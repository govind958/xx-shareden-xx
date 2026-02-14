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
