"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Database,
  Sparkles,
  Users,
  Rocket,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react";
// FIX: Replacing 'next/link' with a standard 'a' tag (anchor) to avoid dependency resolution errors 
// in environments that do not support Next.js routing, while maintaining the href logic.

// Mock implementation of cn (classnames utility) since the actual one is external
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

// --- Design Constants ---
const glassmorphismCard =
  "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 transition-all duration-500 ease-out";
const innerGlassmorphism =
  "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10";

// --- Utility: dynamic icons ---
const getIconForStack = (type: string) => {
  switch (type.toLowerCase()) {
    case "hr":
      return <Users size={28} className="text-cyan-400" />;
    default:
      return <Sparkles size={28} className="text-teal-400" />;
  }
};

// --- Dummy HR Sub Stacks ---
const hrSubStacksData: HrSubStack[] = [
  { id: "jd-budget", name: "Write JD & Budget", price: 10 },
  { id: "post-source", name: "Post & Source Candidates", price: 15 },
  { id: "screen-resumes", name: "Screen Resumes & Calls", price: 10 },
  { id: "interviews", name: "Run Interviews", price: 20 },
  { id: "evaluate", name: "Evaluate with Scorecards", price: 10 },
  { id: "make-offer", name: "Make Offer & Negotiate", price: 15 },
  { id: "onboard", name: "Onboard with 30-60-90 plan", price: 25 },
  { id: "performance", name: "Manage Performance & Growth", price: 15 },
  { id: "engage-retain", name: "Engage & Retain", price: 10 },
  { id: "smooth-exits", name: "Handle Smooth Exits", price: 5 },
  { id: "learn-improve", name: "Learn & Improve", price: 10 },
];

// --- Dummy Stacks ---
const stacksData: Stack[] = [
  {
    id: "hr-stack-01",
    name: "HR & Talent Acquisition Stack",
    type: "HR",
    description:
      "Scale your team faster with hiring pipelines, onboarding, and retention strategies—optimized for founders who move fast.",
    base_price: 180,
    active: true,
    image_id: "img-hr-01",
    owner_id: "usr-41b2c",
    special: true,
    hrSubStacks: hrSubStacksData,
  },
  // Adding a second mock stack to demonstrate the grid layout and shimmer better
  {
    id: "growth-stack-02",
    name: "Growth & Marketing Stack",
    type: "Marketing",
    description:
      "Automate lead generation, run personalized campaigns, and track funnel performance without a dedicated marketing team.",
    base_price: 150,
    active: true,
    image_id: "img-growth-02",
    owner_id: "usr-41b2c",
  },
  {
    id: "ops-stack-03",
    name: "Operations Automation Stack",
    type: "Ops",
    description:
      "Sync tools, automate reporting, and build custom internal workflows to eliminate administrative overhead.",
    base_price: 120,
    active: true,
    image_id: "img-ops-03",
    owner_id: "usr-41b2c",
  },
];

// 🚀 Irresistible Founder Offer Configuration
const founderOffer = {
  stackId: "hr-stack-01",
  salePrice: 99,
  valueAdd: "First 3 Sub-Stacks FREE",
  freeSubStackCount: 3,
  expiresInDays: 7,
};
// ----------------------------------------------------


// --- New Shimmer Card Component ---
const StackShimmerCard = ({ glassmorphism, innerGlassmorphism }: { glassmorphism: string, innerGlassmorphism: string }) => {
  const shimmer = "animate-pulse bg-neutral-800/50 rounded-lg";
  
  return (
    <div className={cn("relative p-8 h-[480px] flex flex-col", glassmorphism)}>
      {/* Header Placeholder */}
      <div className="flex items-center justify-between mb-4 mt-8">
        <div className={`p-3 rounded-xl ${innerGlassmorphism}`}>
          <div className={cn("w-7 h-7", shimmer)} />
        </div>
        <div className={cn("w-16 h-4", shimmer)} />
      </div>

      {/* Title & Description Placeholder */}
      <div className={cn("w-3/4 h-8 mb-2", shimmer)} />
      <div className={cn("w-full h-3", shimmer)} />
      <div className={cn("w-5/6 h-3 mb-6", shimmer)} />

      {/* Sub Stacks Selection Placeholder */}
      <div className="p-4 mb-6 rounded-lg bg-neutral-800/20">
        <div className={cn("w-1/2 h-4 mb-3", shimmer)} />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("h-8", shimmer)} />
          ))}
        </div>
      </div>

      {/* Price & CTA Placeholder */}
      <div className="mt-auto pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <div className="flex-grow">
          <div className={cn("w-20 h-4 mb-1", shimmer)} />
          <div className={cn("w-32 h-6", shimmer)} />
        </div>
        <div className={cn("w-full sm:w-36 h-12 rounded-full", shimmer)} />
      </div>
    </div>
  );
};
// --- End Shimmer Card Component ---


export default function StacksGrid() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubStacks, setSelectedSubStacks] = useState<{
    [key: string]: boolean;
  }>({});

  const glassmorphismCard =
    "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 transition-all duration-500 ease-out";
  const innerGlassmorphism =
    "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10";

  useEffect(() => {
    const fetchStacks = async () => {
      setIsLoading(true);
      // Simulate loading delay (1.2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1200)); 
      
      setStacks(stacksData);
      
      // Initialize all sub-stacks as selected by default for the first stack only
      const initialSelection: { [key: string]: boolean } = {};
      const targetStack = stacksData.find(s => s.id === founderOffer.stackId);
      if (targetStack && targetStack.hrSubStacks) {
          targetStack.hrSubStacks.forEach(sub => {
              // Initialize to selected
              initialSelection[sub.id] = true;
          });
      }
      setSelectedSubStacks(initialSelection);
      setIsLoading(false);
    };

    fetchStacks();
  }, []);

  // 💰 Calculation logic to apply the sale and free sub-stacks
  const calculateTotalPrice = (stack: Stack) => {
    let basePrice = stack.base_price;
    const isOfferActive = stack.id === founderOffer.stackId;

    // Apply base price sale if offer is active
    if (isOfferActive) {
      basePrice = founderOffer.salePrice;
    }

    let subStacksTotal = 0;
    if (stack.hrSubStacks) {
      // Filter for sub-stacks that belong to the current stack AND are globally selected
      const currentStackSelectedSubs = stack.hrSubStacks
          .filter(sub => selectedSubStacks[sub.id]);

      // Apply free sub-stacks if the offer is active
      const freeCount = isOfferActive ? founderOffer.freeSubStackCount : 0;
      
      // Get the sub-stacks that will be charged (skipping the first 'freeCount' selected ones)
      // Note: This assumes the sub-stacks are ordered by price/importance for the free offer
      const chargeableSubStacks = currentStackSelectedSubs.slice(freeCount);

      subStacksTotal = chargeableSubStacks
        .reduce((sum, sub) => sum + sub.price, 0);
    }
    
    return basePrice + subStacksTotal;
  };

  const handleSubStackToggle = (subStackId: string) => {
    setSelectedSubStacks((prev) => ({
      ...prev,
      [subStackId]: !prev[subStackId],
    }));
  };

  // Memoize the list of selected sub-stack IDs to pass to the cart URL
  const selectedSubStackIds = useMemo(() => {
    return Object.keys(selectedSubStacks).filter(id => selectedSubStacks[id]);
  }, [selectedSubStacks]);

  // Memoize the selected sub-stack count for the pricing display
  const selectedSubStackCount = useMemo(() => {
    return selectedSubStackIds.length;
  }, [selectedSubStackIds]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-white/10 px-4 sm:px-0">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-2 leading-tight">
            Choose Your Stack.
            <br className="hidden md:inline" /> Scale Without Limits.
          </h1>
          <p className="text-neutral-400 mt-4 text-lg max-w-2xl">
            Modular stacks built for startup founders. Pay as you grow, activate
            only what you need.
          </p>
        </div>
      </header>

      {/* Cards Grid */}
      <main className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 px-4 sm:px-0">
        
        {/* Shimmer Loading State */}
        {isLoading ? (
            <>
                <StackShimmerCard glassmorphism={glassmorphismCard} innerGlassmorphism={innerGlassmorphism} />
                <StackShimmerCard glassmorphism={glassmorphismCard} innerGlassmorphism={innerGlassmorphism} />
                <StackShimmerCard glassmorphism={glassmorphismCard} innerGlassmorphism={innerGlassmorphism} />
            </>
        ) : stacks.length === 0 ? (
          
          /* Empty State */
          <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
            <Rocket className="text-cyan-400 mb-6" size={48} />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              No active stacks found
            </h2>
            <p className="text-neutral-500 mb-6">
              Check back soon for new startup automation stacks!
            </p>
          </div>
          
        ) : (
          
          /* Data Loaded State */
          stacks.map((stack) => {
            const isOfferActive = stack.id === founderOffer.stackId;
            const freeCount = isOfferActive ? founderOffer.freeSubStackCount : 0;
            const isSubStackFree = (index: number) => index < freeCount;
            
            // Construct the URL string for the cart page including query params
            const cartUrl = `/stacks-cart-page?stackId=${stack.id}&subStacks=${selectedSubStackIds.join(',')}`;

            return (
              <div
                key={stack.id}
                className={cn(
                  "relative p-8 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl",
                  glassmorphismCard,
                  stack.special ? "ring-2 ring-cyan-500/60" : "",
                  isOfferActive && "ring-4 ring-orange-500/80 shadow-orange-500/20"
                )}
              >
                {/* Limited-Time Offer Banner */}
                {isOfferActive && (
                  <div className="absolute -top-4 -left-4 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold uppercase shadow-2xl flex items-center gap-2 transform rotate-[-3deg] z-10">
                    <Zap size={16} />
                    Irresistible Founder Offer!
                  </div>
                )}

                {/* Badge */}
                {stack.special && (
                  <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-cyan-500 text-neutral-950 text-xs font-bold uppercase shadow-xl flex items-center gap-1">
                    <Rocket size={14} />
                    Founder’s Choice
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-4 mt-8">
                  <div className={`p-3 rounded-xl ${innerGlassmorphism}`}>
                    {getIconForStack(stack.type || "")}
                  </div>
                  <span className="text-sm font-semibold tracking-wide uppercase text-neutral-400">
                    {stack.type || "General"}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {stack.name}
                </h3>
                <p className="text-neutral-400 text-sm mb-6">
                  {stack.description}
                </p>

                {/* Sub Stacks Selection */}
                {stack.hrSubStacks && (
                  <div className="p-4 mb-6 rounded-lg bg-neutral-800/20">
                    <h4 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center justify-between">
                      <span>Customize your stack:</span>
                      {isOfferActive && (
                          <span className="text-xs text-orange-400 font-bold">
                              {founderOffer.valueAdd}
                          </span>
                      )}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {stack.hrSubStacks.map((sub, index) => {
                          // The index is used to determine which selected sub-stacks are free
                          const isFree = isOfferActive && isSubStackFree(index);
                          const isSelected = selectedSubStacks[sub.id];

                          return (
                              <button
                                  key={sub.id}
                                  onClick={() => handleSubStackToggle(sub.id)}
                                  className={cn(
                                      "text-left cursor-pointer p-3 text-xs font-medium border rounded-lg transition-colors flex items-center justify-between",
                                      isSelected
                                          ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-cyan-500 text-white"
                                          : "bg-transparent border-neutral-700 text-neutral-400 hover:border-neutral-500",
                                      isFree && isSelected && "ring-2 ring-orange-500"
                                  )}
                              >
                                  <span className="truncate">
                                      {sub.name}{" "}
                                      <span className={cn("ml-1", isFree ? "line-through text-red-400/70" : "text-neutral-500")}>
                                        (${sub.price.toFixed(2)})
                                      </span>
                                      {isFree && isSelected && <span className="ml-1 text-orange-400 font-semibold">FREE</span>}
                                  </span>
                                  {isSelected && (
                                      <CheckCircle
                                          size={16}
                                          className="text-cyan-400 ml-2 flex-shrink-0"
                                      />
                                  )}
                              </button>
                          );
                      })}
                    </div>
                  </div>
                )}

                {/* Price & CTA */}
                <div className="mt-auto pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                  <div className="text-center sm:text-left flex-grow">
                    <span className="text-sm font-medium text-neutral-400">
                      {isOfferActive ? 'Limited-Time Price' : 'Starting at'}
                    </span>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Database size={20} className="text-neutral-500" />
                      {/* Display original price struck out for sale */}
                      {isOfferActive && (
                          <span className="text-2xl font-bold line-through text-neutral-600 mr-2">
                              ${stack.base_price.toFixed(2)}
                          </span>
                      )}
                      <span className={cn(
                          "text-4xl font-bold bg-clip-text text-transparent",
                          isOfferActive 
                              ? "bg-gradient-to-r from-orange-400 to-red-500"
                              : "bg-gradient-to-r from-teal-400 to-cyan-500"
                      )}>
                        ${calculateTotalPrice(stack).toFixed(2)}
                      </span>
                      <span className="text-sm text-neutral-500">/mo</span>
                    </div>
                    {isOfferActive && selectedSubStackCount > 0 && (
                        <p className="text-xs text-orange-400 mt-1">
                            (Includes {Math.min(selectedSubStackCount, freeCount)} FREE sub-stack{Math.min(selectedSubStackCount, freeCount) > 1 ? 's' : ''})
                        </p>
                    )}
                    <p className="text-xs text-neutral-500 mt-1">
                      Save ~20 hrs/month
                    </p>
                  </div>
                  
                  {/* 🌟 FIX: Using standard 'a' tag for navigation 🌟 */}
                  <a
                    href={cartUrl}
                    className="px-6 py-3 text-sm font-bold text-neutral-950 text-center rounded-full shadow-lg w-full sm:w-auto transition-all duration-300 flex items-center justify-center gap-2
                      bg-gradient-to-r from-cyan-400 to-teal-600 hover:from-cyan-500 hover:to-teal-700 hover:scale-105"
                  >
                    Activate Stack <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto text-center py-10 border-t border-white/10 text-neutral-500 text-sm px-4 sm:px-0">
        Trusted by 120+ founders worldwide 🚀
      </footer>
    </div>
  );
}