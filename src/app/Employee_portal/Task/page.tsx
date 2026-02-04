"use client"

import React from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  MoreVertical, 
  Terminal, 
  Hash,
  ArrowUpRight
} from 'lucide-react';

const TaskRow = ({ id, task, priority, status, time }: any) => (
  <tr className="border-b border-neutral-100 dark:border-neutral-900 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
    <td className="py-5 px-4">
      <div className="flex items-center gap-3">
        <Hash size={12} className="text-neutral-400" />
        <span className="text-[10px] font-mono text-neutral-500">{id}</span>
      </div>
    </td>
    <td className="py-5 px-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
        {task}
      </p>
    </td>
    <td className="py-5 px-4">
      <div className="flex items-center gap-2">
        <div className={`w-1 h-1 rounded-full ${
          priority === 'High' ? 'bg-red-500 animate-pulse' : 'bg-teal-500'
        }`} />
        <span className={`text-[9px] font-bold uppercase ${
          priority === 'High' ? 'text-red-500' : 'text-neutral-500'
        }`}>
          {priority}
        </span>
      </div>
    </td>
    <td className="py-5 px-4">
      <span className="text-[9px] font-black uppercase px-2 py-1 bg-zinc-100 dark:bg-black border border-neutral-200 dark:border-neutral-800 text-neutral-500">
        {status}
      </span>
    </td>
    <td className="py-5 px-4 text-right">
      <span className="text-[10px] font-mono text-neutral-400">{time}</span>
    </td>
    <td className="py-5 px-4 text-right">
      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-teal-500">
        <ArrowUpRight size={14} />
      </button>
    </td>
  </tr>
);

export default function TaskPage() {
  const tasks = [
    { id: 'TSK-902', task: 'Kernel_Security_Patch', priority: 'High', status: 'In_Progress', time: '12:04:01' },
    { id: 'TSK-881', task: 'Log_Rotation_Cleanup', priority: 'Low', status: 'Queued', time: '11:58:22' },
    { id: 'TSK-875', task: 'Uplink_Redundancy_Test', priority: 'Med', status: 'Completed', time: '11:45:10' },
    { id: 'TSK-872', task: 'Database_Indexing_S02', priority: 'High', status: 'Paused', time: '10:30:55' },
    { id: 'TSK-860', task: 'SSL_Certificate_Renewal', priority: 'Med', status: 'Queued', time: '09:12:00' },
  ];

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

        <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-teal-500 dark:hover:bg-teal-500 transition-colors">
          Initialize_New_Task <Terminal size={14} />
        </button>
      </header>

      {/* Task Table */}
      <div className="bg-white dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-black border-b border-neutral-200 dark:border-neutral-800">
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest">UID</th>
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest">Description</th>
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest">Priority</th>
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest">Status</th>
                <th className="p-4 text-[9px] font-black uppercase text-neutral-400 tracking-widest text-right">Last_Activity</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <TaskRow key={task.id} {...task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-black/40 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <AlertTriangle size={20} className="text-red-500" />
          <div>
            <p className="text-[10px] font-black dark:text-white uppercase">02 Critical Errors</p>
            <p className="text-[9px] font-bold text-neutral-500 uppercase">Attention Required</p>
          </div>
        </div>
        <div className="md:col-span-2 flex items-center justify-center p-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
           <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-[0.3em]">System_Queue_Load: 14.2%</p>
        </div>
      </div>
    </div>
  );
}