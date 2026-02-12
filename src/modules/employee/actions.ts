'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'crypto'

// Helper to hash values (password, etc.)
function hashValue(value: string): string {
    return createHash('sha256').update(value).digest('hex')
}

// Helper to generate session token
function generateSessionToken(): string {
    return randomBytes(48).toString('hex')
}

// Employee signup
export async function employeeSignup(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    if (!name || !email || !password || !role) {
        redirect('/Employee_portal/signup?error=missing_fields')
    }

    // Check if employee already exists
    const { data: existing } = await supabase
        .from('employees')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single()

    if (existing) {
        redirect('/Employee_portal/signup?error=already_exists')
    }

    // Hash password
    const passwordHash = hashValue(password)

    // Create employee
    const { data: employee, error: insertError } = await supabase
        .from('employees')
        .insert({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password_hash: passwordHash,
            role: role.trim(),
            is_active: true,
        })
        .select('id')
        .single()

    if (insertError || !employee) {
        redirect('/Employee_portal/signup?error=creation_failed')
    }

    // Generate session
    const sessionToken = generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { error: sessionError } = await supabase
        .from('employee_sessions')
        .insert({
            employee_id: employee.id,
            session_token: sessionToken,
            expires_at: expiresAt.toISOString(),
        })

    if (sessionError) {
        redirect('/Employee_portal/signup?error=session_error')
    }

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('employee_session_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    })

    revalidatePath('/Employee_portal', 'layout')
    redirect('/Employee_portal')
}

// Employee login
export async function employeeLogin(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        redirect('/Employee_portal/login?error=missing_fields')
    }

    // Look up employee
    const { data: employee, error: empError } = await supabase
        .from('employees')
        .select('id, email, name, password_hash, is_active')
        .eq('email', email.toLowerCase().trim())
        .eq('is_active', true)
        .single()

    if (empError || !employee) {
        redirect('/Employee_portal/login?error=invalid_credentials')
    }

    // Verify password
    const providedHash = hashValue(password)
    if (!employee.password_hash || employee.password_hash !== providedHash) {
        redirect('/Employee_portal/login?error=invalid_credentials')
    }

    // Generate session
    const sessionToken = generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { error: sessionError } = await supabase
        .from('employee_sessions')
        .insert({
            employee_id: employee.id,
            session_token: sessionToken,
            expires_at: expiresAt.toISOString(),
        })

    if (sessionError) {
        redirect('/Employee_portal/login?error=session_error')
    }

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('employee_session_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    })

    revalidatePath('/Employee_portal', 'layout')
    redirect('/Employee_portal')
}

// Employee logout
export async function employeeLogout() {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('employee_session_token')?.value

    if (sessionToken) {
        const supabase = await createClient()
        await supabase
            .from('employee_sessions')
            .delete()
            .eq('session_token', sessionToken)
    }

    cookieStore.set('employee_session_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    })

    redirect('/Employee_portal/login')
}

// Verify employee session (server-side)
export async function verifyEmployeeSession(): Promise<{
    isValid: boolean
    employee?: { id: string; email: string; name: string; role: string }
}> {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('employee_session_token')?.value

    if (!sessionToken) {
        return { isValid: false }
    }

    const supabase = await createClient()

    // Check session validity
    const { data: session, error: sessionError } = await supabase
        .from('employee_sessions')
        .select('employee_id, expires_at')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single()

    if (sessionError || !session) {
        return { isValid: false }
    }

    // Get employee details
    const { data: employee, error: empError } = await supabase
        .from('employees')
        .select('id, email, name, role, is_active')
        .eq('id', session.employee_id)
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
