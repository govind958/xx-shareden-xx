import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/src/modules/admin/actions'

export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // If already logged in as admin, go straight to dashboard
  const { isValid } = await verifyAdminSession()
  if (isValid) {
    redirect('/admin/dashboard')
  }

  return <>{children}</>
}

