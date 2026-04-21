import React from 'react';
import { 
  Activity, 
  Zap, 
  ShieldCheck, 
  Server, 
  ArrowUpRight, 
  MoreHorizontal 
} from 'lucide-react';
import { getEmployeeAssignments, verifyEmployeeSession } from '@/src/modules/employee/actions';
import { redirect } from 'next/navigation';

interface StatCardProps { title: string; value: string | number | undefined; change: string; icon: React.ElementType; trend: React.ElementType; }
const StatCard = ({ title, value, change, icon: Icon, trend: TrendIcon }: StatCardProps) => (
  <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-6 rounded-none">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-neutral-100 dark:bg-neutral-900">
        <Icon size={18} className="text-teal-500" />
      </div>
      <span className="text-[10px] font-black text-teal-500 flex items-center gap-1">
        {change} <TrendIcon size={12} />
      </span>
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">{title}</p>
    <h3 className="text-2xl font-black text-black dark:text-white tracking-tighter">{value}</h3>
  </div>
);

export default async function Dashboard() {
  const { isValid, employee } = await verifyEmployeeSession();
  if (!isValid || !employee) redirect('/Employee_portal/login');

  const { data: assignments } = await getEmployeeAssignments(employee.id);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500">System Status: Operational</p>
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter italic">OVERVIEW_MATRIX</h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Last Sync</p>
          <p className="text-xs font-mono dark:text-neutral-500">02.02.2026_12:00:01</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Stacks" value={assignments?.length} change="+12%" icon={Server} trend={ArrowUpRight} />
        <StatCard title="Power Load" value="84.2%" change="+2.4%" icon={Zap} trend={ArrowUpRight} />
        <StatCard title="Security Index" value="99.9%" change="Stable" icon={ShieldCheck} trend={Activity} />
        <StatCard title="Bandwidth" value="4.2gb/s" change="+18%" icon={Activity} trend={ArrowUpRight} />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-900 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">My Orders</h3>
            <button className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-900">
                  <th className="p-4 text-[9px] font-black uppercase text-neutral-400">Stack</th>
                  <th className="p-4 text-[9px] font-black uppercase text-neutral-400">Status</th>
                  <th className="p-4 text-[9px] font-black uppercase text-neutral-400">Progress</th>
                  <th className="p-4 text-[9px] font-black uppercase text-neutral-400">Duration</th>
                  <th className="p-4 text-[9px] font-black uppercase text-neutral-400">Assigned</th>
                </tr>
              </thead>
              <tbody className="text-xs font-mono">
                {(!assignments || assignments.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-400">No orders assigned yet.</td>
                  </tr>
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  assignments.map((a: any) => (
                    <tr key={a.id} className="border-b border-neutral-50 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors">
                      <td className="p-4 text-teal-500 font-bold">
                        {a.assignment_kind === 'substack' ? (a.sub_stacks?.name ?? 'Unknown Module') : (a.order_items?.stacks?.name ?? 'Unknown Stack')}
                        {a.assignment_kind === 'substack' && <span className="ml-2 text-[8px] bg-teal-500/10 text-teal-500 px-1.5 py-0.5 rounded uppercase font-black">Module</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[8px] font-black uppercase ${
                          a.order_items?.status === 'completed' ? 'bg-teal-500/10 text-teal-500' :
                          a.order_items?.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {a.order_items?.status?.replace('_', ' ') ?? '—'}
                        </span>
                      </td>
                      <td className="p-4 dark:text-neutral-300">{a.order_items?.progress_percent ?? 0}%</td>
                      <td className="p-4 dark:text-neutral-300">
                        {a.order_items?.orders?.is_recurring
                          ? (a.order_items.orders.subscription_duration ?? 'Recurring')
                          : 'One-time'}
                      </td>
                      <td className="p-4 text-neutral-400">{new Date(a.assigned_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Secondary Info */}
        <div className="space-y-4">
          <div className="bg-teal-500 p-6 text-black">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">System Alerts</h3>
            <p className="text-sm font-bold leading-tight">All systems are currently operating within optimized parameters.</p>
            <div className="mt-6 border-t border-black/20 pt-4">
              <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                View Report <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-neutral-500">Resources</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="dark:text-white">CPU_USAGE</span>
                <span className="text-teal-500">42%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-[2px]">
                <div className="bg-teal-500 h-full w-[42%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
