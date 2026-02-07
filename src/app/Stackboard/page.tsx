"use client"

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Terminal, Send, Check, ChevronLeft, Zap } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

function ClientDashboardContent() {
  const searchParams = useSearchParams();
  const orderItemId = searchParams.get('id');
  const supabase = createClient();

  const [activeStack, setActiveStack] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initSession() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (orderItemId) {
        // 1. Fetch Task Details
        const { data: task } = await supabase.from('order_items').select('*').eq('id', orderItemId).single();
        if (task) setActiveStack(task);

        // 2. Fetch Message History
        const { data: history } = await supabase.from('project_messages').select('*').eq('order_item_id', orderItemId).order('created_at', { ascending: true });
        if (history) setMessages(history);
      }
    }
    initSession();

    if (!orderItemId) return;

    // 3. Real-time Subscription for Messages
    const msgChannel = supabase.channel(`chat:${orderItemId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'project_messages', 
        filter: `order_item_id=eq.${orderItemId}` 
      }, (payload) => {
        setMessages(prev => {
          const exists = prev.find(m => m.id === payload.new.id);
          return exists ? prev : [...prev, payload.new];
        });
      }).subscribe();

    // 4. Real-time Subscription for Task/Progress Updates
    const taskChannel = supabase.channel(`task:${orderItemId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'order_items', 
        filter: `id=eq.${orderItemId}` 
      }, (payload) => {
        setActiveStack(payload.new);
      }).subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(taskChannel);
    };
  }, [orderItemId, supabase]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !orderItemId) return;

    const { error } = await supabase.from('project_messages').insert({
      order_item_id: orderItemId,
      content: input,
      sender_id: user.id,
      sender_role: 'client' // Client role
    });

    if (!error) setInput("");
  };

  if (!orderItemId) return <div className="p-20 text-center uppercase tracking-widest text-neutral-500">No_Session_Active</div>;

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-500 font-sans p-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
        
        {/* Progress Sidebar */}
        <aside className="col-span-12 lg:col-span-4 bg-[#0a0a0a] border border-neutral-900 rounded-[32px] p-8">
          <header className="mb-10 flex justify-between items-center">
             <div>
               <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Node_Telemetry</p>
               <h1 className="text-2xl font-black text-white italic">NODE_{orderItemId.slice(0,8)}</h1>
             </div>
             <div className="text-right">
               <p className="text-xl font-mono text-white font-bold">{activeStack?.progress_percent || 0}%</p>
             </div>
          </header>

          <div className="space-y-8">
            <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
              <p className="text-[9px] font-black text-neutral-500 uppercase mb-2">Current_Status</p>
              <p className="text-xs text-white uppercase font-bold">{activeStack?.status || 'INITIALIZING'}</p>
            </div>
            {activeStack?.admin_note && (
              <div className="p-4 border-l-2 border-teal-500 bg-teal-500/5">
                <p className="text-[9px] font-black text-teal-500 uppercase">Operative_Directive</p>
                <p className="text-xs text-neutral-400 italic mt-1">{activeStack.admin_note}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Messaging Console */}
        <main className="col-span-12 lg:col-span-8 flex flex-col h-[800px] bg-[#0a0a0a] border border-neutral-900 rounded-[32px] overflow-hidden">
          <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-zinc-900/10">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Secure_Link_Established</span>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          </div>

          <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={m.id || i} className={cn("flex flex-col gap-1.5", m.sender_role === 'client' ? "items-end" : "items-start")}>
                <span className="text-[8px] font-black text-neutral-700 uppercase tracking-widest">
                  {m.sender_role === 'client' ? 'Authorized_User' : 'Node_Operative'}
                </span>
                <div className={cn("p-4 rounded-2xl max-w-[85%] text-[13px] font-bold tracking-tight uppercase",
                  m.sender_role === 'client' ? "bg-teal-500 text-black rounded-tr-none" : "bg-neutral-900 text-white border border-neutral-800 rounded-tl-none")}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-8 bg-black/40">
            <div className="relative">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="EXECUTE_SIGNAL..." 
                className="w-full bg-black border border-neutral-800 rounded-2xl py-5 px-8 text-xs text-white focus:border-teal-500/50 outline-none" />
              <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-teal-500"><Send size={18} /></button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default function TechNoirDashboard() {
  return <Suspense fallback={<div>Syncing...</div>}><ClientDashboardContent /></Suspense>;
}