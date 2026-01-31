"use client"

import React, { useState } from 'react';
import Sidebar from '@/src/components/employee-portal-sidebar';
import { Clock, Zap, Shield, FileText, ChevronRight } from 'lucide-react';

const EmployeePortal: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="flex bg-zinc-50 dark:bg-black min-h-screen transition-colors duration-500 text-neutral-900 dark:text-neutral-400 font-sans">
        
        {/* Sidebar with state passed down */}
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <header className="mb-12">
            <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase">
              Portal <span className="text-zinc-300 dark:text-neutral-800">/</span> Alex Rivera
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] font-black text-teal-600 dark:text-teal-500 uppercase tracking-[0.3em]">
                System Status: Online
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Operational Card */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl shadow-sm dark:shadow-none">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xs font-black text-black dark:text-white uppercase tracking-[0.4em] flex items-center gap-2">
                  <Clock size={16} className="text-teal-500" /> Performance Matrix
                </h2>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Live Updates</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-zinc-50 dark:bg-black/40 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-neutral-500 mb-2">Efficiency Rating</p>
                  <p className="text-3xl font-black text-black dark:text-white">94.8%</p>
                </div>
                <div className="p-6 bg-zinc-50 dark:bg-black/40 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-neutral-500 mb-2">Tasks Completed</p>
                  <p className="text-3xl font-black text-black dark:text-white">12/15</p>
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl">
                <h2 className="text-xs font-black text-black dark:text-white uppercase tracking-[0.4em] mb-6">Access Control</h2>
                <div className="flex items-center gap-4 p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
                  <Shield className="text-teal-600 dark:text-teal-500" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-black dark:text-white uppercase">Level 04 Clearance</p>
                    <p className="text-[10px] text-teal-700 dark:text-teal-500/70 uppercase font-bold tracking-tighter">Verified Session</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl">
                <h2 className="text-xs font-black text-black dark:text-white uppercase tracking-[0.4em] mb-6">Recent Docs</h2>
                <div className="space-y-4">
                  {['Compliance_v4.pdf', 'Q4_Projections.xlsx'].map((doc) => (
                    <div key={doc} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText size={14} className="text-neutral-400 group-hover:text-teal-500 transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-black dark:group-hover:text-white">{doc}</span>
                      </div>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-teal-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeePortal;