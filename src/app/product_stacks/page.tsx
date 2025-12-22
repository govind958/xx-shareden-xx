'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getStacks } from './actions'
import { useRouter } from 'next/navigation'
import {
  Rocket,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Loader2,
  Users, // HR
  Megaphone, // Marketing
  Coins, // Finance
  Layers, // Product
  Grid3x3, // All Stacks
} from 'lucide-react'

// --- helper ---
const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ')

// --- shimmer card ---
const StackShimmerCard = () => (
  <div className="rounded-3xl p-6 bg-neutral-800/50 border border-neutral-700/50 animate-pulse h-60" />
)

// --- types ---
interface SubStack {
  id: string
  stack_id: string
  name: string
  price: number
  is_free: boolean
  created_at: string
}

interface Stack {
  id: string
  name: string
  description?: string
  // Updated: Added more possible types for filtering
  type?: 'HR' | 'Marketing' | 'Finance' | 'Product' | string 
  base_price: number
  active: boolean
  created_at: string
  sub_stacks?: SubStack[]
}

// --- tab types ---
type StackCategory = 'All' | 'HR' | 'Marketing' | 'Finance' | 'Product'

const tabs: { label: string; value: StackCategory; icon: React.ReactNode }[] = [
  { label: 'All', value: 'All', icon: <Grid3x3 size={18} /> },
  { label: 'HR', value: 'HR', icon: <Users size={18} /> },
  { label: 'Marketing', value: 'Marketing', icon: <Megaphone size={18} /> },
  { label: 'Finance', value: 'Finance', icon: <Coins size={18} /> },
  { label: 'Product', value: 'Product', icon: <Layers size={18} /> },
]

// --- main component ---
export default function ProductStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [selectedSubs, setSelectedSubs] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<StackCategory>('All')
  const router = useRouter()

  // --- load stacks ---
  useEffect(() => {
    async function loadStacks() {
      try {
        const data = await getStacks()
        setStacks(data)
      } catch (error) {
        console.error('Error loading stacks:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStacks()
  }, [])

  // --- filter stacks based on active tab ---
  const filteredStacks = useMemo(() => {
    if (activeTab === 'All') {
      return stacks
    }
    // Filter by the stack's 'type' matching the activeTab
    // Ensures case sensitivity is consistent
    return stacks.filter(stack => stack.type && stack.type.toLowerCase() === activeTab.toLowerCase())
  }, [stacks, activeTab])

  // --- toggle selection ---
  const toggleSub = (stackId: string, subId: string) => {
    setSelectedSubs((prev) => {
      const current = prev[stackId] || []
      return current.includes(subId)
        ? { ...prev, [stackId]: current.filter((id) => id !== subId) }
        : { ...prev, [stackId]: [...current, subId] }
    })
  }

  // --- total price ---
  const getTotal = (stack: Stack): number => {
    const selected = selectedSubs[stack.id] || []
    const selectedSubsData =
      stack.sub_stacks?.filter((s) => selected.includes(s.id)) || []
    const subTotal = selectedSubsData.reduce(
      (acc, s) => acc + (s.is_free ? 0 : s.price),
      0
    )
    return stack.base_price + subTotal
  }

  // --- handle add to cart ---
  const handleActivate = async (stack: Stack) => {
    try {
      setSaving(stack.id)
      const supabase = createClient()

      // check logged in user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert('Please log in first!')
        setSaving(null)
        return
      }

      const selected = selectedSubs[stack.id] || []
      const total = getTotal(stack)

      // insert into cart_stacks
      const { error } = await supabase.from('cart_stacks').insert([
        {
          user_id: user.id,
          stack_id: stack.id,
          sub_stack_ids: selected,
          total_price: total,
          status: 'pending',
        },
      ])

      if (error) throw error

      alert('✅ Stack added to cart!')
      
      // Dispatch custom event for parent components to listen to
      window.dispatchEvent(new CustomEvent('stackAddedToCart'))
      router.push('/private?tab=stacks_cart')
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('Error adding to cart:', e.message)
      } else {
        console.error('Unknown error adding to cart:', e)
      }
      alert('Something went wrong! Try again.')
    } finally {
      setSaving(null)
    }
  }

  // --- loading state ---
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-8 p-10 max-w-7xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <StackShimmerCard key={i} />
        ))}
      </div>
    )
  }

  // --- main UI ---
  return (
    <div className="min-h-screen bg-neutral-950/95 text-white p-6 lg:p-10 relative overflow-hidden">
      
      {/* Background radial gradient for a modern feel */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] absolute top-[-50px] left-[-50px]" />
        <div className="w-80 h-80 bg-teal-500/10 rounded-full blur-[150px] absolute bottom-[-50px] right-[-50px]" />
      </div>

      <header className="max-w-7xl mx-auto flex flex-col items-center mb-10 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent text-center leading-tight">
          AI-Powered Startup Stacks
        </h1>
        <p className="text-neutral-400 mt-3 text-lg">
            Curated modules for your next big idea. Choose your stack below.
        </p>

        {/* --- Tab Strip UI --- */}
        <div className="flex flex-wrap justify-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 mt-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 transform',
                activeTab === tab.value
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-neutral-950 shadow-lg shadow-cyan-500/20 scale-105'
                  : 'text-neutral-400 hover:bg-white/10 hover:text-white'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Horizontal Rule replacement (More prominent) */}
        <hr className="w-full max-w-7xl h-px bg-cyan-400/20 border-0 mt-8 mb-4" /> 
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {filteredStacks.length === 0 ? (
          <div className="col-span-full text-center text-neutral-400 py-20 bg-white/5 rounded-3xl border border-white/10">
            <Layers size={48} className="mx-auto text-teal-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              No Stacks Found in the "{activeTab}" Category
            </h2>
            <p className="text-neutral-500">
              We are building out this category. Check the 'All' tab for more options!
            </p>
          </div>
        ) : (
          filteredStacks.map((stack) => {
            const currentTotal = getTotal(stack)
            return (
              // Enhanced Card Design with Animated Border
              <div
                key={stack.id}
                className="group relative p-0.5 rounded-3xl bg-neutral-800 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                {/* Animated Border/Glow effect */}
                <div 
                  className="absolute inset-0 rounded-[1.8rem] transition-opacity duration-500 
                  bg-gradient-to-r from-cyan-400/30 to-teal-400/30 opacity-0 group-hover:opacity-100 animate-pulse-slow"
                ></div>

                {/* Card Content */}
                <div className="relative p-6 bg-neutral-900 rounded-[1.75rem] h-full flex flex-col">
                  
                  {/* Stack Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
                        <Rocket size={22} className="text-cyan-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{stack.name}</h2>
                        <p className="text-neutral-500 text-sm">
                          {stack.type || 'General Stack'}
                        </p>
                      </div>
                    </div>
                    {/* Base Price Display */}
                    <div className="text-right">
                        <span className="text-sm text-neutral-400 block">Base Price</span>
                        <span className="text-xl font-bold text-teal-400">
                          ₹{stack.base_price.toFixed(0)}
                        </span>
                    </div>
                  </div>

                  {stack.description && (
                    <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                      {stack.description}
                    </p>
                  )}

                  {/* Sub-stacks (Modules) */}
                  {stack.sub_stacks && stack.sub_stacks.length > 0 && (
                    <div className="mt-2 mb-4">
                      <h3 className="text-xs uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2 font-semibold">
                        <Sparkles size={16} /> Add-on Modules (Optional)
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        {stack.sub_stacks.map((sub) => {
                          const selected = selectedSubs[stack.id]?.includes(sub.id)
                          return (
                            <button
                              key={sub.id}
                              onClick={() => toggleSub(stack.id, sub.id)}
                              className={cn(
                                'flex justify-between items-center gap-2 w-full p-3 rounded-xl border text-left transition-all duration-200 shadow-sm',
                                selected
                                  ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                                  : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700/70 text-neutral-300'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle
                                  size={18}
                                  strokeWidth={1.5}
                                  className={cn(
                                    'transition-colors',
                                    selected
                                      ? 'text-cyan-400 fill-cyan-400/20'
                                      : 'text-neutral-600'
                                  )}
                                />
                                <span className="text-sm truncate">{sub.name}</span>
                              </div>
                              <span
                                className={cn(
                                  'text-xs font-mono font-bold',
                                  sub.is_free ? 'text-green-400' : 'text-teal-300'
                                )}
                              >
                                {sub.is_free ? 'FREE' : `+₹${sub.price}`}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Separator */}
                  <div className="flex-grow border-t border-neutral-700 mt-4 mb-4" />


                  {/* Total & CTA (Stuck to bottom) */}
                  <div className="flex justify-between items-center">
                    {/* Total Price */}
                    <div>
                      <span className="text-neutral-400 text-base block">Total Investment</span>
                      <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">
                        ₹{currentTotal.toFixed(0)}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleActivate(stack)}
                      disabled={saving === stack.id}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 transition-all duration-300 shadow-xl shadow-cyan-500/20 disabled:opacity-60 disabled:shadow-none"
                    >
                      {saving === stack.id ? (
                        <>
                          <Loader2 size={20} className="animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          Activate Stack <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          }))} 
      </main>

      <footer className="max-w-7xl mx-auto text-center py-10 text-neutral-500 text-sm border-t border-white/5 mt-16 relative z-10">
        Empowering 120+ founders with AI-driven startup stacks ⚡
      </footer>
      
      {/* FIX: Define the custom keyframes required for the border animation 
        in a standard <style> tag.
      */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.25; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}