"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Pin,
  Info,
} from "lucide-react";

import { createClient } from '@/utils/supabase/client';
import { PURCHASED_STACKS, PURCHASED_SUBSTACKS } from '@/src/modules/stack_board/types';
import { getPurchasedStacks, getPurchasedSubStacks } from '@/src/modules/stack_board/action';
import { useAuth } from '@/src/context/AuthContext';
import { toast } from 'sonner';
import MessageDashboard from '@/src/components/stackboard/MessageDashboard';

/* ---------------- UTILS ---------------- */
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

/* ---------------- MAIN COMPONENT ---------------- */
export default function Stackboard() {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [purchasedStacks, setPurchasedStacks] = useState<PURCHASED_STACKS[]>([]);
  const [purchasedSubStacks, setPurchasedSubStacks] = useState<PURCHASED_SUBSTACKS[]>([]);

  // State for the active chat room
  const [selectedStackId, setSelectedStackId] = useState<string | null>(null);
  const [selectedStackName, setSelectedStackName] = useState<string>('Select a Stack');

  const { user, loading: authLoading } = useAuth();

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const stacks = await getPurchasedStacks(user.id);
        setPurchasedStacks(stacks);

        // Auto-select first stack only if nothing is selected yet
        if (stacks && stacks.length > 0 && !selectedStackId) {
          setSelectedStackId(stacks[0].id);
          setSelectedStackName(stacks[0].name);
          const substacks = await getPurchasedSubStacks(stacks[0].id);
          setPurchasedSubStacks(substacks);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchData();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // 2. Time Update
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2.5 Real-time subscription for order_items updates (progress & status)
  useEffect(() => {
    if (!user?.id || purchasedStacks.length === 0) return;

    const supabase = createClient();

    // Subscribe to changes on order_items for this user
    const channel = supabase.channel(`user_orders_${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'order_items',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const updatedItem = payload.new as any;
        console.log('[Stackboard] Order item updated:', updatedItem);

        // Update the purchasedStacks state
        setPurchasedStacks(prev => prev.map(stack =>
          stack.id === updatedItem.id
            ? {
              ...stack,
              status: updatedItem.status?.toUpperCase() || stack.status,
              progress_percent: updatedItem.progress_percent ?? stack.progress_percent
            }
            : stack
        ));

        // Show toast notification for status changes
        const statusMessages: Record<string, string> = {
          'in_progress': '🔧 Work has started on your order!',
          'completed': '🎉 Your order has been completed!',
          'processing': '📋 Your order is being processed',
        };

        if (statusMessages[updatedItem.status]) {
          toast(statusMessages[updatedItem.status]);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Stackboard] Realtime: Connected for order updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, purchasedStacks.length]);

  // 3. Handle Stack Selection
  const handleStackSelect = async (stack: PURCHASED_STACKS) => {
    if (selectedStackId === stack.id) return;

    setSelectedStackId(stack.id);
    setSelectedStackName(stack.name);
    setPurchasedSubStacks([]); // Clear while loading

    try {
      const substacks = await getPurchasedSubStacks(stack.id);
      setPurchasedSubStacks(substacks);
    } catch (error) {
      console.error("Error fetching substacks:", error);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7FAFC]">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  // Get the selected stack's data
  const activeStack = purchasedStacks.find(s => s.id === selectedStackId);
  const progressPercent = activeStack?.progress_percent || 0;
  const selectedStatus = activeStack?.status?.toLowerCase() || 'initiated';

  // Get status display for the selected stack
  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'initiated': return 'Queued';
      case 'processing': return 'Assigned';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className="flex h-screen w-full text-slate-800 overflow-hidden bg-[#F7FAFC]">

      {/* Sidebar */}
      <aside className="w-[30%] min-w-[320px] max-w-[400px] bg-white border-r border-slate-200 flex flex-col">

        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-[#1A365D]">
              Messages
            </h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
              Stack Communications
            </p>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <Search size={18} />
          </button>
        </div>

        {/* Stack List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {purchasedStacks.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No purchased stacks yet.</p>
          ) : (
            purchasedStacks.map((stack) => (
              <div
                key={stack.id}
                onClick={() => handleStackSelect(stack)}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-4 cursor-pointer transition-all rounded-lg",
                  selectedStackId === stack.id
                    ? "bg-[#F7FAFC] border-l-4 border-[#2B6CB0]"
                    : "hover:bg-slate-50"
                )}
              >
                <div className="w-11 h-11 rounded-full bg-slate-100 border flex items-center justify-center text-[#1A365D] font-semibold text-sm">
                  {stack.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold truncate text-[#1A365D]">
                      {stack.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {stack.progress_percent}% • {getStatusLabel(stack.status)}
                  </p>
                </div>

                <Pin
                  size={14}
                  className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col bg-white">

        {/* Chat Header */}
        <header className="h-20 border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-[#1A365D] text-white flex items-center justify-center font-semibold">
              {selectedStackName.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1A365D]">
                {selectedStackName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  selectedStatus === 'in_progress' || selectedStatus === 'processing' ? "bg-[#38A169]" : "bg-slate-300"
                )} />
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                  {selectedStatus === 'in_progress' || selectedStatus === 'processing'
                    ? 'Expert Assigned'
                    : selectedStatus === 'completed'
                      ? 'Completed'
                      : 'Awaiting Assignment'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 text-slate-400">
            <button className="p-2 hover:bg-slate-100 hover:text-[#2B6CB0] rounded-lg transition">
              <Info size={18} />
            </button>
            <button className="p-2 hover:bg-slate-100 hover:text-[#2B6CB0] rounded-lg transition">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* Messages + Input (handled by MessageDashboard) */}
        <MessageDashboard
          activeStackId={selectedStackId}
          activeStackName={selectedStackName}
          user={user}
        />
      </main>
    </div>
  );
}
