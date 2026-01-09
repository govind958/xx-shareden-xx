"use client"

import React from "react"
import { 
  TrendingUp, Zap, ShieldCheck, Layers, 
 Clock, Database,
} from "lucide-react"

/* ---------------- INDUSTRIAL STYLING HELPERS ---------------- */
const INDUSTRIAL_CARD = "bg-[#080808] border border-neutral-900 rounded-[32px] p-8 transition-all hover:border-teal-500/40 shadow-2xl group"
const ICON_CONTAINER = "w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-black transition-all duration-500"

export default function ClientDashboardPage() {
  return (
    // overflow-x-hidden ensures the "white strip" bug is killed at the component level
    <div className="flex-1 flex flex-col min-w-0 bg-[#020202] overflow-x-hidden">
      
      {/* 1. TOP NAV BAR (Search & Actions) */}
      

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="p-8 lg:p-12 space-y-12 max-w-[1600px] mx-auto w-full">
        
        {/* HERO SECTION */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em]">Operational Status</span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-none">System Overview</h2>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-500/10 border border-teal-500/20 rounded-md">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[9px] font-black text-teal-500 uppercase">Live Monitor</span>
              </div>
              <p className="text-neutral-600 text-sm font-medium tracking-tight">Active node synchronization in progress</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-8 py-3.5 bg-neutral-900/50 border border-neutral-800 hover:bg-neutral-800 text-white font-bold rounded-2xl text-[11px] transition-all uppercase tracking-widest backdrop-blur-sm">
              Logs
            </button>
            <button className="px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-black font-black rounded-2xl text-[11px] transition-all uppercase tracking-widest shadow-2xl shadow-teal-500/20">
              Upgrade Node
            </button>
          </div>
        </section>

        {/* STATS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Stacks", value: "2", icon: Layers, trend: "+12%" },
            { label: "System Health", value: "99.9%", icon: ShieldCheck, trend: "Stable" },
            { label: "API Traffic", value: "1.2M", icon: Zap, trend: "+5.4%" },
            { label: "Network Growth", value: "18%", icon: TrendingUp, trend: "+2.1%" },
          ].map((stat, i) => (
            <div key={i} className={INDUSTRIAL_CARD}>
              <div className="flex justify-between items-start mb-10">
                <div className={ICON_CONTAINER}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-black text-teal-500 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <h3 className="text-4xl font-bold text-white font-mono tracking-tighter leading-none">{stat.value}</h3>
              </div>
            </div>
          ))}
        </section>

        {/* INFRASTRUCTURE MONITORING SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Visual Monitoring Placeholder */}
          

           {/* Resource Allocation */}
           <div className={cn(INDUSTRIAL_CARD, "min-h-[400px]")}>
              <div className="flex items-center gap-3 mb-8">
                <Database size={18} className="text-teal-500" />
                <h3 className="text-lg font-bold text-white tracking-tight">Resource_Allocation</h3>
              </div>
              <div className="space-y-8">
                {[
                  { label: "NVMe Storage", usage: 75, limit: "10GB" },
                  { label: "CPU Compute", usage: 92, limit: "500h" },
                  { label: "Bandwidth", usage: 45, limit: "100GB" },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{item.label}</span>
                      <span className="text-sm font-mono font-bold text-white">{item.usage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", item.usage > 90 ? "bg-red-500" : "bg-teal-500")} style={{ width: `${item.usage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 p-5 rounded-2xl bg-teal-950/20 border border-teal-900/30">
                <div className="flex gap-4">
                  <Clock size={16} className="text-teal-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-neutral-400 leading-relaxed font-bold uppercase tracking-wider">
                    Reset cycle: <span className="text-white">04 Days Remaining</span>
                  </p>
                </div>
              </div>
           </div>
        </div>
      </main>

      <footer className="py-12 text-center border-t border-neutral-900 mx-8">
         <p className="text-[10px] font-black text-neutral-800 uppercase tracking-[1em]">SYSTEM ARCHITECTURE V4.0.2 // CLIENT ACCESS</p>
      </footer>
    </div>
  )
}

function cn(...inputs: (string | false | null | undefined)[]) {
  return inputs.filter(Boolean).join(" ")
}