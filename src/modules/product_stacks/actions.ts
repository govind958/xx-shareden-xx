import { createClient } from "@/utils/supabase/client"
import { Stack } from "@/src/types/product_stack"

// 📦 Fetch all active stacks *with* their sub_stacks
export async function getStacks(): Promise<Stack[]> {
  const supabase = createClient()

  // Fetch rows from "stacks" table and join related sub_stacks
  const { data, error } = await supabase
    .from("stacks")
    .select(`
      id,
      name,
      description,
      type,
      base_price,
      active,
      created_at,
      sub_stacks (
        id,
        stack_id,
        name,
        price,
        is_free,
        created_at
      )
    `)
    .eq("active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching stacks with sub_stacks:", error.message)
    return []
  }

  return (data as Stack[]) ?? []
}
