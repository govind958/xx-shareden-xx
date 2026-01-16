'use client';

import { useState, useRef, useEffect } from 'react';
import { useDnD } from '../DnDContext';
import { CanvasNode, SavedStack } from '../types/canvas';
import { CustomNode } from './CustomNode';
import { ZoomControls } from './ZoomControls';
import { useZoom } from '../hooks/useZoom';
import { useCanvasInteractions } from '../hooks/useCanvasInteractions';

interface CanvasProps {
  onStackCreate?: (stack: SavedStack) => void;
  onDeleteClusterRef?: React.MutableRefObject<((clusterNodeId: string) => void) | null>;
  userName?: string;
}

const STORAGE_KEY_CANVAS_NODES = 'product_stacks_canvas_nodes';

export const Canvas: React.FC<CanvasProps> = ({ onStackCreate, onDeleteClusterRef, userName }) => {
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

  // --- Logic: Save Cluster ---
  const handleSaveCluster = (clusterId: string) => {
    const clusterNode = nodes.find(n => n.id === clusterId);
    const substacks = nodes.filter(n => n.parentId === clusterId);
    
    // Create new Saved Stack with cluster node ID reference
    const newStack: SavedStack = {
      id: `saved-${Date.now()}`,
      name: clusterNode?.label || 'Custom Stack',
      author: userName || 'User',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modules: substacks.map(n => ({
        name: n.label,
        type: n.type,
        base_price: n.base_price || 0,
      })),
      clusterNodeId: clusterId, // Store reference to canvas cluster node
    };

    // Callback to parent to add to saved stacks
    if (onStackCreate) {
      onStackCreate(newStack);
    }

    // Mark cluster and ALL children as saved
    setNodes(prev => prev.map(n => {
      if (n.id === clusterId) return { ...n, isSaved: true };
      if (n.parentId === clusterId) return { ...n, isSaved: true };
      return n;
    }));
  };

  // Expose delete function to parent via ref
  useEffect(() => {
    if (onDeleteClusterRef) {
      onDeleteClusterRef.current = (clusterNodeId: string) => {
        // Delete the cluster node and all its children
        setNodes((prev) => prev.filter((n) => n.id !== clusterNodeId && n.parentId !== clusterNodeId));
      };
    }
    return () => {
      if (onDeleteClusterRef) {
        onDeleteClusterRef.current = null;
      }
    };
  }, [onDeleteClusterRef]);
  // Connection logic is not yet implemented in this modular canvas version.

  const handleRemoveSelected = () => {
    if (!selectedId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedId));
    setSelectedId(null);
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
                onResizeStart={(e) => startResize(e, node.id)}
                onConnectStart={() => {}}
                onSave={handleSaveCluster}
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

