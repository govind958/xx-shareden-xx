'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import {
        sendEmployeeInviteEmail,
        sendAdminNewEmployeeNotification,
        sendEmployeeApprovalEmail,
    } from "@/src/modules/email/send-employee-invite";
import {
    sendStatusNotificationEmail,
    type OrderStatus,
} from '@/src/modules/email/send-status-notification'
import { randomBytes } from "crypto";

// Generate a secure invite token
function generateInviteToken(): string {
    return randomBytes(32).toString("hex");
  }

// Employee signup - Uses Supabase Auth with auto-confirmed email
export async function employeeSignup(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const employeeRole = formData.get('role') as string
    const inviteToken = formData.get('invite_token') as string

    if (!name || !email || !password || !employeeRole) {
        redirect('/Employee_portal/signup?error=missing_fields')
    }

    if (!inviteToken) {
        redirect('/Employee_portal/signup?error=invalid_invite')
    }

    // Check if invitation exists and is valid
    const { data: invitation, error: inviteError } = await supabase
        .from('employee_invitations')
        .select('id, email, status')
        .eq('invite_token', inviteToken)
        .eq('status', 'pending')
        .single()

    if (inviteError || !invitation) {
        redirect('/Employee_portal/signup?error=invalid_invite')
    }

    // Ensure email matches invitation
    const normalizedEmail = email.toLowerCase().trim();
    if (invitation.email !== normalizedEmail) {
        redirect("/Employee_portal/signup?error=invalid_invite");
    }


    // Check if email already exists in employees table
    const { data: existing } = await supabase
        .from('employees')
        .select('id')
        .eq('email', normalizedEmail)
        .single()

    if (existing) {
        redirect('/Employee_portal/signup?error=already_exists')
    }

    // Use admin client to create user with auto-confirmed email
    const adminClient = createAdminClient()
    
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: normalizedEmail,
        password: password,
        email_confirm: true, // Auto-confirm email for employees
        user_metadata: {
            name: name.trim(),
            user_type: 'employee',
            employee_role: employeeRole.trim(),
        }
    })

    if (authError || !authData.user) {
        console.error('Auth signup error:', authError)
        redirect('/Employee_portal/signup?error=auth_failed')
    }

    // Create employee record linked to auth user (pending approval)
    const { error: insertError } = await adminClient
        .from('employees')
        .insert({
            id: authData.user.id,
            name: name.trim(),
            email: normalizedEmail,
            role: employeeRole.trim(),
            is_active: false,
            approval_status: 'pending',
        })

    if (insertError) {
        console.error('Employee insert error:', insertError)
        // Clean up auth user if employee creation fails
        await adminClient.auth.admin.deleteUser(authData.user.id).catch(() => {})
        redirect('/Employee_portal/signup?error=creation_failed')
    }

    // Mark invitation as accepted
    await adminClient
        .from("employee_invitations")
        .update({ status: "accepted" })
        .eq("id", invitation.id);

          // Notify admin (get first admin email - you may want to fetch from admin_users)
  const { data: adminUser } = await adminClient
  .from("admin_users")
  .select("email")
  .eq("is_active", true)
  .limit(1)
  .single();
const adminEmail = adminUser?.email || process.env.SMTP_USER || "";
await sendAdminNewEmployeeNotification(name.trim(), normalizedEmail, adminEmail);

    revalidatePath('/Employee_portal', 'layout')
    redirect('/Employee_portal/pending-approval')
}

// Employee login - Uses Supabase Auth and verifies employee role
export async function employeeLogin(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        redirect('/Employee_portal/login?error=missing_fields')
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
    })

    if (authError || !authData.user) {
        console.error('Auth login error:', authError)
        redirect('/Employee_portal/login?error=invalid_credentials')
    }

    // Verify user is an employee (check employees table - query without is_active to detect pending/rejected)
    const { data: employee } = await supabase
        .from('employees')
        .select('id, is_active, approval_status')
        .eq('id', authData.user.id)
        .single()

    if (!employee) {
        await supabase.auth.signOut()
        redirect('/Employee_portal/login?error=not_employee')
    }

    if (!employee.is_active && employee.approval_status === 'pending') {
        await supabase.auth.signOut()
        redirect('/Employee_portal/login?error=pending_approval')
    }

    if (!employee.is_active || employee.approval_status === 'rejected') {
        await supabase.auth.signOut()
        redirect('/Employee_portal/login?error=account_rejected')
    }

    revalidatePath('/Employee_portal', 'layout')
    redirect('/Employee_portal')
}

// Employee forgot password - validates email exists before sending reset link
export async function employeeForgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const adminClient = createAdminClient();
    const supabase = await createClient();

    const normalizedEmail = email.toLowerCase().trim();

    const { data: employee } = await adminClient
        .from('employees')
        .select('id, is_active')
        .eq('email', normalizedEmail)
        .single();

    if (!employee) {
        return { success: false, error: 'No employee account found with this email address.' };
    }

    if (!employee.is_active) {
        return { success: false, error: 'This account is not active. Please contact your administrator.' };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${siteUrl}/Employee_portal/reset-password`,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

// Employee logout
export async function employeeLogout() {
        const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/Employee_portal/login')
}

// Verify employee session (server-side) - Uses Supabase Auth
export async function verifyEmployeeSession(): Promise<{
    isValid: boolean
    employee?: { id: string; email: string; name: string; role: string }
}> {
    const supabase = await createClient()

    // Get current auth session
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return { isValid: false }
    }

    // Verify user is an employee
    const { data: employee, error: empError } = await supabase
        .from('employees')
        .select('id, email, name, role, is_active')
        .eq('id', user.id)
        .eq('is_active', true)
        .single()

    if (empError || !employee) {
        return { isValid: false }
    }

    return {
        isValid: true,
        employee: {
            id: employee.id,
            email: employee.email,
            name: employee.name,
            role: employee.role,
        },
    }
}

// Valid order item statuses - alias email module type for this surface
export type OrderItemStatus = OrderStatus

// Update order item status (for employees working on tasks)
export async function updateOrderItemStatus(
    orderItemId: string,
    newStatus: OrderItemStatus,
    progressPercent?: number
): Promise<{ success: boolean; error?: string }> {
    const { isValid, employee } = await verifyEmployeeSession()

    if (!isValid || !employee) {
        return { success: false, error: 'Unauthorized - Employee session required' }
    }

    const supabase = await createClient()
    const adminClient = createAdminClient()

    // Fetch order item with user and stack details for notification
    const { data: orderItem, error: fetchError } = await supabase
        .from('order_items')
        .select(`
            id, 
            assigned_to, 
            status,
            user_id,
            stacks:stack_id (name)
        `)
        .eq('id', orderItemId)
        .single()

    if (fetchError || !orderItem) {
        return { success: false, error: 'Order item not found' }
    }

    const { data: subAccess } = await supabase
        .from('substack_assignments')
        .select('id')
        .eq('order_item_id', orderItemId)
        .eq('employee_id', employee.id)
        .limit(1)
        .maybeSingle()

    const hasAccess =
        orderItem.assigned_to === employee.id || !!subAccess

    if (!hasAccess) {
        return { success: false, error: 'You are not assigned to this order item' }
    }

    const previousStatus = orderItem.status as OrderItemStatus

    // Build update payload
    const updatePayload: { status: OrderItemStatus; progress_percent?: number } = {
        status: newStatus,
    }

    // Auto-set progress based on status if not provided
    if (progressPercent !== undefined) {
        updatePayload.progress_percent = progressPercent
    } else {
        // Default progress values based on status
        switch (newStatus) {
            case 'in_progress':
                updatePayload.progress_percent = 25
                break
            case 'completed':
                updatePayload.progress_percent = 100
                break
        }
    }

    // Update order_items table
    const { error: updateError } = await supabase
        .from('order_items')
        .update(updatePayload)
        .eq('id', orderItemId)

    if (updateError) {
        return { success: false, error: updateError.message }
    }

    // Also update employee_assignments status
    const assignmentStatus = newStatus === 'completed' ? 'completed' : 
                            newStatus === 'in_progress' ? 'in_progress' : 'assigned'
    
    await supabase
        .from('employee_assignments')
        .update({ status: assignmentStatus })
        .eq('order_item_id', orderItemId)
        .eq('employee_id', employee.id)

    await supabase
        .from('substack_assignments')
        .update({ status: assignmentStatus })
        .eq('order_item_id', orderItemId)
        .eq('employee_id', employee.id)

    // Send email notification to customer if status changed
    if (previousStatus !== newStatus && orderItem.user_id) {
        try {
            // Get user email from auth.users using admin client
            const { data: userData } = await adminClient.auth.admin.getUserById(orderItem.user_id)
            
            // Get user profile for name
            const { data: profile } = await supabase
                .from('profiles')
                .select('name')
                .eq('user_id', orderItem.user_id)
                .single()

            if (userData?.user?.email) {
                const stacks = orderItem.stacks as { name: string } | { name: string }[] | null
                const stackName = Array.isArray(stacks) ? stacks[0]?.name : stacks?.name || 'Your Stack'
                
                await sendStatusNotificationEmail({
                    customerEmail: userData.user.email,
                    customerName: profile?.name || 'Valued Customer',
                    orderItemId: orderItemId,
                    stackName: stackName,
                    newStatus: newStatus,
                    previousStatus: previousStatus,
                    progressPercent: updatePayload.progress_percent,
                    employeeName: employee.name,
                })
            }
        } catch (emailError) {
            console.error('Failed to send status notification email:', emailError)
            // Don't fail the status update if email fails
        }
    }

    revalidatePath('/Employee_portal/Task_Working_Space')
    revalidatePath('/Employee_portal/Task')

    return { success: true }
}

// Update order item progress (without changing status)
export async function updateOrderItemProgress(
    orderItemId: string,
    progressPercent: number
): Promise<{ success: boolean; error?: string }> {
    const { isValid, employee } = await verifyEmployeeSession()

    if (!isValid || !employee) {
        return { success: false, error: 'Unauthorized - Employee session required' }
    }

    if (progressPercent < 0 || progressPercent > 100) {
        return { success: false, error: 'Progress must be between 0 and 100' }
    }

    const supabase = await createClient()

    // Verify this order item is assigned to this employee
    const { data: orderItem, error: fetchError } = await supabase
        .from('order_items')
        .select('id, assigned_to')
        .eq('id', orderItemId)
        .single()

    if (fetchError || !orderItem) {
        return { success: false, error: 'Order item not found' }
    }

    const { data: subAccess } = await supabase
        .from('substack_assignments')
        .select('id')
        .eq('order_item_id', orderItemId)
        .eq('employee_id', employee.id)
        .limit(1)
        .maybeSingle()

    const hasAccess =
        orderItem.assigned_to === employee.id || !!subAccess

    if (!hasAccess) {
        return { success: false, error: 'You are not assigned to this order item' }
    }

    // Update progress
    const { error: updateError } = await supabase
        .from('order_items')
        .update({ progress_percent: progressPercent })
        .eq('id', orderItemId)

    if (updateError) {
        return { success: false, error: updateError.message }
    }

    return { success: true }
}

// Get employee assignments (whole line items + per-substack modules)
export async function getEmployeeAssignments(employeeId: string) {
    const supabase = await createClient()

    const { data: itemRows, error: errItem } = await supabase
      .from('employee_assignments')
      .select(`
        id,
        status,
        assigned_at,
        order_items (
          id,
          order_id,
          status,
          progress_percent,
          step,
          stacks ( id, name, type ),
          orders!order_items_order_id_fkey (
            id,
            subscription_duration,
            subscription_status,
            is_recurring,
            created_at
          )
        )
      `)
      .eq('employee_id', employeeId)
      .order('assigned_at', { ascending: false })

    const { data: subRows, error: errSub } = await supabase
      .from('substack_assignments')
      .select(`
        id,
        status,
        created_at,
        sub_stack_id,
        sub_stacks:sub_stack_id ( id, name ),
        order_items:order_item_id (
          id,
          order_id,
          status,
          progress_percent,
          step,
          stacks:stack_id ( id, name, type ),
          orders!order_items_order_id_fkey (
            id,
            subscription_duration,
            subscription_status,
            is_recurring,
            created_at
          )
        )
      `)
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })

    const merged = [
      ...(itemRows || []).map((a) => ({ ...a, assignment_kind: 'order_item' as const })),
      ...(subRows || []).map((a) => ({ ...a, assigned_at: a.created_at, assignment_kind: 'substack' as const })),
    ].sort(
      (a, b) =>
        new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime()
    )

    return { data: merged, error: errItem || errSub }
  }

  // Admin: Send Employee invitation

  export async function sendEmployeeInvite(email: string): Promise<{ success: boolean; error?: string }> {
    const adminClient = createAdminClient()
    const normalizedEmail = email.toLowerCase().trim();

    const {data: existingEmp} = await adminClient
    .from("employees")
    .select("id")
    .eq("email", normalizedEmail)
    .single()

    if (existingEmp) {
        return { success: false, error: 'Employee already exists' }
    }

    const { data: pendingInvite } = await adminClient
    .from("employee_invitations")
    .select("id")
    .eq("email", normalizedEmail)
    .eq("status", "pending")
    .gt("expires_at", new Date().toISOString())
    .single();
  if (pendingInvite) {
    return { success: false, error: "An invitation for this email is already pending" };
  }

  const inviteToken = generateInviteToken();
  const { error: insertError } = await adminClient.from("employee_invitations").insert({
    email: normalizedEmail,
    invite_token: inviteToken,
    status: "pending",
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  const result = await sendEmployeeInviteEmail(normalizedEmail, inviteToken);
  if (!result.success) {
    return { success: false, error: result.error || "Failed to send email" };
  }
  return { success: true };
}

// Validate invite token (for signup page)
export async function validateInviteToken(token: string): Promise<{ email: string } | null> {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("employee_invitations")
      .select("email")
      .eq("invite_token", token)
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString())
      .single();
    if (error || !data) return null;
    return { email: data.email };
  }

// Admin: Approve employee
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

// Admin: Reject employee
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