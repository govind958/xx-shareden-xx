"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import {
  FolderTree, Search, Filter, Box,
  ArrowUpRight, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';

// --- Sub-component: ProjectCard ---
const ProjectCard = ({ name, status, progress, id, isActive }: any) => (
  <div className={`bg-white dark:bg-neutral-900/40 border p-6 transition-all group ${!isActive ? 'border-orange-500/50' : 'border-neutral-200 dark:border-neutral-800 hover:border-teal-500/50'}`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-2 rounded-lg transition-colors ${!isActive ? 'bg-orange-500/10' : 'bg-zinc-100 dark:bg-black group-hover:bg-teal-500'}`}>
        <Box size={18} className={`${!isActive ? 'text-orange-500' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-black'}`} />
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 ${status === 'processing' ? 'bg-teal-500/10 text-teal-500' : 'bg-orange-500/10 text-orange-500'
          }`}>
          {status}
        </span>
        {!isActive && (
          <span className="text-[7px] font-bold text-orange-500 uppercase flex items-center gap-1">
            <AlertCircle size={8} /> Inactive_Node
          </span>
        )}
      </div>
    </div>

    <h3 className="text-lg font-black text-black dark:text-white tracking-tighter uppercase mb-1">
      {name || "Standard_Stack"}
    </h3>
    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-6">
      ID: {id.slice(0, 8)}
    </p>

    <div className="space-y-2">
      <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
        <span className="text-neutral-400">Optimization_Level</span>
        <span className="text-teal-500">{progress}%</span>
      </div>
      <div className="w-full bg-zinc-100 dark:bg-black h-1">
        <div
          className="bg-teal-500 h-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>

    <Link
      href={`/Employee_portal/Task_Working_Space?id=${id}`}
      className="w-full mt-6 py-3 flex items-center justify-center gap-2 border border-neutral-100 dark:border-neutral-800 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
    >
      Open_Matrix <ArrowUpRight size={12} />
    </Link>
  </div>
);

// --- Main Page Component ---
export default function ProjectPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchAssignedTasks() {
      setLoading(true);

      // 1. Get the current authenticated user's session
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 2. Look up the employee record by email to get the employee.id
        const { data: employee } = await supabase
          .from('employees')
          .select('id')
          .eq('email', user.email)
          .single();

        if (!employee) {
          console.error("No employee record found for this user");
          setLoading(false);
          return;
        }

        // 3. Fetch order_items assigned to this employee
        const { data, error } = await supabase
          .from('order_items')
          .select(`
            id,
            stack_id,
            status,
            progress_percent,
            user_note,
            is_active,
            stacks (name)
          `)
          .eq('assigned_to', employee.id);

        if (error) {
          console.error("Fetch error:", error);
        } else {
          setTasks(data || []);
        }
      }
      setLoading(false);
    }

    fetchAssignedTasks();
  }, []);

  const filteredTasks = tasks.filter(t =>
    t.stack_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.includes(searchQuery)
  );

  return (
    <div className="p-6 md:p-12 space-y-10 animate-in fade-in duration-700 min-h-screen bg-white dark:bg-black text-black dark:text-white">

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
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
              className="bg-zinc-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-teal-500 w-64 transition-all"
            />
          </div>
          <button className="p-3 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-teal-500 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-8 border-y border-neutral-100 dark:border-neutral-900 py-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-teal-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            {tasks.filter(t => t.status === 'completed').length}_Completed
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            {tasks.filter(t => t.status !== 'completed').length}_Active_Tasks
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-neutral-100 dark:bg-neutral-900 animate-pulse border border-neutral-800" />
          ))
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <ProjectCard
              key={task.id}
              id={task.id}
              name={task.stacks?.name || task.stack_id}
              status={task.status}
              progress={task.progress_percent}
              isActive={task.is_active} // Passing the is_active status to the card
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-neutral-800">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500">
              No_Assigned_Nodes_Detected_In_Registry
            </p>
          </div>
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