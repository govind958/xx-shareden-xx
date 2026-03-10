import { Stack } from "./Substack";
import { SubscriptionLimit } from "./product_stacks";

export interface UserOrder {
  id: string;
  stack_id: string;
  status: string;
  created_at: string;
  stacks: Stack;
  total_amount: number;
}

export interface BillingTransaction {
  id: string;
  displayId: string;
  name: string;
  amount: number;
  date: string;
  status: string;
  rawDate: string;
}

export interface PurchasedOrder {
  id: string;
  total_amount: number;
  created_at: string;
  stacks: PurchasedStack[];
}

export interface OrderWithStacks {
  id: string;
  total_amount: number;
  created_at: string;
  subscription_duration?: SubscriptionLimit;
  is_recurring?: boolean;
  subscription_status?: string | null;
  stacks: PurchasedStack[];
}

export interface PurchasedStack {
  id: string;
  stack_id: string;
  stack_name: string;
  stack_type: string | null;
  status: string;
  progress_percent: number;
  created_at: string;
  order_id: string;
  base_price: number;
}

export interface BillingAddress {
  id: string;
  user_id: string;
  address_type: 'headquarters' | 'office';
  company_name: string | null;
  phone: string | null;
  country: string;
  state: string | null;
  street_address: string | null;
  city: string | null;
  zip_code: string | null;
  created_at: string;
  updated_at: string;
}
