'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import {
  Lock,
  Check,
  Globe,
  ShieldCheck,
  Cpu,
  Trash2
} from 'lucide-react';

// const FEATURES = [
//   "Create, assign, and track tasks",
//   "Activity Logging & Full Reporting",
//   "Priority Email Support",
//   "4 GB Encrypted Storage",
//   "Customizable Neural Templates",
//   "Integration with Slack & Matrix"
// ];

/* ---------------- MAIN COMPONENT ---------------- */

interface CartStack {
  cart_id: string;
  stack_id: string;
  name: string;
  type: string;
  price: number;
  description:string;
  sub_stacks: Array<{ id: string; name: string; price: number }>;
}

export default function TechNoirCheckout() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cartStacks, setCartStacks] = useState<CartStack[]>([]);
  const [activeCartId, setActiveCartId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [profileData, setProfileData] = useState<{ email?: string; name?: string } | null>(null);
  const [organizationData,setOrganizationData] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    const fetchCartStacks = async () => {
      if (authLoading) {
        setLoading(true);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();
        const { data: organizationData, error: organizationError } = await supabase
          .from('organizations')
          .select('org_name')
          .eq('user_id', user.id)
          .single();
        if (organizationError) {
          console.error('Error fetching organization:', organizationError);
        }
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }
        
        // Combine profile data with email from auth
        setProfileData({
          email: user.email || undefined,
          name: profileData?.name || ''
        });
        setOrganizationData({ name: organizationData?.org_name || '' });
        // Fetch cart items with stack details
        const { data: cartItems } = await supabase
          .from('cart_stacks')
          .select(`
            id,
            stack_id,
            total_price,
            sub_stack_ids,
            stacks (
              id,
              name,
              type,
              base_price,
              description
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (cartItems) {
          // Fetch sub_stacks for each cart item
          const formattedStacks: CartStack[] = await Promise.all(
            cartItems.map(async (item) => {
              const stack = Array.isArray(item.stacks) ? item.stacks[0] : item.stacks;
              
              // Fetch sub_stacks if sub_stack_ids exist
              let subStacks: Array<{ id: string; name: string; price: number }> = [];
              if (item.sub_stack_ids && item.sub_stack_ids.length > 0) {
                const { data: subStacksData } = await supabase
                  .from('sub_stacks')
                  .select('id, name, price')
                  .in('id', item.sub_stack_ids);
                
                subStacks = subStacksData || [];
              }

              return {
                cart_id: item.id,
                stack_id: stack?.id || item.stack_id,
                name: stack?.name || 'Unknown Stack',
                type: stack?.type?.toUpperCase().replace(/_/g, ' ') || 'CUSTOM',
                price: item.total_price || stack?.base_price || 0,
                description: stack?.description || '',
                sub_stacks: subStacks,
              };
            })
          );
          setCartStacks(formattedStacks);
        }
      } catch (error) {
        console.error('Error fetching cart stacks:', error);
      } finally {
        setTimeout(() => setLoading(false), 1200);
      }
    };

    fetchCartStacks();
  }, [user, authLoading]);

  // Set active cart item to first item when cart loads
  useEffect(() => {
    if (cartStacks.length > 0 && !activeCartId) {
      setActiveCartId(cartStacks[0].cart_id);
    }
  }, [cartStacks, activeCartId]);

  const handleRemoveFromCart = async (cartId: string) => {
    if (removingId) return;
    setRemovingId(cartId);
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('cart_stacks')
        .delete()
        .eq('id', cartId);
      
      if (error) throw error;
      
      setCartStacks((prev) => prev.filter((item) => item.cart_id !== cartId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart');
    } finally {
      setRemovingId(null);
    }
  };

  const handleCheckout = async () => {
    if (isCheckingOut || cartStacks.length === 0) return;
    setIsCheckingOut(true);
    
    if (!user) {
      alert('Please sign in to checkout');
      setIsCheckingOut(false);
      return;
    }
    
    try {
      const supabase = createClient();

      // Calculate total
      const totalAmount = cartStacks.reduce((sum, item) => sum + item.price, 0);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
        })
        .select('id')
        .single();

      if (orderError || !order) throw orderError;

      // Create order items
      const orderItems = cartStacks.map((item) => ({
        order_id: order.id,
        user_id: user.id,
        stack_id: item.stack_id,
        sub_stack_ids: item.sub_stacks.map((sub) => sub.id),
        status: 'initiated',
        step: 1,
        progress_percent: 0,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      const { error: clearError } = await supabase
        .from('cart_stacks')
        .delete()
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (clearError) throw clearError;

      // Redirect to stackboard
      router.push('/private?tab=stackboard');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = cartStacks.reduce((sum, item) => sum + item.price, 0);
  const activeStack = cartStacks.find((stack) => stack.cart_id === activeCartId);

  if (loading) return <BootSequence />;

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* ATMOSPHERIC GRADIENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-teal-500/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-teal-900/10 blur-[120px] rounded-full" />
      </div>

      {/* --- REFINED NAV SECTION (ACTIVE MODULES) --- */}
     <div className="sticky top-0 z-20 rounded-2xl border border-neutral-900 bg-[#020202]/80 backdrop-blur-md shadow-lg">
  <nav>
    <div className="max-w-[1700px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
      {/* Cart Icon */}
          <div
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/60"
            aria-label="Cart"
          >
            <ShieldCheck size={18} className="text-teal-500" />
            {cartStacks.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-teal-500 text-[10px] font-bold text-black flex items-center justify-center">
                {cartStacks.length}
              </span>
            )}
          </div>
      
      {/* Horizontal Scroll Area for StackCards */}
      <div className="flex-1 flex gap-4 overflow-x-auto no-scrollbar py-2">
        {cartStacks.length > 0 ? (
          cartStacks.map((stack) => (
            <div 
              key={stack.cart_id} 
              onClick={() => setActiveCartId(stack.cart_id)}
              className={`relative flex-shrink-0 w-48 p-4 rounded-xl transition-all cursor-pointer ${
                activeCartId === stack.cart_id
                  ? 'bg-teal-500/10 border-2 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                  : 'bg-neutral-900/40 border border-neutral-800 hover:border-teal-500/40'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-[10px] font-bold text-teal-500 uppercase tracking-wider">{stack.type}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromCart(stack.cart_id);
                  }}
                  disabled={removingId === stack.cart_id}
                  className="text-neutral-600 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Remove from cart"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{stack.name}</h3>
              <p className="text-xs text-neutral-500">{stack.sub_stacks.length} modules</p>
              <div className="mt-3 pt-3 border-t border-neutral-800">
                <p className="text-lg font-mono font-bold text-teal-500">₹{stack.price.toLocaleString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 text-center py-4">
            <p className="text-neutral-600 text-sm">Your cart is empty</p>
          </div>
        )}
      </div>

    </div>
  </nav>



</div>


      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
      

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: PLAN SUMMARY */}
          <section className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <p className="text-teal-500 text-[10px] font-black uppercase tracking-[0.4em]">Stack Details</p>
              {activeStack ? (
                <>
                  <div className="flex items-baseline gap-4">
                    <h1 className="text-4xl font-black text-white tracking-tighter">{activeStack.name}</h1>
                    <span className="bg-teal-500/10 border border-teal-500/20 text-teal-500 text-[10px] px-3 py-1 rounded-full font-bold">{activeStack.type}</span>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {activeStack.description || 'No description available for this stack.'}
                  </p>
                  <div className="pt-4">
                    <p className="text-2xl font-mono font-bold text-teal-500">₹{activeStack.price.toLocaleString()}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Add stacks to your cart to get started with your infrastructure.
                </p>
              )}
            </div>

            <div className="space-y-4 border-t border-neutral-900 pt-10">
              {activeStack && activeStack.sub_stacks.length > 0 ? (
                <>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Included Modules</p>
                  {activeStack.sub_stacks.map((subStack) => (
                    <div key={subStack.id} className="flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-5 h-5 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-teal-500/40 transition-colors">
                          <Check size={12} className="text-teal-500" />
                        </div>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{subStack.name}</span>
                      </div>
                      <span className="text-xs font-mono text-neutral-600">₹{subStack.price.toLocaleString()}</span>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm text-neutral-600">No modules available</p>
              )}
            </div>

            <div className="pt-10 border-t border-neutral-900 space-y-3">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <span>Subtotal</span>
                <span className="text-white font-mono">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <span>Items in Cart</span>
                <span className="text-white font-mono">{cartStacks.length}</span>
              </div>
              <div className="flex justify-between pt-6 text-2xl font-black border-t border-neutral-900">
                <span className="text-white uppercase tracking-tighter">Total_Cost</span>
                <span className="text-teal-500 font-mono">₹{subtotal.toLocaleString()}</span>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: SECURE PAYMENT */}
          <section className="lg:col-span-7 bg-[#0a0a0a] border border-neutral-900 rounded-[40px] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <form className="space-y-8">
              <div className="space-y-6">
                <label className="block">
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-1">Email</span>
                  <input type="email" defaultValue={profileData?.email} className="mt-2 w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-teal-500/50 transition-all font-mono" />
                </label>

                {/* <div className="space-y-4">
                   <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-1">Payment_Transceiver</span>
                   <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden focus-within:border-teal-500/50 transition-all">
                      <div className="p-6 border-b border-neutral-800 flex items-center gap-4">
                        <CreditCard className="text-neutral-600" size={20} />
                        <input type="text" placeholder="1234 5678 9876 5432" className="bg-transparent w-full text-white focus:outline-none font-mono tracking-widest" />
                        <div className="flex gap-2">
                           <div className="w-8 h-5 bg-neutral-800 rounded-md" />
                           <div className="w-8 h-5 bg-neutral-800 rounded-md" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <input type="text" placeholder="MM / YY" className="p-6 bg-transparent border-r border-neutral-800 focus:outline-none text-white font-mono" />
                        <input type="text" placeholder="CVC" className="p-6 bg-transparent focus:outline-none text-white font-mono" />
                      </div>
                   </div>
                </div> */}

                <label className="block">
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-1">Name</span>
                  <input type="text" defaultValue={organizationData?.name} className="mt-2 w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-teal-500/50 transition-all uppercase tracking-tight" />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-1">Geographic_Node</span>
                    <div className="relative">
                    <input type="text" placeholder="Country" className="mt-2 w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white focus:outline-none" />
                      
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-1">Postal_Code</span>
                    <input type="text" placeholder="Address line 1" className="mt-2 w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white focus:outline-none" />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-3xl bg-teal-500/5 border border-teal-500/10">
                <div className="pt-1">
                    <input type="checkbox" className="w-4 h-4 accent-teal-500 bg-black border-neutral-800 rounded" />
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-500">
                  By clicking Subscribe, you agree to the <span className="text-teal-500">Terms of Decryption</span> and authorize monthly protocol charges. Cancel anytime via the dashboard.
                </p>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut || cartStacks.length === 0}
                className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-6 rounded-2xl transition-all duration-300 uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(20,184,166,0.15)] active:scale-[0.98]"
              >
                {isCheckingOut ? 'Processing...' : 'Complete Subscription'}
              </button>
              {cartStacks.length === 0 && (
                <p className="text-[10px] text-neutral-600 italic text-center mt-4">Add stacks to your cart to checkout</p>
              )}
              
              <div className="flex items-center justify-center gap-8 opacity-30 grayscale hover:opacity-60 transition-opacity">
                <ShieldCheck size={18} />
                <Globe size={18} />
                <Lock size={18} />
                <Cpu size={18} />
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

function BootSequence() {
  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center font-mono">
       <div className="relative w-64 h-[1px] bg-neutral-900 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-teal-500 animate-loading" />
       </div>
       <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] tracking-[0.8em] text-teal-500 uppercase animate-pulse">Syncing Active Modules</p>
       </div>
       <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-loading {
            animation: loading 1.5s infinite ease-in-out;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
       `}</style>
    </div>
  )
}