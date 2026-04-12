"use server";

import { createClient } from "@/utils/supabase/server";

const TRIAL_DAYS = 3;
const MAX_STARTER_DEPLOYS = 1;
const MAX_STARTER_SUBSTACKS = 3;

export type CreateDeployOrderResult = {
  success: boolean;
  error?: string;
  orderId?: string;
  orderItemId?: string;
  /** When set, client should send the user to /private?tab=client_price */
  redirectToPricing?: boolean;
};

export type StacksTrialAccessResult = {
  allowed: boolean;
  message?: string;
  redirectToPricing?: boolean;
};

async function userAlreadyHasOrders(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("createDeployOrder: orders count", error);
    return true;
  }
  return (count ?? 0) > 0;
}

/** User has an active Pro or Enterprise plan — exempt from starter limits. */
async function userHasPaidAccess(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from("user_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active")
    .in("plan", ["pro", "enterprise"]);

  if (error) {
    console.error("createDeployOrder: paid plan check", error);
    return false;
  }
  return (count ?? 0) > 0;
}

async function countUserOrderItems(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("createDeployOrder: order_items count", error);
    return MAX_STARTER_DEPLOYS;
  }
  return count ?? 0;
}

/** Milliseconds at end of trial window, or null if user has no orders yet. */
async function getEffectiveTrialEndMs(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<number | null> {
  const { data: first, error } = await supabase
    .from("orders")
    .select("trial_ends_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("createDeployOrder: first order for trial", error);
    return Date.now();
  }
  if (!first) return null;
  if (first.trial_ends_at) {
    return new Date(first.trial_ends_at).getTime();
  }
  return (
    new Date(first.created_at).getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000
  );
}

const STARTER_DEPLOY_LIMIT_MSG =
  `Starter plan includes ${MAX_STARTER_DEPLOYS} stack deployment with up to ${MAX_STARTER_SUBSTACKS} modules. Upgrade to Pro for unlimited deploys.`;
const STARTER_SUBSTACK_LIMIT_MSG =
  `Starter plan allows up to ${MAX_STARTER_SUBSTACKS} modules per stack. Upgrade to Pro for unlimited modules.`;
const STARTER_TRIAL_EXPIRED_MSG =
  "Your starter trial period has ended. Upgrade to Pro to continue building stacks.";

async function trialGateBlocksNewDeploy(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<CreateDeployOrderResult | null> {
  if (await userHasPaidAccess(supabase, userId)) return null;

  const itemCount = await countUserOrderItems(supabase, userId);
  const trialEndMs = await getEffectiveTrialEndMs(supabase, userId);

  if (itemCount === 0) {
    return null;
  }

  if (itemCount >= MAX_STARTER_DEPLOYS) {
    return {
      success: false,
      error: STARTER_DEPLOY_LIMIT_MSG,
      redirectToPricing: true,
    };
  }

  if (trialEndMs !== null && Date.now() > trialEndMs) {
    return {
      success: false,
      error: STARTER_TRIAL_EXPIRED_MSG,
      redirectToPricing: true,
    };
  }

  return null;
}

async function starterSubstackGate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  substackCount: number
): Promise<CreateDeployOrderResult | null> {
  if (await userHasPaidAccess(supabase, userId)) return null;
  if (substackCount > MAX_STARTER_SUBSTACKS) {
    return {
      success: false,
      error: STARTER_SUBSTACK_LIMIT_MSG,
      redirectToPricing: true,
    };
  }
  return null;
}

/** For the stacks builder tab: redirect unpaid users who used trial fully or are past trial end. */
export async function checkStacksTrialAccess(): Promise<StacksTrialAccessResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { allowed: true };

  if (await userHasPaidAccess(supabase, user.id)) {
    return { allowed: true };
  }

  const itemCount = await countUserOrderItems(supabase, user.id);
  if (itemCount === 0) return { allowed: true };

  const trialEndMs = await getEffectiveTrialEndMs(supabase, user.id);

  if (itemCount >= MAX_STARTER_DEPLOYS) {
    return {
      allowed: false,
      message: STARTER_DEPLOY_LIMIT_MSG,
      redirectToPricing: true,
    };
  }

  if (trialEndMs !== null && Date.now() > trialEndMs) {
    return {
      allowed: false,
      message: STARTER_TRIAL_EXPIRED_MSG,
      redirectToPricing: true,
    };
  }

  return { allowed: true };
}

/** Expose limits to client UI so canvas/templates can enforce caps proactively. */
export async function getStarterDeployLimits(): Promise<{
  paid: boolean;
  maxSubStacks: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { paid: false, maxSubStacks: MAX_STARTER_SUBSTACKS };
  }
  if (await userHasPaidAccess(supabase, user.id)) {
    return { paid: true, maxSubStacks: 10_000 };
  }
  return { paid: false, maxSubStacks: MAX_STARTER_SUBSTACKS };
}

function trialFieldsForFirstOrder(): {
  trial_started_at: string;
  trial_ends_at: string;
} {
  const trial_started_at = new Date().toISOString();
  const trial_ends_at = new Date(
    Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();
  return { trial_started_at, trial_ends_at };
}

export async function createDeployOrderForPreMadeStack(input: {
  stackId: string;
  subStackIds: string[];
  totalAmount: number;
}): Promise<CreateDeployOrderResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const blocked = await trialGateBlocksNewDeploy(supabase, user.id);
  if (blocked) return blocked;

  const subGate = await starterSubstackGate(
    supabase,
    user.id,
    input.subStackIds.length
  );
  if (subGate) return subGate;

  const hasPriorOrders = await userAlreadyHasOrders(supabase, user.id);
  const trial = !hasPriorOrders ? trialFieldsForFirstOrder() : {};

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: 0,
      discount_amount: 0,
      ...trial,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("createDeployOrderForPreMadeStack order", orderError);
    return { success: false, error: "Could not create order." };
  }

  const { data: orderItem, error: itemError } = await supabase
    .from("order_items")
    .insert({
      order_id: order.id,
      user_id: user.id,
      stack_id: input.stackId,
      sub_stack_ids: input.subStackIds,
      status: "initiated",
      step: 1,
      progress_percent: 0,
    })
    .select("id")
    .single();

  if (itemError || !orderItem) {
    await supabase.from("orders").delete().eq("id", order.id);
    console.error("createDeployOrderForPreMadeStack order_item", itemError);
    return { success: false, error: "Could not create deployment." };
  }

  return {
    success: true,
    orderId: order.id,
    orderItemId: orderItem.id,
  };
}

type ClusterSubInput = { name: string; price: number; is_free?: boolean };

/** Resolve existing stack (any type/author) or create a new custom stack. */
async function resolveStackIdForCustomCluster(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  clusterName: string,
  totalPrice: number,
  clusterData: ClusterSubInput[]
): Promise<{ stack_id: string; sub_stack_ids: string[] } | null> {
  const currentSubstackNames = clusterData.map((s) => s.name).sort();

  const { data: existingStacks } = await supabase
    .from("stacks")
    .select("id, name, base_price")
    .eq("active", true);

  if (existingStacks && existingStacks.length > 0) {
    for (const stack of existingStacks) {
      const { data: existingSubStacks } = await supabase
        .from("sub_stacks")
        .select("id, name")
        .eq("stack_id", stack.id);

      if (existingSubStacks) {
        const existingNames = existingSubStacks.map((s) => s.name).sort();
        const namesMatch =
          currentSubstackNames.length === existingNames.length &&
          currentSubstackNames.every(
            (val, index) => val === existingNames[index]
          );

        if (namesMatch) {
          return {
            stack_id: stack.id,
            sub_stack_ids: existingSubStacks.map((s) => s.id),
          };
        }
      }
    }
  }

  const { data: stackRow, error: stackError } = await supabase
    .from("stacks")
    .insert({
      name: clusterName,
      description: "Custom infrastructure stack",
      type: "custom",
      base_price: totalPrice,
      author_id: userId,
      active: true,
    })
    .select("id")
    .single();

  if (stackError || !stackRow) {
    console.error("resolveStackIdForCustomCluster stack", stackError);
    return null;
  }

  const subStackPayload = clusterData.map((sub) => ({
    stack_id: stackRow.id,
    name: sub.name,
    price: sub.price,
    is_free: sub.is_free ?? false,
  }));

  const { data: subRows, error: subError } = await supabase
    .from("sub_stacks")
    .insert(subStackPayload)
    .select("id");

  if (subError || !subRows) {
    console.error("resolveStackIdForCustomCluster sub_stacks", subError);
    await supabase.from("stacks").delete().eq("id", stackRow.id);
    return null;
  }

  return {
    stack_id: stackRow.id,
    sub_stack_ids: subRows.map((row) => row.id),
  };
}

export async function createDeployOrderForCustomCluster(input: {
  clusterName: string;
  clusterData: ClusterSubInput[];
  totalPrice: number;
}): Promise<CreateDeployOrderResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  if (!input.clusterData.length) {
    return { success: false, error: "Add at least one module to the cluster." };
  }

  const blocked = await trialGateBlocksNewDeploy(supabase, user.id);
  if (blocked) return blocked;

  const subGate = await starterSubstackGate(
    supabase,
    user.id,
    input.clusterData.length
  );
  if (subGate) return subGate;

  const resolved = await resolveStackIdForCustomCluster(
    supabase,
    user.id,
    input.clusterName,
    input.totalPrice,
    input.clusterData
  );

  if (!resolved) {
    return { success: false, error: "Could not save your stack." };
  }

  const hasPriorOrders = await userAlreadyHasOrders(supabase, user.id);
  const trial = !hasPriorOrders ? trialFieldsForFirstOrder() : {};

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: 0,
      discount_amount: 0,
      ...trial,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("createDeployOrderForCustomCluster order", orderError);
    return { success: false, error: "Could not create order." };
  }

  const { data: orderItem, error: itemError } = await supabase
    .from("order_items")
    .insert({
      order_id: order.id,
      user_id: user.id,
      stack_id: resolved.stack_id,
      sub_stack_ids: resolved.sub_stack_ids,
      status: "initiated",
      step: 1,
      progress_percent: 0,
    })
    .select("id")
    .single();

  if (itemError || !orderItem) {
    await supabase.from("orders").delete().eq("id", order.id);
    console.error("createDeployOrderForCustomCluster order_item", itemError);
    return { success: false, error: "Could not create deployment." };
  }

  return {
    success: true,
    orderId: order.id,
    orderItemId: orderItem.id,
  };
}
