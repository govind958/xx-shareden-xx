"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCartStacks(userId: string) {
  const supabase = await createClient();

  // 1️⃣ Fetch cart items
  const { data: cartData, error: cartErr } = await supabase
    .from("cart_stacks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (cartErr) {
    console.error("Error fetching cart_stacks:", cartErr);
    return [];
  }

  if (!cartData || cartData.length === 0) return [];

  // 2️⃣ Collect stack_ids in one array
  const stackIds = [...new Set(cartData.map((c: any) => c.stack_id))];

  // 3️⃣ Fetch all stacks in 1 query
  const { data: stacks, error: stackErr } = await supabase
    .from("stacks")
    .select("id, name, type, description, base_price, active, image_url")
    .in("id", stackIds);

  if (stackErr) {
    console.error("Error fetching stacks:", stackErr);
    return [];
  }

  // 4️⃣ Collect all sub_stack_ids
  const subIds = cartData.flatMap((c: any) => c.sub_stack_ids || []);
  const uniqueSubIds = [...new Set(subIds)];

  // 5️⃣ Fetch sub_stacks in 1 query
  const { data: subStacks, error: subErr } = await supabase
    .from("sub_stacks")
    .select("id, name, price")
    .in("id", uniqueSubIds);

  if (subErr) {
    console.error("Error fetching sub_stacks:", subErr);
    return [];
  }

  // 6️⃣ Create dictionary for faster mapping
  const subDict: Record<string, any> = {};
  subStacks?.forEach((s) => {
    subDict[s.id] = s;
  });

  // 7️⃣ Merge data → final output
  const final = cartData.map((item: any) => {
    const stack = stacks.find((s) => s.id === item.stack_id);

    return {
      cart_id: item.id, // cart row id
      stack_id: item.stack_id,
      name: stack?.name,
      type: stack?.type,
      description: stack?.description,
      base_price: stack?.base_price,
      active: stack?.active,
      image_url: stack?.image_url,

      sub_stacks:
        item.sub_stack_ids?.map((sid: string) => subDict[sid]) || [],

      total_price: item.total_price,
      status: item.status,
      created_at: item.created_at,
    };
  });

  return final;
}
