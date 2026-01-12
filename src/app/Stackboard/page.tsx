'use client'


import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Clock,
  Rocket,
  Sparkles,
  MessageCircle,
  User,
  ArrowRight,
  Loader2,
  Activity,
  Zap,
  Bell,
  Cpu,
  ShieldCheck,
  Terminal,
  Layers,
} from 'lucide-react';

import { createClient } from '@/utils/supabase/client';
import { getOrderItemsWithProgress } from '@/src/modules/stack_board/action';
import type { StackProgress } from '@/src/types/stack_board';


/* ---------------- STYLE HELPERS ---------------- */
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

const INDUSTRIAL_CARD = "group relative bg-[#080808] border border-neutral-900 rounded-[24px] p-6 transition-all duration-500 hover:border-teal-500/40 hover:shadow-[0_0_40px_-15px_rgba(20,184,166,0.1)] flex flex-col h-full"
const ICON_CONTAINER = "w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-black transition-all duration-500"

/* ---------------- FORMATTERS ---------------- */
const formatETA = (eta: string | null): string => {
  if (!eta) return "PENDING"
  try {
    const date = new Date(eta)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()
  } catch { return "TBD" }
}

const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`
    if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()
  } catch { return "RECENT" }
}

export default function StackBoardPage() {
  const [stacks, setStacks] = useState<StackProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    async function loadOrderItems() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return setLoading(false)
        const data = await getOrderItemsWithProgress(user.id)
        setStacks(data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadOrderItems()
  }, [])

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      
      {/* 1. TOP GLOBAL NAVIGATION */}
      <nav className="h-20 border-b border-neutral-900 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-black">
                <Zap size={18} fill="currentColor" />
             </div>
             <span className="text-white font-bold tracking-tighter text-xl">CloudConsole</span>
          </div>
          <div className="h-6 w-px bg-neutral-800 hidden md:block" />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button onClick={() => router.push('/product_stacks')} className="text-neutral-500 hover:text-neutral-200 transition">Infrastructure</button>
            <button className="text-teal-400 border-b-2 border-teal-500 py-7">System Monitor</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center relative">
            <Bell size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        
        {/* 2. HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] block mb-2">Live Node Tracking</span>
            <h1 className="text-4xl font-bold text-white tracking-tight">
                Operator: <span className="text-neutral-400">StackBoard v4.0</span>
            </h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2 font-mono text-sm">
              <Activity size={14} className="text-teal-500" /> System reporting <span className="text-neutral-200 font-medium">{stacks.length} Active Deployments</span>
            </p>
          </div>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">All Systems Nominal</span>
             </div>
          </div>
        </div>

        {/* 3. SYSTEM STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Active Tasks</p>
                <h3 className="text-3xl font-bold text-white tracking-tighter font-mono">{stacks.length}</h3>
              </div>
              <Layers size={20} className="text-neutral-700" />
          </div>
          <div className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Average Sync</p>
                <h3 className="text-3xl font-bold text-white tracking-tighter font-mono">74%</h3>
              </div>
              <Cpu size={20} className="text-neutral-700" />
          </div>
          <div className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Security Status</p>
                <h3 className="text-3xl font-bold text-white tracking-tighter">Verified</h3>
              </div>
              <ShieldCheck size={20} className="text-teal-500/50" />
          </div>
          <div className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Last Update</p>
                <h3 className="text-3xl font-bold text-white tracking-tighter">Today</h3>
              </div>
              <Clock size={20} className="text-neutral-700" />
          </div>
        </div>

        {/* 4. MAIN BOARD GRID */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden">
          <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Deployment Progress Terminal</span>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center animate-pulse text-neutral-600 font-mono">INITIALIZING TELEMETRY...</div>
            ) : stacks.length === 0 ? (
              <div className="col-span-full py-20 text-center text-neutral-600 font-mono">NO ACTIVE NODES DETECTED.</div>
            ) : stacks.map((stack) => (
              <div key={stack.order_item_id} className={INDUSTRIAL_CARD}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={ICON_CONTAINER}><Rocket size={20} /></div>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight leading-tight">{stack.name}</h2>
                      <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                        <Terminal size={10} className="text-teal-500" /> {stack.type || 'Standard Module'}
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-lg border border-neutral-800 bg-black text-[9px] font-black uppercase tracking-widest text-teal-400">
                    {stack.statusDisplay}
                  </div>
                </div>

                {/* Industrial Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2 font-mono">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sync Progress</span>
                    <span className="text-sm font-black text-white">{stack.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                    <div 
                      className="bg-teal-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(20,184,166,0.5)]"
                      style={{ width: `${stack.progress}%` }}
                    />
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-900">
                        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1">Timeline ETA</p>
                        <p className="text-xs font-bold text-white font-mono">{formatETA(stack.eta)}</p>
                    </div>
                    {stack.assigned_employee && (
                        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-900">
                            <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-1">Lead Operator</p>
                            <p className="text-xs font-bold text-teal-500 flex items-center gap-1">
                                <User size={10} /> {stack.assigned_employee.name.toUpperCase()}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-6 border-t border-neutral-900 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 font-mono">
                    <Clock size={12} /> LAST_SYNC: {formatRelativeTime(stack.updated_at)}
                  </div>
                  <button className="flex items-center gap-2 px-5 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-teal-500 transition-all">
                    Ask Expert <MessageCircle size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. FOOTER LOGS */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[32px] overflow-hidden">
          <div className="px-8 py-4 bg-black/40 flex justify-between items-center">
            <p className="text-[10px] font-medium text-neutral-700 font-mono tracking-tighter">
                TELEMETRY_ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
            <p className="text-[10px] font-black text-neutral-800 uppercase tracking-[0.5em]">SYSTEM STACK TERMINAL V4.0.2</p>
          </div>
        </div>
      </main>
    </div>
  )
}