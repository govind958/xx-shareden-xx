import { useState, useCallback } from 'react';
import { CanvasNode, InteractionState } from '../types';

export const useCanvasInteractions = (
  nodes: CanvasNode[],
  setNodes: React.Dispatch<React.SetStateAction<CanvasNode[]>>,
  scale: number,
  panOffset: { x: number; y: number },
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [interaction, setInteraction] = useState<InteractionState>({ mode: 'idle', id: null });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const getGroupAtPoint = useCallback((x: number, y: number): CanvasNode | null => {
    return nodes.find(n =>
      n.type === 'group' &&
      n.width && n.height &&
      x >= n.x && x <= n.x + n.width &&
      y >= n.y && y <= n.y + n.height
    ) || null;
  }, [nodes]);

  const startDrag = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (interaction.mode === 'resize') return;

    const node = nodes.find(n => n.id === id);
    if (!node) return;

    // Prevent dragging if this node or its parent is saved (locked)
    let isLocked = !!node.isSaved;
    if (node.parentId) {
      const parent = nodes.find(p => p.id === node.parentId);
      if (parent && parent.isSaved) {
        isLocked = true;
      }
    }
    if (isLocked) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const nodeScreenX = (node.x * scale) + panOffset.x + rect.left;
    const nodeScreenY = (node.y * scale) + panOffset.y + rect.top;

    setInteraction({ mode: 'drag', id });
    setOffset({
      x: e.clientX - nodeScreenX,
      y: e.clientY - nodeScreenY,
    });
  }, [interaction.mode, nodes, scale, panOffset, containerRef]);

  const startResize = useCallback((_e: React.MouseEvent, id: string) => {
    const node = nodes.find(n => n.id === id);
    if (node && node.isSaved) {
      // Prevent resizing of saved clusters
      return;
    }
    setInteraction({ mode: 'resize', id });
  }, [nodes]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (interaction.mode === 'idle' || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / scale;
    const mouseY = (e.clientY - rect.top - panOffset.y) / scale;

    if (interaction.mode === 'drag' && interaction.id) {
      const newX = mouseX - (offset.x / scale);
      const newY = mouseY - (offset.y / scale);
      setNodes((prev) => prev.map(n => n.id === interaction.id ? { ...n, x: newX, y: newY } : n));
    } else if (interaction.mode === 'resize' && interaction.id) {
      const node = nodes.find(n => n.id === interaction.id);
      if (node) {
        const newWidth = Math.max(200, mouseX - node.x);
        const newHeight = Math.max(150, mouseY - node.y);
        setNodes((prev) => prev.map(n => n.id === interaction.id ? { ...n, width: newWidth, height: newHeight } : n));
      }
    }
  }, [interaction, offset, scale, panOffset, containerRef, nodes, setNodes]);

  const onMouseUp = useCallback(() => {
    setInteraction({ mode: 'idle', id: null });
  }, []);

  return {
    interaction,
    getGroupAtPoint,
    startDrag,
    startResize,
    onMouseMove,
    onMouseUp,
    setInteraction,
  };
};

