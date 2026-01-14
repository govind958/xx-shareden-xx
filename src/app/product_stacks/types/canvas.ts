export interface CanvasNode {
  id: string;
  label: string;
  type?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  parentId?: string;
  isSaved?: boolean; // For clusters and locked children
  base_price?: number; // Price for pricing calculations
}

export interface SavedStack {
  id: string;
  name: string;
  author: string;
  timestamp: string;
  modules: { name: string; type?: string; base_price: number }[];
  clusterNodeId?: string; // ID of the cluster node on canvas
}

export interface InteractionState {
  mode: 'idle' | 'drag' | 'resize';
  id: string | null;
}

export interface ZoomState {
  scale: number;
  panOffset: { x: number; y: number };
}

