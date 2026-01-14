export interface Node {
    id: string;
    label: string;
    type?: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    parentId?: string;
    isSaved?: boolean; // For clusters
  }

  export interface Edge {
    id: string;
    source: string;
    target: string;
  }


  export interface ViewState {
    x: number;
    y: number;
    scale: number;
  }
