export interface CanvasNode {
  id: string;
  label: string;
  type?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  parentId?: string;
}

export interface InteractionState {
  mode: 'idle' | 'drag' | 'resize';
  id: string | null;
}

export interface ZoomState {
  scale: number;
  panOffset: { x: number; y: number };
}

