"use client"

import React from 'react';
import { Shield, FileText, ChevronRight, BarChart3, Activity, Zap } from 'lucide-react';

/** * Reusable Stat Component 
 * Keeps the main code clean and maintainable.
 */
const MetricCard = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
  <div className="p-6 bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-zinc-100 dark:bg-black rounded-lg">
        <Icon size={18} className="text-teal-500" />
      </div>
      <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Live</span>
    </div>
    <p className="text-[10px] font-black uppercase text-neutral-500 mb-1 tracking-widest">{label}</p>
    <p className="text-3xl font-black text-black dark:text-white tracking-tighter">{value}</p>
  </div>
);

export default function DefaultDashboard() {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">
      
      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[10px] font-black text-teal-600 dark:text-teal-500 uppercase tracking-[0.4em]">
            System_Authenticated
          </span>
        </div>
        <h1 className="text-6xl font-black text-black dark:text-white tracking-tighter uppercase italic">
          Overview
        </h1>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Efficiency" value="94.8%" icon={Zap} />
        <MetricCard label="Node Status" value="Online" icon={Activity} />
        <MetricCard label="Security" value="Level_04" icon={Shield} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Block */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-black text-black dark:text-white uppercase tracking-[0.4em] flex items-center gap-2">
              <BarChart3 size={16} className="text-teal-500" /> Performance_Matrix
            </h2>
          </div>
          
          {/* Simple Visual Bar Chart Placeholder */}
          <div className="flex items-end gap-2 h-48 w-full border-b border-neutral-100 dark:border-neutral-800 pb-2">
            {[40, 70, 45, 90, 65, 85, 30, 100, 50, 75].map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-teal-500/20 hover:bg-teal-500 transition-all cursor-crosshair" 
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
            <span>T-10 Hours</span>
            <span>Current Session</span>
          </div>
        </div>

        {/* Recent Files Block */}
        <div className="bg-white dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl">
          <h2 className="text-xs font-black text-black dark:text-white uppercase tracking-[0.4em] mb-6">Recent_Files</h2>
          <div className="space-y-2">
            {['Compliance_v4.pdf', 'Q4_Projections.xlsx', 'Network_Map.svg'].map((file) => (
              <button key={file} className="w-full flex items-center justify-between group p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-black/40 transition-all">
                <div className="flex items-center gap-3">
                  <FileText size={14} className="text-neutral-400 group-hover:text-teal-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white">
                    {file}
                  </span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-teal-500 transition-all" />
              </button>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 border border-dashed border-neutral-200 dark:border-neutral-800 text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-teal-500 hover:border-teal-500/50 transition-all">
            View All Documentation
          </button>
        </div>

      </div>
    </div>
  );
}