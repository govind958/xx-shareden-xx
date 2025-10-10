"use client";

import React, { useEffect, useState } from "react";
import { Clock, Rocket, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

interface StackProgress {
  id: string;
  name: string;
  type: string;
  description: string;
  progress: number;
  status: "Not Started" | "In Progress" | "Under Review" | "Done";
  eta: string;
}

const getIconForStack = (type: string) => {
  switch (type.toLowerCase()) {
    case "hr":
      return <Rocket size={22} className="text-cyan-400" />;
    default:
      return <Sparkles size={22} className="text-teal-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Not Started":
      return "bg-neutral-700 text-neutral-300";
    case "In Progress":
      return "bg-cyan-500/20 text-cyan-300";
    case "Under Review":
      return "bg-amber-500/20 text-amber-300";
    case "Done":
      return "bg-green-500/20 text-green-300";
    default:
      return "bg-neutral-700 text-neutral-300";
  }
};

const mockStackProgress: StackProgress[] = [
  {
    id: "hr-stack-01",
    name: "HR & Talent Acquisition Stack",
    type: "HR",
    description: "Automating your hiring and onboarding workflows.",
    progress: 65,
    status: "In Progress",
    eta: "Expected by Oct 18, 2025",
  },
  {
    id: "growth-stack-02",
    name: "Growth & Marketing Stack",
    type: "Marketing",
    description: "Running initial growth campaigns and analytics setup.",
    progress: 40,
    status: "Under Review",
    eta: "Expected by Oct 15, 2025",
  },
  {
    id: "ops-stack-03",
    name: "Operations Automation Stack",
    type: "Operations",
    description: "Building task automations and workflow sync.",
    progress: 100,
    status: "Done",
    eta: "Completed Oct 5, 2025",
  },
];

// --- New Shimmer Component ---
const ShimmerCard = ({ glass }: { glass: string }) => {
  // Shimmer effect classes
  const shimmer = "animate-pulse bg-neutral-800/50 rounded-lg";

  return (
    <div className={cn("p-6", glass)}>
      <div className="flex items-start justify-between mb-4">
        {/* Icon and Text Placeholder */}
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl", shimmer)} />
          <div>
            <div className={cn("w-48 h-5 mb-1", shimmer)} />
            <div className={cn("w-64 h-3", shimmer)} />
          </div>
        </div>
        {/* Status Placeholder */}
        <div className={cn("w-20 h-5 rounded-full", shimmer)} />
      </div>

      {/* Progress Bar Placeholder */}
      <div className="w-full bg-white/10 rounded-full h-3 mt-4 mb-2">
        <div className={cn("w-2/3 h-3 rounded-full", shimmer)}></div>
      </div>
      <div className={cn("w-40 h-3 mb-4", shimmer)} />

      {/* Action buttons Placeholder */}
      <div className="flex justify-between items-center">
        <div className={cn("w-32 h-5", shimmer)} />
        <div className={cn("w-28 h-8 rounded-full", shimmer)} />
      </div>
    </div>
  );
};
// --- End New Shimmer Component ---


export default function StackBoardPage() {
  const [stacks, setStacks] = useState<StackProgress[]>([]);
  // New state for loading
  const [isLoading, setIsLoading] = useState(true);

  const glass = "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10";
  const inner = "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10";

  useEffect(() => {
    // Simulate a network delay for the shimmer effect
    const timer = setTimeout(() => {
      setStacks(mockStackProgress);
      setIsLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  // Show shimmer effect while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 lg:p-10">
        <header className="max-w-7xl mx-auto flex items-center justify-center mb-10">
            {/* The Back to Dashboard button is removed, and w-full is used to center the title */}
            <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent text-center">
            StackBoard
            </h1>
        </header>
        
        {/* Shimmer loading content */}
        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Render Shimmer Cards */}
            <ShimmerCard glass={glass} />
            <ShimmerCard glass={glass} />
            <ShimmerCard glass={glass} />
        </main>

        <footer className="max-w-7xl mx-auto text-center py-10 text-neutral-500 text-sm border-t border-white/10 mt-10">
            Loading your stacks...
        </footer>
      </div>
    )
  }

  // Display "No active stacks" message only if not loading AND stacks are empty
  if (!isLoading && stacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <Rocket className="text-cyan-400 mb-6" size={48} />
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          No active stacks yet
        </h2>
        <p className="text-neutral-500 mb-6">
          Once you purchase a stack, progress tracking will appear here.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 lg:p-10">
      {/* Header - "Back to Dashboard" removed, title centered */}
      <header className="max-w-7xl mx-auto flex items-center justify-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent text-center">
          StackBoard
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {stacks.map((stack) => (
          <div key={stack.id} className={cn("p-6", glass)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${inner}`}>{getIconForStack(stack.type)}</div>
                <div>
                  <h2 className="text-xl font-bold">{stack.name}</h2>
                  <p className="text-neutral-400 text-sm">{stack.description}</p>
                </div>
              </div>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  getStatusColor(stack.status)
                )}
              >
                {stack.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-3 mt-4 mb-2">
              <div
                className={cn(
                  "h-3 rounded-full transition-all duration-700",
                  stack.status === "Done"
                    ? "bg-green-400"
                    : stack.status === "Under Review"
                    ? "bg-amber-400"
                    : "bg-cyan-400"
                )}
                style={{ width: `${stack.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              {stack.progress}% complete — {stack.eta}
            </p>

            {/* Action buttons */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-neutral-400 text-sm">
                <Clock size={14} /> Updated just now
              </div>
              <button className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-400 to-teal-500 text-neutral-950 flex items-center gap-2 hover:scale-105 transition-all duration-300">
                <MessageCircle size={14} /> Ask Expert
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto text-center py-10 text-neutral-500 text-sm border-t border-white/10 mt-10">
        Tracking 3 stacks in progress — growing faster every week 🚀
      </footer>
    </div>
  );
}