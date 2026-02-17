// app/admin/stacks/actions.ts
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { StackFormData } from "@/src/types/admin"

export async function saveStack(formData: StackFormData, id?: string) {
  const supabase = await createClient()
  
  const stackData = {
    name: formData.name,
    type: formData.type,
    description: formData.description,
    base_price: parseFloat(String(formData.base_price)),
    active: formData.active === "true" 
  }

  let stackId = id

  if (id) {
    // Update existing stack
    const { error } = await supabase.from("stacks").update(stackData).eq("id", id)
    if (error) throw new Error(error.message)
  } else {
    // Insert new stack and get the ID
    const { data, error } = await supabase
      .from("stacks")
      .insert([stackData])
      .select("id")
      .single()
    
    if (error) throw new Error(error.message)
    stackId = data.id
  }

  // Handle substacks
  if (stackId && formData.substacks && formData.substacks.length > 0) {
    // Delete existing substacks for this stack
    const { error: deleteError } = await supabase
      .from("sub_stacks")
      .delete()
      .eq("stack_id", stackId)
    
    if (deleteError) throw new Error(deleteError.message)

    // Insert new substacks
    const substackData = formData.substacks.map((substack) => ({
      stack_id: stackId,
      name: substack.label,
      price: parseFloat(String(substack.price)),
      is_free: parseFloat(String(substack.price)) === 0,
    }))

    const { error: insertError } = await supabase
      .from("sub_stacks")
      .insert(substackData)

    if (insertError) throw new Error(insertError.message)
  } else if (stackId) {
    // If no substacks provided, delete all existing ones
    await supabase.from("sub_stacks").delete().eq("stack_id", stackId)
  }
  
  revalidatePath("/admin/stacks")
}

export async function deleteStack(id: string) {
  const supabase = await createClient()
  // Substacks will be deleted automatically due to ON DELETE CASCADE
  const { error } = await supabase.from("stacks").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/stacks")
}

export async function getStacksWithSubstacks() {
  const supabase = await createClient()
  
  const { data: stacks, error } = await supabase
    .from("stacks")
    .select(`
      *,
      sub_stacks (
        id,
        name,
        price,
        is_free
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  
  // Transform sub_stacks to substacks format expected by the UI
  return stacks.map(stack => ({
    ...stack,
    substacks: stack.sub_stacks?.map((sub: { id: string; name: string; price: number; is_free: boolean }) => ({
      id: sub.id,
      label: sub.name,
      price: sub.price,
    })) || []
  }))
}

export async function getStackById(id: string) {
  const supabase = await createClient()
  
  const { data: stack, error } = await supabase
    .from("stacks")
    .select(`
      *,
      sub_stacks (
        id,
        name,
        price,
        is_free
      )
    `)
    .eq("id", id)
    .single()

  if (error) throw new Error(error.message)
  
  return {
    ...stack,
    substacks: stack.sub_stacks?.map((sub: { id: string; name: string; price: number; is_free: boolean }) => ({
      id: sub.id,
      label: sub.name,
      price: sub.price,
    })) || []
  }
}