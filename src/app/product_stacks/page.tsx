'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getStacks } from './actions'
import { useRouter } from 'next/navigation'
import {
  Rocket,
  CheckCircle,
  ArrowRight,
  Loader2,
  Users,
  Megaphone,
  Coins,
  Layers,
  Grid3x3,
  Hash,
  Activity
} from 'lucide-react'

/* ---------------- INDUSTRIAL STYLING HELPERS ---------------- */
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

// Optimized for responsiveness: Reduced padding on mobile (p-5 vs p-8)
const INDUSTRIAL_CARD = "group relative bg-[#080808] border border-neutral-900 rounded-[24px] md:rounded-[32px] p-5 md:p-8 transition-all duration-500 hover:border-teal-500/40 hover:shadow-[0_0_40px_-15px_rgba(20,184,166,0.1)] flex flex-col h-full"
const ICON_CONTAINER = "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-black transition-all duration-500"

const StackShimmerCard = () => (
  <div className="rounded-[32px] p-8 bg-[#080808] border border-neutral-900 animate-pulse h-[350px] md:h-[400px] flex flex-col gap-6">
    <div className="flex justify-between">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-900 rounded-xl" />
      <div className="w-16 md:w-20 h-8 bg-neutral-900 rounded-xl" />
    </div>
    <div className="space-y-3">
      <div className="h-6 bg-neutral-900 rounded w-1/2" />
      <div className="h-4 bg-neutral-900 rounded w-full" />
    </div>
    <div className="mt-auto h-12 bg-neutral-900 rounded-2xl w-full" />
  </div>
)

interface SubStack { id: string; name: string; price: number; is_free: boolean; }
interface Stack { id: string; name: string; description?: string; type?: string; base_price: number; sub_stacks?: SubStack[]; }
type StackCategory = 'All' | 'HR' | 'Marketing' | 'Finance' | 'Product'

const tabs: { label: string; value: StackCategory; icon: any }[] = [
  { label: 'All', value: 'All', icon: Grid3x3 },
  { label: 'HR', value: 'HR', icon: Users },
  { label: 'Marketing', value: 'Marketing', icon: Megaphone },
  { label: 'Finance', value: 'Finance', icon: Coins },
  { label: 'Product', value: 'Product', icon: Layers },
]

export default function ProductStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [selectedSubs, setSelectedSubs] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<StackCategory>('All')
  const router = useRouter()

  useEffect(() => {
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

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 p-4 sm:p-8 lg:p-12 xl:p-16 max-w-[1800px] mx-auto w-full space-y-8 md:space-y-12">
        
        {/* HEADER: Stacked on mobile, side-by-side on desktop */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <span className="text-[9px] md:text-[10px] font-black text-teal-500 uppercase tracking-[0.4em]">Infrastructure Nodes</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white leading-tight md:leading-none">Startup Stacks</h2>
            <p className="text-neutral-600 text-sm md:text-base font-medium tracking-tight max-w-md pt-1">
              Select and synchronize pre-configured AI modules.
            </p>
          </div>

          {/* TAB STRIP: Scrollable on mobile, fixed on desktop */}
          
        </section>

        {/* CONTENT GRID: 1 on mobile, 2 on tablet, 3 on large desktop, 4 on ultra-wide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => <StackShimmerCard key={i} />)
          ) : filteredStacks.length === 0 ? (
            <div className="col-span-full py-24 md:py-32 bg-[#080808] border border-dashed border-neutral-900 rounded-[32px] md:rounded-[40px] text-center">
              <Layers size={32} className="mx-auto text-neutral-800 mb-4" />
              <p className="text-neutral-600 font-black uppercase tracking-widest text-[10px]">No active nodes found</p>
            </div>
          ) : (
            filteredStacks.map((stack) => (
              <div key={stack.id} className={INDUSTRIAL_CARD}>
                {/* Upper Section */}
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={ICON_CONTAINER}><Rocket size={20} /></div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">{stack.name}</h2>
                      <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                        <Activity size={10} className="text-teal-500" /> {stack.type || 'Node'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">Base</p>
                    <p className="text-md md:text-lg font-mono font-bold text-white">₹{stack.base_price.toLocaleString()}</p>
                  </div>
                </div>

                {stack.description && (
                  <p className="text-neutral-500 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed font-medium line-clamp-3">
                    {stack.description}
                  </p>
                )}

                {/* Sub-stacks */}
                {stack.sub_stacks && stack.sub_stacks.length > 0 && (
                  <div className="space-y-3 mb-8">
                    <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest block">Modules</span>
                    <div className="grid grid-cols-1 gap-2">
                      {stack.sub_stacks.map((sub) => {
                        const isSelected = selectedSubs[stack.id]?.includes(sub.id)
                        return (
                          <button
                            key={sub.id}
                            onClick={() => toggleSub(stack.id, sub.id)}
                            className={cn(
                              'flex justify-between items-center p-3 md:p-4 rounded-xl md:rounded-2xl border text-left transition-all duration-300',
                              isSelected ? 'bg-teal-500/5 border-teal-500/40 text-white' : 'bg-neutral-900/30 border-neutral-800/50 text-neutral-500'
                            )}
                          >
                            <span className="text-[10px] md:text-[11px] font-bold uppercase truncate pr-2">{sub.name}</span>
                            <span className="text-[10px] font-mono font-black text-teal-500 shrink-0">
                              {sub.is_free ? 'FREE' : `+₹${sub.price}`}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Total / Action */}
                <div className="mt-auto pt-6 md:pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Final Config</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tighter">
                      ₹{getTotal(stack).toLocaleString()}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleActivate(stack)}
                    disabled={saving === stack.id}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 bg-teal-600 text-black font-black uppercase tracking-widest text-[10px] md:text-[11px] rounded-xl md:rounded-2xl hover:bg-teal-500 transition-all shadow-xl shadow-teal-500/10 disabled:opacity-50"
                  >
                    {saving === stack.id ? <Loader2 size={16} className="animate-spin" /> : <>Sync Node <ArrowRight size={16} /></>}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="py-12 text-center border-t border-neutral-900 mx-4 sm:mx-8">
         <p className="text-[9px] md:text-[10px] font-black text-neutral-800 uppercase tracking-[0.5em] md:tracking-[1em]">SYSTEM STACK TERMINAL V4.0.2</p>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}