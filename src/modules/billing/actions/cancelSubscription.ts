"use server";

import { createClient } from "@/utils/supabase/server";
import Razorpay from "razorpay";
import { CancelSubscriptionResult } from "../types";

// Local Razorpay client for subscription cancellation
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * Cancel a subscription for a specific order item
 * 1. Look up the parent order and its Razorpay subscription
 * 2. Cancel the Razorpay subscription (at period end)
 * 3. Archive the order item by setting is_active to false
 */
export async function cancelSubscription(
  orderItemId: string,
  userId: string
): Promise<CancelSubscriptionResult> {
  try {
    const supabase = await createClient();

    // Find the parent order and its Razorpay subscription id
    const { data: orderItem, error: orderItemError } = await supabase
      .from("order_items")
      .select(
        `
        id,
        order_id,
        user_id,
        orders (
          id,
          razorpay_subscription_id
        )
      `
      )
      .eq("id", orderItemId)
      .eq("user_id", userId)
      .single();

    if (orderItemError || !orderItem) {
      console.error("Error fetching order item for cancellation:", orderItemError);
      return {
        success: false,
        message: "Unable to find subscription to cancel",
        error: orderItemError?.message,
      };
    }

    const razorpaySubscriptionId =
      (orderItem as { orders?: { razorpay_subscription_id?: string } }).orders
        ?.razorpay_subscription_id || null;

    // If we have a Razorpay subscription id, cancel it at cycle end
    if (razorpaySubscriptionId) {
      try {
        await (razorpay.subscriptions as unknown as { cancel: (id: string, params?: { cancel_at_cycle_end?: boolean }) => Promise<unknown> })
          .cancel(razorpaySubscriptionId, { cancel_at_cycle_end: true });

        // Mark the order as no longer recurring
        const { error: orderUpdateError } = await supabase
          .from("orders")
          .update({
            is_recurring: false,
            subscription_status: "cancelled",
          })
          .eq("id", orderItem.order_id);

        if (orderUpdateError) {
          console.error("Error updating order after subscription cancel:", orderUpdateError);
        }
      } catch (razorpayError) {
        console.error("Error cancelling Razorpay subscription:", razorpayError);
        return {
          success: false,
          message: "Failed to cancel subscription with payment provider",
          error: razorpayError instanceof Error ? razorpayError.message : "Unknown Razorpay error",
        };
      }
    }

    // Archive the order item locally
    const { error: updateError } = await supabase
      .from("order_items")
      .update({
        is_active: false,
      })
      .eq("id", orderItemId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error cancelling subscription:", updateError);
      return {
        success: false,
        message: "Failed to cancel subscription",
        error: updateError.message,
      };
    }

    return {
      success: true,
      message:
        "Subscription cancellation requested. Your access will remain active until the end of the current billing cycle.",
    };
  } catch (error) {
    console.error("Error in cancelSubscription:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
