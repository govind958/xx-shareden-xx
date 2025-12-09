"use client";

import React, { useEffect, useState } from "react";
import { Clock, Rocket, Sparkles, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { getOrderItemsWithProgress, StackProgress } from "./action";

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

const getIconForStack = (type: string) => {
  switch (type.toLowerCase()) {
    case "hr":
      return <Rocket size={22} className="text-cyan-400" />;
    default:
      return <Sparkles size={22} className="text-teal-400" />;
  }
};

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === "not started" || statusLower === "initiated") {
    return "bg-neutral-700 text-neutral-300";
  }
  if (statusLower === "in progress" || statusLower === "in_progress") {
    return "bg-cyan-500/20 text-cyan-300";
  }
  if (statusLower === "under review" || statusLower === "under_review") {
    return "bg-amber-500/20 text-amber-300";
  }
  if (statusLower === "done" || statusLower === "completed") {
    return "bg-green-500/20 text-green-300";
  }
  return "bg-neutral-700 text-neutral-300";
};

// Helper function to format ETA date
const formatETA = (eta: string | null): string => {
  if (!eta) return "TBD";
  try {
    const date = new Date(eta);
    const now = new Date();
    const isPast = date < now;
    
    if (isPast && date.toDateString() === now.toDateString()) {
      return "Today";
    }
    
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  } catch {
    return eta;
  }
};

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric" 
    });
  } catch {
    return "recently";
  }
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const glass = "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10";
  const inner = "bg-white/5 backdrop-blur-sm rounded-xl border border-white/10";

  useEffect(() => {
    async function loadOrderItems() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const supabase = createClient();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('Error getting user:', authError);
          setStacks([]);
          setIsLoading(false);
          return;
        }

        // Fetch order items with progress
        const orderItemsData = await getOrderItemsWithProgress(user.id);
        setStacks(orderItemsData);
      } catch (error) {
        console.error('Error loading order items:', error);
        setStacks([]);
        setErrorMessage("Unable to load your stacks right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrderItems();
  }, []);

  // Show shimmer effect while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 lg:p-10">
        <header className="max-w-7xl mx-auto flex items-center justify-center mb-10">
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
          href="/private?tab=stacks"
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
      <main className="max-w-7xl mx-auto">
        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-2xl text-sm mb-6">
            {errorMessage}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {stacks.map((stack) => {
            const progressColor = 
              stack.progress === 100 
                ? "bg-green-400"
                : stack.statusDisplay === "Under Review"
                ? "bg-amber-400"
                : "bg-cyan-400";
            
            const etaText = stack.eta 
              ? `Expected by ${formatETA(stack.eta)}`
              : "ETA TBD";
            
            return (
              <div key={stack.order_item_id} className={cn("p-6", glass)}>
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
                      getStatusColor(stack.statusDisplay)
                    )}
                  >
                    {stack.statusDisplay}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-3 mt-4 mb-2">
                  <div
                    className={cn("h-3 rounded-full transition-all duration-700", progressColor)}
                    style={{ width: `${stack.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-400 mb-4">
                  {stack.progress}% complete — {etaText}
                </p>

                {/* Assigned Employee */}
                {stack.assigned_employee && (
                  <div className="mb-4 p-3 rounded-lg bg-teal-500/5 border border-teal-200/10">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-teal-400" />
                      <span className="text-neutral-400">Assigned to: </span>
                      <span className="text-teal-400 font-medium">
                        {stack.assigned_employee.name}
                      </span>
                      <span className="text-neutral-500 text-xs">
                        ({stack.assigned_employee.role})
                      </span>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <Clock size={14} /> Updated {formatRelativeTime(stack.updated_at)}
                  </div>
                  <button className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-400 to-teal-500 text-neutral-950 flex items-center gap-2 hover:scale-105 transition-all duration-300">
                    <MessageCircle size={14} /> Ask Expert
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto text-center py-10 text-neutral-500 text-sm border-t border-white/10 mt-10">
        Tracking {stacks.length} stack{stacks.length !== 1 ? 's' : ''} in progress — growing faster every week 🚀
      </footer>
    </div>
  );
}