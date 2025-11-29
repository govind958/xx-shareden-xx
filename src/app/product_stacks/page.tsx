'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getStacks } from './actions'
import { useRouter } from 'next/navigation'
import {
  Rocket,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react'

// --- helper ---
const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ')

// --- shimmer card ---
const StackShimmerCard = () => (
  <div className="rounded-3xl p-6 backdrop-blur-md bg-white/5 border border-white/10 animate-pulse">
    <div className="h-6 w-1/3 bg-white/20 rounded mb-3" />
    <div className="h-4 w-2/3 bg-white/10 rounded mb-2" />
    <div className="h-4 w-1/4 bg-white/10 rounded mb-4" />
    <div className="h-5 w-full bg-white/10 rounded" />
  </div>
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
  type?: string
  base_price: number
  active: boolean
  created_at: string
  sub_stacks?: SubStack[]
}

// --- main ---
interface ProductStacksPageProps {
  onAddToCart?: () => void
}

export default function ProductStacksPage({ onAddToCart }: ProductStacksPageProps = {}) {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [selectedSubs, setSelectedSubs] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
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
      
      // Switch to cart tab if callback is provided (when used in private page)
      if (onAddToCart) {
        onAddToCart()
        // Update URL without full page navigation
        window.history.replaceState({}, '', '/private?tab=stacks_cart')
      } else {
        // Fallback: navigate if used as standalone page
        router.push('/private?tab=stacks_cart')
      }
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
      <div className="grid md:grid-cols-2 gap-6 p-8">
        {[...Array(4)].map((_, i) => (
          <StackShimmerCard key={i} />
        ))}
      </div>
    )
  }

  // --- main UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 lg:p-10">
      <header className="max-w-7xl mx-auto flex items-center justify-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent text-center">
          Explore Startup Stacks 🚀
        </h1>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {stacks.length === 0 ? (
          <div className="col-span-full text-center text-neutral-400 py-20">
            <Rocket size={48} className="mx-auto text-cyan-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Active Stacks Found</h2>
            <p className="text-neutral-500">
              Please check back later — new stacks launching soon!
            </p>
          </div>
        ) : (
          stacks.map((stack) => (
            <div
              key={stack.id}
              className="p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:scale-[1.02] transition-all duration-300"
            >
              {/* Stack Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <Rocket size={22} className="text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{stack.name}</h2>
                    <p className="text-neutral-400 text-sm">
                      {stack.type || 'General Stack'}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-teal-400">
                  ₹{stack.base_price.toFixed(2)}
                </span>
              </div>

              {stack.description && (
                <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                  {stack.description}
                </p>
              )}

              {/* Sub-stacks */}
              {stack.sub_stacks && stack.sub_stacks.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm uppercase tracking-wide text-neutral-400 mb-3 flex items-center gap-2">
                    <Sparkles className="text-teal-400" /> Add-on Modules
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {stack.sub_stacks.map((sub) => {
                      const selected = selectedSubs[stack.id]?.includes(sub.id)
                      return (
                        <button
                          key={sub.id}
                          onClick={() => toggleSub(stack.id, sub.id)}
                          className={cn(
                            'flex justify-between items-center gap-2 w-full p-3 rounded-xl border text-left transition-all duration-200 group',
                            selected
                              ? 'bg-gradient-to-r from-cyan-400/20 to-teal-400/20 border-cyan-400/40'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              size={18}
                              className={cn(
                                'transition-colors',
                                selected
                                  ? 'text-cyan-400'
                                  : 'text-neutral-600 group-hover:text-neutral-400'
                              )}
                            />
                            <span className="text-sm">{sub.name}</span>
                          </div>
                          <span
                            className={cn(
                              'text-xs font-semibold',
                              sub.is_free ? 'text-green-400' : 'text-teal-300'
                            )}
                          >
                            {sub.is_free ? 'Free' : `₹${sub.price}`}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="mt-6 flex justify-between items-center border-t border-white/10 pt-4">
                <span className="text-neutral-400 text-sm">Total Price:</span>
                <span className="text-xl font-bold text-cyan-400">
                  ₹{getTotal(stack)}
                </span>
              </div>

              {/* CTA */}
              <div className="mt-6 text-right">
                <button
                  onClick={() => handleActivate(stack)}
                  disabled={saving === stack.id}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-60"
                >
                  {saving === stack.id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      Activate Stack <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      <footer className="max-w-7xl mx-auto text-center py-10 text-neutral-500 text-sm border-t border-white/10 mt-10">
        Empowering 120+ founders with AI-driven startup stacks ⚡
      </footer>
    </div>
  )
}
