"use client"

import React from "react"
import { Search, Plus, ShieldCheck, Cpu, Bell, HelpCircle, Command } from "lucide-react"
import { useAuth } from "@/src/context/AuthContext"
import { cn } from "@/src/lib/utils"

export function TopNav() {
  const { user, loading } = useAuth()

  const userIdentifier = user?.email ? user.email.split('@')[0] : "GUEST_USER"
  const initial = user?.email ? user.email.charAt(0).toUpperCase() : "G"

  return (
    <header className="h-[56px] bg-[#0A0A0A] flex items-center justify-between px-4 shrink-0 z-[60] border-b border-white/5 shadow-2xl">
      
      {/* --- LEFT SECTION: SYSTEM BRANDING --- */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5 group cursor-pointer">
           <div className="h-7 w-7 bg-[#1A365D] border border-[#2B6CB0]/50 rounded-lg flex items-center justify-center transition-all group-hover:border-[#2B6CB0] group-hover:shadow-[0_0_12px_rgba(43,108,176,0.4)]">
              <div className="h-3 w-3 bg-white rotate-45 transition-transform group-hover:scale-110" />
           </div>
           <div className="flex flex-col">
             <span className="text-sm font-black text-white uppercase tracking-[0.15em] leading-none">
               Stack<span className="text-[#2B6CB0]">AI</span>
             </span>
             <span className="text-[8px] text-neutral-500 font-bold tracking-widest mt-0.5">V3.0_PRO</span>
           </div>
        </div>

        {/* Global Search Interface */}
        <div className="relative hidden lg:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-[#2B6CB0] transition-colors" size={13} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="w-[280px] bg-neutral-900/50 border border-neutral-800 rounded-md py-1.5 pl-9 pr-12 text-[12px] text-white outline-none focus:ring-1 focus:ring-[#2B6CB0]/50 focus:border-[#2B6CB0]/50 transition-all placeholder:text-neutral-600" 
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="h-4 px-1 rounded bg-neutral-800 text-[9px] text-neutral-500 border border-neutral-700 flex items-center justify-center font-sans">
              <Command size={8} className="mr-0.5" /> K
            </kbd>
          </div>
        </div>
      </div>

      {/* --- RIGHT SECTION: SYSTEM ACTIONS & SECURITY IDENTITY --- */}
      <div className="flex items-center gap-3">
        
        {/* Quick Actions Group */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-3 mr-1">
          <button title="Help" className="p-2 text-neutral-500 hover:text-white transition-colors">
            <HelpCircle size={18} strokeWidth={1.5} />
          </button>
          <button title="Notifications" className="p-2 text-neutral-500 hover:text-white transition-colors relative">
            <Bell size={18} strokeWidth={1.5} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#2B6CB0] rounded-full" />
          </button>
          <button className="ml-2 flex items-center gap-2 px-3 py-1.5 bg-[#2B6CB0] hover:bg-[#2B6CB0]/90 text-white rounded text-[11px] font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20">
            <Plus size={14} />
            <span className="hidden xl:inline">NEW PROJECT</span>
          </button>
        </div>

        {/* SECURITY LAYER PROFILE SECTION */}
        <div className="flex items-center gap-3 py-1.5 px-3 bg-neutral-900/40 rounded-lg border border-neutral-800 hover:border-[#2B6CB0]/30 transition-all group cursor-pointer">
          
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-black text-black text-[11px]">
              {loading ? <Cpu size={12} className="animate-spin" /> : initial}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A0A0A] rounded-full" />
          </div>

          <div className="hidden sm:flex flex-col min-w-0 pr-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-200 font-bold truncate uppercase tracking-wider">
                {loading ? "FETCHING..." : userIdentifier}
              </span>
              <ShieldCheck size={10} className="text-teal-500/50 group-hover:text-teal-400 transition-colors" />
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}