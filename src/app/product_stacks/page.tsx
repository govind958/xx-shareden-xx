"use client";

import React, { useEffect, useState } from "react";
import { Database, Sparkles, Users, Rocket, CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

// Types
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

interface HrSubStack {
  id: string;
  name: string;
  price: number;
}

// Utility: dynamic icons
const getIconForStack = (type: string) => {
  switch (type.toLowerCase()) {
    case "hr":
      return <Users size={28} className="text-cyan-400" />;
    default:
      return <Sparkles size={28} className="text-teal-400" />;
  }
};

// Dummy HR Sub Stacks
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

// Dummy Stacks
const stacksData: Stack[] = [
  {
    id: "hr-stack-01",
    name: "HR & Talent Acquisition Stack",
    type: "HR",
    description:
      "Streamline your hiring process and build a thriving team with our all-in-one HR solution. Includes custom features designed to save you time and money.",
    base_price: 180,
    active: true,
    image_id: "img-hr-01",
    owner_id: "usr-41b2c",
    special: true,
    hrSubStacks: hrSubStacksData,
  },
];

export default function StacksGrid() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubStacks, setSelectedSubStacks] = useState<{ [key: string]: boolean }>({});

  const glassmorphismCard =
    "bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 transition-all duration-500 ease-out";
  const innerGlassmorphism =
    "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10";

  useEffect(() => {
    const fetchStacks = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate loading
      setStacks(stacksData);
      setIsLoading(false);
    };

    fetchStacks();
  }, []);

  const calculateTotalPrice = (stack: Stack) => {
    let total = stack.base_price;
    if (stack.hrSubStacks) {
      const selectedPrices = stack.hrSubStacks
        .filter((sub) => selectedSubStacks[sub.id])
        .reduce((sum, sub) => sum + sub.price, 0);
      total += selectedPrices;
    }
    return total;
  };

  const handleSubStackToggle = (subStackId: string) => {
    setSelectedSubStacks((prev) => ({
      ...prev,
      [subStackId]: !prev[subStackId],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="w-20 h-20 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-mono tracking-wide text-neutral-300">
          Activating the stack matrix...
        </h3>
        <p className="text-neutral-500 mt-2 text-sm">
          Connecting to the Shareden network.
        </p>
      </div>
    );
  }

  return (
    <main className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 md:p-10">
      {stacks.map((stack) => (
        <div
          key={stack.id}
          className={cn(
            "relative p-8 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl",
            glassmorphismCard,
            stack.special ? "ring-2 ring-cyan-500/50" : ""
          )}
        >
          {stack.special && (
            <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-cyan-500 text-neutral-950 text-xs font-bold uppercase shadow-xl">
              <div className="flex items-center gap-1">
                <Rocket size={14} />
                Featured Stack
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className={`p-4 rounded-xl ${innerGlassmorphism}`}>
              {getIconForStack(stack.type || "")}
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase text-neutral-400">
              {stack.type || "General"}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {stack.name}
          </h3>
          <p className="text-neutral-400 text-sm flex-grow mb-6">
            {stack.description}
          </p>

          {stack.hrSubStacks && (
            <div className="p-4 mb-6 rounded-lg bg-neutral-800/20">
              <h4 className="text-sm font-semibold text-neutral-300 mb-2">
                Select your needs:
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-2">
                {stack.hrSubStacks.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => handleSubStackToggle(sub.id)}
                    className={cn(
                      "cursor-pointer p-3 text-xs font-medium border rounded-lg hover:border-cyan-500 transition-colors",
                      "flex items-center justify-between",
                      selectedSubStacks[sub.id]
                        ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-cyan-500 text-white"
                        : "bg-transparent border-neutral-700 text-neutral-400"
                    )}
                  >
                    <span className="truncate">
                      {sub.name}{" "}
                      <span className="text-neutral-500 ml-1">
                        (${sub.price})
                      </span>
                    </span>
                    {selectedSubStacks[sub.id] && (
                      <CheckCircle
                        size={16}
                        className="text-cyan-400 flex-shrink-0 ml-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left flex-grow">
              <span className="text-sm font-medium text-neutral-400">
                Starting at
              </span>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Database size={20} className="text-neutral-500" />
                <span className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                  ${calculateTotalPrice(stack)}
                </span>
                <span className="text-sm text-neutral-500">/mo</span>
              </div>
            </div>
            <a
              href="#"
              className="px-6 py-3 text-sm font-bold text-neutral-950 text-center rounded-full shadow-lg w-full sm:w-auto transition-all duration-300 flex items-center justify-center gap-2
                  bg-gradient-to-r from-cyan-400 to-teal-600 hover:from-cyan-500 hover:to-teal-700 hover:scale-105"
            >
              Subscribe
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      ))}
    </main>
  );
}
