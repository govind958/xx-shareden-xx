import { SubscriptionLimit } from "@/src/types/product_stacks";

export interface CancelSubscriptionResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface SubscriptionData {
  id: string;
  stack_id: string;
  stack_name: string;
  base_price: number;
  subscription_duration?: SubscriptionLimit;
  created_at: string;
  next_payment_date: string;
  days_remaining: number;
}

