"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import {
  FolderTree, Search, Filter, 
  ArrowUpRight, CheckCircle2, Clock, Loader2
} from 'lucide-react';

interface TaskItem { id: string; status?: string; progress_percent?: number; section_type?: string; target?: number; limit?: number; stacks?: { name?: string }; }
export default function ProjectPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchAssignedTasks() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: employee } = await supabase
          .from('employees')
          .select('id').eq('email', user.email).single();

        if (employee) {
          const { data, error } = await supabase
            .from('order_items')
            .select(`id, status, progress_percent, stacks (name)`)
            .eq('assigned_to', employee.id);

          if (!error && data) {
            setTasks(data as unknown as TaskItem[]);
          }
        }
      }
      setLoading(false);
    }
    fetchAssignedTasks();
  }, [supabase]);

  const filteredTasks = tasks.filter(t =>
    (t.stacks?.name || t.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
      
      {/* Header with Original Theme Support */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FolderTree size={14} className="text-teal-500" />
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Infrastructure_Inventory</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Project_Matrix</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
            <input
              type="text"
              placeholder="SEARCH_REGISTRY..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-teal-500 w-64 transition-all"
            />
          </div>
          <button className="p-3 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-teal-500 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-8 border-y border-neutral-100 dark:border-neutral-900 py-6 mb-8">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-teal-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            {tasks.filter(t => t.status?.toLowerCase() === 'done').length}_Completed
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            {tasks.filter(t => t.status?.toLowerCase() !== 'done').length}_Active_Tasks
          </span>
        </div>
      </div>

      {/* The Table Layout */}
      <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-sm">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-teal-500" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree size={32} className="mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">No projects assigned</p>
            <p className="mt-2 text-xs text-neutral-400">Contact your admin to get assigned to projects.</p>
          </div>
        ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
              <th className="p-4 w-12"><input type="checkbox" className="accent-teal-500" /></th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Header</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Section Type</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Status</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 text-center">Target</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 text-center">Limit</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors group">
                <td className="p-4"><input type="checkbox" className="accent-teal-500" /></td>
                <td className="p-4 text-sm font-bold tracking-tight uppercase">
                  {task.stacks?.name || "Standard_Node"}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 text-[9px] font-black uppercase border border-neutral-200 dark:border-neutral-700 rounded-full bg-white dark:bg-black">
                    {task.section_type || "Narrative"}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase ${
                    task.status?.toLowerCase() === 'done' 
                    ? 'bg-teal-500/10 text-teal-500 border-teal-500/20' 
                    : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                  }`}>
                    {task.status?.toLowerCase() === 'done' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                    {task.status || 'In Process'}
                  </span>
                </td>
                <td className="p-4 text-center text-xs font-mono">{task.target || 0}</td>
                <td className="p-4 text-center text-xs font-mono">{task.limit || 30}</td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/Employee_portal/Task_Working_Space?id=${task.id}`}
                    className="inline-flex items-center gap-1 text-[9px] font-black text-neutral-400 hover:text-teal-500 uppercase tracking-widest group"
                  >
                    Open_Matrix <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      <div className="flex justify-center pt-8">
        <button className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 hover:text-teal-500 transition-colors">
          Fetch_Next_Sequence_...
        </button>
      </div>
    </div>
  );
}