export interface CartStackRow {
    id: string;
    user_id: string;
    stack_id: string;
    sub_stack_ids: string[] | null;
    total_price: number;
    status: string;
    created_at: string;
  }
  
  export interface StackRow {
    id: string;
    name: string;
    type: string;
    description: string | null;
    base_price: number;
    active: boolean;
    image_url: string | null;
  }
  
  export interface SubStackRow {
    id: string;
    name: string;
    price: number;
  }
  
  export interface FinalCartItem {
    cart_id: string;
    stack_id: string;
    name: string | undefined;
    type: string | undefined;
    description: string | null | undefined;
    base_price: number | undefined;
    active: boolean | undefined;
    image_url: string | null | undefined;
    sub_stacks: SubStackRow[];
    total_price: number;
    status: string;
    created_at: string;
  }
  