"use server";

import { createClient } from "@/utils/supabase/server";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export type PlanName = "starter" | "pro" | "enterprise";

const PLAN_PRICES: Record<PlanName, { monthly: number; yearly: number }> = {
  starter: { monthly: 0, yearly: 0 },
  pro: { monthly: 29, yearly: 19 },
  enterprise: { monthly: 99, yearly: 79 },
};

export async function getUserActivePlan() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  return data;
}

export async function createPlanSubscription(
  plan: PlanName,
  billingCycle: "monthly" | "yearly"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (plan === "starter") {
    const { data: existing } = await supabase
      .from("user_subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (existing) {
      return { error: "You already have an active plan." };
    }

    const { error } = await supabase.from("user_subscriptions").insert({
      user_id: user.id,
      plan: "starter",
      status: "active",
      billing_cycle: null,
      amount: 0,
    });

    if (error) {
      console.error("createPlanSubscription starter:", error);
      return { error: "Could not activate starter plan." };
    }

    return { success: true, plan: "starter" };
  }

  const amount = PLAN_PRICES[plan][billingCycle];

  try {
    const razorpayPlan = (await razorpay.plans.create({
      period: billingCycle === "yearly" ? "yearly" : "monthly",
      interval: 1,
      item: {
        name: `Shareden ${plan} – ${billingCycle}`,
        amount: amount * 100,
        currency: "INR",
      },
    })) as { id: string };

    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlan.id,
      total_count: billingCycle === "yearly" ? 10 : 120,
      customer_notify: 1,
      notes: {
        user_id: user.id,
        plan,
        billing_cycle: billingCycle,
      },
    });

    if (!subscription || !subscription.id) {
      throw new Error("Failed to create Razorpay subscription");
    }

    return {
      success: true,
      subscriptionId: subscription.id,
      amount: amount * 100,
      currency: "INR",
      plan,
    };
  } catch (error: unknown) {
    let msg = "Unknown error";
    if (error instanceof Error) msg = error.message;
    else if (typeof error === "object" && error !== null && "error" in error) {
      const rzp = (error as { error: { description?: string } }).error;
      msg = rzp.description || JSON.stringify(rzp);
    }
    console.error("createPlanSubscription:", msg);
    return { error: msg };
  }
}

export async function verifyPlanSubscription(input: {
  razorpay_subscription_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: PlanName;
  billingCycle: "monthly" | "yearly";
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const body = `${input.razorpay_subscription_id}|${input.razorpay_payment_id}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expected !== input.razorpay_signature) {
    return { error: "Invalid payment signature" };
  }

  const amount = PLAN_PRICES[input.plan][input.billingCycle];
  const now = new Date();
  const periodEnd = new Date(now);
  if (input.billingCycle === "yearly") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  await supabase
    .from("user_subscriptions")
    .update({ status: "cancelled" })
    .eq("user_id", user.id)
    .eq("status", "active");

  const { error } = await supabase.from("user_subscriptions").insert({
    user_id: user.id,
    plan: input.plan,
    status: "active",
    billing_cycle: input.billingCycle,
    razorpay_subscription_id: input.razorpay_subscription_id,
    razorpay_payment_id: input.razorpay_payment_id,
    amount,
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
  });

  if (error) {
    console.error("verifyPlanSubscription insert:", error);
    return { error: "Could not activate plan." };
  }

  return {
    success: true,
    plan: input.plan,
    paymentId: input.razorpay_payment_id,
  };
}
