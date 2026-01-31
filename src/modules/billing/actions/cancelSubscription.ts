"use server";

import { createClient } from "@/utils/supabase/server";
import { CancelSubscriptionResult } from "../types";

/**
 * Cancel a subscription
 * Archives the stack and removes subscription
 */
export async function cancelSubscription(
  stackId: string,
  userId: string
): Promise<CancelSubscriptionResult> {
  try {
    const supabase = await createClient();

    // Update stack to archive it and remove subscription
    const { error: updateError } = await supabase
      .from("stacks")
      .update({
        active: false,
        subscription_duration: null,
      })
      .eq("id", stackId)
      .eq("author_id", userId);

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
      message: "Subscription cancelled successfully. The stack has been archived.",
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


