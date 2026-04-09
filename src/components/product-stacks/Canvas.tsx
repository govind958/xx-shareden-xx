'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDnD, CanvasNode, useZoom, useCanvasInteractions } from '@/src/modules/product_stacks';
import { CustomNode } from './CustomNode';
import { ZoomControls } from './ZoomControls';
import { useAuth } from '@/src/context/AuthContext';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';
import {
  createDeployOrderForCustomCluster,
  getStarterDeployLimits,
} from '@/src/modules/orders/createDeployOrder';

const STORAGE_KEY_CANVAS_NODES = 'product_stacks_canvas_nodes';

type DialogState = {
  open: boolean;
  title: string;
  message: string;
  showUpgrade?: boolean;
};

const LimitDialog = ({
  dialog,
  onClose,
  onUpgrade,
}: {
  dialog: DialogState;
  onClose: () => void;
  onUpgrade: () => void;
}) => {
  if (!dialog.open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900">{dialog.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{dialog.message}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Got it
          </button>
          {dialog.showUpgrade && (
            <button
              onClick={onUpgrade}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition"
            >
              Upgrade to Pro
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const [maxSubStacks, setMaxSubStacks] = useState(3);
  const [dialog, setDialog] = useState<DialogState>({ open: false, title: '', message: '' });

  const closeDialog = useCallback(() => setDialog(prev => ({ ...prev, open: false })), []);
  const handleUpgrade = useCallback(() => {
    closeDialog();
    router.push('/private?tab=client_price');
  }, [closeDialog, router]);

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

  useEffect(() => {
    getStarterDeployLimits().then((limits) => {
      setMaxSubStacks(limits.maxSubStacks);
    });
  }, [user]);

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

    if (targetGroup && !isGroup) {
      const childCount = nodes.filter((n) => n.parentId === targetGroup.id).length;
      if (childCount >= maxSubStacks) {
        setDialog({
          open: true,
          title: 'Module limit reached',
          message: `Starter plan allows up to ${maxSubStacks} modules per stack. Upgrade to Pro for unlimited modules.`,
          showUpgrade: true,
        });
        return;
      }
    }

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

    if (!user) {
      setDialog({ open: true, title: 'Sign in required', message: 'Please sign in to deploy a stack.' });
      return;
    }

    const clusterNode = nodes.find(n => n.id === clusterId);

    if (!clusterNode) return;

    setPurchasingIds(prev => [...prev, clusterId]);

    const substacks = nodes.filter(n => n.parentId === clusterId);

    // const totalPrice = substacks.reduce((sum, n) => sum + (n.base_price || 0), 0);

    try {

      const clusterData = substacks.map(node => ({
        name: node.label,
        // price: node.base_price || 0,
        price: 0,
        is_free: false as const,
      }));

      // --- Cart flow (disabled): insert cluster into cart_stacks, then navigate ---
      // const supabase = createClient();
      // const clusterDataForCart = substacks.map(node => ({
      //   name: node.label,
      //   price: node.base_price || 0,
      // }));
      // await supabase.from('cart_stacks').insert({
      //   user_id: user.id,
      //   cluster_name: clusterNode.label || 'Custom Stack',
      //   cluster_data: clusterDataForCart,
      //   total_price: totalPrice,
      //   status: 'active',
      // });
      // router.push('/private?tab=client_price');

      const result = await createDeployOrderForCustomCluster({
        clusterName: clusterNode.label || 'Custom Stack',
        clusterData,
        // totalPrice,
        totalPrice:0,
      });

      if (!result.success) {
        setDialog({
          open: true,
          title: result.redirectToPricing ? 'Upgrade required' : 'Deployment failed',
          message: result.error || 'Could not start deployment.',
          showUpgrade: result.redirectToPricing,
        });
        return;
      }

      router.push('/private?tab=stackboard');

    } catch {

      setDialog({ open: true, title: 'Deployment failed', message: 'Could not start deployment. Please try again.' });

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

      <LimitDialog dialog={dialog} onClose={closeDialog} onUpgrade={handleUpgrade} />

    </div>

  );

};