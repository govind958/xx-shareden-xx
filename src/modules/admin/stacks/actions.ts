// app/admin/stacks/actions.ts
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { StackFormData } from "@/types/admin"

export async function saveStack(formData: StackFormData, id?: string) {
  const supabase = await createClient()
  
  const stackData = {
    name: formData.name,
    type: formData.type,
    description: formData.description,
    base_price: parseFloat(String(formData.base_price)),
    active: formData.active === "true" 
  }

  const { error } = id 
    ? await supabase.from("stacks").update(stackData).eq("id", id)
    : await supabase.from("stacks").insert([stackData])

  if (error) throw new Error(error.message)
  
  revalidatePath("/admin/stacks")
}

export async function deleteStack(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("stacks").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/stacks")
}