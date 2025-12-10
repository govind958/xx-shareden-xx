import { createClient } from '@/utils/supabase/server'
import { verifyAdminSession } from '../actions'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const { isValid, adminUser } = await verifyAdminSession()

  if (!isValid) {
    redirect('/admin/login')
  }

  const supabase = await createClient()

  // Get statistics
  const [usersCount, formsCount, activeSessionsCount, stacksCount] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('forms').select('*', { count: 'exact', head: true }),
    supabase
      .from('admin_sessions')
      .select('*', { count: 'exact', head: true })
      .gt('expires_at', new Date().toISOString()),
    supabase.from('stacks').select('*', { count: 'exact', head: true }),
  ])

  const totalStacks = stacksCount.count || 0

  // Glassmorphism classes matching user dashboard theme
  const glassmorphismClass = "bg-teal-500/10 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200/20"

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-50">
          Welcome back, {adminUser?.name || adminUser?.email} 👋
        </h1>
        <p className="text-neutral-400">Admin Dashboard Overview</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className={`${glassmorphismClass} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-400">Total Users</h3>
            <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <span className="text-teal-400 text-xl">👥</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-50">
            {usersCount.count || 0}
          </p>
        </div>

        {/* Total Forms */}
        <div className={`${glassmorphismClass} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-400">Total Forms</h3>
            <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <span className="text-teal-400 text-xl">📝</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-50">
            {formsCount.count || 0}
          </p>
        </div>

        {/* Active Admin Sessions */}
        <div className={`${glassmorphismClass} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-400">Active Admin Sessions</h3>
            <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <span className="text-teal-400 text-xl">🔐</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-50">
            {activeSessionsCount.count || 0}
          </p>
        </div>

        {/* Total Stacks */}
        <div className={`${glassmorphismClass} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-neutral-400">Total Stacks</h3>
            <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <span className="text-teal-400 text-xl">📦</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-50">
            {totalStacks}
          </p>
        </div>
      </div>
    </div>
  )
}

