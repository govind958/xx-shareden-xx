"use client"

import React, { useEffect, useState, useRef, Suspense, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Terminal, Send, Zap,
  Box, ArrowRight, LayoutGrid,
  Play, CheckCircle, Loader2, Plus
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { updateOrderItemStatus, updateOrderItemProgress, type OrderItemStatus } from '@/src/modules/employee/actions';
import { toast } from 'sonner';
import { 
  MessageCardRenderer, 
  type MessageType, 
  type AppointmentData, 
  type MessageMetadata 
} from '@/src/components/messaging/message-cards';
import { ActionMenu } from '@/src/components/messaging/action-menu';
import { AppointmentModal } from '@/src/components/messaging/create-modals';

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
  const [isUpdatingStatus, startStatusTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Component-based messaging state
  const [showActions, setShowActions] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // 1. Initial Data Fetch: Get Supabase Auth user and verify employee
  useEffect(() => {
    async function initDashboard() {
      // Get Supabase Auth session (required for realtime to work)
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error('No valid auth session found');
        setLoading(false);
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
    initDashboard();
  }, [orderItemId]);

  // 2. Real-time Listeners (Messages & Progress)
  useEffect(() => {
    if (!orderItemId) return;

    // Function to fetch messages (used for polling fallback)
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

  // Handle action menu selection
  const handleActionSelect = (type: MessageType | 'doc') => {
    setShowActions(false);
    if (type === 'appointment') {
      setShowAppointmentModal(true);
    } else if (type === 'doc') {
      toast.info('File sharing coming soon!');
    }
  };

  // Send component-based message
  const sendComponentMessage = async (
    messageType: MessageType, 
    metadata: MessageMetadata,
    contentDescription: string
  ) => {
    if (!user || !orderItemId) return;

    const { data, error } = await supabase.from('project_messages').insert({
      order_item_id: orderItemId,
      content: contentDescription,
      sender_id: user.id,
      sender_role: 'employee',
      message_type: messageType,
      metadata: metadata
    }).select().single();

    if (error) {
      toast.error('Failed to send message');
      return;
    }

    if (data) {
      setMessages(prev => {
        const exists = prev.find(m => m.id === data.id);
        return exists ? prev : [...prev, data];
      });
      toast.success('Message sent!');
    }
  };

  // Handle appointment creation
  const handleCreateAppointment = (data: AppointmentData) => {
    sendComponentMessage('appointment', { appointment: data }, `Appointment request: ${data.title}`);
  };

  // Handle appointment status update
  const handleAppointmentStatusUpdate = async (messageId: string, status: 'approved' | 'declined') => {
    const message = messages.find(m => m.id === messageId);
    if (!message?.metadata?.appointment) return;

    const updatedMetadata = {
      ...message.metadata,
      appointment: { ...message.metadata.appointment, status }
    };

    const { error } = await supabase
      .from('project_messages')
      .update({ metadata: updatedMetadata })
      .eq('id', messageId);

    if (error) {
      toast.error('Failed to update appointment status');
      return;
    }

    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, metadata: updatedMetadata } : m
    ));
    toast.success(`Appointment ${status}!`);
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
                {/* Chat Header with Status Controls */}
                <div className="p-6 border-b border-neutral-900 bg-zinc-900/10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-teal-500 border border-white/5">
                        <Terminal size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Node_Uplink_Channel</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-mono text-neutral-600 uppercase">Status:</span>
                          <span className={cn(
                            "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                            getStatusInfo(activeStack?.status || 'initiated').bg,
                            getStatusInfo(activeStack?.status || 'initiated').color
                          )}>
                            {getStatusInfo(activeStack?.status || 'initiated').label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Action Buttons */}
                    <div className="flex items-center gap-2">
                      {activeStack?.status !== 'completed' && (
                        <>
                          {/* Start Working Button */}
                          {(activeStack?.status === 'initiated' || activeStack?.status === 'processing') && (
                            <button
                              onClick={() => handleStatusUpdate('in_progress')}
                              disabled={isUpdatingStatus}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                "bg-amber-500/20 text-amber-400 border border-amber-500/30",
                                "hover:bg-amber-500/30 hover:border-amber-500/50",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                              )}
                            >
                              {isUpdatingStatus ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Play size={14} fill="currentColor" />
                              )}
                              Start Working
                            </button>
                          )}
                          
                          {/* Mark Complete Button */}
                          {activeStack?.status === 'in_progress' && (
                            <button
                              onClick={() => handleStatusUpdate('completed')}
                              disabled={isUpdatingStatus}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                "bg-green-500/20 text-green-400 border border-green-500/30",
                                "hover:bg-green-500/30 hover:border-green-500/50",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                              )}
                            >
                              {isUpdatingStatus ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                              Mark Complete
                            </button>
                          )}
                        </>
                      )}
                      
                      {/* Completed Badge */}
                      {activeStack?.status === 'completed' && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30">
                          <CheckCircle size={14} />
                          <span className="text-[10px] font-black uppercase tracking-wider">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {activeStack && (
                    <div className="mt-4 pt-4 border-t border-neutral-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Progress</span>
                        <span className="text-[10px] font-mono text-teal-400">{activeStack.progress_percent || 0}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500 ease-out"
                          style={{ width: `${activeStack.progress_percent || 0}%` }}
                        />
                      </div>
                      
                      {/* Quick Progress Buttons (only when in_progress) */}
                      {activeStack.status === 'in_progress' && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-[8px] font-black text-neutral-700 uppercase">Quick Set:</span>
                          {[25, 50, 75, 100].map((percent) => (
                            <button
                              key={percent}
                              onClick={() => handleProgressUpdate(percent)}
                              className={cn(
                                "px-2 py-1 rounded text-[9px] font-mono transition-all",
                                activeStack.progress_percent === percent
                                  ? "bg-teal-500/30 text-teal-400 border border-teal-500/50"
                                  : "bg-neutral-800 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300"
                              )}
                            >
                              {percent}%
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-hide">
                  {messages.length > 0 ? messages.map((m, i) => {
                    const isMe = m.sender_role === 'employee';
                    const messageType = m.message_type || 'text';
                    const isComponentMessage = messageType !== 'text' && m.metadata;
                    
                    return (
                      <div key={m.id || i} className={cn("flex flex-col gap-1.5", isMe ? "items-end" : "items-start")}>
                        <span className="text-[8px] font-black text-neutral-700 tracking-widest">
                          {isMe ? 'You (Operative)' : 'Client_Auth'}
                        </span>
                        
                        {isComponentMessage ? (
                          <div className={cn("max-w-[85%]", isMe ? "ml-auto" : "mr-auto")}>
                            <MessageCardRenderer
                              messageType={messageType as MessageType}
                              metadata={m.metadata}
                              isMe={isMe}
                              onAppointmentApprove={() => handleAppointmentStatusUpdate(m.id, 'approved')}
                              onAppointmentDecline={() => handleAppointmentStatusUpdate(m.id, 'declined')}
                            />
                          </div>
                        ) : (
                          <div className={cn(
                            "p-4 rounded-2xl max-w-[80%] text-[13px] font-bold tracking-tight leading-relaxed shadow-lg",
                            isMe
                              ? "bg-teal-500 text-black rounded-tr-none"
                              : "bg-neutral-900 text-white border border-neutral-800 rounded-tl-none"
                          )}>
                            {m.content}
                          </div>
                        )}
                      </div>
                    );
                  }) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-[10px] tracking-[0.5em] uppercase">
                      Awaiting_Initial_Handshake...
                    </div>
                  )}
                </div>

                {/* Input Area with Action Menu */}
                <form onSubmit={sendMessage} className="p-8 bg-black/40 border-t border-neutral-900">
                  <div className="relative">
                    {/* Action Menu Popover */}
                    <ActionMenu 
                      isOpen={showActions} 
                      onClose={() => setShowActions(false)} 
                      onAction={handleActionSelect}
                    />
                    
                    <div className="flex items-center gap-3">
                      {/* Plus Button for Actions */}
                      <button 
                        type="button"
                        onClick={() => setShowActions(!showActions)}
                        className={cn(
                          "p-3 rounded-xl transition-all shrink-0",
                          showActions 
                            ? "bg-teal-500 text-black rotate-45" 
                            : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                        )}
                      >
                        <Plus size={20} />
                      </button>
                      
                      {/* Text Input */}
                      <div className="relative flex-1">
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
                    </div>
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
      
      {/* Component Message Modals */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onSubmit={handleCreateAppointment}
      />
    </div>
  );
}

export default function TechNoirDashboard() {
  return <Suspense fallback={null}><ClientDashboardContent /></Suspense>;
}