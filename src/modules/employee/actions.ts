'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

// Employee signup - Uses Supabase Auth with auto-confirmed email
export async function employeeSignup(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const employeeRole = formData.get('role') as string

    if (!name || !email || !password || !employeeRole) {
        redirect('/Employee_portal/signup?error=missing_fields')
    }

    // Check if email already exists in employees table
    const { data: existing } = await supabase
        .from('employees')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single()

    if (existing) {
        redirect('/Employee_portal/signup?error=already_exists')
    }

    // Use admin client to create user with auto-confirmed email
    const adminClient = createAdminClient()
    
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: email.toLowerCase().trim(),
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

    // Create employee record linked to auth user
    const { error: insertError } = await adminClient
        .from('employees')
        .insert({
            id: authData.user.id,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            role: employeeRole.trim(),
            is_active: true,
        })

    if (insertError) {
        console.error('Employee insert error:', insertError)
        // Clean up auth user if employee creation fails
        await adminClient.auth.admin.deleteUser(authData.user.id).catch(() => {})
        redirect('/Employee_portal/signup?error=creation_failed')
    }

    // Sign in the user after signup
    await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
    })

    revalidatePath('/Employee_portal', 'layout')
    redirect('/Employee_portal')
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

    // Verify user is an employee (check employees table)
    const { data: employee } = await supabase
        .from('employees')
        .select('id, is_active')
        .eq('id', authData.user.id)
        .eq('is_active', true)
        .single()

    if (!employee) {
        // Not an employee, sign them out
        await supabase.auth.signOut()
        redirect('/Employee_portal/login?error=not_employee')
    }

    revalidatePath('/Employee_portal', 'layout')
    redirect('/Employee_portal')
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

// Valid order item statuses
export type OrderItemStatus = 'initiated' | 'processing' | 'in_progress' | 'completed' | 'cancelled'

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

    // Verify this order item is assigned to this employee
    const { data: orderItem, error: fetchError } = await supabase
        .from('order_items')
        .select('id, assigned_to, status')
        .eq('id', orderItemId)
        .single()

    if (fetchError || !orderItem) {
        return { success: false, error: 'Order item not found' }
    }

    if (orderItem.assigned_to !== employee.id) {
        return { success: false, error: 'You are not assigned to this order item' }
    }

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

    if (orderItem.assigned_to !== employee.id) {
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

// Get employee assignments
export async function getEmployeeAssignments(employeeId: string) {
    const supabase = await createClient()
  
    const { data, error } = await supabase
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
  
    return { data, error }
  }