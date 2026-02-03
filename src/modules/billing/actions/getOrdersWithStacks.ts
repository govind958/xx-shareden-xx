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
      order_items (
        id,
        stack_id,
        status,
        progress_percent,
        created_at,
        stacks (
          id,
          name,
          type,
          base_price,
          subscription_duration
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
      stacks: {
        id: string;
        name: string;
        type: string | null;
        base_price: number;
        subscription_duration: SubscriptionLimit;
      } | null;
    }>;

    return {
      id: order.id,
      total_amount: order.total_amount,
      created_at: order.created_at,
      stacks: (orderItems || []).map((item) => ({
        id: item.id,
        stack_id: item.stack_id,
        stack_name: item.stacks?.name || "Unknown Stack",
        stack_type: item.stacks?.type || null,
        status: item.status || "pending",
        progress_percent: item.progress_percent || 0,
        created_at: item.created_at,
        order_id: order.id,
        base_price: item.stacks?.base_price || 0,
        subscription_duration: item.stacks?.subscription_duration,
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

