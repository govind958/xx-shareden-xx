'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getCartStacks, createOrderFromCart } from '@/src/modules/stack_cart/actions'
import { useRouter } from 'next/navigation'
import {
  Rocket,
  ArrowRight,
  Loader2,
  Activity,
  Zap,
  Bell,
  Cpu,
  Trash2,
  ShoppingCart,
  CreditCard,
  Layers
} from 'lucide-react'
import { Stack, SubStack } from '@/src/types/Substack'
/* ---------------- STYLE HELPERS (From Page 1) ---------------- */
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

const INDUSTRIAL_CARD = "group relative bg-[#080808] border border-neutral-900 rounded-[24px] p-6 transition-all duration-500 hover:border-teal-500/40 hover:shadow-[0_0_40px_-15px_rgba(20,184,166,0.1)] flex flex-col h-full"
const ICON_CONTAINER = "w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-black transition-all duration-500"



const DISCOUNT_AMOUNT = 20.00;

export default function StacksCartPage() {
  const [cartStacks, setCartStacks] = useState<Stack[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    async function loadCart() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return setLoading(false)

        const cartData = await getCartStacks(user.id)
        const transformed: Stack[] = cartData.map((item) => ({
          cart_id: item.cart_id,
          id: item.stack_id,
          name: item.name || 'Unknown Node',
          type: item.type || 'Standard',
          description: item.description ?? null,
          base_price: item.base_price || 0,
          sub_stacks: (item.sub_stacks || []) as SubStack[],
          total_price: item.total_price,
        }))
        setCartStacks(transformed)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [])

  const subtotal = useMemo(() => cartStacks.reduce((acc, curr) => acc + curr.total_price, 0), [cartStacks])
  const finalTotal = subtotal - DISCOUNT_AMOUNT

  const handleRemoveStack = async (cartId: string) => {
    try {
      setRemovingId(cartId)
      const supabase = createClient()
      const { error } = await supabase.from("cart_stacks").delete().eq("id", cartId)
      if (error) throw error
      setCartStacks(prev => prev.filter(s => s.cart_id !== cartId))
      window.dispatchEvent(new CustomEvent('stackAddedToCart')) // Refresh counters if any
    } catch (e) {
      alert("Removal sequence failed.")
    } finally {
      setRemovingId(null)
    }
  }

  const handleCheckout = async () => {
    try {
      setIsCreatingOrder(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const result = await createOrderFromCart(user.id, DISCOUNT_AMOUNT)
      if (result.success) {
        router.push('/private?tab=orders')
      } else {
        alert(result.error)
      }
    } catch (e) {
      alert("Checkout sync failed.")
    } finally {
      setIsCreatingOrder(false)
    }
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
            <button onClick={() => router.push('/product_stacks')} className="text-neutral-500 hover:text-neutral-200 transition">Infrastructure</button>
            <button className="text-teal-400 border-b-2 border-teal-500 py-7">Manifest Cart</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <Bell size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        
        {/* 2. HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] block mb-2">Checkout Pipeline</span>
            <h1 className="text-4xl font-bold text-white tracking-tight">
                Review: <span className="text-neutral-400">Deployment Manifest</span>
            </h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2 font-mono text-sm">
              <ShoppingCart size={14} className="text-teal-500" /> {cartStacks.length} Modules queued for <span className="text-neutral-200 font-medium">Provisioning</span>
            </p>
          </div>
        </div>

        {/* 3. SUMMARY STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Subtotal Value</p>
              <h3 className="text-3xl font-bold text-white tracking-tighter font-mono">₹{subtotal.toLocaleString()}</h3>
            </div>
            <Layers size={20} className="text-neutral-700" />
          </div>
          <div className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase text-teal-500/60 tracking-widest mb-1">Applied Credits</p>
              <h3 className="text-3xl font-bold text-teal-500 tracking-tighter font-mono">-₹{DISCOUNT_AMOUNT}</h3>
            </div>
            <Activity size={20} className="text-neutral-700" />
          </div>
          <div className="bg-teal-500 border border-teal-400 p-6 rounded-[24px] flex justify-between items-start text-black">
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Final Payload Total</p>
              <h3 className="text-3xl font-bold tracking-tighter font-mono">₹{Math.max(0, finalTotal).toLocaleString()}</h3>
            </div>
            <CreditCard size={20} className="opacity-40" />
          </div>
        </div>

        {/* 4. CART ITEMS GRID */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden">
          <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex justify-between items-center">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Active Queue Terminal</span>
             </div>
             {cartStacks.length > 0 && (
                <button 
                  onClick={handleCheckout}
                  disabled={isCreatingOrder}
                  className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-teal-500 transition-colors flex items-center gap-2"
                >
                  {isCreatingOrder ? <Loader2 size={14} className="animate-spin" /> : <>Initiate Deployment <ArrowRight size={14} /></>}
                </button>
             )}
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center animate-pulse text-neutral-600 font-mono">SCANNING QUEUE...</div>
            ) : cartStacks.length === 0 ? (
              <div className="col-span-full py-20 text-center text-neutral-600 font-mono">
                MANIFEST EMPTY. <button onClick={() => router.push('/product_stacks')} className="text-teal-500 hover:underline">RE-LINK HARDWARE?</button>
              </div>
            ) : cartStacks.map((stack) => (
              <div key={stack.cart_id} className={INDUSTRIAL_CARD}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={ICON_CONTAINER}><Rocket size={20} /></div>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight leading-tight">{stack.name}</h2>
                      <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                        <Cpu size={10} className="text-teal-500" /> {stack.type}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveStack(stack.cart_id)}
                    className="text-neutral-700 hover:text-red-500 transition-colors"
                  >
                    {removingId === stack.cart_id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                </div>

                <div className="space-y-2 mb-8 flex-grow">
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-3">Loaded Modules</p>
                  <div className="p-3 rounded-xl bg-neutral-900/30 border border-neutral-800/50 flex justify-between items-center font-mono">
                    <span className="text-[10px] text-neutral-400 uppercase">Base Core</span>
                    <span className="text-[10px] text-teal-500">₹{stack.base_price}</span>
                  </div>
                  {stack.sub_stacks.map((sub) => (
                    <div key={sub.id} className="p-3 rounded-xl bg-neutral-900/30 border border-neutral-800/50 flex justify-between items-center font-mono">
                      <span className="text-[10px] text-neutral-400 uppercase">{sub.name}</span>
                      <span className="text-[10px] text-teal-500">+₹{sub.price}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-neutral-900 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Node Cost</p>
                    <h3 className="text-2xl font-bold text-white font-mono tracking-tighter">
                      ₹{stack.total_price.toLocaleString()}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. FOOTER LOGS */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[32px] overflow-hidden">
          <div className="px-8 py-4 bg-black/40 flex justify-between items-center">
            <p className="text-[10px] font-medium text-neutral-700 font-mono tracking-tighter">
                LAST_CART_SYNC: {new Date().toISOString()}
            </p>
            <p className="text-[10px] font-black text-neutral-800 uppercase tracking-[0.5em]">SYSTEM STACK TERMINAL V4.0.2</p>
          </div>
        </div>
      </main>
    </div>
  )
}