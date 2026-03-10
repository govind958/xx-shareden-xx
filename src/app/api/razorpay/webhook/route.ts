import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Razorpay webhook handler to keep subscription status in sync
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Razorpay webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(bodyText) as {
      event: string;
      payload?: {
        subscription?: { entity: { id: string; status: string } };
      };
    };

    const event = payload.event;
    const subscriptionEntity = payload.payload?.subscription?.entity;
    const subscriptionId = subscriptionEntity?.id;
    const subscriptionStatus = subscriptionEntity?.status;

    if (subscriptionId) {
      const supabase = await createClient();

      // Update any orders tied to this Razorpay subscription
      const { error } = await supabase
        .from("orders")
        .update({
          subscription_status: subscriptionStatus,
        })
        .eq("razorpay_subscription_id", subscriptionId);

      if (error) {
        console.error("Failed to update subscription status from webhook:", error);
      }
    }

    // You can extend this to handle payment events if needed
    console.log("Processed Razorpay webhook event:", event, subscriptionId, subscriptionStatus);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling Razorpay webhook:", error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}

