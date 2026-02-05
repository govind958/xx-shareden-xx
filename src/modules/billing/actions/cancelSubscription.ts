"use server";

import { createClient } from "@/utils/supabase/server";
import { CancelSubscriptionResult } from "../types";

/**
 * Cancel a subscription for a specific order item
 * Archives the order item by setting is_active to false
 */
export async function cancelSubscription(
  orderItemId: string,
  userId: string
): Promise<CancelSubscriptionResult> {
  try {
    const supabase = await createClient();

    // Update order_item to archive it by setting is_active to false
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
      message: "Subscription cancelled successfully. The item has been archived.",
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



