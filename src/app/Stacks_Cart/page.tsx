"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Rocket, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

// Mock implementation of cn (for production, this would be imported from a utility file)
const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Types ---
interface HrSubStack {
  id: string;
  name: string;
  price: number;
}

interface Stack {
  id: string;
  name: string;
  type: string;
  description: string;
  base_price: number;
  active: boolean;
  image_id: string;
  owner_id: string;
  special?: boolean;
  features?: string[];
  hrSubStacks?: HrSubStack[];
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

// --- Sample data (simulating fetched data) ---
const selectedStacks: Stack[] = [
  {
    id: "hr-stack-01",
    name: "HR & Talent Acquisition Stack",
    type: "HR",
    description:
      "Automate hiring, onboarding, and performance with full-cycle HR tools.",
    base_price: 99,
    active: true,
    image_id: "img-hr-01",
    owner_id: "usr-41b2c",
    hrSubStacks: [
      { id: "jd-budget", name: "Write JD & Budget", price: 10 },
      { id: "interviews", name: "Run Interviews", price: 20 },
      { id: "onboard", name: "Onboard with 30-60-90 plan", price: 25 },
    ],
  },
];

// --- Stacks Cart Page Component ---
export default function StacksCartPage() {
  const [cartStacks, setCartStacks] = useState<Stack[]>([]);

  const glassmorphism = "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10";
  const innerGlass = "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10";
  
  const discountAmount = 20.00; // Fixed discount

  useEffect(() => {
    // Simulate fetching selected stacks
    setCartStacks(selectedStacks);
  }, []);

  // Calculation function (now correctly defined inside the component)
  const calculateTotal = () => {
    return cartStacks.reduce((sum, stack) => {
      const subTotal =
        stack.hrSubStacks?.reduce((s, sub) => s + sub.price, 0) ?? 0;
      return sum + stack.base_price + subTotal;
    }, 0);
  };
  
  const subtotalCost = calculateTotal();
  const finalTotalCost = subtotalCost - discountAmount;

  // --- Empty Cart State ---
  if (cartStacks.length === 0) {
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
          href="/stacks"
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
      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-10">
        <Link
          href="/stacks"
          className="flex items-center gap-2 text-neutral-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft size={18} />
          Back to Stacks
        </Link>
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent text-center w-full">
          Your Stacks Cart
        </h1>
        <div className="w-[80px]" /> {/* Spacer */}
      </header>
      
      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Stack list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {cartStacks.map((stack) => (
            <div key={stack.id} className={cn("p-6", glassmorphism)}>
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
                <span className="text-lg font-semibold text-teal-400">
                  ${stack.base_price.toFixed(2)}
                </span>
              </div>

              {stack.hrSubStacks && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-neutral-300 mb-2">
                    Selected Modules
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {stack.hrSubStacks.map((sub) => (
                      <li
                        key={sub.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-cyan-400" />
                          {sub.name}
                        </div>
                        <span className="text-neutral-400">${sub.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Pricing summary */}
        <aside className={cn("p-6 sticky top-10 h-fit", glassmorphism)}>
          <h3 className="text-2xl font-bold mb-4">Pricing Summary</h3>
          <div className="space-y-2 text-sm text-neutral-400 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-white text-base border-t border-white/10 pt-3">
              <span>Total Monthly Cost</span>
              <span>${finalTotalCost.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs text-neutral-500 mb-4">
            Save ~20 hrs/month with automated workflows 🚀
          </p>

          <button
            className="w-full py-3 rounded-full font-bold text-neutral-950 bg-gradient-to-r from-cyan-400 to-teal-600 hover:from-cyan-500 hover:to-teal-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            Proceed to Payment <ArrowRight size={16} />
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