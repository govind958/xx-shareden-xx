"use client";

import React, { useEffect, useState, useRef, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Zap, Send, Paperclip, MoreHorizontal, Search, 
  Smile, Mic, CheckCheck, Terminal, Bell
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { updateOrderItemStatus, updateOrderItemProgress, type OrderItemStatus } from '@/src/modules/employee/actions';
import { toast } from 'sonner';


const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');
const supabase = createClient();

// --- SAMPLE DATA ---
// const MOCK_TASKS = [
//   { id: '1', stacks: { name: 'NEXT.JS_ENTERPRISE_CORE' }, status: 'in_progress', progress_percent: 75, unread: 3 },
//   { id: '2', stacks: { name: 'STRIPE_PAYMENT_GATEWAY' }, status: 'completed', progress_percent: 100, unread: 0 },
//   { id: '3', stacks: { name: 'SUPABASE_AUTH_PROTOCOL' }, status: 'initiated', progress_percent: 15, unread: 12 },
// ];

function StackboardMessagingUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderItemId = searchParams.get('id');

  const [orders, setOrders] = useState<any[]>([]);
  const [activeStack, setActiveStack] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [isUpdatingStatus, startStatusTransition] = useTransition();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
        // Get Supabase Auth session (required for realtime to work)
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
          console.error('No valid auth session found');
          setLoading(false);
          router.push('/Employee_portal/login');
            return;
        }
              // Verify user is an employee
      const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('id, email, name, role, is_active')
      .eq('id', authUser.id)
      .eq('is_active', true)
      .single();

    if (empError || !employee) {
      console.error('User is not an employee');
      setLoading(false);
      return;
    }

    setUser({ id: employee.id, email: employee.email });
    setEmployeeId(employee.id);
          // Fetch order_items assigned to this employee
          const { data: cartItems } = await supabase
          .from('order_items')
          .select('*, stacks(name)')
          .eq('assigned_to', employee.id)
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
    init();
  }, [orderItemId]);

  // 2. Real-time Listeners (Messages & Progress)
  useEffect(()=>{
    if(!orderItemId) return;

    //Function to fetch messages (used for polling fallback)
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('project_messages')
        .select('*')
        .eq('order_item_id', orderItemId)
        .order('created_at', { ascending: true });
      
      if (data) {
        // Always use the fresh data from DB to avoid duplicates
        setMessages(data);
      }
    };
    console.log('Setting up realtime for order:', orderItemId);
        // Debug: Check auth state
        supabase.auth.getSession().then(({ data, error }) => {
          console.log('Current auth session:', data?.session ? 'EXISTS' : 'NONE', error);
          if (data?.session) {
            console.log('Session user:', data.session.user.email);
          }
        });
    
        const channel = supabase.channel(`nexus_${orderItemId}`)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'project_messages',
            filter: `order_item_id=eq.${orderItemId}`
          }, (payload) => {
            console.log('Realtime INSERT received:', payload);
            const newMsg = payload.new as any;
            // Deduplicate: only add if not already in state
            setMessages(prev => {
              const exists = prev.find(m => m.id === newMsg.id);
              return exists ? prev : [...prev, newMsg];
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
            console.log('Realtime subscription status:', status);
            if (status === 'SUBSCRIBED') {
              console.log('Realtime: Connected to channel (Employee Portal)');
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Realtime: Channel error', err);
            } else if (status === 'TIMED_OUT') {
              console.error('Realtime: Connection timed out');
            }
          });
    
        // Polling fallback - fetch every 3 seconds in case realtime doesn't work
        const pollInterval = setInterval(fetchMessages, 3000);
    
        return () => { 
          clearInterval(pollInterval);
          supabase.removeChannel(channel); 
        };
  }, [orderItemId]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // Handle status update
  const handleStatusUpdate = (newStatus: OrderItemStatus) => {
    if (!orderItemId) return;
    
    startStatusTransition(async () => {
      const result = await updateOrderItemStatus(orderItemId, newStatus);
      
      if (result.success) {
        // Update local state optimistically
        setActiveStack((prev: any) => prev ? { 
          ...prev, 
          status: newStatus,
          progress_percent: newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? 25 : prev.progress_percent
        } : prev);
        
        // Also update in orders list
        setOrders(prev => prev.map(order => 
          order.id === orderItemId 
            ? { 
                ...order, 
                status: newStatus,
                progress_percent: newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? 25 : order.progress_percent
              } 
            : order
        ));
        
        toast.success(
          newStatus === 'in_progress' 
            ? 'Started working on task!' 
            : newStatus === 'completed' 
              ? 'Task marked as completed!' 
              : 'Status updated!'
        );
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    });
  };

  // Handle progress update
  const handleProgressUpdate = async (newProgress: number) => {
    if (!orderItemId) return;
    
    const result = await updateOrderItemProgress(orderItemId, newProgress);
    
    if (result.success) {
      setActiveStack((prev: any) => prev ? { ...prev, progress_percent: newProgress } : prev);
      setOrders(prev => prev.map(order => 
        order.id === orderItemId ? { ...order, progress_percent: newProgress } : order
      ));
    } else {
      toast.error(result.error || 'Failed to update progress');
    }
  };

  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'initiated':
        return { label: 'Not Started', color: 'text-neutral-400', bg: 'bg-neutral-800' };
      case 'processing':
        return { label: 'Assigned', color: 'text-blue-400', bg: 'bg-blue-500/20' };
      case 'in_progress':
        return { label: 'Working', color: 'text-amber-400', bg: 'bg-amber-500/20' };
      case 'completed':
        return { label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/20' };
      default:
        return { label: status, color: 'text-neutral-400', bg: 'bg-neutral-800' };
    }
  };

  // --- DYNAMIC THEME CLASSES ---
  // These classes now toggle based on the 'dark' class on the parent container/html
  const theme = {
    bg: 'bg-white dark:bg-[#020202]',
    sidebar: 'bg-zinc-50 dark:bg-[#0a0a0a] border-neutral-200 dark:border-white/5',
    header: 'bg-white dark:bg-[#111] border-neutral-200 dark:border-white/5',
    text: 'text-black dark:text-white',
    inputBg: 'bg-neutral-100 dark:bg-[#181818]',
    chatBg: 'bg-neutral-50 dark:bg-[#050505]',
    bubbleMe: 'bg-teal-600 dark:bg-[#054c44] text-white',
    bubbleThem: 'bg-neutral-200 dark:bg-[#1f2c33] text-black dark:text-neutral-200',
    accentText: 'text-teal-600 dark:text-teal-500',
    accentBg: 'bg-teal-600 dark:bg-teal-500',
  };

  if (loading) return (
    <div className={cn("h-screen flex flex-col items-center justify-center font-mono italic tracking-[0.5em]", theme.bg, theme.accentText)}>
       <Zap className="animate-pulse mb-4" size={32} />
       BOOTING_OS...
    </div>
  );

  return (
    <div className={cn("flex h-screen w-full overflow-hidden antialiased transition-colors duration-500", theme.bg, theme.text)}>
      
      {/* --- SIDEBAR --- */}
      <aside className={cn("w-[30%] min-w-[340px] max-w-[450px] border-r flex flex-col", theme.sidebar)}>
        <header className={cn("h-[60px] px-4 flex items-center justify-between border-b", theme.header)}>
          <div className="flex items-center gap-2">
            <Terminal size={16} className={theme.accentText} />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Node_Explorer</span>
          </div>
        </header>

        <div className="p-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-teal-500 transition-colors" size={14} />
            <input 
              placeholder="SEARCH_NODES..." 
              className={cn("w-full rounded-lg py-2.5 pl-10 pr-4 text-[11px] font-bold focus:outline-none border border-transparent placeholder:text-neutral-500 transition-all", theme.inputBg)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {orders.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`?id=${item.id}`)}
              className={cn(
                "flex items-center gap-3 px-4 py-4 cursor-pointer border-b border-black/[0.03] dark:border-white/[0.03] transition-all relative",
                item.id === orderItemId ? "bg-teal-500/10 dark:bg-white/[0.05]" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-black/20 flex items-center justify-center border border-black/5 dark:border-white/5 relative">
                <Zap size={20} className={cn(item.id === orderItemId && "fill-current", theme.accentText)} />
                {item.unread > 0 && (
                  <span className={cn("absolute -top-1 -right-1 text-white dark:text-black text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#0a0a0a] animate-pulse", theme.accentBg)}>
                    {item.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="text-xs font-black truncate uppercase tracking-tight">{item.stacks?.name}</h3>
                  <span className="text-[9px] opacity-40 font-mono">11:04</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] opacity-60 truncate italic font-mono uppercase">{item.status}</p>
                  <div className="w-12 h-[3px] bg-black/10 dark:bg-white/10 rounded-full overflow-hidden shrink-0">
                    <div className={cn("h-full transition-all duration-1000", theme.accentBg)} style={{ width: `${item.progress_percent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* --- CHAT AREA --- */}
      <main className={cn("flex-1 flex flex-col relative", theme.chatBg)}>
        {orderItemId ? (
          <>
            <header className={cn("h-[60px] border-b px-6 flex items-center justify-between", theme.header)}>
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center">
                  <Terminal size={18} className={theme.accentText} />
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider">Active_Session</h2>
                  <p className={cn("text-[9px] font-mono uppercase font-bold", theme.accentText)}>Uplink_Secure</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-neutral-400">
                <Search size={18} className="cursor-pointer hover:text-teal-500" />
                <MoreHorizontal size={18} className="cursor-pointer hover:text-teal-500" />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {messages.map((m, i) => {
                const isMe = m.sender_role === 'employee';
                return (
                  <div key={m.id || i} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm relative border border-black/5 dark:border-white/5",
                      isMe ? cn("rounded-tr-none", theme.bubbleMe) : cn("rounded-tl-none", theme.bubbleThem)
                    )}>
                      <p className="text-[13px] leading-relaxed font-medium">{m.content}</p>
                      <div className="flex items-center justify-end gap-1.5 mt-1.5">
                        <span className="text-[8px] opacity-60 font-mono">11:24 PM</span>
                        {isMe && <CheckCheck size={12} className={isMe ? 'text-teal-200' : 'text-teal-500'} />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <footer className={cn("p-4 flex items-center gap-3 border-t", theme.header)}>
              <Smile size={22} className="text-neutral-400 cursor-pointer hover:text-teal-500" />
              <Paperclip size={22} className="text-neutral-400 cursor-pointer hover:text-teal-500" />
              <form onSubmit={sendMessage} className="flex-1">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className={cn("w-full rounded-xl py-3 px-5 text-sm focus:outline-none border border-black/10 dark:border-transparent focus:border-teal-500/50 dark:bg-[#2a3942] bg-white")}
                />
              </form>
              <button 
                onClick={sendMessage}
                className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all", theme.accentBg)}
              >
                <Send size={20} />
              </button>
            </footer>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-40">
            <Zap size={64} className={cn("mb-6", theme.accentText)} />
            <h2 className="text-sm font-black uppercase tracking-[0.5em]">Select_Active_Node</h2>
            <p className="text-[10px] mt-3 font-mono tracking-widest uppercase">Encryption_Enabled</p>
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #88888855; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}

export default function App() {
  return <Suspense fallback={null}><StackboardMessagingUI /></Suspense>;
}