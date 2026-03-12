"use server";

import { createClient } from "@/utils/supabase/server";
import { OrderWithStacks, PurchasedStack } from "@/src/types/billing";
import { SubscriptionLimit } from "@/src/types/product_stacks";

/**
 * Fetch orders with stacks including subscription data
 */
export async function getOrdersWithStacks(
  userId: string
): Promise<{ orders: OrderWithStacks[]; stacks: PurchasedStack[] }> {
  const supabase = await createClient();

  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
      id,
      total_amount,
      created_at,
      subscription_duration,
      is_recurring,
      subscription_status,
      discount_amount,
      coupon_id,
      payment_method,
      payment_id,
      order_items (
        id,
        stack_id,
        status,
        progress_percent,
        created_at,
        is_active,
        stacks (
          id,
          name,
          type,
          base_price
        )
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
    return { orders: [], stacks: [] };
  }

  // Transform data
  const ordersWithStacks: OrderWithStacks[] = (ordersData || []).map((order) => {
    const orderItems = (order.order_items as unknown) as Array<{
      id: string;
      stack_id: string;
      status: string;
      progress_percent: number;
      created_at: string;
      is_active: boolean;
      stacks: {
        id: string;
        name: string;
        type: string | null;
        base_price: number;
      } | null;
    }>;

    // Filter only active order items
    const activeOrderItems = (orderItems || []).filter((item) => item.is_active !== false);

    const baseOrder = order as {
      id: string;
      total_amount: number;
      created_at: string;
      subscription_duration?: SubscriptionLimit;
      is_recurring?: boolean;
      subscription_status?: string | null;
      discount_amount?: number;
      coupon_id?: string | null;
      payment_method?: string | null;
      payment_id?: string | null;
    };

    return {
      id: order.id,
      total_amount: baseOrder.total_amount,
      created_at: baseOrder.created_at,
      subscription_duration: baseOrder.subscription_duration,
      is_recurring: baseOrder.is_recurring,
      subscription_status: baseOrder.subscription_status,
      discount_amount: baseOrder.discount_amount,
      coupon_id: baseOrder.coupon_id,
      payment_method: baseOrder.payment_method,
      payment_id: baseOrder.payment_id,
      stacks: activeOrderItems.map((item) => ({
        id: item.id,
        stack_id: item.stack_id,
        stack_name: item.stacks?.name || "Unknown Stack",
        stack_type: item.stacks?.type || null,
        status: item.status || "pending",
        progress_percent: item.progress_percent || 0,
        created_at: item.created_at,
        order_id: order.id,
        base_price: item.stacks?.base_price || 0,
      })),
    };
  });

  // Extract unique stacks for subscription table
  const uniqueStacks: PurchasedStack[] = [];
  // const seenStackIds = new Set<string>();

  ordersWithStacks.forEach((order) => {
    order.stacks.forEach((stack) => {
      uniqueStacks.push(stack);
    })
  });

  return {
    orders: ordersWithStacks,
    stacks: uniqueStacks,
  };
}

