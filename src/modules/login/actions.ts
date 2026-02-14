'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// 🔑 Helper to generate correct URL
function getURL() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000/'

  url = url.startsWith('http') ? url : `https://${url}`
  url = url.endsWith('/') ? url : `${url}/`

  return url
}

// ✅ Login (with role validation - only regular users)
export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  // Check if user is an employee trying to use user login
  const userType = authData.user?.user_metadata?.user_type
  if (userType === 'employee') {
    // Sign them out and redirect to employee login
    await supabase.auth.signOut()
    redirect('/Employee_portal/login?error=use_employee_login')
  }

  revalidatePath('/private', 'layout')
  redirect('/private')
}

// ✅ Signup (with user_type metadata)
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getURL(),
      data: {
        user_type: 'user', // Mark as regular user
      },
    },
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/private', 'layout')
  redirect('/verify-email')
}

// ✅ Google Login/Signup
// ✅ OAuth Factory
const signInWith = (provider: 'google' | 'github' | 'facebook') => {
  return async () => {
    const supabase = await createClient()

    const auth_callback_url = `${getURL()}auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: auth_callback_url,
      },
    })

    if (error) {
      redirect('/error')
    }

    // Supabase will redirect the user to provider → then back to callback URL
    redirect(data?.url ?? '/error')
  }
}

// 👉 Specific provider actions
export const signInWithGoogle = signInWith('google')
