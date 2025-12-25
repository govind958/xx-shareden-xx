"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Rocket, CheckCircle, Sparkles, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { getCartStacks, createOrderFromCart } from "./actions";

// Mock implementation of cn
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Types ---
interface SubStack {
  id: string;
  name: string;
  price: number;
}

interface Stack {
  cart_id: string;
  id: string;
  name: string;
  type: string;
  description: string | null;
  base_price: number;
  active: boolean;
  sub_stacks: SubStack[];
  total_price: number;
}

// --- Utility: dynamic icon ---
const getIconForStack = (type: string) => {
  switch (type.toLowerCase()) {
    case "hr":
      return <Rocket size={24} className="text-cyan-400" />;
    default:
      return <Sparkles size={24} className="text-teal-400" />;
  }
};

const discountAmount = 20.00;

// --- New Shimmer Card Component for Cart Items ---
const CartShimmerCard = ({ glassmorphism, innerGlass }: { glassmorphism: string, innerGlass: string }) => {
  const shimmer = "animate-pulse bg-neutral-800/50 rounded-lg";
  
  return (
    <div className={cn("p-6", glassmorphism)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${innerGlass}`}>
            <div className={cn("w-6 h-6", shimmer)} />
          </div>
          <div>
            <div className={cn("w-64 h-5 mb-1", shimmer)} />
            <div className={cn("w-96 h-3", shimmer)} />
          </div>
        </div>
        <div className={cn("w-16 h-5", shimmer)} />
      </div>
      <div className="mt-4">
        <div className={cn("w-32 h-4 mb-3", shimmer)} />
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 text-sm">
              <div className={cn("w-40 h-3", shimmer)} />
              <div className={cn("w-12 h-3", shimmer)} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function StacksCartPage() {
  const [cartStacks, setCartStacks] = useState<Stack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [removingSubId, setRemovingSubId] = useState<string | null>(null);
  const [removingStackId, setRemovingStackId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const glassmorphism = "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10";
  const innerGlass = "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10";
  
  useEffect(() => {
    async function loadCartStacks() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setCartStacks([]);
          setIsLoading(false);
          setUserId(null);
          return;
        }

        setUserId(user.id);
        const cartData = await getCartStacks(user.id);
        
        const transformedStacks: Stack[] = cartData.map((item) => ({
          cart_id: item.cart_id,
          id: item.stack_id,
          name: item.name || 'Unknown Stack',
          type: item.type || 'General',
          description: item.description || null,
          base_price: item.base_price || 0,
          active: item.active || false,
          sub_stacks: item.sub_stacks.map((sub) => ({
            id: sub.id,
            name: sub.name,
            price: sub.price,
          })),
          total_price: item.total_price,
        }));

        setCartStacks(transformedStacks);
      } catch (error) {
        setErrorMessage("Unable to load your cart right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    loadCartStacks();
  }, []);

  const handleClearCart = async () => {
    if (!userId || cartStacks.length === 0) return;
    try {
      setIsClearing(true);
      const supabase = createClient();
      const { error } = await supabase.from("cart_stacks").delete().eq("user_id", userId);
      if (error) throw error;
      setCartStacks([]);
    } catch (error) {
      setErrorMessage("Could not clear your cart.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleRemoveSubstack = async (cartId: string, subId: string) => {
    if (!userId) return;
    const targetStack = cartStacks.find((stack) => stack.cart_id === cartId);
    if (!targetStack) return;
    try {
      setRemovingSubId(`${cartId}-${subId}`);
      const updatedSubStacks = targetStack.sub_stacks.filter((sub) => sub.id !== subId);
      const updatedSubIds = updatedSubStacks.map((sub) => sub.id);
      const updatedTotal = targetStack.base_price + updatedSubStacks.reduce((sum, sub) => sum + sub.price, 0);
      const supabase = createClient();
      const { error } = await supabase.from("cart_stacks").update({ sub_stack_ids: updatedSubIds, total_price: updatedTotal }).eq("id", cartId).eq("user_id", userId);
      if (error) throw error;
      setCartStacks((prev) => prev.map((stack) => stack.cart_id === cartId ? { ...stack, sub_stacks: updatedSubStacks, total_price: updatedTotal } : stack));
    } catch (error) {
      setErrorMessage("Could not update modules.");
    } finally {
      setRemovingSubId(null);
    }
  };

  const handleRemoveStack = async (cartId: string) => {
    if (!userId) return;
    try {
      setRemovingStackId(cartId);
      const supabase = createClient();
      const { error } = await supabase.from("cart_stacks").delete().eq("id", cartId).eq("user_id", userId);
      if (error) throw error;
      setCartStacks((prev) => prev.filter((stack) => stack.cart_id !== cartId));
    } catch (error) {
      setErrorMessage("Could not remove stack.");
    } finally {
      setRemovingStackId(null);
    }
  };

  const handleCreateOrder = async () => {
    if (!userId || cartStacks.length === 0) return;
    try {
      setIsCreatingOrder(true);
      const result = await createOrderFromCart(userId, discountAmount);
      if (!result.success) {
        setErrorMessage(result.error || "Unable to complete checkout.");
        return;
      }
      setCartStacks([]);
      alert("✅ Order placed successfully!");
    } catch (error) {
      setErrorMessage("Something went wrong.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const calculateTotal = (stacks: Stack[]) => {
    return stacks.reduce((sum, stack) => {
      const subTotal = stack.sub_stacks?.reduce((s, sub) => s + sub.price, 0) ?? 0;
      return sum + stack.base_price + subTotal;
    }, 0);
  };
  
  const subtotalCost = calculateTotal(cartStacks);
  const finalTotalCost = subtotalCost - discountAmount;

  // Loading and Main Content wrapped in a div with overflow-x-hidden and min-h-screen to prevent white bar
  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen w-full bg-neutral-950 overflow-x-hidden">
      <div className="min-h-screen w-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 lg:p-10">
        {children}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <PageWrapper>
        <header className="max-w-7xl mx-auto flex items-center justify-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent text-center">
            Your Stacks Cart
          </h1>
        </header>
        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <CartShimmerCard glassmorphism={glassmorphism} innerGlass={innerGlass} />
          </div>
          <aside className={cn("p-6 sticky top-10 h-fit animate-pulse", glassmorphism)}>
            <div className="w-40 h-7 mb-4 bg-neutral-800/50 rounded-lg" />
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between"><div className="w-1/3 h-4 bg-neutral-800/50 rounded-lg" /><div className="w-1/4 h-4 bg-neutral-800/50 rounded-lg" /></div>
              <div className="flex justify-between font-bold text-white text-base border-t border-white/10 pt-3"><div className="w-1/2 h-5 bg-neutral-800/50 rounded-lg" /><div className="w-1/4 h-5 bg-neutral-800/50 rounded-lg" /></div>
            </div>
            <div className="w-full h-12 rounded-full bg-neutral-800/50" />
          </aside>
        </main>
      </PageWrapper>
    );
  }

  if (cartStacks.length === 0) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
          <Rocket className="text-cyan-400 mb-6" size={48} />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">You haven’t added any stacks yet</h2>
          <Link href="/product_stacks" className="px-6 py-3 rounded-full font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-teal-500 hover:scale-105 transition-all duration-300 shadow-lg">
            Explore Stacks
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <header className="max-w-7xl mx-auto flex items-center justify-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent text-center">
          Your Stacks Cart
        </h1>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl text-sm">{errorMessage}</div>
          )}
          {cartStacks.map((stack) => (
            <div key={stack.cart_id} className={cn("p-6", glassmorphism)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${innerGlass}`}>{getIconForStack(stack.type)}</div>
                  <div>
                    <h2 className="text-xl font-bold">{stack.name}</h2>
                    <p className="text-neutral-400 text-sm">{stack.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-teal-400">₹{stack.total_price.toFixed(2)}</span>
                  {removingStackId === stack.cart_id ? <Loader2 size={18} className="animate-spin text-neutral-500" /> : (
                    <button onClick={() => handleRemoveStack(stack.cart_id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"><Trash2 size={18} /></button>
                  )}
                </div>
              </div>

              {stack.sub_stacks?.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stack.sub_stacks.map((sub) => (
                    <div key={sub.id} className={cn("flex justify-between items-center p-3 rounded-xl border", removingSubId === `${stack.cart_id}-${sub.id}` ? "opacity-50" : "bg-gradient-to-r from-cyan-400/20 to-teal-400/20 border-cyan-400/40")}>
                      <span className="text-sm">{sub.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">₹{sub.price.toFixed(2)}</span>
                        <button onClick={() => handleRemoveSubstack(stack.cart_id, sub.id)} className="text-red-400"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <aside className={cn("p-6 sticky top-10 h-fit", glassmorphism)}>
          <h3 className="text-2xl font-bold mb-4">Pricing Summary</h3>
          <div className="space-y-2 text-sm text-neutral-400 mb-6">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotalCost.toFixed(2)}</span></div>
            <div className="flex justify-between text-green-400"><span>Discount</span><span>-₹{discountAmount.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-white text-base border-t border-white/10 pt-3"><span>Total</span><span>₹{finalTotalCost.toFixed(2)}</span></div>
          </div>
          <button onClick={handleCreateOrder} disabled={isCreatingOrder} className="w-full py-3 rounded-full font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-teal-600 flex items-center justify-center gap-2">
            {isCreatingOrder ? <Loader2 size={16} className="animate-spin" /> : <>Proceed to Payment <ArrowRight size={16} /></>}
          </button>
        </aside>
      </main>
    </PageWrapper>
  );
}