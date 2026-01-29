import { Stack } from "./Substack";

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

export interface PurchasedStack {
    id: string;
    stack_id: string;
    stack_name: string;
    stack_type: string | null;
    status: string;
    progress_percent: number;
    created_at: string;
    order_id: string;
  }

export interface OrderWithStacks {
    id: string;
    total_amount: number;
    created_at: string;
    stacks: PurchasedStack[];
  } 
