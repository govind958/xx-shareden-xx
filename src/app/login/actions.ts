'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

// Helper to generate correct site URL
function getURL() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000/'

  url = url.startsWith('http') ? url : `https://${url}`
  url = url.endsWith('/') ? url : `${url}/`

  return url
}

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

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      emailRedirectTo: getURL(),
    },
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/private', 'layout')
  redirect('/private')
}

/* ---------- Google OAuth ---------- */



export async function loginWithGoogle() {
  console.log("[Google Login] Button clicked");

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/auth/callback",
      },
    });

    console.log("[Google Login] Supabase response:", data, error);

    if (error) {
      console.error("[Google Login] Error:", error.message);
      alert("Login failed: " + error.message);
      return;
    }

    if (data?.url) {
      console.log("[Google Login] Redirecting browser to:", data.url);
      window.location.href = data.url; // 👈 browser redirect to Google
    } else {
      console.warn("[Google Login] No URL returned from Supabase");
    }
  } catch (err) {
    console.error("[Google Login] Unexpected error:", err);
  }
}




