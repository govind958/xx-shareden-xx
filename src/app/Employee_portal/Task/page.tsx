"use client"

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Terminal,
  Hash,
  ArrowUpRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const supabase = createClient();

const statusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500/10 border-green-500/20 text-green-500';
    case 'in_progress': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
    case 'processing': return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
    case 'initiated': return 'bg-neutral-500/10 border-neutral-500/20 text-neutral-400';
    case 'cancelled': return 'bg-red-500/10 border-red-500/20 text-red-500';
    default: return 'bg-neutral-800 border-neutral-700 text-neutral-500';
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Completed';
    case 'in_progress': return 'Working';
    case 'processing': return 'Assigned';
    case 'initiated': return 'Not Started';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
};

const TaskRow = ({ id, task, status, progress, isActive, createdAt }: any) => (
  <tr className="border-b border-neutral-100 dark:border-neutral-900 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
    <td className="py-5 px-4">
      <div className="flex items-center gap-3">
        <Hash size={12} className="text-neutral-400" />
        <span className="text-[10px] font-mono text-neutral-500">{id.slice(0, 8)}</span>
      </div>
    </td>
    <td className="py-5 px-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
        {task || "Standard_Stack"}
      </p>
    </td>
    <td className="py-5 px-4">
      <div className="flex items-center gap-2">
        <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-teal-500 animate-pulse' : 'bg-orange-500'}`} />
        <span className={`text-[9px] font-bold uppercase ${isActive ? 'text-teal-500' : 'text-orange-500'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </td>
    <td className="py-5 px-4">
      <span className={`text-[9px] font-black uppercase px-2 py-1 border rounded ${statusColor(status)}`}>
        {statusLabel(status)}
      </span>
    </td>
    <td className="py-5 px-4">
      <div className="flex items-center gap-2">
        <div className="w-16 bg-neutral-800 h-1 rounded-full overflow-hidden">
          <div className="bg-teal-500 h-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] font-mono text-neutral-400">{progress}%</span>
      </div>
    </td>
    <td className="py-5 px-4 text-right">
      <span className="text-[10px] font-mono text-neutral-400">
        {new Date(createdAt).toLocaleDateString()}
      </span>
    </td>
    <td className="py-5 px-4 text-right">
      <Link href={`/Employee_portal/Task_Working_Space?id=${id}`}>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-teal-500">
          <ArrowUpRight size={14} />
        </button>
      </Link>
    </td>
  </tr>
);

export default function TaskPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Look up employee record by email
        const { data: employee } = await supabase
          .from('employees')
          .select('id')
          .eq('email', user.email)
          .single();

        if (!employee) {
          console.error('No employee record found for this user');
          setLoading(false);
          return;
        }

        // Fetch order_items assigned to this employee
        const { data, error } = await supabase
          .from('order_items')
          .select(`
            id,
            stack_id,
            status,
            progress_percent,
            is_active,
            created_at,
            stacks (name)
          `)
          .eq('assigned_to', employee.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Fetch error:", error);
        } else {
          setTasks(data || []);
        }
      }
      setLoading(false);
    }

    fetchTasks();
  }, []);

  const activeTasks = tasks.filter(t => t.status === 'in_progress' || (t.status !== 'completed' && t.is_active));
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');

  return (
    <div className="p-6 md:p-12 space-y-10 animate-in fade-in duration-700">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare size={14} className="text-teal-500" />
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Operations_Queue</span>
          </div>
          <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase italic">Task_Matrix</h1>
        </div>
      </header>

      {/* Task Table */}
      <div className="bg-white dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-black border-b border-neutral-200 dark:border-neutral-800">
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest">UID</th>
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest">Stack</th>
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest">Activity</th>
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest">Status</th>
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest">Progress</th>
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest text-right">Created</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-20 text-center animate-pulse text-neutral-500">Loading assigned tasks...</td></tr>
              ) : tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    id={task.id}
                    task={task.stacks?.name || task.stack_id}
                    status={task.status}
                    progress={task.progress_percent}
                    isActive={task.is_active}
                    createdAt={task.created_at}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500">
                      No_Tasks_Assigned
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-black/40 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <Clock size={20} className="text-amber-500" />
          <div>
            <p className="text-[10px] font-black dark:text-white uppercase">{inProgressTasks.length} Working</p>
            <p className="text-[9px] font-bold text-neutral-500 uppercase">In Progress</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-black/40 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <AlertTriangle size={20} className="text-blue-500" />
          <div>
            <p className="text-[10px] font-black dark:text-white uppercase">{activeTasks.length - inProgressTasks.length} Pending</p>
            <p className="text-[9px] font-bold text-neutral-500 uppercase">Not Started</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-black/40 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <CheckSquare size={20} className="text-green-500" />
          <div>
            <p className="text-[10px] font-black dark:text-white uppercase">{completedTasks.length} Completed</p>
            <p className="text-[9px] font-bold text-neutral-500 uppercase">Delivered</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-[0.3em]">Total: {tasks.length}</p>
        </div>
      </div>
    </div>
  );
}