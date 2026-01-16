'use client'

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stack, SubStack } from '@/src/types/product_stack';
import { CanvasContainer } from './components/CanvasContainer';
import { Footer } from './components/Footer';

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

  // 1. HOOKS FIRST: useMemo must be called before any conditional returns
  const convertedStacks: Stack[] = useMemo(() => {
    return stacks.map(s => {
      return {
        ...(s as any),
        base_price: (s as any).base_price ?? 0,
        active: (s as any).active ?? true,
      } as Stack
    })
  }, [stacks])

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

  // 2. CONDITIONAL RETURNS SECOND: Only return early AFTER all hooks are declared
  if (!mounted) return <div className="min-h-screen bg-[#020202]" />

  const subStacks: SubStack[] = []

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
          </div>
        </div>

        {/* 4. MAIN BOARD GRID */}

        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden">
          <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Deployment Progress Terminal</span>
          </div>

          <CanvasContainer stacks={convertedStacks} subStacks={subStacks} />
        </div>


        {/* 5. FOOTER LOGS */}
        <Footer />

      </main>
    </div>
  )
}