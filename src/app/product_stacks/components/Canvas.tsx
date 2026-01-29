'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDnD } from '../DnDContext';
import { CanvasNode } from '../types/canvas';
import { CustomNode } from './CustomNode';
import { ZoomControls } from './ZoomControls';
import { useZoom } from '../hooks/useZoom';
import { useCanvasInteractions } from '../hooks/useCanvasInteractions';
import { createClient } from '@/utils/supabase/client';

const STORAGE_KEY_CANVAS_NODES = 'product_stacks_canvas_nodes';

export const Canvas: React.FC = () => {
  const router = useRouter();
  // Load nodes from localStorage on mount
  const [nodes, setNodes] = useState<CanvasNode[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CANVAS_NODES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [purchasingIds, setPurchasingIds] = useState<string[]>([]);

  // Save to localStorage whenever nodes change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CANVAS_NODES, JSON.stringify(nodes));
    }
  }, [nodes]);

  const [dragItem] = useDnD();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scale, panOffset, zoomIn, zoomOut, resetZoom, handleWheel } = useZoom();
  const {
    interaction,
    getGroupAtPoint,
    startDrag,
    startResize,
    onMouseMove,
    onMouseUp,
  } = useCanvasInteractions(nodes, setNodes, scale, panOffset, containerRef);

  // Prevent the page from scrolling when the user scrolls over the canvas
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
    };
    el.addEventListener('wheel', preventScroll, { passive: false });
    return () => {
      el.removeEventListener('wheel', preventScroll);
    };
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragItem || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / scale;
    const y = (e.clientY - rect.top - panOffset.y) / scale;

    const isGroup = dragItem.type === 'group';
    const groupAtPoint = getGroupAtPoint(x, y);
    // Do not allow dropping into a saved (locked) group
    const targetGroup = groupAtPoint && !groupAtPoint.isSaved ? groupAtPoint : null;

    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      label: dragItem.name,
      type: dragItem.type,
      x: isGroup ? x - 190 : (targetGroup ? x - targetGroup.x - 80 : x - 80),
      y: isGroup ? y - 120 : (targetGroup ? y - targetGroup.y - 40 : y - 40),
      width: isGroup ? 380 : undefined,
      height: isGroup ? 240 : undefined,
      parentId: targetGroup ? targetGroup.id : undefined,
      base_price: dragItem.base_price || 0,
    };

    setNodes((prev) => [...prev, newNode]);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const sortedNodes = [...nodes].sort((a, b) => {
    if (a.type === 'group' && b.type !== 'group') return -1;
    if (a.type !== 'group' && b.type === 'group') return 1;
    return 0;
  });

  // --- Logic: Purchase Cluster ---
  const handlePurchaseCluster = async (clusterId: string) => {
    if (purchasingIds.includes(clusterId)) return;
    setPurchasingIds((prev) => [...prev, clusterId]);

    const clusterNode = nodes.find(n => n.id === clusterId);
    if (!clusterNode) {
      setPurchasingIds((prev) => prev.filter((id) => id !== clusterId));
      return;
    }

    const substacks = nodes.filter(n => n.parentId === clusterId);
    const totalPrice = substacks.reduce((sum, n) => sum + (n.base_price || 0), 0);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw new Error('Please sign in to purchase this stack');

      // Check for existing stack
      const { data: existingStacks } = await supabase
        .from('stacks')
        .select('id, name')
        .eq('author_id', authData.user.id)
        .eq('name', clusterNode.label)
        .eq('active', true);

      let foundStackId: string | null = null;
      let foundSubStackIds: string[] = [];

      if (existingStacks && existingStacks.length > 0) {
        // Check substacks for each candidate
        for (const stack of existingStacks) {
          const { data: existingSubStacks } = await supabase
            .from('sub_stacks')
            .select('id, name')
            .eq('stack_id', stack.id);

          if (existingSubStacks) {
            // Compare logic: check if every substack in current cluster exists in db stack
            // and same counts.
            // Simple set comparison by sorting names?

            const currentNames = substacks.map(s => s.label).sort();
            const existingNames = existingSubStacks.map(s => s.name).sort();

            const isMatch = currentNames.length === existingNames.length &&
              currentNames.every((val, index) => val === existingNames[index]);

            if (isMatch) {
              foundStackId = stack.id;
              foundSubStackIds = existingSubStacks.map(s => s.id);
              break;
            }
          }
        }
      }

      let stackId = foundStackId;
      let subStackIds = foundSubStackIds;

      if (!stackId) {
        // 1) Save stack
        const { data: stackRow, error: stackError } = await supabase.from('stacks')
          .insert({
            name: clusterNode.label || 'Custom Stack',
            description: "Purchased from Infrastructure Stacks",
            type: 'custom',
            base_price: totalPrice,
            author_id: authData.user.id,
            active: true,
          })
          .select('id')
          .single();

        if (stackError || !stackRow) {
          const details = stackError
            ? `${stackError.message}${stackError.details ? ` (${stackError.details})` : ''}`
            : 'No stack row returned.';
          throw new Error(`Failed to save stack: ${details}`);
        }
        stackId = stackRow.id;

        // 2) Save sub_stacks
        const subStackPayload = substacks.map((node) => ({
          stack_id: stackId,
          name: node.label,
          price: node.base_price || 0,
          is_free: (node.base_price || 0) === 0,
        }));

        const { data: subRows, error: subError } = await supabase
          .from('sub_stacks')
          .insert(subStackPayload)
          .select('id');

        if (subError) {
          throw subError;
        }

        subStackIds = (subRows || []).map((row: { id: string }) => row.id);
      }

      // 3) Add to cart for checkout
      // First check if already in cart? 
      // The logic says "do not create new cluster in db". 
      // It doesn't explicitly say "don't add to cart if already in cart", but usually that's desirable.
      // However, if the user clicks buy again, maybe they want qty 2? 
      // But let's assume valid flow is just adding to cart.

      // We will perform the insert. If there is a constraint it might fail, but usually carts allow duplicates or separate entries.
      // Based on typical flows, we just insert.

      const { error: cartError } = await supabase.from('cart_stacks').insert({
        user_id: authData.user.id,
        stack_id: stackId,
        sub_stack_ids: subStackIds,
        total_price: totalPrice,
        status: 'active',
      });

      if (cartError) {
        throw cartError;
      }
      // Mark cluster and ALL children as purchased
      setNodes(prev => prev.map(n => {
        if (n.id === clusterId) return { ...n, isSaved: true };
        if (n.parentId === clusterId) return { ...n, isSaved: true };
        return n;
      }));

      router.push('/private?tab=stacks_cart');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Purchase failed.';
      alert(message);
    } finally {
      setPurchasingIds((prev) => prev.filter((id) => id !== clusterId));
    }
  };

  // Connection logic is not yet implemented in this modular canvas version.

  const handleRemoveSelected = () => {
    if (!selectedId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedId));
    setSelectedId(null);
  };

  const handleRenameCluster = (id: string, name: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, label: name } : n)));
  };

  return (
    <div
      ref={containerRef}
      className="flex-grow h-full w-full relative overflow-hidden bg-[#080808] cursor-crosshair select-none"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMouseMove={interaction.mode !== 'idle' ? onMouseMove : undefined}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={handleWheel}
    >
      {/* Zoomed Content Container */}
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#262626 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Nodes */}
        {sortedNodes.map((node) => {
          const parentNode = node.parentId ? nodes.find(n => n.id === node.parentId) : null;
          const absoluteX = parentNode ? parentNode.x + node.x : node.x;
          const absoluteY = parentNode ? parentNode.y + node.y : node.y;

          if (node.parentId && !parentNode) return null;

          const nodePrice =
            node.type === 'group'
              ? nodes
                .filter((n) => n.parentId === node.id)
                .reduce((sum, child) => sum + (child.base_price || 0), 0)
              : node.base_price || 0;

          return (
            <div
              key={node.id}
              className="absolute cursor-move active:cursor-grabbing"
              style={{
                left: absoluteX,
                top: absoluteY,
                zIndex: node.type === 'group' ? 1 : (node.parentId ? 5 : 10),
                transition: interaction.id === node.id ? 'none' : 'box-shadow 0.2s',
              }}
              onMouseDown={(e) => {
                setSelectedId(node.id);
                startDrag(e, node.id);
              }}
            >
              <CustomNode
                id={node.id}
                label={node.label}
                type={node.type}
                isSelected={selectedId === node.id}
                width={node.width}
                height={node.height}
                isSaved={node.isSaved}
                price={nodePrice}
                onResizeStart={(e) => startResize(e, node.id)}
                onConnectStart={() => { }}
                onBuy={handlePurchaseCluster}
                onRename={handleRenameCluster}
              />
            </div>
          );
        })}
      </div>

      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} onResetZoom={resetZoom} />

      {selectedId && (
        <div className="absolute top-4 left-4 bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-full px-4 py-2 flex items-center gap-3 text-xs text-neutral-400 z-50">
          <span>Node Selected</span>
          <button
            onClick={handleRemoveSelected}
            className="px-2 py-1 rounded-md bg-red-600/80 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest"
          >
            Remove
          </button>
          <button
            onClick={() => setSelectedId(null)}
            className="text-neutral-500 hover:text-white text-[10px] uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

