"use client"

import React, { useEffect, useState, useRef, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Terminal, Send, Check, ChevronLeft, Zap,
  Box, ArrowRight, LayoutGrid, Activity
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { verifyEmployeeSession } from '@/src/modules/employee/actions';

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// Create supabase client outside component to prevent recreation on each render
const supabase = createClient();

function ClientDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderItemId = searchParams.get('id'); // The "Room ID"

  const [orders, setOrders] = useState<any[]>([]);
  const [activeStack, setActiveStack] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Initial Data Fetch: Get all Cart Items (Order Items)
  useEffect(() => {
    async function initDashboard() {
      // Use custom employee session instead of Supabase Auth
      const sessionResult = await verifyEmployeeSession();

      if (!sessionResult.isValid || !sessionResult.employee) {
        console.error('No valid employee session found');
        setLoading(false);
        return;
      }

      const emp = sessionResult.employee;
      setUser({ id: emp.id, email: emp.email }); // For message sender_id
      setEmployeeId(emp.id);

      // Fetch order_items assigned to this employee
      const { data: cartItems } = await supabase
        .from('order_items')
        .select('*, stacks(name)')
        .eq('assigned_to', emp.id)
        .order('created_at', { ascending: false });

      setOrders(cartItems || []);

      // If an ID is in URL, fetch that specific stack's details
      if (orderItemId) {
        const { data: currentTask } = await supabase
          .from('order_items')
          .select('*')
          .eq('id', orderItemId)
          .single();
        setActiveStack(currentTask);

        const { data: history } = await supabase
          .from('project_messages')
          .select('*')
          .eq('order_item_id', orderItemId)
          .order('created_at', { ascending: true });
        setMessages(history || []);
      }
      setLoading(false);
    }
    initDashboard();
  }, [orderItemId]);

  // 2. Real-time Listeners (Messages & Progress)
  useEffect(() => {
    if (!orderItemId) return;

    const channel = supabase.channel(`nexus_${orderItemId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'project_messages',
        filter: `order_item_id=eq.${orderItemId}`
      }, (payload) => {
        // Deduplicate: only add if not already in state
        setMessages(prev => {
          const exists = prev.find(m => m.id === payload.new.id);
          return exists ? prev : [...prev, payload.new];
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'order_items',
        filter: `id=eq.${orderItemId}`
      }, (payload) => {
        setActiveStack(payload.new);
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime: Connected to channel');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Realtime: Channel error', err);
        } else if (status === 'TIMED_OUT') {
          console.error('Realtime: Connection timed out');
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [orderItemId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !orderItemId) return;

    const messageContent = input.trim();
    setInput(""); // Clear input immediately for better UX

    const { data, error } = await supabase.from('project_messages').insert({
      order_item_id: orderItemId,
      content: messageContent,
      sender_id: user.id,
      sender_role: 'employee'
    }).select().single();

    // Add message to local state immediately (optimistic update)
    if (!error && data) {
      setMessages(prev => {
        // Avoid duplicates if realtime already added it
        const exists = prev.find(m => m.id === data.id);
        return exists ? prev : [...prev, data];
      });
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-teal-500 font-mono animate-pulse">BOOTING_NEXUS_OS...</div>;

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans p-6 md:p-10 selection:bg-teal-500/30">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0a0a0a] border border-neutral-900 p-8 rounded-[32px] gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(20,184,166,0.2)]">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">NEXUS_DASHBOARD</h1>
              <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.4em]">Authorized_Client_Access</p>
            </div>
          </div>
          <div className="flex gap-6 text-right">
            <div className="hidden sm:block">
              <p className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">Active_Nodes</p>
              <p className="text-xl font-mono text-white font-bold">{orders.length}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">

          {/* LEFT COLUMN: THE CART (Node Registry) */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[32px] p-6 flex flex-col max-h-[800px]">
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={16} className="text-teal-500" />
                  <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Ordered_Items_Registry</h2>
                </div>
              </div>

              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {orders.map((item) => {
                  const isActive = item.id === orderItemId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => router.push(`?id=${item.id}`)}
                      className={cn(
                        "w-full text-left p-5 rounded-2xl border transition-all duration-300 group",
                        isActive
                          ? "bg-teal-500/10 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.05)]"
                          : "bg-black border-neutral-900 hover:border-neutral-700"
                      )}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={cn("text-[10px] font-black uppercase tracking-widest", isActive ? "text-teal-500" : "text-neutral-500")}>
                          {item.stack_id || "Standard_Build"}
                        </span>
                        <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-teal-500 animate-pulse" : "bg-neutral-800")} />
                      </div>
                      <h3 className="text-white font-bold text-sm mb-4 truncate uppercase">NODE_{item.stacks?.name}</h3>
                      <div className="flex items-end justify-between">
                        <div className="space-y-1">
                          <p className="text-[8px] text-neutral-600 uppercase font-black">Progress</p>
                          <p className="text-lg font-mono text-white leading-none">{item.progress_percent}%</p>
                        </div>
                        <ArrowRight size={16} className={cn("transition-transform group-hover:translate-x-1", isActive ? "text-teal-500" : "text-neutral-800")} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: COMMUNICATION CONSOLE */}
          <main className="col-span-12 lg:col-span-8">
            {orderItemId ? (
              <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[32px] overflow-hidden flex flex-col h-[800px]">
                {/* Chat Header */}
                <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-zinc-900/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-teal-500 border border-white/5">
                      <Terminal size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Node_Uplink_Channel</h3>
                      <p className="text-[9px] font-mono text-neutral-600 uppercase mt-0.5">Status: {activeStack?.status || 'Active'}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-hide">
                  {messages.length > 0 ? messages.map((m, i) => (
                    <div key={m.id || i} className={cn("flex flex-col gap-1.5", m.sender_role === 'employee' ? "items-end" : "items-start")}>
                      <span className="text-[8px] font-black text-neutral-700  tracking-widest">
                        {m.sender_role === 'employee' ? 'You (Operative)' : 'Client_Auth'}
                      </span>
                      <div className={cn(
                        "p-4 rounded-2xl max-w-[80%] text-[13px] font-bold tracking-tight  leading-relaxed shadow-lg",
                        m.sender_role === 'employee'
                          ? "bg-teal-500 text-black rounded-tr-none"
                          : "bg-neutral-900 text-white border border-neutral-800 rounded-tl-none"
                      )}>
                        {m.content}
                      </div>
                    </div>
                  )) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-[10px] tracking-[0.5em] uppercase">
                      Awaiting_Initial_Handshake...
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={sendMessage} className="p-8 bg-black/40 border-t border-neutral-900">
                  <div className="relative">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="ENTER_SIGNAL_ENCODING..."
                      className="w-full bg-black border border-neutral-800 rounded-2xl py-5 px-8 text-xs text-white focus:border-teal-500 focus:outline-none transition-all"
                    />
                    <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-teal-500 hover:text-white transition-colors">
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="h-[800px] border border-neutral-900 border-dashed rounded-[32px] flex flex-col items-center justify-center gap-4 text-neutral-800">
                <Box size={48} className="opacity-10" />
                <p className="text-[10px] font-black  tracking-[0.8em]">Select_Node_To_Communicate</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function TechNoirDashboard() {
  return <Suspense fallback={null}><ClientDashboardContent /></Suspense>;
}