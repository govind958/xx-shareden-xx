"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Search,
  MoreHorizontal,
  Pin,
  Info,
  Menu,
  X,
  ChevronLeft,
  Phone,
  Briefcase,
  Hash,
  Calendar,
  Layers,
  Box,
} from "lucide-react";

import { createClient } from '@/utils/supabase/client';
import { StackboardSidebarItem } from '@/src/modules/stack_board/types';
import { getStackboardSidebarItems, getAssignedEmployee, getAssignedEmployeeForSubstack } from '@/src/modules/stack_board/action';
import { useAuth } from '@/src/context/AuthContext';
import { toast } from 'sonner';
import MessageDashboard from '@/src/components/stackboard/MessageDashboard';
import { useStackboardStore } from '@/src/modules/stack_board/store';
import { useNotificationStore } from '@/src/store/notification-store';

// --- Utility ---
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

const ACCENT_PALETTE = ['#2B6CB0', '#1A365D', '#38A169', '#805AD5', '#DD6B20', '#D69E2E', '#E53E3E'] as const;

function stackAccentColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return ACCENT_PALETTE[Math.abs(h) % ACCENT_PALETTE.length];
}

type AssignedEmployee = { name: string; role: string; specialization: string; assigned_at: string | null } | null;

export default function Stackboard() {
  const { sidebarItems, isFetched, setSidebarItems } = useStackboardStore();
  const { markOrderMessagesAsRead } = useNotificationStore();
  const [loading, setLoading] = useState(!isFetched);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [assignedEmployee, setAssignedEmployee] = useState<AssignedEmployee>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Selected item can be a stack or substack
  const [selectedItem, setSelectedItem] = useState<StackboardSidebarItem | null>(null);

  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeItemRef = useRef<StackboardSidebarItem | null>(null);

  const { user, loading: authLoading } = useAuth();

  // Ref to hold latest sidebar items for use in realtime callbacks without re-subscribing
  const sidebarItemsRef = useRef<StackboardSidebarItem[]>(sidebarItems);
  
  useEffect(() => {
    sidebarItemsRef.current = sidebarItems;
  }, [sidebarItems]);

  // 1. Initial Data Fetch — only depends on auth state, not selectedItem
  const selectedItemRef = useRef(selectedItem);
  selectedItemRef.current = selectedItem;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      if (isFetched) {
        setLoading(false);
        if (sidebarItems.length > 0 && !selectedItemRef.current) {
          setSelectedItem(sidebarItems[0]);
        }
        return;
      }
      
      try {
        const items = await getStackboardSidebarItems(user.id);
        setSidebarItems(items);
        sidebarItemsRef.current = items;

        if (items && items.length > 0 && !selectedItemRef.current) {
          setSelectedItem(items[0]);
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

  // Load assigned employee whenever the selected item changes
  useEffect(() => {
    if (!selectedItem) {
      setAssignedEmployee(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        let employee: AssignedEmployee = null;
        
        if (selectedItem.itemType === 'substack' && selectedItem.subStackId) {
          // Get employee assigned to this specific substack
          employee = await getAssignedEmployeeForSubstack(selectedItem.orderItemId, selectedItem.subStackId);
        } else {
          // Get employee assigned to the whole stack
          employee = await getAssignedEmployee(selectedItem.orderItemId);
        }
        
        if (!cancelled) {
          setAssignedEmployee(employee);
        }
      } catch (error) {
        console.error("Error fetching assigned employee:", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedItem]);

  // 2.5 Real-time subscription for order_items updates (progress & status)
  // Uses ref instead of sidebarItems in deps to avoid reconnection on every state change
  useEffect(() => {
    if (!user?.id || sidebarItemsRef.current.length === 0) return;

    const supabase = createClient();

    const channel = supabase.channel(`user_orders_${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'order_items',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        const updatedItem = payload.new as { id: string; is_active?: boolean; status?: string; progress_percent?: number };

        if (updatedItem.is_active === false) {
          setSidebarItems(prev => {
            const next = prev.filter(item => item.orderItemId !== updatedItem.id);
            sidebarItemsRef.current = next;
            if (next.length > 0 && activeItemRef.current?.orderItemId === updatedItem.id) {
              setSelectedItem(next[0]);
            } else if (next.length === 0) {
              setSelectedItem(null);
            }
            return next;
          });
          toast('A subscription was cancelled and removed from your tasks.');
          return;
        }

        setSidebarItems(prev => {
          const next = prev.map(item =>
            item.orderItemId === updatedItem.id
              ? {
                ...item,
                status: updatedItem.status?.toUpperCase() || item.status,
                progress_percent: updatedItem.progress_percent ?? item.progress_percent
              }
              : item
          );
          sidebarItemsRef.current = next;
          return next;
        });

        const statusMessages: Record<string, string> = {
          'in_progress': '🔧 Work has started on your order!',
          'completed': '🎉 Your order has been completed!',
          'processing': '📋 Your order is being processed',
        };

        if (statusMessages[updatedItem.status || '']) {
          toast(statusMessages[updatedItem.status || '']);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    activeItemRef.current = selectedItem;
    if (selectedItem?.orderItemId) {
      markOrderMessagesAsRead(selectedItem.orderItemId);
    }
  }, [selectedItem, markOrderMessagesAsRead]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return sidebarItems;
    const q = searchQuery.toLowerCase();
    return sidebarItems.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.parentStackName && item.parentStackName.toLowerCase().includes(q))
    );
  }, [sidebarItems, searchQuery]);

  // Unread messages tracking
  // Uses ref instead of sidebarItems in deps to avoid reconnection on every state change
  useEffect(() => {
    if (!user?.id || sidebarItemsRef.current.length === 0) return;

    const supabase = createClient();
    const orderItemIds = [...new Set(sidebarItemsRef.current.map(s => s.orderItemId))];

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
          const newMsg = payload.new as { order_item_id?: string; sub_stack_id?: string; sender_id?: string };
          const msgOrderItemId = newMsg.order_item_id;
          const msgSubStackId = newMsg.sub_stack_id;

          // Re-check using ref for latest items
          const currentOrderItemIds = new Set(sidebarItemsRef.current.map(s => s.orderItemId));
          if (!msgOrderItemId || !currentOrderItemIds.has(msgOrderItemId)) return;
          if (newMsg.sender_id === user.id) return;

          const itemKey = msgSubStackId 
            ? `${msgOrderItemId}-${msgSubStackId}` 
            : msgOrderItemId;

          const activeKey = activeItemRef.current?.subStackId 
            ? `${activeItemRef.current.orderItemId}-${activeItemRef.current.subStackId}`
            : activeItemRef.current?.orderItemId;

          if (itemKey !== activeKey) {
            setUnreadCounts(prev => ({
              ...prev,
              [itemKey]: (prev[itemKey] || 0) + 1
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleItemSelect = useCallback((item: StackboardSidebarItem) => {
    setSelectedItem(prev => {
      if (prev?.id === item.id && prev?.itemType === item.itemType) return prev;
      return item;
    });
    setAssignedEmployee(null);

    const itemKey = item.subStackId 
      ? `${item.orderItemId}-${item.subStackId}` 
      : item.orderItemId;
    setUnreadCounts(prev => ({ ...prev, [itemKey]: 0 }));

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7FAFC]">
        <div className="flex items-center gap-1.5" role="status" aria-label="Loading">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse [animation-delay:200ms]" />
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    );
  }

  const progressPercent = selectedItem?.progress_percent || 0;
  const selectedStatus = selectedItem?.status?.toLowerCase() || 'initiated';

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'initiated': return 'Queued';
      case 'processing': return 'Assigned';
      case 'assigned': return 'Assigned';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const headerColor = selectedItem ? stackAccentColor(selectedItem.id) : '#1A365D';
  const headerInitial = (selectedItem?.name || 'Select').charAt(0) || '?';
  const headerName = selectedItem?.name || 'Select a Stack';

  const openSearchInSidebar = () => {
    setSearchOpen(true);
    setIsSidebarOpen(true);
  };

  // Get unique key for unread counts
  const getItemKey = (item: StackboardSidebarItem) => 
    item.subStackId ? `${item.orderItemId}-${item.subStackId}` : item.orderItemId;

  return (
    <div className="flex h-screen w-full text-slate-800 overflow-hidden bg-[#F7FAFC] font-sans">

      {!isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      <aside className={cn(
        "fixed md:relative z-30 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0"
      )}>

        <div className={cn(
          "border-b border-slate-100 h-20 shrink-0 overflow-hidden",
          isSidebarOpen ? "p-6 flex flex-col justify-center gap-0" : "md:px-0 md:py-4 md:flex md:items-center md:justify-center"
        )}>
          {isSidebarOpen && searchOpen ? (
            <div className="flex items-center gap-2 w-full">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search stacks & modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-700"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className={cn(
              "flex items-center justify-between w-full",
              !isSidebarOpen && "md:hidden"
            )}>
              <div>
                <h1 className="text-xl font-bold text-[#1A365D] whitespace-nowrap">
                  Messages
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 whitespace-nowrap">
                  Stack Engine v2
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                >
                  <Search size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            </div>
          )}
          {!isSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors mx-auto"
            >
              <Menu size={18} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              {searchQuery ? 'No items match your search.' : 'No purchased stacks yet.'}
            </p>
          ) : (
            filteredItems.map((item, index) => {
              const itemKey = getItemKey(item);
              const unread = unreadCounts[itemKey] || 0;
              const isSelected = selectedItem?.id === item.id && selectedItem?.itemType === item.itemType;
              const isSubstack = item.itemType === 'substack';
              const accent = isSubstack ? '#805AD5' : stackAccentColor(item.id);
              
              return (
                <div
                  key={`${item.itemType}-${item.id}-${index}`}
                  onClick={() => handleItemSelect(item)}
                  className={cn(
                    "group relative flex items-center gap-3 p-3 cursor-pointer transition-all rounded-xl",
                    isSelected
                      ? isSubstack 
                        ? "bg-purple-50 ring-1 ring-purple-500/10"
                        : "bg-[#F0F7FF] ring-1 ring-[#2B6CB0]/10"
                      : "hover:bg-slate-50",
                    isSubstack && "ml-4"
                  )}
                >
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        "flex items-center justify-center text-white font-bold text-sm shadow-sm",
                        isSubstack ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-full"
                      )}
                      style={{ backgroundColor: accent }}
                    >
                      {isSubstack ? (
                        <Box size={14} />
                      ) : (
                        item.name.charAt(0)
                      )}
                    </div>
                    {unread > 0 && (
                      <div className={cn(
                        "absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white",
                        isSidebarOpen ? "h-5 min-w-5 px-0.5" : "h-4 w-4"
                      )}>
                        {isSidebarOpen ? (unread > 99 ? '99+' : unread) : ''}
                      </div>
                    )}
                  </div>

                  {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <h3 className={cn(
                          "font-bold truncate",
                          isSubstack ? "text-xs text-purple-900" : "text-sm text-[#1A365D]"
                        )}>
                          {item.name}
                        </h3>
                        <span className={cn(
                          "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0",
                          isSubstack 
                            ? "bg-purple-100 text-purple-600" 
                            : "bg-blue-100 text-blue-600"
                        )}>
                          {isSubstack ? 'Module' : 'Stack'}
                        </span>
                      </div>
                      {isSubstack && item.parentStackName && (
                        <p className="text-[10px] text-slate-400 truncate">
                          in {item.parentStackName}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden max-w-[60px]">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              isSubstack ? "bg-purple-500" : "bg-[#2B6CB0]"
                            )}
                            style={{ width: `${item.progress_percent}%` }}
                          />
                        </div>
                        <p className={cn(
                          "text-[10px] font-semibold truncate uppercase tracking-tighter",
                          unread > 0 ? "text-slate-800" : "text-slate-500"
                        )}>
                          {getStatusLabel(item.status)}
                        </p>
                      </div>
                      {item.assignedEmployee && (
                        <p className="text-[9px] text-slate-400 mt-1 truncate">
                          👤 {item.assignedEmployee.name}
                        </p>
                      )}
                    </div>
                  )}

                  {isSidebarOpen && (
                    <Pin
                      size={12}
                      className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  )}

                  {isSelected && (
                    <div className={cn(
                      "absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full",
                      isSubstack ? "bg-purple-500" : "bg-[#2B6CB0]"
                    )} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-white min-h-0">

        <header className="h-20 border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              className="md:hidden p-2 -ml-2 text-slate-500"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div
              className={cn(
                "shrink-0 text-white flex items-center justify-center font-bold shadow-md",
                selectedItem?.itemType === 'substack' ? "w-10 h-10 rounded-lg" : "w-10 h-10 rounded-lg"
              )}
              style={{ backgroundColor: headerColor }}
            >
              {selectedItem?.itemType === 'substack' ? (
                <Box size={18} />
              ) : (
                headerInitial
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#1A365D] truncate">
                  {headerName}
                </h2>
                {selectedItem?.itemType === 'substack' && (
                  <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 shrink-0">
                    Module
                  </span>
                )}
              </div>
              {selectedItem?.itemType === 'substack' && selectedItem.parentStackName && (
                <p className="text-[10px] text-slate-400 truncate">
                  in {selectedItem.parentStackName}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  selectedStatus === 'in_progress' || selectedStatus === 'processing' || selectedStatus === 'assigned' ? "bg-[#38A169]" : "bg-slate-300"
                )} />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">
                  {assignedEmployee 
                    ? `${assignedEmployee.name} - ${assignedEmployee.role}`
                    : selectedStatus === 'in_progress' || selectedStatus === 'processing' || selectedStatus === 'assigned'
                      ? 'Expert Assigned'
                      : selectedStatus === 'completed'
                        ? 'Completed'
                        : 'Awaiting Assignment'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={openSearchInSidebar}
              className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-[#2B6CB0] rounded-full transition-all"
            >
              <Search size={18} />
            </button>
            <button type="button" className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-[#2B6CB0] rounded-full transition-all" title="Start Call">
              <Phone size={18} />
            </button>
            <button
              type="button"
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className={cn(
                "hidden sm:block p-2.5 rounded-full transition-all",
                showInfoPanel ? "bg-[#EBF8FF] text-[#2B6CB0]" : "text-slate-400 hover:bg-slate-50 hover:text-[#2B6CB0]"
              )}
            >
              <Info size={18} />
            </button>
            <button type="button" className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-[#2B6CB0] rounded-full transition-all">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden min-h-0">
          <div className="flex-1 min-w-0 flex flex-col min-h-0">
            <MessageDashboard
              activeStackId={selectedItem?.orderItemId || null}
              activeSubStackId={selectedItem?.subStackId || null}
              activeStackName={selectedItem?.name || 'Select a Stack'}
              user={user!}
            />
          </div>

          {showInfoPanel && selectedItem && (
            <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] transition-all animate-in slide-in-from-right-8 duration-300 z-20 shrink-0">
              <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-[#1A365D] text-sm">
                  {selectedItem.itemType === 'substack' ? 'Module Details' : 'Stack Details'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowInfoPanel(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 transition"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                  <div className="relative mb-4">
                    <div className={cn(
                      "w-20 h-20 rounded-full text-white flex items-center justify-center text-3xl font-bold shadow-md",
                      selectedItem.itemType === 'substack' 
                        ? "bg-gradient-to-tr from-purple-600 to-purple-400"
                        : "bg-gradient-to-tr from-[#2B6CB0] to-[#4299E1]"
                    )}>
                      {assignedEmployee?.name?.charAt(0) || '?'}
                    </div>
                    <div className={cn(
                      "absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-white",
                      assignedEmployee ? "bg-green-500" : "bg-slate-400"
                    )} />
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

                <div className="py-6 space-y-5">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {selectedItem.itemType === 'substack' ? 'Module Info' : 'Order Info'}
                  </h5>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-slate-50 rounded text-slate-400">
                        {selectedItem.itemType === 'substack' ? <Box size={16} /> : <Layers size={16} />}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">
                          {selectedItem.itemType === 'substack' ? 'Module Name' : 'Stack Name'}
                        </p>
                        <p className="text-sm font-semibold text-[#1A365D]">{selectedItem.name}</p>
                      </div>
                    </div>

                    {selectedItem.itemType === 'substack' && selectedItem.parentStackName && (
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 bg-slate-50 rounded text-slate-400">
                          <Layers size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Parent Stack</p>
                          <p className="text-sm font-semibold text-[#1A365D]">{selectedItem.parentStackName}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-slate-50 rounded text-slate-400">
                        <Hash size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Order ID</p>
                        <p className="text-sm font-semibold text-[#1A365D]">{selectedItem.orderItemId.substring(0, 8).toUpperCase()}</p>
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

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</h5>
                    <span className={cn(
                      "text-xs font-bold",
                      selectedItem.itemType === 'substack' ? "text-purple-600" : "text-[#2B6CB0]"
                    )}>{progressPercent}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        selectedItem.itemType === 'substack' ? "bg-purple-500" : "bg-[#2B6CB0]"
                      )}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      selectedItem.status?.toLowerCase() === 'completed' ? "bg-slate-400" : "bg-green-500 animate-pulse"
                    )} />
                    Current Status: <span className="font-semibold text-slate-700 capitalize">{getStatusLabel(selectedItem.status)}</span>
                  </p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E0;
        }
      `}} />
    </div>
  );
}
