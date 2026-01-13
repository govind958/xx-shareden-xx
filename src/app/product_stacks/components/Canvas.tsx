'use client';

import { useState, useRef } from 'react';
import { useDnD } from '../DnDContext';
import { CanvasNode } from '../types/canvas';
import { CustomNode } from './CustomNode';
import { ZoomControls } from './ZoomControls';
import { useZoom } from '../hooks/useZoom';
import { useCanvasInteractions } from '../hooks/useCanvasInteractions';

export const Canvas: React.FC = () => {
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
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

    const newNode: CanvasNode = {
      id: `node-${Date.now()}`,
      label: dragItem.name,
      type: dragItem.type,
      x: isGroup ? x - 190 : (groupAtPoint ? x - groupAtPoint.x - 80 : x - 80),
      y: isGroup ? y - 120 : (groupAtPoint ? y - groupAtPoint.y - 40 : y - 40),
      width: isGroup ? 380 : undefined,
      height: isGroup ? 240 : undefined,
      parentId: groupAtPoint ? groupAtPoint.id : undefined,
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
              onMouseDown={(e) => startDrag(e, node.id)}
            >
              <CustomNode
                label={node.label}
                type={node.type}
                isSelected={interaction.id === node.id}
                width={node.width}
                height={node.height}
                onResizeStart={(e) => startResize(e, node.id)}
              />
            </div>
          );
        })}
      </div>

      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} onResetZoom={resetZoom} />
    </div>
  );
};

