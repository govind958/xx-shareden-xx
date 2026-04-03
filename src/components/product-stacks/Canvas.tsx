'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDnD, CanvasNode, useZoom, useCanvasInteractions } from '@/src/modules/product_stacks';
import { CustomNode } from './CustomNode';
import { ZoomControls } from './ZoomControls';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/src/context/AuthContext';

const STORAGE_KEY_CANVAS_NODES = 'product_stacks_canvas_nodes';

export const Canvas: React.FC = () => {

  const router = useRouter();
  const { user } = useAuth();

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

  const containerRef = useRef<HTMLDivElement>(null);

  const [dragItem] = useDnD();

  const { scale, panOffset, zoomIn, zoomOut, resetZoom, handleWheel } = useZoom();

  const {
    interaction,
    getGroupAtPoint,
    startDrag,
    startResize,
    onMouseMove,
    onMouseUp,
  } = useCanvasInteractions(nodes, setNodes, scale, panOffset, containerRef);

  /* ---------------------------
     Save nodes to localStorage
  --------------------------- */

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CANVAS_NODES, JSON.stringify(nodes));
    }
  }, [nodes]);

  /* ---------------------------
     CLICK TO ADD CLUSTER
  --------------------------- */

  useEffect(() => {

    const handleAddCluster = (event: Event) => {
      const customEvent = event as CustomEvent<{ name?: string }>;

      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      const x = (rect.width / 2 - panOffset.x) / scale;
      const y = (rect.height / 2 - panOffset.y) / scale;

      const newNode: CanvasNode = {
        id: `node-${Date.now()}`,
        label: customEvent.detail?.name || 'Cluster Group',
        type: 'group',
        x: x - 190,
        y: y - 120,
        width: 380,
        height: 240,
        base_price: 0,
      };

      setNodes(prev => [...prev, newNode]);

    };

    window.addEventListener("add-cluster", handleAddCluster);

    return () => {
      window.removeEventListener("add-cluster", handleAddCluster);
    };

  }, [scale, panOffset]);

  /* ---------------------------
     Prevent page scroll
  --------------------------- */

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

  /* ---------------------------
     DROP LOGIC
  --------------------------- */

  const onDrop = (e: React.DragEvent) => {

    e.preventDefault();

    if (!dragItem || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left - panOffset.x) / scale;
    const y = (e.clientY - rect.top - panOffset.y) / scale;

    const isGroup = dragItem.type === 'group';

    const groupAtPoint = getGroupAtPoint(x, y);

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

    setNodes(prev => [...prev, newNode]);

  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /* ---------------------------
     SORT NODES
  --------------------------- */

  const sortedNodes = [...nodes].sort((a, b) => {

    if (a.type === 'group' && b.type !== 'group') return -1;

    if (a.type !== 'group' && b.type === 'group') return 1;

    return 0;

  });

  /* ---------------------------
     PURCHASE LOGIC
  --------------------------- */

  const handlePurchaseCluster = async (clusterId: string) => {

    if (purchasingIds.includes(clusterId)) return;

    setPurchasingIds(prev => [...prev, clusterId]);

    const clusterNode = nodes.find(n => n.id === clusterId);

    if (!clusterNode) return;

    const substacks = nodes.filter(n => n.parentId === clusterId);

    const totalPrice = substacks.reduce((sum, n) => sum + (n.base_price || 0), 0);

    if (!user) {
      alert('Please sign in');
      return;
    }

    try {

      const supabase = createClient();

      const clusterData = substacks.map(node => ({
        name: node.label,
        price: node.base_price || 0,
      }));

      await supabase.from('cart_stacks').insert({

        user_id: user.id,

        cluster_name: clusterNode.label || 'Custom Stack',

        cluster_data: clusterData,

        total_price: totalPrice,

        status: 'active',

      });

      router.push('/private?tab=stacks_cart');

    } catch {

      alert('Failed to add to cart.');

    } finally {

      setPurchasingIds(prev => prev.filter(id => id !== clusterId));

    }

  };

  /* ---------------------------
     REMOVE NODE
  --------------------------- */

  const handleRemoveSelected = () => {

    if (!selectedId) return;

    setNodes(prev => prev.filter(n => n.id !== selectedId));

    setSelectedId(null);

  };

  /* ---------------------------
     RENAME
  --------------------------- */

  const handleRenameCluster = (id: string, name: string) => {

    setNodes(prev => prev.map(n =>
      n.id === id ? { ...n, label: name } : n
    ));

  };

  return (

    <div
      ref={containerRef}
      className="flex-grow h-full w-full relative overflow-hidden bg-[#020617] cursor-crosshair select-none"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMouseMove={interaction.mode !== 'idle' ? onMouseMove : undefined}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={handleWheel}
    >

      {/* GRID */}

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
            backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* NODES */}

        {sortedNodes.map(node => {

          const parentNode = node.parentId ? nodes.find(n => n.id === node.parentId) : null;

          const absoluteX = parentNode ? parentNode.x + node.x : node.x;

          const absoluteY = parentNode ? parentNode.y + node.y : node.y;

          if (node.parentId && !parentNode) return null;

          const nodePrice =
            node.type === 'group'
              ? nodes
                  .filter(n => n.parentId === node.id)
                  .reduce((sum, child) => sum + (child.base_price || 0), 0)
              : node.base_price || 0;

          return (

            <div
              key={node.id}
              className="absolute cursor-move active:cursor-grabbing"
              style={{
                left: absoluteX,
                top: absoluteY,
                zIndex: node.type === 'group' ? 1 : 10,
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
                onConnectStart={() => {}}
                onBuy={handlePurchaseCluster}
                onRename={handleRenameCluster}
              />

            </div>

          );

        })}

      </div>

      <ZoomControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
      />

      {selectedId && (

        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-full px-4 py-2 flex items-center gap-3 text-xs text-slate-300 z-50">

          <span>Node Selected</span>

          <button
            onClick={handleRemoveSelected}
            className="px-2 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest"
          >
            Remove
          </button>

          <button
            onClick={() => setSelectedId(null)}
            className="text-slate-400 hover:text-white text-[10px] uppercase tracking-widest"
          >
            Cancel
          </button>

        </div>

      )}

    </div>

  );

};