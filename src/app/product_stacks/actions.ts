// src/app/product_stacks/actions.ts
import { createClient } from "@/utils/supabase/client"

export interface Stack {
  id: number
  name: string
  description?: string
  type?: string
  base_price: number
  active: boolean
  created_at: string
}

export async function getStacks(): Promise<Stack[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("stacks")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching stacks:", error.message)
    return []
  }

  return (data as Stack[]) || []
}
