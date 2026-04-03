import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Detect if running locally or on Vercel
      const isLocal = process.env.NODE_ENV === 'development'
      const forwardedHost = request.headers.get('x-forwarded-host')
      const host = isLocal
        ? url.origin // e.g. http://localhost:3000
        : forwardedHost
        ? `https://${forwardedHost}` // Vercel’s real host
        : url.origin // fallback

      // ✅ Always send to /private after successful login
      return NextResponse.redirect(`${host}/private`)
    }
  }

  // ❌ If code is missing or exchange fails → error page
  return NextResponse.redirect(`${url.origin}/auth/auth-code-error`)
}
