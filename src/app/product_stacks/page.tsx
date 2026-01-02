'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getStacks } from './actions'
import { useRouter } from 'next/navigation'
import {
  Rocket,
  ArrowRight,
  Loader2,
  Users,
  Megaphone,
  Coins,
  Layers,
  Grid3x3,
  Activity,
  Zap,
  Search,
  Bell,
  CheckCircle2,
  Cpu
} from 'lucide-react'

/* ---------------- STYLE HELPERS ---------------- */
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

const INDUSTRIAL_CARD = "group relative bg-[#080808] border border-neutral-900 rounded-[24px] p-6 transition-all duration-500 hover:border-teal-500/40 hover:shadow-[0_0_40px_-15px_rgba(20,184,166,0.1)] flex flex-col h-full"
const ICON_CONTAINER = "w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-black transition-all duration-500"

interface SubStack { id: string; name: string; price: number; is_free: boolean; }
interface Stack { id: string; name: string; description?: string; type?: string; base_price: number; sub_stacks?: SubStack[]; }
type StackCategory = 'All' | 'HR' | 'Marketing' | 'Finance' | 'Product'

export default function ProductStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [selectedSubs, setSelectedSubs] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<StackCategory>('All')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    async function loadStacks() {
      try {
        const data = await getStacks()
        setStacks(data || [])
      } catch (error) { console.error(error) } finally { setLoading(false) }
    }
    loadStacks()
  }, [])

  const filteredStacks = useMemo(() => {
    if (activeTab === 'All') return stacks
    return stacks.filter(s => s.type?.toLowerCase() === activeTab.toLowerCase())
  }, [stacks, activeTab])

  const stats = [
    { label: "Active Nodes", val: stacks.length, icon: Cpu },
    { label: "Deployment Ready", val: "99.9%", icon: Activity },
    { label: "Global Tiers", val: 5, icon: Layers },
    { label: "System Health", val: "Optimal", icon: CheckCircle2 },
  ]

  const toggleSub = (stackId: string, subId: string) => {
    setSelectedSubs(prev => {
      const current = prev[stackId] || []
      return current.includes(subId)
        ? { ...prev, [stackId]: current.filter(id => id !== subId) }
        : { ...prev, [stackId]: [...current, subId] }
    })
  }

  const getTotal = (stack: Stack) => {
    const selected = selectedSubs[stack.id] || []
    const subTotal = stack.sub_stacks?.filter(s => selected.includes(s.id)).reduce((a, b) => a + (b.is_free ? 0 : b.price), 0) || 0
    return stack.base_price + subTotal
  }

  const handleActivate = async (stack: Stack) => {
    try {
      setSaving(stack.id)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return alert('Login required')
      const { error } = await supabase.from('cart_stacks').insert([{
        user_id: user.id, stack_id: stack.id, sub_stack_ids: selectedSubs[stack.id] || [],
        total_price: getTotal(stack), status: 'pending',
      }])
      if (error) throw error
      window.dispatchEvent(new CustomEvent('stackAddedToCart'))
      router.push('/private?tab=stacks_cart')
    } catch (e) { alert('Sync failed') } finally { setSaving(null) }
  }

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
            <button onClick={() => setActiveTab('All')} className={cn("py-7 transition", activeTab === 'All' ? "text-teal-400 border-b-2 border-teal-500" : "text-neutral-500 hover:text-neutral-200")}>Overview</button>
            <button className="hover:text-neutral-200 transition py-7 text-neutral-500">Analytics</button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 px-3 py-1.5 rounded-xl mr-4">
            <Search size={14} className="text-neutral-600" />
            <input type="text" placeholder="Search infrastructure..." className="bg-transparent border-none outline-none text-xs w-32" />
          </div>
          <button className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center relative">
            <Bell size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        
        {/* 2. HEADER SECTION (OPERATOR STYLE) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] block mb-2">System Deployment</span>
            <h1 className="text-4xl font-bold text-white tracking-tight">
                Operator: <span className="text-neutral-400">Startup Stacks</span>
            </h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2 font-mono text-sm">
              <Activity size={14} className="text-teal-500" /> All modules reporting <span className="text-neutral-200 font-medium">Ready for Sync</span>
            </p>
          </div>
          <div className="flex gap-2 bg-neutral-900/50 p-1 rounded-xl border border-neutral-800 overflow-x-auto no-scrollbar">
            {['All', 'HR', 'Marketing', 'Finance', 'Product'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as StackCategory)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                    activeTab === tab ? "bg-teal-500 text-black" : "text-neutral-500 hover:text-white"
                  )}
                >
                  {tab}
                </button>
            ))}
          </div>
        </div>

        {/* 3. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <div key={i} className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">{item.label}</p>
                  <h3 className="text-3xl font-bold text-white tracking-tighter">{item.val}</h3>
                </div>
                <item.icon size={20} className="text-neutral-700" />
            </div>
          ))}
        </div>

        {/* 4. CONTENT GRID (INFRASTRUCTURE CARDS) */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden">
          <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Module Selection Terminal v4.0</span>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center animate-pulse text-neutral-600 font-mono">INITIALIZING NODES...</div>
            ) : filteredStacks.map((stack) => (
              <div key={stack.id} className={INDUSTRIAL_CARD}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={ICON_CONTAINER}><Rocket size={20} /></div>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight leading-tight">{stack.name}</h2>
                      <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                        <Activity size={10} className="text-teal-500" /> {stack.type || 'Standard Node'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-neutral-500 text-sm mb-8 leading-relaxed font-medium line-clamp-3">
                  {stack.description || "Deploy pre-configured AI infrastructure for this segment."}
                </p>

                {stack.sub_stacks && (
                  <div className="space-y-2 mb-8 flex-grow">
                    {stack.sub_stacks.map((sub) => {
                      const isSelected = selectedSubs[stack.id]?.includes(sub.id)
                      return (
                        <button
                          key={sub.id}
                          onClick={() => toggleSub(stack.id, sub.id)}
                          className={cn(
                            'w-full flex justify-between items-center p-3 rounded-xl border text-left transition-all duration-300 font-mono',
                            isSelected ? 'bg-teal-500/10 border-teal-500/40 text-white' : 'bg-neutral-900/30 border-neutral-800/50 text-neutral-500 hover:border-neutral-700'
                          )}
                        >
                          <span className="text-[10px] font-bold uppercase">{sub.name}</span>
                          <span className="text-[10px] font-black text-teal-500">
                            {sub.is_free ? '0.00' : `+${sub.price}`}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-neutral-900 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Total Payload</p>
                    <h3 className="text-2xl font-bold text-white font-mono tracking-tighter">
                      ₹{getTotal(stack).toLocaleString()}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleActivate(stack)}
                    disabled={saving === stack.id}
                    className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-teal-500 transition-all disabled:opacity-50"
                  >
                    {saving === stack.id ? <Loader2 size={16} className="animate-spin" /> : <>Sync <ArrowRight size={14} /></>}
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
                LAST_SYNC: {new Date().toISOString()}
            </p>
            <p className="text-[10px] font-black text-neutral-800 uppercase tracking-[0.5em]">SYSTEM STACK TERMINAL V4.0.2</p>
          </div>
        </div>
      </main>
    </div>
  )
}