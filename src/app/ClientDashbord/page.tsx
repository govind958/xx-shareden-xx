"use client"

import React from "react"
import { 
  MoreHorizontal, 
  ClipboardList, 
  AlertCircle, 
  Flag, 
  Search, 
  LayoutDashboard, 
  Layers,
  ChevronRight,
  Plus,
  HelpCircle
} from "lucide-react"

/* ---------------- STYLE HELPERS ---------------- */
// Added subtle transitions and hover lifts for better tactile feel
const STAT_CARD = "group bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 cursor-default relative overflow-hidden"
const SECTION_CARD = "bg-white border border-slate-200 rounded-2xl p-6 min-h-[350px] flex flex-col shadow-sm hover:border-slate-300 transition-colors"
const ICON_BG = "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#FDFDFD] text-slate-800 font-sans selection:bg-blue-100">
      
      {/* 1. HEADER SECTION */}
      <header className="px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <LayoutDashboard size={14} />
            Overview
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Govind</span>
          </h1>
          <p className="text-sm text-slate-400">
            Managing <span className="font-semibold text-slate-600">govinddotanand816...</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <nav className="flex gap-1">
            <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-white shadow-sm rounded-xl">Personal</button>
            <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Portfolio</button>
          </nav>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button className="p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-lg transition-all">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="px-10 py-10 space-y-10 max-w-[1600px] w-full mx-auto">
        
        {/* STATS SECTION */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Key Performance Indicators</h2>
            <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
              View Detailed Analytics <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
            <StatCard label="Open Tasks" count={0} color="blue" icon={<ClipboardList size={20}/>} />
            <StatCard label="Closed Tasks" count={0} color="blue" icon={<ClipboardList size={20}/>} />
            <StatCard label="Open Issues" count={0} color="red" icon={<AlertCircle size={20}/>} />
            <StatCard label="Closed Issues" count={0} color="red" icon={<AlertCircle size={20}/>} />
            <StatCard label="Open Phases" count={0} color="indigo" icon={<Flag size={20}/>} />
            <StatCard label="Closed Phases" count={0} color="indigo" icon={<Flag size={20}/>} />
          </div>
        </section>

        {/* WORKSPACE GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EmptyStateSection title="My Tasks" highlightColor="bg-blue-500" />
          <EmptyStateSection title="My Issues" highlightColor="bg-red-500" />
          <EmptyStateSection title="Due Today" highlightColor="bg-amber-500" />
          <EmptyStateSection title="Overdue" highlightColor="bg-purple-500" />
        </section>
      </main>

      {/* ACTION BUTTON */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3">
         
        <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 font-medium hover:bg-slate-50 transition-all text-sm">
          <HelpCircle size={18} className="text-orange-500" />
          Support
        </button>
      </div>
    </div>
  )
}

/* ---------------- SUB-COMPONENTS ---------------- */

function StatCard({ label, count, color, icon }: { label: string, count: number, color: 'blue' | 'red' | 'indigo', icon: React.ReactNode }) {
  const themes = {
    blue: "text-blue-600 bg-blue-50",
    red: "text-red-500 bg-red-50",
    indigo: "text-indigo-500 bg-indigo-50"
  }

  return (
    <div className={STAT_CARD}>
      <div className="relative z-10">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{count}</h3>
      </div>
      <div className={`${themes[color]} ${ICON_BG}`}>
        {icon}
      </div>
      {/* Subtle bottom accent line */}
      <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ${color === 'blue' ? 'bg-blue-500' : color === 'red' ? 'bg-red-500' : 'bg-indigo-500'}`} />
    </div>
  )
}

function EmptyStateSection({ title, highlightColor }: { title: string, highlightColor: string }) {
  return (
    <div className={SECTION_CARD}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-6 ${highlightColor} rounded-full`} />
          <h3 className="text-slate-800 font-bold tracking-tight">{title}</h3>
        </div>
        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
          <Layers size={16} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Modernized Empty Illustration */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center border border-dashed border-slate-200">
             <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <Search size={20} className="text-slate-300" />
             </div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center">
            <AlertCircle size={16} className="text-amber-400" />
          </div>
        </div>
        <h4 className="text-slate-900 font-semibold mb-1">All caught up!</h4>
        <p className="text-slate-400 text-sm max-w-[200px] leading-relaxed">
          No {title.toLowerCase()} were found in your current workspace.
        </p>
      </div>
    </div>
  )
}