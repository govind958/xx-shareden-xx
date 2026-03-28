"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  MoreHorizontal,
  Pin,
  Info,
  X,
  Briefcase,
  Hash,
  Calendar,
} from "lucide-react";

import { createClient } from '@/utils/supabase/client';
import { PURCHASED_STACKS, PURCHASED_SUBSTACKS } from '@/src/modules/stack_board/types';
import { getPurchasedStacks, getPurchasedSubStacks, getAssignedEmployee } from '@/src/modules/stack_board/action';
import { useAuth } from '@/src/context/AuthContext';
import { toast } from 'sonner';
import MessageDashboard from '@/src/components/stackboard/MessageDashboard';
import mixpanel from '@/src/lib/mixpanelClient';

/* ---------------- UTILS ---------------- */
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

type AssignedEmployee = { name: string; role: string; specialization: string; assigned_at: string | null } | null;

/* ---------------- MAIN COMPONENT ---------------- */
export default function Stackboard() {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [purchasedStacks, setPurchasedStacks] = useState<PURCHASED_STACKS[]>([]);
  const [purchasedSubStacks, setPurchasedSubStacks] = useState<PURCHASED_SUBSTACKS[]>([]);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [assignedEmployee, setAssignedEmployee] = useState<AssignedEmployee>(null);

  // State for the active chat room
  const [selectedStackId, setSelectedStackId] = useState<string | null>(null);
  const [selectedStackName, setSelectedStackName] = useState<string>('Select a Stack');

  // Unread message counts: { [stackId]: count }
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use a ref for the active stack ID so our real-time listener always has the latest value
  const activeStackIdRef = useRef<string | null>(null);

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
          const [substacks, employee] = await Promise.all([
            getPurchasedSubStacks(stacks[0].id),
            getAssignedEmployee(stacks[0].id),
          ]);
          setPurchasedSubStacks(substacks);
          setAssignedEmployee(employee);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
        mixpanel.track('Stackboard Viewed');
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
        const updatedItem = payload.new as { id: string; is_active?: boolean; status?: string; progress_percent?: number };
        console.log('[Stackboard] Order item updated:', updatedItem);

        // If order item was cancelled (is_active = false), remove it from the list
        if (updatedItem.is_active === false) {
          setPurchasedStacks(prev => {
            const next = prev.filter(stack => stack.id !== updatedItem.id);
            if (next.length > 0 && activeStackIdRef.current === updatedItem.id) {
              setSelectedStackId(next[0].id);
              setSelectedStackName(next[0].name);
            } else if (next.length === 0) {
              setSelectedStackId(null);
              setSelectedStackName('Select a Stack');
            }
            return next;
          });
          toast('A subscription was cancelled and removed from your tasks.');
          return;
        }

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

        if (statusMessages[updatedItem.status || '']) {
          toast(statusMessages[updatedItem.status || '']);
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

  // Keep activeStackIdRef in sync
  useEffect(() => {
    activeStackIdRef.current = selectedStackId;
  }, [selectedStackId]);

  // Filter stacks by search query
  const filteredStacks = useMemo(() => {
    if (!searchQuery.trim()) return purchasedStacks;
    const q = searchQuery.toLowerCase();
    return purchasedStacks.filter(stack =>
      stack.name.toLowerCase().includes(q)
    );
  }, [purchasedStacks, searchQuery]);

  // Real-time subscription for unread messages across ALL stacks
  useEffect(() => {
    if (!user?.id || purchasedStacks.length === 0) return;

    const supabase = createClient();
    const stackIds = purchasedStacks.map(s => s.id);

    const channel = supabase
      .channel(`unread_messages_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_messages',
        },
        (payload) => {
          const newMsg = payload.new as any;
          const msgStackId = newMsg.order_item_id;

          // Only count messages for stacks we own and that aren't currently open
          if (
            stackIds.includes(msgStackId) &&
            msgStackId !== activeStackIdRef.current &&
            newMsg.sender_id !== user.id // Don't count our own messages
          ) {
            setUnreadCounts(prev => ({
              ...prev,
              [msgStackId]: (prev[msgStackId] || 0) + 1
            }));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Stackboard] Realtime: Connected for unread messages');
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
    setPurchasedSubStacks([]);
    setAssignedEmployee(null);

    setUnreadCounts(prev => ({ ...prev, [stack.id]: 0 }));

    try {
      const [substacks, employee] = await Promise.all([
        getPurchasedSubStacks(stack.id),
        getAssignedEmployee(stack.id),
      ]);
      setPurchasedSubStacks(substacks);
      setAssignedEmployee(employee);
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
          {searchOpen ? (
            <div className="flex items-center gap-2 w-full">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search stacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-700"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-xl font-bold text-[#1A365D]">
                  Messages
                </h1>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                  Stack Communications
                </p>
              </div>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              >
                <Search size={18} />
              </button>
            </>
          )}
        </div>

        {/* Stack List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredStacks.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              {searchQuery ? 'No stacks match your search.' : 'No purchased stacks yet.'}
            </p>
          ) : (
            filteredStacks.map((stack) => (
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
                <div className="w-11 h-11 rounded-full bg-slate-100 border flex items-center justify-center text-[#1A365D] font-semibold text-sm shrink-0">
                  {stack.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className={cn(
                      "text-sm truncate text-[#1A365D]",
                      unreadCounts[stack.id] > 0 ? "font-bold" : "font-semibold"
                    )}>
                      {stack.name}
                    </h3>

                    {/* Unread message badge */}
                    {unreadCounts[stack.id] > 0 && (
                      <div className="w-5 h-5 ml-2 shrink-0 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                        {unreadCounts[stack.id] > 99 ? '99+' : unreadCounts[stack.id]}
                      </div>
                    )}
                  </div>
                  <p className={cn(
                    "text-xs mt-1 truncate",
                    unreadCounts[stack.id] > 0 ? "text-slate-800 font-medium" : "text-slate-500"
                  )}>
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

          <div className="flex gap-2 text-slate-400 shrink-0">
            {/* Info Toggle Button */}
            <button 
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className={cn(
                "p-2 rounded-lg transition duration-200",
                showInfoPanel ? "bg-[#EBF8FF] text-[#2B6CB0]" : "hover:bg-slate-100 hover:text-[#2B6CB0]"
              )}
            >
              <Info size={18} />
            </button>
          </div>
        </header>
        
        {/* Content Wrapper (Messages + Info Panel) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages Dashboard */}
          <div className="flex-1 min-w-0 relative flex flex-col">
            <MessageDashboard
              activeStackId={selectedStackId}
              activeStackName={selectedStackName}
              user={user}
            />
          </div>

          {/* RIGHT SIDE INFO PANEL */}
          {showInfoPanel && activeStack && (
            <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] transition-all animate-in slide-in-from-right-8 duration-300 z-20">
              
              {/* Panel Header */}
              <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-[#1A365D] text-sm">Stack Details</h3>
                <button 
                  onClick={() => setShowInfoPanel(false)} 
                  className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Panel Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                
                {/* 1. Expert Profile Section */}
                <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#2B6CB0] to-[#4299E1] text-white flex items-center justify-center text-3xl font-bold shadow-md">
                      {assignedEmployee?.name?.charAt(0) || '?'}
                    </div>
                    <div className={cn(
                      "absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-white",
                      assignedEmployee ? "bg-green-500" : "bg-slate-400"
                    )}></div>
                  </div>
                  <h4 className="font-bold text-[#1A365D] text-lg leading-tight">
                    {assignedEmployee?.name || 'Unassigned'}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1.5">
                    <Briefcase size={14} />
                    {assignedEmployee?.role || 'Awaiting Specialist'}
                  </p>
                  {assignedEmployee?.specialization && (
                    <p className="text-xs text-slate-400 mt-1">{assignedEmployee.specialization}</p>
                  )}
                </div>

                {/* 2. Order Information */}
                <div className="py-6 space-y-5">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Info</h5>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-slate-50 rounded text-slate-400">
                        <Hash size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Order ID</p>
                        <p className="text-sm font-semibold text-[#1A365D]">{activeStack.id.substring(0, 8).toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-slate-50 rounded text-slate-400">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Assigned On</p>
                        <p className="text-sm font-semibold text-[#1A365D]">
                          {assignedEmployee?.assigned_at
                            ? new Date(assignedEmployee.assigned_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                            : 'Not yet assigned'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Progress Status */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</h5>
                    <span className="text-xs font-bold text-[#2B6CB0]">{progressPercent}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#2B6CB0] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      activeStack.status === 'completed' ? "bg-slate-400" : "bg-green-500 animate-pulse"
                    )} />
                    Current Status: <span className="font-semibold text-slate-700 capitalize">{getStatusLabel(activeStack.status)}</span>
                  </p>
                </div>

              </div>
            </aside>
          )}

        </div>

      </main>
    </div>
  );
}
