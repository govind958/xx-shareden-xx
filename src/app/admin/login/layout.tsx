import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminSession } from '../actions'

export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const hostHeader = headersList.get('host') || ''
  const [host] = hostHeader.split(':')

  const isAdminHost = host === 'admin.localhost' || host.startsWith('admin.')

  // If someone hits /admin/login on localhost or any non-admin host,
  // redirect them to the normal user login (for security).
  if (!isAdminHost) {
    redirect('/login')
  }

  // If already logged in as admin on admin host, go straight to dashboard
  const { isValid } = await verifyAdminSession()
  if (isValid) {
    redirect('/admin/dashboard')
  }

  return <>{children}</>
}

