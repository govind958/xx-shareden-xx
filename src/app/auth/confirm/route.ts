import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  // Use || instead of ?? so empty string also falls through to the default
  const defaultNext = type === 'recovery' ? '/reset-password' : '/private'
  const nextParam = searchParams.get('next') || defaultNext
  const next = nextParam.startsWith('http') ? new URL(nextParam).pathname : nextParam

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified page, or /reset-password for recovery, /private otherwise
      redirect(next)
    }
    console.error('OTP verification failed:', error.message)
  }

  // redirect the user to an error page with some instructions
  redirect('/error')
}