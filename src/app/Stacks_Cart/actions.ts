"use server";

import { createClient } from "@/utils/supabase/server";

// -------------------------
// TYPES
// -------------------------
export interface CartStackRow {
  id: string;
  user_id: string;
  stack_id: string;
  sub_stack_ids: string[] | null;
  total_price: number;
  status: string;
  created_at: string;
}

export interface StackRow {
  id: string;
  name: string;
  type: string;
  description: string | null;
  base_price: number;
  active: boolean;
  image_url: string | null;
}

export interface SubStackRow {
  id: string;
  name: string;
  price: number;
}

export interface FinalCartItem {
  cart_id: string;
  stack_id: string;
  name: string | undefined;
  type: string | undefined;
  description: string | null | undefined;
  base_price: number | undefined;
  active: boolean | undefined;
  image_url: string | null | undefined;
  sub_stacks: SubStackRow[];
  total_price: number;
  status: string;
  created_at: string;
}

// -------------------------
// MAIN FUNCTION
// -------------------------
export async function getCartStacks(userId: string): Promise<FinalCartItem[]> {
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

  const typedCartData = cartData as CartStackRow[];

  // 2️⃣ Extract stack IDs uniquely
  const stackIds = [...new Set(typedCartData.map((c) => c.stack_id))];

  // 3️⃣ Fetch stacks
  const { data: stacks, error: stackErr } = await supabase
    .from("stacks")
    .select("id, name, type, description, base_price, active, image_url")
    .in("id", stackIds);

  if (stackErr || !stacks) {
    console.error("Error fetching stacks:", stackErr);
    return [];
  }

  const typedStacks = stacks as StackRow[];

  // 4️⃣ Collect all sub stack IDs
  const allSubIds = typedCartData.flatMap((c) => c.sub_stack_ids || []);
  const uniqueSubIds = [...new Set(allSubIds)];

  // 5️⃣ Fetch sub stacks
  const { data: subStacks, error: subErr } = await supabase
    .from("sub_stacks")
    .select("id, name, price")
    .in("id", uniqueSubIds);

  if (subErr || !subStacks) {
    console.error("Error fetching sub_stacks:", subErr);
    return [];
  }

  const typedSubStacks = subStacks as SubStackRow[];

  // 6️⃣ Create dictionary
  const subDict: Record<string, SubStackRow> = {};
  typedSubStacks.forEach((s) => {
    subDict[s.id] = s;
  });

  // 7️⃣ Final merged output
  const final: FinalCartItem[] = typedCartData.map((item) => {
    const stack = typedStacks.find((s) => s.id === item.stack_id);

    return {
      cart_id: item.id,
      stack_id: item.stack_id,

      name: stack?.name,
      type: stack?.type,
      description: stack?.description,
      base_price: stack?.base_price,
      active: stack?.active,
      image_url: stack?.image_url,

      sub_stacks: item.sub_stack_ids?.map((sid) => subDict[sid]) || [],

      total_price: item.total_price,
      status: item.status,
      created_at: item.created_at,
    };
  });

  return final;
}
