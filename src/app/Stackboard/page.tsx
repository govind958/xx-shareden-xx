"use client"

import React, { useEffect, useState, useRef } from 'react';
import {
  Activity,
  Cpu,
  Shield,
  Wifi,
  Layers,
  ArrowUpRight,
  Database,
  Lock,
  MoreHorizontal,
  Zap,
  CheckCircle2,
  Server,
  Terminal,
  FileText,
  Check,
  X,
  Paperclip,
  Send,
  Globe,
  Command
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { PURCHASED_STACKS, PURCHASED_SUBSTACKS } from '@/src/modules/stack_board/types';
import { getPurchasedStacks, getPurchasedSubStacks } from '@/src/modules/stack_board/action';
import { useAuth } from '@/src/context/AuthContext';

/* ---------------- UTILS ---------------- */
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

export default function TechNoirDashboard() {
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

  if (loading || authLoading) return <BootSequence />;

  // Calculate progress
  const progressPercent = purchasedSubStacks.length > 0
    ? Math.round((purchasedSubStacks.filter(s => s.status === 'completed').length / purchasedSubStacks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-500 font-sans selection:bg-teal-500/30 overflow-x-hidden p-4 lg:p-10">

      {/* ATMOSPHERIC GRADIENT BLURS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal-500/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-teal-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-[1700px] mx-auto space-y-8">

        {/* --- INDUSTRIAL HEADER --- */}
        <header className="flex flex-col md:flex-row items-center justify-between bg-[#0a0a0a] border border-neutral-900 p-8 rounded-[32px] shadow-2xl">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-teal-500 animate-pulse" />
              <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.6em]">System_Uplink: Active</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-baseline gap-1">
              NEXUS<span className="text-neutral-800 not-italic">.OS</span>
            </h1>
          </div>

          <div className="flex items-center gap-12 mt-6 md:mt-0">
            <div className="hidden xl:grid grid-cols-2 gap-x-8 gap-y-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-700">Latency</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-700">Timestamp</span>
              <span className="text-[10px] font-mono text-teal-500/70">14ms</span>
              <span className="text-[10px] font-mono text-white">{currentTime.toLocaleTimeString('en-GB')}</span>
            </div>

            <button className="group relative overflow-hidden bg-white text-black px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:pr-14">
              <span className="relative z-10">Initialize_Deploy</span>
              <ArrowUpRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={18} />
            </button>
          </div>
        </header>

        {/* --- TECH-STACK HORIZONTAL SCROLL --- */}
        <section className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {purchasedStacks.length > 0 ? (
            purchasedStacks.map((stack) => (
              <div key={stack.id} className="flex-shrink-0 w-[320px]">
                <StackCard
                  stack={stack}
                  isSelected={selectedStackId === stack.id}
                  onClick={() => handleStackSelect(stack)}
                />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12 text-neutral-600">
              <p className="text-sm">No purchased stacks found</p>
            </div>
          )}
        </section>

        {/* --- PRIMARY DATA INTERFACE --- */}
        <main className="grid grid-cols-12 gap-8 items-start">

          {/* LEFT: PROGRESS ARCHITECTURE */}
          <aside className="col-span-12 lg:col-span-4 bg-[#0a0a0a] border border-neutral-900 rounded-[32px] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-neutral-900">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.5em]">Stack_Progress</p>
                  <h2 className="text-white text-lg font-bold tracking-tight">{selectedStackName}</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-teal-500 font-bold">{progressPercent}%</p>
                  <div className="w-24 h-1 bg-neutral-900 mt-2 overflow-hidden">
                    <div className="h-full bg-teal-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              <div className="space-y-10 relative">
                <div className="absolute left-[21px] top-2 bottom-2 w-[1px] bg-neutral-900" />
                {purchasedSubStacks.length > 0 ? (
                  purchasedSubStacks.map((step, idx) => (
                    <ProgressStep key={idx} step={step} />
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-600">
                    <p className="text-xs">No progress data available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-neutral-900/20 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.4em]">Kernel_Stream: Online</span>
            </div>
          </aside>

          {/* RIGHT: COMMAND CENTER / MESSAGING */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            {/* PASSING DATA TO MESSAGE DASHBOARD */}
            <MessageDashboard
              activeStackId={selectedStackId}
              activeStackName={selectedStackName}
              user={user}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */

// Create supabase client outside component to prevent recreation on each render
const supabase = createClient();

function MessageDashboard({
  activeStackId,
  activeStackName,
  user
}: {
  activeStackId: string | null,
  activeStackName: string,
  user: any
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // 1. Fetch & Subscribe to Messages
  useEffect(() => {
    if (!activeStackId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      const { data } = await supabase
        .from('project_messages')
        .select('*')
        .eq('order_item_id', activeStackId)
        .order('created_at', { ascending: true });

      if (data) setMessages(data);
      setLoadingMessages(false);
    };

    fetchMessages();

    // Real-time Subscription
    const channel = supabase.channel(`client_view_${activeStackId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'project_messages',
        filter: `order_item_id=eq.${activeStackId}`
      }, (payload) => {
        setMessages(prev => {
          // Prevent duplicates if we already added it optimistically
          const exists = prev.find(m => m.id === payload.new.id);
          return exists ? prev : [...prev, payload.new];
        });
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime: Connected to channel (Stackboard)');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Realtime: Channel error', err);
        } else if (status === 'TIMED_OUT') {
          console.error('Realtime: Connection timed out');
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [activeStackId]);

  // 2. Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loadingMessages]);

  // 3. Send Message Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !activeStackId) return;

    const content = input.trim();
    const tempId = Date.now(); // Temp ID for optimistic UI

    // Optimistic Update
    const optimisticMsg = {
      id: tempId,
      content: content,
      sender_id: user.id,
      sender_role: 'client',
      created_at: new Date().toISOString(),
      order_item_id: activeStackId
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setInput("");

    // DB Insert
    const { data, error } = await supabase.from('project_messages').insert({
      order_item_id: activeStackId,
      content: content,
      sender_id: user.id,
      sender_role: 'client'
    }).select().single();

    if (error) {
      console.error("Failed to send", error);
      // Rollback
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } else {
      // Replace temp ID with real ID
      setMessages(prev => prev.map(m => m.id === tempId ? data : m));
    }
  };

  if (!activeStackId) {
    return (
      <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[32px] h-[700px] flex items-center justify-center text-neutral-700">
        <div className="flex flex-col items-center gap-4">
          <Terminal size={48} strokeWidth={1} />
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">Select_Node_To_Initialize_Uplink</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[32px] overflow-hidden flex flex-col h-[700px]">

      {/* Header */}
      <div className="p-6 border-b border-neutral-900 flex items-center justify-between bg-neutral-900/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-teal-500 border border-white/5">
            <Terminal size={18} />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Deployment_Console</h3>
            <p className="text-[9px] font-mono text-neutral-600 uppercase mt-0.5">Target: {activeStackName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className={`w-2 h-2 rounded-full ${loadingMessages ? 'bg-yellow-500' : 'bg-teal-500'} animate-pulse`} />
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8 scrollbar-hide">
        {messages.length === 0 && !loadingMessages ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Channel_Open_No_Traffic</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender_role === 'client';
            return (
              <div key={m.id} className={`flex flex-col gap-2 max-w-[450px] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isMe ? 'mr-1 text-teal-500/50' : 'ml-1 text-neutral-700'}`}>
                  {isMe ? 'User_Auth' : 'System_Admin'}
                </span>

                <div className={cn(
                  "p-5 text-[13px] font-bold leading-relaxed shadow-lg relative",
                  isMe
                    ? "bg-teal-500 text-black rounded-[24px] rounded-tr-none"
                    : "bg-neutral-900/80 border border-neutral-800 text-neutral-300 rounded-[24px] rounded-tl-none"
                )}>
                  {m.content}
                </div>

                <span className="text-[8px] font-mono text-neutral-800 uppercase">
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-neutral-900/20 border-t border-neutral-900">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="EXECUTE TRANSMISSION..."
            className="w-full bg-black border border-neutral-800 rounded-2xl py-5 px-8 text-xs text-white font-mono focus:outline-none focus:border-teal-500/50 focus:shadow-[0_0_30px_rgba(20,184,166,0.1)] transition-all placeholder:text-neutral-800"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-neutral-600 hover:text-teal-500 transition-colors disabled:opacity-50"
          >
            <span className="text-[10px] font-bold hidden sm:block">SEND</span>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function StackCard({ stack, isSelected, onClick }: { stack: PURCHASED_STACKS; isSelected?: boolean; onClick?: () => void }) {
  const getIconForType = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'security': return Lock;
      case 'payment': return Zap;
      case 'infrastructure': return Server;
      case 'storage': return Database;
      default: return Layers;
    }
  };
  const Icon = stack.icon || getIconForType(stack.type);

  return (
    <div
      className={`group bg-[#0a0a0a] border p-8 rounded-[32px] transition-all duration-500 relative overflow-hidden cursor-pointer
        ${isSelected
          ? 'border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.2)]'
          : 'border-neutral-900 hover:border-teal-500/30'
        }
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-12">
        <div className={`p-3 rounded-2xl transition-colors duration-500 ${isSelected ? 'bg-teal-500 text-black' : 'bg-neutral-900 group-hover:bg-teal-500 group-hover:text-black text-neutral-400'}`}>
          <Icon size={20} />
        </div>
        <div className="text-[9px] font-bold text-neutral-600 border border-neutral-800 px-3 py-1 rounded-full uppercase tracking-widest">
          {stack.status}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[9px] font-black text-teal-500/60 uppercase tracking-[0.4em]">{stack.type}</p>
        <h3 className="text-white font-black text-lg tracking-tighter uppercase">{stack.name}</h3>
      </div>

      <div className="mt-8 pt-8 border-t border-neutral-900 flex items-end justify-between">
        <div>
          <p className="text-[8px] font-bold text-neutral-700 uppercase tracking-[0.3em] mb-1">Architecture_Value</p>
          <p className="text-2xl font-mono text-white font-bold tracking-tighter">₹{stack.price.toFixed(2)}</p>
        </div>
        <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-600 group-hover:text-white group-hover:bg-neutral-800 transition-all">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </div>
  );
}

function ProgressStep({ step }: { step: PURCHASED_SUBSTACKS }) {
  const isCompleted = step.status === 'completed';
  const isCurrent = step.status === 'current';

  return (
    <div className={cn("flex gap-6 items-start transition-opacity duration-500", !isCompleted && !isCurrent && "opacity-25")}>
      <div className={cn(
        "z-10 w-[42px] h-[42px] shrink-0 rounded-full flex items-center justify-center border-4 border-[#020202]",
        isCompleted ? "bg-teal-500 text-black" : isCurrent ? "bg-neutral-900 border-teal-500/50 text-teal-500" : "bg-neutral-900 text-neutral-700"
      )}>
        {isCompleted ? <Check size={20} strokeWidth={4} /> : <div className={cn("w-1.5 h-1.5 rounded-full", isCurrent ? "bg-teal-500 animate-pulse" : "bg-neutral-700")} />}
      </div>
      <div className="space-y-1.5 pt-1">
        <p className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isCurrent ? "text-teal-500" : "text-white")}>{step.label}</p>
      </div>
    </div>
  );
}

function BootSequence() {
  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center font-mono">
      <div className="relative w-64 h-[1px] bg-neutral-900 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-teal-500 animate-loading" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] tracking-[0.8em] text-teal-500 uppercase animate-pulse">Initializing Nexus.OS</p>
        <p className="text-[8px] tracking-[0.2em] text-neutral-700 uppercase">Kernel Revision 4.2.0-Alpha</p>
      </div>
      <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
          .animate-loading {
            animation: loading 1.5s infinite ease-in-out;
          }
       `}</style>
    </div>
  )
}