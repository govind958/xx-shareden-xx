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

// ✅ Login (unchanged)
export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/private', 'layout')
  redirect('/private')
}

// ✅ Signup (updated for email verification flow)
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      emailRedirectTo: getURL(), // where verification link will send user
    },
  })

  if (error) {
    redirect('/error')
  }

  // Revalidate private cache (optional, safe to keep)
  revalidatePath('/private', 'layout')

  // 👉 Instead of sending user to /private, send them to verify email page
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
