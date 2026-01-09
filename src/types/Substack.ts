
export interface SubStack { id: string; name: string; price: number; }

export interface Stack {
  cart_id: string;
  id: string;
  name: string;
  type: string;
  description: string | null;
  base_price: number;
  sub_stacks: SubStack[];
  total_price: number;
}