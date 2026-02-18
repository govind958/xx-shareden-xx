

export interface PURCHASED_STACKS {
  id: string;
  stack_id: string;
  name: string;
  type: string;
  price: number;
  status: string;
  progress_percent: number;
  icon?: any; // Optional icon component
}

export interface PURCHASED_SUBSTACKS {
  label: string;
  status: 'completed' | 'current' | 'pending';
}
