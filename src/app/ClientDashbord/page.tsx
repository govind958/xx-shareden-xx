"use client"

import React from "react"
import { 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Layers, 
  ArrowUpRight, 
  MoreHorizontal,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ---------------- STYLING HELPERS ---------------- */
const GLASS_CARD = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all hover:border-white/20"
const ICON_BOX = "w-12 h-12 rounded-xl flex items-center justify-center bg-teal-500/10 text-teal-400 border border-teal-500/20"

export default function ClientDashbordPage() {
  return (
    <div className="space-y-10">
      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">System Overview</h2>
          <p className="text-neutral-400 mt-1">Real-time performance and active stack monitoring.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl">
            Download Reports
          </Button>
          <Button className="bg-teal-500 hover:bg-teal-600 text-black font-bold rounded-xl px-6">
            Upgrade Plan
          </Button>
        </div>
      </section>

      {/* 2. STATS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Deployments", value: "24", icon: Layers, trend: "+12%" },
          { label: "System Health", value: "99.9%", icon: ShieldCheck, trend: "Stable" },
          { label: "API Requests", value: "1.2M", icon: Zap, trend: "+5.4%" },
          { label: "Monthly Growth", value: "18%", icon: TrendingUp, trend: "+2.1%" },
        ].map((stat, i) => (
          <div key={i} className={GLASS_CARD}>
            <div className="flex justify-between items-start mb-4">
              <div className={ICON_BOX}>
                <stat.icon size={22} />
              </div>
              <span className="text-teal-400 text-xs font-bold bg-teal-400/10 px-2 py-1 rounded-md">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. RECENT ACTIVITY (WIDER) */}
        <section className={cn(GLASS_CARD, "lg:col-span-2")}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Recent Deployments</h3>
            <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "E-commerce Backend", status: "Successful", time: "2 mins ago", type: "Node.js" },
              { name: "Auth Service API", status: "Processing", time: "15 mins ago", type: "Next.js" },
              { name: "Data Scraper Bot", status: "Successful", time: "1 hour ago", type: "Python" },
              { name: "Marketing Landing Page", status: "Successful", time: "3 hours ago", type: "React" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/[0.08] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-xs text-neutral-500">{item.type} • {item.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className={cn(
                     "text-[10px] uppercase font-bold px-2 py-1 rounded-md border",
                     item.status === "Successful" ? "border-teal-500/20 text-teal-400 bg-teal-500/5" : "border-amber-500/20 text-amber-400 bg-amber-500/5"
                   )}>
                     {item.status}
                   </span>
                   <ArrowUpRight size={18} className="text-neutral-600 group-hover:text-white transition-colors cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. PLAN USAGE (NARROWER) */}
        <section className={GLASS_CARD}>
          <h3 className="text-xl font-bold text-white mb-6">Usage Limits</h3>
          <div className="space-y-8">
            {[
              { label: "Storage", usage: 75, limit: "10GB" },
              { label: "Bandwidth", usage: 45, limit: "100GB" },
              { label: "Compute Hours", usage: 90, limit: "500h" },
            ].map((bar, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">{bar.label}</span>
                  <span className="text-white font-mono">{bar.usage}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      bar.usage > 80 ? "bg-red-500" : "bg-teal-500"
                    )}
                    style={{ width: `${bar.usage}%` }}
                  />
                </div>
                <p className="text-[10px] text-neutral-600 text-right uppercase tracking-tighter">Limit: {bar.limit}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <div className="flex gap-3">
              <Clock size={18} className="text-teal-400 shrink-0" />
              <p className="text-xs text-teal-100/80 leading-relaxed">
                Your next billing cycle starts in <strong>4 days</strong>. Auto-renew is enabled.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// Minimal Tailwind helper for this component
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}