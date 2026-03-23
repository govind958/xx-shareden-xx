"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { sendEmployeeApprovalEmail } from "@/src/modules/email/send-employee-invite";

export async function approveEmployee(employeeId: string): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  const { data: emp, error: fetchError } = await adminClient
    .from("employees")
    .select("id, email")
    .eq("id", employeeId)
    .single();
  if (fetchError || !emp) return { success: false, error: "Employee not found" };

  const { error: updateError } = await adminClient
    .from("employees")
    .update({ is_active: true, approval_status: "approved" })
    .eq("id", employeeId);
  if (updateError) return { success: false, error: updateError.message };

  await sendEmployeeApprovalEmail(emp.email, true);
  return { success: true };
}

export async function rejectEmployee(employeeId: string): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  const { data: emp, error: fetchError } = await adminClient
    .from("employees")
    .select("id, email")
    .eq("id", employeeId)
    .single();
  if (fetchError || !emp) return { success: false, error: "Employee not found" };

  const { error: updateError } = await adminClient
    .from("employees")
    .update({ is_active: false, approval_status: "rejected" })
    .eq("id", employeeId);
  if (updateError) return { success: false, error: updateError.message };

  await sendEmployeeApprovalEmail(emp.email, false);
  return { success: true };
}