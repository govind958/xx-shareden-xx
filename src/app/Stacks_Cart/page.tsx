"use client";

import React, { useEffect, useState } from "react";
import {  ArrowRight, Rocket, CheckCircle, Sparkles, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { getCartStacks, createOrderFromCart } from "./actions";

// Mock implementation of cn (for production, this would be imported from a utility file)
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

const discountAmount = 20.00; // Fixed discount

// --- New Shimmer Card Component for Cart Items ---
const CartShimmerCard = ({ glassmorphism, innerGlass }: { glassmorphism: string, innerGlass: string }) => {
  const shimmer = "animate-pulse bg-neutral-800/50 rounded-lg";
  
  return (
    <div className={cn("p-6", glassmorphism)}>
      <div className="flex items-start justify-between mb-4">
        {/* Icon and Text Placeholder */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${innerGlass}`}>
            <div className={cn("w-6 h-6", shimmer)} /> {/* Icon Placeholder */}
          </div>
          <div>
            <div className={cn("w-64 h-5 mb-1", shimmer)} />
            <div className={cn("w-96 h-3", shimmer)} />
          </div>
        </div>
        {/* Price Placeholder */}
        <div className={cn("w-16 h-5", shimmer)} />
      </div>

      {/* Modules Placeholder */}
      <div className="mt-4">
        <div className={cn("w-32 h-4 mb-3", shimmer)} />
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 text-sm"
            >
              <div className={cn("w-40 h-3", shimmer)} />
              <div className={cn("w-12 h-3", shimmer)} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
// --- End Shimmer Card Component ---


// --- Stacks Cart Page Component ---
export default function StacksCartPage() {
  const [cartStacks, setCartStacks] = useState<Stack[]>([]);
  const [isLoading, setIsLoading] = useState(true); // New loading state
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
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('Error getting user:', authError);
          setCartStacks([]);
          setIsLoading(false);
          setUserId(null);
          return;
        }

        setUserId(user.id);

        // Fetch cart stacks from database
        const cartData = await getCartStacks(user.id);
        
        // Transform FinalCartItem[] to Stack[] format
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
        console.error('Error loading cart stacks:', error);
        setCartStacks([]);
        setErrorMessage("Unable to load your cart right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCartStacks();
  }, []); // Reloads when component mounts/remounts (via key prop from parent)

  const handleClearCart = async () => {
    if (!userId || cartStacks.length === 0) return;

    try {
      setIsClearing(true);
      setErrorMessage(null);
      const supabase = createClient();
      const { error } = await supabase.from("cart_stacks").delete().eq("user_id", userId);

      if (error) {
        throw error;
      }

      setCartStacks([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      setErrorMessage("Could not clear your cart. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleRemoveSubstack = async (cartId: string, subId: string) => {
    if (!userId) return;

    const targetStack = cartStacks.find((stack) => stack.cart_id === cartId);
    if (!targetStack) return;

    const containsSub = targetStack.sub_stacks.some((sub) => sub.id === subId);
    if (!containsSub) return;

    try {
      setRemovingSubId(`${cartId}-${subId}`);
      setErrorMessage(null);

      const updatedSubStacks = targetStack.sub_stacks.filter((sub) => sub.id !== subId);
      const updatedSubIds = updatedSubStacks.map((sub) => sub.id);
      const updatedTotal =
        targetStack.base_price +
        updatedSubStacks.reduce((sum, sub) => sum + sub.price, 0);

      const supabase = createClient();
      const { error } = await supabase
        .from("cart_stacks")
        .update({
          sub_stack_ids: updatedSubIds,
          total_price: updatedTotal,
        })
        .eq("id", cartId)
        .eq("user_id", userId);

      if (error) throw error;

      setCartStacks((prev) =>
        prev.map((stack) =>
          stack.cart_id === cartId
            ? { ...stack, sub_stacks: updatedSubStacks, total_price: updatedTotal }
            : stack
        )
      );
    } catch (error) {
      console.error("Error removing module:", error);
      setErrorMessage("Could not update your modules. Please try again.");
    } finally {
      setRemovingSubId(null);
    }
  };

  const handleRemoveStack = async (cartId: string) => {
    if (!userId) return;

    try {
      setRemovingStackId(cartId);
      setErrorMessage(null);

      const supabase = createClient();
      const { error } = await supabase
        .from("cart_stacks")
        .delete()
        .eq("id", cartId)
        .eq("user_id", userId);

      if (error) throw error;

      setCartStacks((prev) => prev.filter((stack) => stack.cart_id !== cartId));
    } catch (error) {
      console.error("Error removing stack:", error);
      setErrorMessage("Could not remove stack from cart. Please try again.");
    } finally {
      setRemovingStackId(null);
    }
  };

  const handleCreateOrder = async () => {
    if (!userId || cartStacks.length === 0) return;

    try {
      setIsCreatingOrder(true);
      setErrorMessage(null);

      const result = await createOrderFromCart(userId, discountAmount);

      if (!result.success) {
        setErrorMessage(result.error || "Unable to complete checkout. Please try again.");
        return;
      }

      setCartStacks([]);
      alert("✅ Order placed successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      setErrorMessage("Something went wrong while creating the order. Please try again.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Calculation function (now correctly defined inside the component)
  const calculateTotal = (stacks: Stack[]) => {
    return stacks.reduce((sum, stack) => {
      const subTotal =
        stack.sub_stacks?.reduce((s, sub) => s + sub.price, 0) ?? 0;
      return sum + stack.base_price + subTotal;
    }, 0);
  };
  
  // Calculate costs only when data is loaded
  const subtotalCost = calculateTotal(cartStacks);
  const finalTotalCost = subtotalCost - discountAmount;


  // --- Shimmer Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 lg:p-10">
        {/* Header - Back button removed, title centered */}
        <header className="max-w-7xl mx-auto flex items-center justify-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent text-center">
            Your Stacks Cart
          </h1>
        </header>

        {/* Main Content Grid with Shimmer */}
        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Shimmer list */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <CartShimmerCard glassmorphism={glassmorphism} innerGlass={innerGlass} />
          </div>

          {/* Right: Pricing summary Shimmer */}
          <aside className={cn("p-6 sticky top-10 h-fit animate-pulse", glassmorphism)}>
            <div className={cn("w-40 h-7 mb-4 bg-neutral-800/50 rounded-lg")} /> {/* Title */}
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <div className={cn("w-1/3 h-4 bg-neutral-800/50 rounded-lg")} />
                <div className={cn("w-1/4 h-4 bg-neutral-800/50 rounded-lg")} />
              </div>
              <div className="flex justify-between">
                <div className={cn("w-1/4 h-4 bg-neutral-800/50 rounded-lg")} />
                <div className={cn("w-1/5 h-4 bg-neutral-800/50 rounded-lg")} />
              </div>
              <div className="flex justify-between font-bold text-white text-base border-t border-white/10 pt-3">
                <div className={cn("w-1/2 h-5 bg-neutral-800/50 rounded-lg")} />
                <div className={cn("w-1/4 h-5 bg-neutral-800/50 rounded-lg")} />
              </div>
            </div>
            <div className={cn("w-full h-12 rounded-full bg-neutral-800/50")} /> {/* Button */}
          </aside>
        </main>

        <footer className="max-w-7xl mx-auto text-center py-10 text-neutral-500 text-sm border-t border-white/10 mt-10">
            Loading your cart items...
        </footer>
      </div>
    );
  }


  // --- Empty Cart State (after loading) ---
  if (!isLoading && cartStacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <Rocket className="text-cyan-400 mb-6" size={48} />
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          You haven’t added any stacks yet
        </h2>
        <p className="text-neutral-500 mb-6">
          Explore powerful startup stacks built for founders like you.
        </p>
        <Link
          href="/product_stacks"
          className="px-6 py-3 rounded-full font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-teal-500 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Explore Stacks
        </Link>
      </div>
    );
  }

  // --- Cart With Items State ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 lg:p-10">
      {/* Header - Back to Stacks removed, title centered */}
      <header className="max-w-7xl mx-auto flex items-center justify-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent text-center">
          Your Stacks Cart
        </h1>
      </header>
      
      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Stack list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl text-sm">
              {errorMessage}
            </div>
          )}
          {cartStacks.map((stack) => {
            const isRemovingStack = removingStackId === stack.cart_id;
            return (
              <div key={stack.cart_id} className={cn("p-6", glassmorphism)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${innerGlass}`}>
                      {getIconForStack(stack.type)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{stack.name}</h2>
                      <p className="text-neutral-400 text-sm">
                        {stack.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-teal-400">
                      ₹{stack.total_price.toFixed(2)}
                    </span>
                    {isRemovingStack ? (
                      <Loader2 size={18} className="animate-spin text-neutral-500" />
                    ) : (
                      <button
                        onClick={() => handleRemoveStack(stack.cart_id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 flex items-center justify-center"
                        title="Remove stack"
                        type="button"
                      >
                        <Trash2 size={18} className="flex-shrink-0" />
                      </button>
                    )}
                  </div>
                </div>

              {stack.sub_stacks && stack.sub_stacks.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-neutral-300 mb-2">
                    Selected Modules
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stack.sub_stacks.map((sub) => {
                      const pending = removingSubId === `${stack.cart_id}-${sub.id}`;
                      return (
                        <div
                          key={sub.id}
                          className={cn(
                            "flex justify-between items-center gap-2 w-full p-3 rounded-xl border transition-all duration-200",
                            pending
                              ? "border-white/10 bg-white/5 text-neutral-500"
                              : "bg-gradient-to-r from-cyan-400/20 to-teal-400/20 border-cyan-400/40"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              size={16}
                              className={cn(
                                "transition-colors",
                                pending ? "text-neutral-500" : "text-cyan-400"
                              )}
                            />
                            <span className="text-sm">{sub.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-teal-200">
                              ₹{sub.price.toFixed(2)}
                            </span>
                            {pending ? (
                              <Loader2 size={16} className="animate-spin text-neutral-500" />
                            ) : (
                              <button
                                onClick={() => handleRemoveSubstack(stack.cart_id, sub.id)}
                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 flex items-center justify-center"
                                title="Remove module"
                                type="button"
                              >
                                <Trash2 size={16} className="flex-shrink-0" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-between items-center border-t border-white/10 pt-4">
                <span className="text-neutral-400 text-sm">Updated Total:</span>
                <span className="text-xl font-bold text-cyan-400">
                  ₹{stack.total_price.toFixed(2)}
                </span>
              </div>
              </div>
            );
          })}
        </div>

        {/* Right: Pricing summary */}
        <aside className={cn("p-6 sticky top-10 h-fit", glassmorphism)}>
          <h3 className="text-2xl font-bold mb-4">Pricing Summary</h3>
          <div className="space-y-2 text-sm text-neutral-400 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-400">-₹{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-white text-base border-t border-white/10 pt-3">
              <span>Total Monthly Cost</span>
              <span>₹{finalTotalCost.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 mb-4">
            Save ~20 hrs/month with automated workflows 🚀
          </p>

          <button
            onClick={handleClearCart}
            disabled={isClearing || cartStacks.length === 0}
            className={cn(
              "w-full py-3 mb-3 rounded-full font-semibold border border-white/20 transition-all duration-300",
              isClearing || cartStacks.length === 0
                ? "text-neutral-500 bg-transparent cursor-not-allowed"
                : "text-white bg-transparent hover:bg-white/10"
            )}
          >
            {isClearing ? "Clearing..." : "Clear Cart"}
          </button>

          <button
            onClick={handleCreateOrder}
            disabled={isCreatingOrder || cartStacks.length === 0}
            className={cn(
              "w-full py-3 rounded-full font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-teal-600 flex items-center justify-center gap-2 shadow-lg transition-all duration-300",
              isCreatingOrder || cartStacks.length === 0
                ? "opacity-60 cursor-not-allowed"
                : "hover:from-cyan-500 hover:to-teal-700 hover:scale-105"
            )}
          >
            {isCreatingOrder ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating Order...
              </>
            ) : (
              <>
                Proceed to Payment <ArrowRight size={16} />
              </>
            )}
          </button>
        </aside>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto text-center py-10 text-neutral-500 text-sm border-t border-white/10 mt-10">
        Trusted by 120+ founders worldwide 🚀
      </footer>
    </div>
  );
}