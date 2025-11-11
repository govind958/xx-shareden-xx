// src/app/product_stacks/actions.ts
import { createClient } from "@/utils/supabase/client"

// 🧩 Define the TypeScript type for a Stack record
export interface Stack {
  id: string               // UUID in Supabase, so this must be string
  name: string
  description?: string
  type?: string
  base_price: number
  active: boolean
  created_at: string
}

// 📦 Fetch all active stacks from Supabase
export async function getStacks(): Promise<Stack[]> {
  const supabase = createClient()

  // Fetch rows from "stacks" table
  const { data, error } = await supabase
    .from("stacks")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })

  // Handle errors safely
  if (error) {
    console.error("Error fetching stacks:", error.message)
    return []
  }

  // Return typed data or an empty array
  return (data as Stack[]) ?? []
}
