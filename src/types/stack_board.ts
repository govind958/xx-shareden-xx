export interface OrderItemRow {
    id: string;
    order_id: string;
    user_id: string;
    stack_id: string;
    sub_stack_ids: string[] | null;
    status: string;
    step: number;
    progress_percent: number;
    eta: string | null;
    user_note: string | null;
    admin_note: string | null;
    assigned_to: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface StackRow {
    id: string;
    name: string;
    type: string;
    description: string | null;
    base_price: number;
    active: boolean;
  }
  
  export interface StackProgress {
    id: string;
    order_item_id: string;
    order_id: string;
    name: string;
    type: string;
    description: string;
    progress: number;
    status: string;
    statusDisplay: string;
    step: number;
    eta: string | null;
    created_at: string;
    updated_at: string;
    assigned_employee?: {
      id: string;
      name: string;
      email: string;
      role: string;
    } | null;
  }
  