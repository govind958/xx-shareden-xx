'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useDnD,
  CanvasNode,
  useZoom,
  useCanvasInteractions
} from '@/src/modules/product_stacks';
import { CustomNode } from './CustomNode';
import { ZoomControls } from './ZoomControls';
import { useAuth } from '@/src/context/AuthContext';
import { RefreshCw, Trash2, Rocket, AlertTriangle, X, ArrowRight } from 'lucide-react';
import {
  createDeployOrderForCustomCluster,
  getStarterDeployLimits,
} from '@/src/modules/orders/createDeployOrder';

const STORAGE_KEY_CANVAS_NODES = 'product_stacks_canvas_nodes';
const GRID_SIZE = 25;

const THEME = {
  canvasBg: 'bg-[#FDFDFD]',
  gridColor: '#cbd5e1',
  gridOpacity: 'opacity-40',
  selectionRing: 'ring-[#2B6CB0]',
  hudBg: 'bg-white/95',
  textMain: 'text-[#1A365D]',
  textMuted: 'text-slate-500'
};

type DialogState = {
  open: boolean;
  title: string;
  message: string;
  showUpgrade?: boolean;
  confirmLabel?: string;
  onConfirm?: () => void;
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
            {dialog.onConfirm ? 'Cancel' : 'Got it'}
          </button>
          {dialog.onConfirm && (
            <button
              onClick={() => {
                onClose();
                dialog.onConfirm?.();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              {dialog.confirmLabel || 'Continue'}
            </button>
          )}
          {dialog.showUpgrade && !dialog.onConfirm && (
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

function isModuleNode(n: CanvasNode): boolean {
  return n.type !== 'group';
}

export const Canvas: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [nodes, setNodes] = useState<CanvasNode[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CANVAS_NODES);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({ open: false, title: '', message: '' });
  const [isPaid, setIsPaid] = useState(false);
  const [maxSubStacks, setMaxSubStacks] = useState(3);

  const containerRef = useRef<HTMLDivElement>(null);

  const [dragItem] = useDnD();
  const { scale, panOffset, zoomIn, zoomOut, resetZoom, handleWheel } = useZoom();

  const {
    getGroupAtPoint,
    startDrag,
    onMouseMove,
    onMouseUp,
  } = useCanvasInteractions(nodes, setNodes, scale, panOffset, containerRef);

  const moduleNodes = useMemo(() => nodes.filter(isModuleNode), [nodes]);

  useEffect(() => {
    getStarterDeployLimits().then((limits) => {
      setIsPaid(limits.paid);
      setMaxSubStacks(limits.maxSubStacks);
    });
  }, []);

  const closeDialog = useCallback(() => setDialog((d) => ({ ...d, open: false })), []);
  const handleUpgrade = useCallback(() => {
    closeDialog();
    router.push('/private?tab=client_price');
  }, [closeDialog, router]);

  const runDeploy = useCallback(async (modules: CanvasNode[]) => {
    const clusterData = modules.map((n) => ({
      name: (n.label || 'Module').trim() || 'Module',
      price: n.base_price || 0,
    }));
    const totalPrice = clusterData.reduce((s, c) => s + c.price, 0);
    const clusterName = `Canvas ${new Date().toLocaleDateString()}`;

    const result = await createDeployOrderForCustomCluster({
      clusterName,
      clusterData,
      totalPrice,
    });

    if (!result.success) {
      setDialog({
        open: true,
        title: result.redirectToPricing ? 'Upgrade required' : 'Deployment failed',
        message: result.error || 'Could not create your deployment.',
        showUpgrade: result.redirectToPricing,
      });
      return;
    }

    setNodes([]);
    setSelectedId(null);
    localStorage.removeItem(STORAGE_KEY_CANVAS_NODES);
    router.push('/private?tab=stackboard');
  }, [router]);

  const handleGlobalDeploy = async () => {
    if (moduleNodes.length === 0 || isDeploying) return;

    if (!user) {
      setDialog({
        open: true,
        title: 'Sign in required',
        message: 'Please sign in to deploy your stack.',
      });
      return;
    }

    setIsDeploying(true);

    try {
      if (!isPaid && moduleNodes.length > maxSubStacks) {
        setDialog({
          open: true,
          title: 'Module limit',
          message: `Starter plan allows up to ${maxSubStacks} modules per deployment. Go to Billing to upgrade to Pro for unlimited modules, or deploy the first ${maxSubStacks} modules now.`,
          confirmLabel: `Deploy ${maxSubStacks} modules`,
          onConfirm: () => {
            void (async () => {
              setIsDeploying(true);
              try {
                await runDeploy(moduleNodes.slice(0, maxSubStacks));
              } finally {
                setIsDeploying(false);
              }
            })();
          },
        });
        return;
      }

      await runDeploy(moduleNodes);
    } catch {
      setDialog({
        open: true,
        title: 'Deployment failed',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsDeploying(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CANVAS_NODES, JSON.stringify(nodes));
    }
  }, [nodes]);

  const snapToGrid = (val: number) => Math.round(val / GRID_SIZE) * GRID_SIZE;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedId) {
        setNodes(prev => prev.filter(n => n.id !== selectedId && n.parentId !== selectedId));
        setSelectedId(null);
      }
    }
    if (e.key === 'Escape') setSelectedId(null);
  }, [selectedId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragItem || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = snapToGrid((e.clientX - rect.left - panOffset.x) / scale);
    const y = snapToGrid((e.clientY - rect.top - panOffset.y) / scale);

    const groupAtPoint = getGroupAtPoint(x, y);
    const targetGroup = groupAtPoint && !groupAtPoint.isSaved ? groupAtPoint : null;
    const isGroup = dragItem.type === 'group';

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
      x: dragItem.type === 'group' ? x - 180 : (targetGroup ? x - targetGroup.x - 80 : x - 80),
      y: dragItem.type === 'group' ? y - 100 : (targetGroup ? y - targetGroup.y - 40 : y - 40),
      parentId: targetGroup ? targetGroup.id : undefined,
      base_price: dragItem.base_price || 0,
    };

    setNodes(prev => [...prev, newNode]);
  };

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedId), [nodes, selectedId]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${THEME.canvasBg} cursor-crosshair select-none`}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={handleWheel}
    >
      <LimitDialog dialog={dialog} onClose={closeDialog} onUpgrade={handleUpgrade} />

      {/* GRID LAYER */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <div
          className={`absolute inset-0 pointer-events-none ${THEME.gridOpacity}`}
          style={{
            backgroundImage: `radial-gradient(circle, ${THEME.gridColor} 1px, transparent 1px)`,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            width: '10000px', height: '10000px', top: '-5000px', left: '-5000px'
          }}
        />

        {nodes.map(node => {
          const parent = node.parentId ? nodes.find(n => n.id === node.parentId) : null;
          const absX = parent ? parent.x + node.x : node.x;
          const absY = parent ? parent.y + node.y : node.y;

          return (
            <div
              key={node.id}
              className="absolute transition-all duration-150"
              style={{ left: absX, top: absY, zIndex: node.type === 'group' ? 1 : 10 }}
              onMouseDown={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedId(node.id); startDrag(e, node.id); }}
            >
              <CustomNode
                id={node.id}
                label={node.label}
                isSelected={selectedId === node.id}
                onRename={(id, name) => setNodes(n => n.map(x => x.id === id ? {...x, label: name} : x))}
              />
            </div>
          );
        })}
      </div>

      {/* ZOOM & STATS */}
      <div className="absolute bottom-6 left-6 flex items-center gap-4 z-50">
        <div className="bg-white shadow-lg border border-slate-200 rounded-xl p-1">
            <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} onResetZoom={resetZoom} />
        </div>
      </div>

      {/* PERMANENT HUD */}
      <div className={`absolute top-6 left-1/2 -translate-x-1/2 flex items-center p-1.5 gap-1 ${THEME.hudBg} backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[22px] z-50 animate-in fade-in slide-in-from-top-4 duration-500`}>

        {/* LEFT: CONTEXT */}
        <div className="pl-4 pr-6 py-1 border-r border-slate-200/60 min-w-[180px]">
          <div className="flex items-center gap-2 mb-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${moduleNodes.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em]">
              {selectedId ? 'Selection Active' : 'Canvas Overview'}
            </p>
          </div>
          <p className={`text-sm ${THEME.textMain} font-extrabold tracking-tight truncate`}>
            {selectedNode ? selectedNode.label : `${moduleNodes.length} module${moduleNodes.length === 1 ? '' : 's'} on canvas`}
          </p>
        </div>

        {/* CENTER: TOOLS */}
        <div className="flex items-center gap-1 px-2">
          {selectedId && (
            <>
              <button
                onClick={() => {
                  setNodes(prev => prev.filter(n => n.id !== selectedId && n.parentId !== selectedId));
                  setSelectedId(null);
                }}
                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Delete Selected"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={() => setSelectedId(null)}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-all"
              >
                Deselect
              </button>
            </>
          )}

          <button
            onClick={() => {
              setNodes([]);
              setSelectedId(null);
              localStorage.removeItem(STORAGE_KEY_CANVAS_NODES);
            }}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:rotate-180"
            title="Refresh Canvas"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* RIGHT: GLOBAL DEPLOY */}
        <div className="pl-1 pr-1">
          <button
            onClick={() => void handleGlobalDeploy()}
            disabled={moduleNodes.length === 0 || isDeploying}
            className={`
              flex items-center gap-2.5 px-6 py-3 rounded-[16px] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 group text-white shadow-lg
              ${moduleNodes.length > 0
                ? "bg-[#12141a] hover:bg-blue-600 shadow-blue-500/20"
                : "bg-slate-200 cursor-not-allowed shadow-none"
              }
            `}
          >
            <Rocket size={16} className={moduleNodes.length > 0 ? "group-hover:animate-bounce" : ""} />
            <span className="text-[11px] font-black uppercase tracking-[0.12em]">
              {isDeploying ? 'Deploying...' : `Deploy (${moduleNodes.length})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
