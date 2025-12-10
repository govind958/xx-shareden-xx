import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

// Your admin domain (the one you added in Vercel)
const ADMIN_DOMAIN = "admin-xx-shareden-xx.vercel.app"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = url.hostname

  // ---------------------------
  // 1. Admin domain routing
  // ---------------------------
  if (hostname === ADMIN_DOMAIN) {
    // Ensure all admin domain requests start with /admin
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = "/admin" + url.pathname
      return NextResponse.redirect(url)
    }
  }

  // ---------------------------
  // 2. Supabase session sync
  // ---------------------------
  return await updateSession(request)
}

// ---------------------------
// Matcher
// ---------------------------
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
