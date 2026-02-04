"use client"

import React from 'react';
import Link from 'next/link';
import { FolderTree, Search, Filter, Box, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

// Mock Data
const PROJECTS = [
  { id: 'aegis', name: "Project_Aegis", status: "Active", progress: 88, nodes: 24 },
  { id: 'titan', name: "Titan_Uplink", status: "Pending", progress: 42, nodes: 112 },
  { id: 'void', name: "Void_Shell", status: "Active", progress: 95, nodes: 16 },
  { id: 'neural', name: "Neural_Gate", status: "Active", progress: 12, nodes: 8 },
  { id: 'grid', name: "Grid_Master", status: "Pending", progress: 0, nodes: 400 },
  { id: 'silent', name: "Silent_Core", status: "Active", progress: 100, nodes: 4 },
];

const ProjectCard = ({ name, status, progress, nodes, id }: any) => (
  <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-6 hover:border-teal-500/50 transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="p-2 bg-zinc-100 dark:bg-black rounded-lg group-hover:bg-teal-500 transition-colors">
        <Box size={18} className="text-neutral-500 dark:text-neutral-400 group-hover:text-black" />
      </div>
      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 ${
        status === 'Active' ? 'bg-teal-500/10 text-teal-500' : 'bg-orange-500/10 text-orange-500'
      }`}>
        {status}
      </span>
    </div>
    
    <h3 className="text-lg font-black text-black dark:text-white tracking-tighter uppercase mb-1">{name}</h3>
    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-6">{nodes} Nodes Assigned</p>

    <div className="space-y-2">
      <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
        <span className="text-neutral-400">Optimization</span>
        <span className="text-teal-500">{progress}%</span>
      </div>
      <div className="w-full bg-zinc-100 dark:bg-black h-1">
        <div className="bg-teal-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </div>

    {/* FIXED NAVIGATION: Pointing to the route, not the file */}
    <Link 
     href="/Employee_portal/Task_Working_Space"
      className="w-full mt-6 py-3 flex items-center justify-center gap-2 border border-neutral-100 dark:border-neutral-800 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer">
      Open_Matrix <ArrowUpRight size={12} />
    </Link>
  </div>
);

export default function ProjectPage() {
  return (
    <div className="p-6 md:p-12 space-y-10 animate-in fade-in duration-700 min-h-screen bg-white dark:bg-black">
      
      {/* Header & Controls */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FolderTree size={14} className="text-teal-500" />
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Infrastructure_Inventory</span>
          </div>
          <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase italic">Project_Matrix</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
            <input 
              type="text" 
              placeholder="SEARCH_REGISTRY..." 
              className="bg-zinc-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-teal-500 w-64 transition-all"
            />
          </div>
          <button className="p-3 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-teal-500 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="flex flex-wrap gap-8 border-y border-neutral-100 dark:border-neutral-900 py-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={16} className="text-teal-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400">12_Completed</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400">04_Pending_Deployment</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-8">
        <button className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 hover:text-teal-500 transition-colors">
          Fetch_Next_Sequence_...
        </button>
      </div>
    </div>
  );
}