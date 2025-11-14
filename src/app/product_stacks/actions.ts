import { createClient } from "@/utils/supabase/client"

// 🧩 Define types
export interface SubStack {
  id: string
  stack_id: string
  name: string
  price: number
  is_free: boolean
  created_at: string
}

export interface Stack {
  id: string
  name: string
  description?: string
  type?: string
  base_price: number
  active: boolean
  created_at: string
  sub_stacks?: SubStack[]     // <--- include sub_stacks here
}

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
