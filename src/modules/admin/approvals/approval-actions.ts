"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { verifyAdminSession } from "@/src/modules/admin/actions"
import { approveEmployee, rejectEmployee } from "@/src/modules/admin/employee-actions"

// Fetch pending employees (approval_status=pending, is_active=false)
export async function getPendingEmployees() {
  const { isValid } = await verifyAdminSession()
  if (!isValid) return { error: "Unauthorized", data: null }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("employees")
    .select("id, name, email, role, specialization, created_at, approval_status, phone")
    .eq("is_active", false)
    .eq("approval_status", "pending")
    .order("created_at", { ascending: false })

  if (error) return { error: error.message, data: null }
  return { data: data || [], error: null }
}

// Fetch pending invitations (status=pending, not expired)
export async function getPendingInvitations() {
  const { isValid } = await verifyAdminSession()
  if (!isValid) return { error: "Unauthorized", data: null }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("employee_invitations")
    .select("id, email, status, invited_by, created_at, expires_at")
    .eq("status", "pending")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })

  if (error) return { error: error.message, data: null }
  return { data: data || [], error: null }
}

// Revoke an invitation
export async function revokeInvitation(invitationId: string) {
  const { isValid } = await verifyAdminSession()
  if (!isValid) return { success: false, error: "Unauthorized" }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from("employee_invitations")
    .update({ status: "revoked" })
    .eq("id", invitationId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// Re-export for convenience
export { approveEmployee, rejectEmployee }