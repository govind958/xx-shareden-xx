'use client'

import React, { useEffect, useState, useRef } from 'react';
import {
  Clock,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpRight,
  LayoutGrid,
  List,
  User,
  Zap,
  Activity,
  Calendar,
  Terminal,
  Cpu,
  Shield,
  Radio,
  BarChart3,
  Wifi,
  ChevronDown,
  ChevronUp,
  Database,
  Lock,
  Loader2,
  Circle,
  Server,
  Layers,
  Box,
  LucideIcon,
  MessageSquare,
  Send,
  Mic,
  Paperclip,
  Maximize2
} from 'lucide-react';

/* ---------------- DATABASE TYPES & INTERFACES ---------------- */

// Represents 'public.employees'
interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  is_active: boolean;
}

// Represents 'public.stacks'
interface StackDefinition {
  id: string;
  name: string;
  type: string;
  description: string;
  base_price: number;
}

// Represents 'public.sub_stacks'
interface SubStackDefinition {
  id: string;
  stack_id: string;
  name: string;
  price: number;
}

// Represents chat messages (UI specific, derived or stored separately)
interface Message {
  id: string;
  sender: 'system' | 'lead' | 'admin';
  text: string;
  timestamp: string;
}

// Represents 'public.order_items' joined with Stack, Employee, and SubStack definitions
interface OrderItem {
  // DB Fields
  id: string;
  order_id: string;
  user_id: string;
  stack_id: string;
  sub_stack_ids: string[]; // Array of UUIDs from DB
  status: string;          // e.g., 'initiated', 'pending', 'completed'
  step: number;            // Current step integer (1-based index)
  progress_percent: number;
  eta: string | null;
  user_note?: string;
  assigned_to?: string;    // UUID
  
  // Joined Data (for UI display)
  stack: StackDefinition;
  assigned_employee?: Employee;
  resolved_sub_stacks: SubStackDefinition[]; // Map sub_stack_ids to definitions
  
  // UI Specific
  messages: Message[];
  latency?: string; // Mock metric
}

// Represents 'public.orders'
interface OrderCluster {
  id: string;
  user_id: string;
  total_amount: number;
  created_at: string;
  
  // UI Grouping
  items: OrderItem[];
}

/* ---------------- UTILS ---------------- */
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

/* ---------------- MOCK DATA GENERATORS ---------------- */

// 1. Define Employees
const EMPLOYEES: Record<string, Employee> = {
  'emp-1': { id: 'emp-1', name: 'Alex Chen', role: 'Senior Dev', email: 'alex@nexus.os', is_active: true },
  'emp-2': { id: 'emp-2', name: 'Sarah Jones', role: 'Security Lead', email: 'sarah@nexus.os', is_active: true },
  'emp-3': { id: 'emp-3', name: 'Mike Ross', role: 'DevOps Engineer', email: 'mike@nexus.os', is_active: true },
};

// 2. Define Stacks
const STACKS: Record<string, StackDefinition> = {
  'stk-1': { id: 'stk-1', name: 'PAYMENT_GATEWAY_INTEGRATION', type: 'BACKEND_MODULE', description: 'Stripe/PayPal integration', base_price: 500 },
  'stk-2': { id: 'stk-2', name: 'USER_AUTH_PROTOCOL', type: 'SECURITY_CORE', description: 'OAuth2 + JWT', base_price: 300 },
  'stk-3': { id: 'stk-3', name: 'INFRASTRUCTURE_AWS_NODES', type: 'DEVOPS_OPS', description: 'EC2 Cluster', base_price: 1200 },
};

// 3. Define Sub Stacks (Steps)
const SUB_STACKS: Record<string, SubStackDefinition> = {
  // Payment Steps
  'ss-1': { id: 'ss-1', stack_id: 'stk-1', name: 'ENV_VAR_CONFIG', price: 0 },
  'ss-2': { id: 'ss-2', stack_id: 'stk-1', name: 'STRIPE_API_HANDSHAKE', price: 0 },
  'ss-3': { id: 'ss-3', stack_id: 'stk-1', name: 'WEBHOOK_LISTENERS', price: 0 },
  'ss-4': { id: 'ss-4', stack_id: 'stk-1', name: 'FINAL_DEPLOYMENT', price: 0 },
  
  // Auth Steps
  'ss-5': { id: 'ss-5', stack_id: 'stk-2', name: 'OAUTH_PROVIDER_SETUP', price: 0 },
  'ss-6': { id: 'ss-6', stack_id: 'stk-2', name: 'JWT_TOKEN_GENERATION', price: 0 },
  'ss-7': { id: 'ss-7', stack_id: 'stk-2', name: 'SESSION_ENCRYPTION', price: 0 },
  
  // DevOps Steps
  'ss-8': { id: 'ss-8', stack_id: 'stk-3', name: 'VPC_CONFIGURATION', price: 0 },
  'ss-9': { id: 'ss-9', stack_id: 'stk-3', name: 'EC2_INSTANCE_PROVISION', price: 0 },
  'ss-10': { id: 'ss-10', stack_id: 'stk-3', name: 'LOAD_BALANCER_SETUP', price: 0 },
  'ss-11': { id: 'ss-11', stack_id: 'stk-3', name: 'SECURITY_GROUP_AUDIT', price: 0 },
};

// 4. Create Mock Orders
const MOCK_ORDERS: OrderCluster[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    user_id: 'user-123',
    total_amount: 2400.00,
    created_at: '2024-02-01T10:00:00Z',
    items: [
      {
        id: 'item-1',
        order_id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: 'user-123',
        stack_id: 'stk-1',
        stack: STACKS['stk-1'],
        sub_stack_ids: ['ss-1', 'ss-2', 'ss-3', 'ss-4'],
        resolved_sub_stacks: [SUB_STACKS['ss-1'], SUB_STACKS['ss-2'], SUB_STACKS['ss-3'], SUB_STACKS['ss-4']],
        status: 'completed',
        step: 5, // All 4 steps done (current step > total)
        progress_percent: 100,
        eta: '2024-03-10',
        assigned_to: 'emp-1',
        assigned_employee: EMPLOYEES['emp-1'],
        latency: '12ms',
        messages: [
           { id: 'm1', sender: 'system', text: 'Deployment initialized successfully.', timestamp: '09:00' },
           { id: 'm2', sender: 'lead', text: 'API keys rotated for security. Proceeding with handshake.', timestamp: '09:05' },
        ]
      },
      {
        id: 'item-2',
        order_id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: 'user-123',
        stack_id: 'stk-2',
        stack: STACKS['stk-2'],
        sub_stack_ids: ['ss-5', 'ss-6', 'ss-7'],
        resolved_sub_stacks: [SUB_STACKS['ss-5'], SUB_STACKS['ss-6'], SUB_STACKS['ss-7']],
        status: 'initiated',
        step: 2, // Currently on step 2 (JWT_TOKEN_GENERATION)
        progress_percent: 45,
        eta: '2024-03-25',
        assigned_to: 'emp-2',
        assigned_employee: EMPLOYEES['emp-2'],
        latency: '45ms',
        messages: [
           { id: 'm1', sender: 'system', text: 'OAuth providers linked: Google, GitHub.', timestamp: '11:00' },
           { id: 'm2', sender: 'lead', text: 'Optimizing the encryption algorithm now.', timestamp: '12:00' },
        ]
      },
      {
        id: 'item-3',
        order_id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: 'user-123',
        stack_id: 'stk-3',
        stack: STACKS['stk-3'],
        sub_stack_ids: ['ss-8', 'ss-9', 'ss-10', 'ss-11'],
        resolved_sub_stacks: [SUB_STACKS['ss-8'], SUB_STACKS['ss-9'], SUB_STACKS['ss-10'], SUB_STACKS['ss-11']],
        status: 'initiated',
        step: 4, // Currently on step 4 (SECURITY_GROUP_AUDIT)
        progress_percent: 85,
        eta: '2024-03-15',
        assigned_to: 'emp-3',
        assigned_employee: EMPLOYEES['emp-3'],
        latency: '8ms',
        messages: [
           { id: 'm1', sender: 'system', text: 'VPC Peering established.', timestamp: 'Yesterday' },
        ]
      }
    ]
  }
];

/* ---------------- COMPONENT ---------------- */
export default function StackBoardPage() {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedItemId, setSelectedItemId] = useState<string | null>('item-2');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const loader = setTimeout(() => setLoading(false), 1500);
    return () => {
      clearInterval(timer);
      clearTimeout(loader);
    };
  }, []);

  const totalModules = MOCK_ORDERS.reduce((acc, c) => acc + c.items.length, 0);
  const sysLoad = Math.floor(Math.random() * (45 - 30) + 30); 

  // Resolve selected item
  let selectedItem: OrderItem | undefined;
  MOCK_ORDERS.forEach(order => {
     const found = order.items.find(i => i.id === selectedItemId);
     if (found) selectedItem = found;
  });

  if (loading) return <BootSequence />;

  return (
    <div className="h-screen bg-[#050505] text-neutral-300 font-mono selection:bg-teal-500/30 overflow-hidden flex flex-col">
      
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* --- TOP NAV --- */}
      <header className="shrink-0 border-b border-neutral-800 bg-[#050505]/95 backdrop-blur-md z-50">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-teal-900/20 border border-teal-500/30 flex items-center justify-center text-teal-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-500/10 animate-pulse" />
                <Zap size={20} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-[0.2em] text-lg leading-none">NEXUS_OS</span>
                <span className="text-[10px] text-teal-500 uppercase tracking-widest mt-1">v4.2.0 Stable</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-4 text-[10px] font-bold text-neutral-500 tracking-widest">
                <div className="flex items-center gap-2">
                   <Wifi size={14} className="text-teal-500" />
                   <span>NET: ONLINE</span>
                </div>
                <div className="flex items-center gap-2">
                   <Activity size={14} className="text-teal-500" />
                   <span>SYS_LOAD: {sysLoad}%</span>
                </div>
                <div className="flex items-center gap-2">
                   <Clock size={14} className="text-teal-500" />
                   <span>{currentTime.toLocaleTimeString('en-US', { hour12: false })} UTC</span>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* --- FULL WIDTH HEADER & STATS --- */}
      <div className="shrink-0 p-6 lg:p-8 border-b border-neutral-800 bg-[#050505] z-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block w-2 h-2 bg-teal-500 animate-pulse shadow-[0_0_10px_#14b8a6]" />
                <span className="text-[10px] font-bold text-teal-500 uppercase tracking-[0.3em]">Live Node Tracking</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase font-sans">
                Deployment <span className="text-neutral-600">Matrix</span>
              </h1>
            </div>
            <div className="flex gap-2">
                <button className="h-9 px-4 border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest transition-colors">
                   Export Logs
                </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatPanel label="Total Modules" value={totalModules} icon={Layers} trend="ACTIVE" />
              <StatPanel label="System Efficiency" value="94.2%" icon={Cpu} trend="STABLE" />
              <StatPanel label="Security Level" value="SECURE" icon={Shield} trend="LOCK" color="text-green-500" />
              <StatPanel label="Active Orders" value={MOCK_ORDERS.length} icon={Server} trend="ONLINE" color="text-teal-500" />
          </div>
      </div>

      {/* --- SPLIT VIEW LAYOUT --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: ORDERS & MODULES */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
            {MOCK_ORDERS.map((order) => (
               <OrderClusterContainer 
                 key={order.id} 
                 order={order} 
                 selectedItemId={selectedItemId}
                 onSelectItem={setSelectedItemId}
               />
            ))}
        </div>

        {/* RIGHT PANEL: MESSAGING UI */}
        <div className="w-[400px] xl:w-[500px] border-l border-neutral-800 bg-[#080808] flex flex-col relative z-20 shadow-2xl">
           {selectedItem ? (
              <CommunicationConsole item={selectedItem} />
           ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 p-8 text-center">
                 <Radio size={48} className="mb-4 opacity-20" />
                 <p className="text-xs uppercase tracking-widest font-bold">Secure Channel Standby</p>
                 <p className="text-[10px] mt-2 font-mono">Select a module to establish uplink</p>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */

interface OrderClusterProps {
  order: OrderCluster;
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
}

function OrderClusterContainer({ order, selectedItemId, onSelectItem }: OrderClusterProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative border border-neutral-800/60 bg-[#080808] overflow-hidden">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 px-6 cursor-pointer hover:bg-neutral-900/40 transition-colors border-b border-neutral-800 group"
      >
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-teal-500 group-hover:border-teal-500/30 transition-all">
              <Server size={16} />
           </div>
           <div>
              <h2 className="text-sm font-black tracking-tight text-white font-sans">
                 ORDER #{order.id.split('-')[0].toUpperCase()}
              </h2>
              <div className="flex items-center gap-3 mt-0.5">
                 <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                    ID: {order.id.slice(0, 18)}...
                 </span>
                 <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                    TOTAL: ${order.total_amount}
                 </span>
              </div>
           </div>
        </div>

        <button className={cn(
            "w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 bg-neutral-900 text-neutral-500",
            isOpen ? "rotate-180" : ""
        )}>
           <ChevronDown size={14} />
        </button>
      </div>

      <div className={cn(
          "transition-all duration-500 ease-in-out bg-[#0a0a0a]/50",
          isOpen ? "max-h-[3000px] opacity-100 p-4 space-y-3" : "max-h-0 opacity-0 overflow-hidden py-0"
      )}>
         {order.items.map((item) => (
            <OrderItemRow 
              key={item.id} 
              item={item} 
              isSelected={selectedItemId === item.id}
              onSelect={() => onSelectItem(item.id)}
            />
         ))}
      </div>
    </div>
  )
}

interface OrderItemRowProps {
  item: OrderItem;
  isSelected: boolean;
  onSelect: () => void;
}

function OrderItemRow({ item, isSelected, onSelect }: OrderItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCompleted = item.progress_percent === 100;
  
  return (
    <div className={cn(
        "group relative bg-[#0c0c0c] border transition-all duration-300 overflow-hidden",
        isSelected 
          ? "border-teal-500 shadow-[0_0_20px_-5px_rgba(20,184,166,0.15)] bg-[#0d0d0d]" 
          : "border-neutral-800 hover:border-neutral-700"
    )}>
      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 z-10" />}

      <div 
        onClick={() => {
           onSelect();
           setIsExpanded(!isExpanded);
        }}
        className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-neutral-900/50 transition-colors"
      >
         <div className="flex items-center gap-4">
            <div className={cn(
                "w-10 h-10 flex items-center justify-center border transition-colors relative shrink-0",
                isCompleted 
                   ? "bg-teal-500/20 text-teal-400 border-teal-500/50" 
                   : isSelected
                      ? "bg-teal-500/10 text-teal-300 border-teal-500/30"
                      : "bg-neutral-900 border-neutral-800 text-neutral-500"
            )}>
                {getIconByType(item.stack.type)}
            </div>
            
            <div className="flex flex-col gap-0.5">
               <h3 className={cn(
                   "font-bold tracking-tight text-sm font-sans transition-colors",
                   isSelected ? "text-teal-400" : "text-neutral-300 group-hover:text-white"
               )}>
                  {item.stack.name}
               </h3>
               <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{item.stack.type}</span>
                  <span className="text-[9px] text-neutral-600 font-mono">
                      {item.progress_percent}% SYNC
                  </span>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <StatusTag status={item.status} minimal />
            <ChevronDown size={14} className={cn("transition-transform duration-300 text-neutral-600", isExpanded ? "rotate-180" : "")} />
         </div>
      </div>

      {/* EXPANDED STEPPER AREA */}
      <div className={cn(
          "grid transition-all duration-500 ease-in-out bg-[#080808]",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
         <div className="overflow-hidden">
            <div className="p-6 border-t border-neutral-800/50">
               <h4 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity size={12} className="text-teal-500" /> Execution Sequence (Step {item.step}/{item.resolved_sub_stacks.length})
               </h4>
               <VerticalStepper 
                 steps={item.resolved_sub_stacks} 
                 currentStepIndex={item.step} // DB 'step' is 1-based usually, assume index + 1
               />
               
               <div className="mt-6 pt-4 border-t border-neutral-800/50 flex items-center justify-between">
                  <div className="text-[9px] font-mono text-neutral-600">
                     LEAD: {item.assigned_employee?.name || 'UNASSIGNED'}
                  </div>
                  <button className="text-[9px] uppercase tracking-widest font-bold text-teal-500 hover:text-white transition-colors">
                     View Full Logs &rarr;
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function VerticalStepper({ steps, currentStepIndex }: { steps: SubStackDefinition[], currentStepIndex: number }) {
  // Logic: step < currentStepIndex -> Completed
  // Logic: step == currentStepIndex -> Processing
  // Logic: step > currentStepIndex -> Pending
  
  return (
    <ol className="relative border-s border-neutral-800 ml-2">
       {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStepIndex;
          const isProcessing = stepNumber === currentStepIndex;

          return (
             <li key={step.id} className="mb-6 ms-6 last:mb-0">
                <span className={cn(
                   "absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-4 ring-[#080808] transition-all duration-300",
                   isCompleted 
                      ? "bg-teal-500 text-black shadow-[0_0_15px_rgba(20,184,166,0.4)]" 
                      : isProcessing 
                         ? "bg-neutral-900 border border-teal-500 text-teal-500" 
                         : "bg-neutral-900 border border-neutral-800 text-neutral-600"
                )}>
                   {isCompleted ? <CheckCircle2 size={12} /> : 
                    isProcessing ? <Loader2 size={12} className="animate-spin" /> : 
                    <Circle size={12} />}
                </span>
                
                <h3 className={cn(
                   "font-bold leading-tight uppercase tracking-widest text-[10px] mb-0.5 transition-colors",
                   isCompleted ? "text-teal-400" : isProcessing ? "text-white" : "text-neutral-500"
                )}>
                   {step.name}
                </h3>
                
                <p className={cn("text-[9px] font-mono", isProcessing ? "text-teal-600 animate-pulse" : "text-neutral-600")}>
                   {isCompleted ? 'COMPLETED' : isProcessing ? 'IN PROGRESS' : 'QUEUED'}
                </p>
             </li>
          )
       })}
    </ol>
  )
}

function CommunicationConsole({ item }: { item: OrderItem }) {
   const [input, setInput] = useState('');
   const scrollRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
   }, [item.messages]);

   return (
      <div className="flex flex-col h-full">
         <div className="p-4 border-b border-neutral-800 bg-[#0a0a0a] flex items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
                <div className="relative">
                   <div className="w-8 h-8 rounded-full bg-teal-900/30 border border-teal-500/30 flex items-center justify-center text-teal-400">
                      <User size={14} />
                   </div>
                   <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   </div>
                </div>
                <div>
                   <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      {item.assigned_employee?.name || 'UNASSIGNED'}
                   </h3>
                   <p className="text-[9px] text-teal-500 font-mono">SECURE_UPLINK_ESTABLISHED</p>
                </div>
             </div>
             <div className="flex gap-2">
                <button className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded"><Maximize2 size={14} /></button>
             </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800" ref={scrollRef}>
            <div className="flex justify-center my-4">
               <span className="text-[9px] font-mono text-neutral-700 bg-neutral-900/50 px-2 py-1 rounded">
                  SESSION START: {item.eta || 'IMMEDIATE'}
               </span>
            </div>

            {item.messages.length === 0 && (
               <div className="text-center py-10 opacity-30">
                  <Terminal size={32} className="mx-auto mb-2" />
                  <p className="text-[10px] uppercase font-bold">No transmission history</p>
               </div>
            )}

            {item.messages.map((msg) => {
               const isLead = msg.sender === 'lead';
               return (
                  <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isLead ? "items-start mr-auto" : "items-end ml-auto")}>
                     <div className={cn(
                        "p-3 rounded-lg border text-xs font-mono leading-relaxed relative",
                        isLead 
                           ? "bg-[#111] border-neutral-800 text-neutral-300 rounded-tl-none" 
                           : "bg-teal-950/20 border-teal-500/20 text-teal-100 rounded-tr-none"
                     )}>
                        {msg.text}
                     </div>
                     <span className="text-[9px] text-neutral-600 mt-1 font-mono uppercase">
                        {msg.sender === 'system' ? 'SYS' : msg.sender === 'lead' ? 'OPR' : 'ADM'} // {msg.timestamp}
                     </span>
                  </div>
               )
            })}
         </div>

         <div className="p-4 border-t border-neutral-800 bg-[#0a0a0a] shrink-0">
            <div className="relative">
               <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Transmit command..."
                  className="w-full bg-[#050505] border border-neutral-800 rounded-lg pl-4 pr-24 py-3 text-xs font-mono text-white focus:outline-none focus:border-teal-500/50 transition-colors placeholder:text-neutral-700"
               />
               <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1.5 text-neutral-600 hover:text-teal-500 transition-colors"><Mic size={14} /></button>
                  <button className="p-1.5 text-neutral-600 hover:text-teal-500 transition-colors"><Paperclip size={14} /></button>
                  <button className="p-1.5 bg-teal-500 text-black rounded hover:bg-teal-400 transition-colors">
                     <Send size={12} />
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

function StatPanel({ label, value, icon: Icon, trend, color = "text-white" }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-neutral-800 p-4 flex flex-col justify-between h-24 relative overflow-hidden group hover:border-neutral-700 transition-colors">
      <div className="absolute top-0 right-0 p-3 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-500">
        <Icon size={48} />
      </div>
      <div className="flex justify-between items-start z-10">
         <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="z-10 mt-auto">
         <div className={cn("text-xl font-black tracking-tighter font-mono", color)}>{value}</div>
         <div className="text-[8px] font-bold text-neutral-600 uppercase mt-1 tracking-widest flex items-center gap-1">
            <span className="w-1 h-1 bg-teal-500/50 rounded-full inline-block" />
            {trend}
         </div>
      </div>
    </div>
  )
}

function StatusTag({ status, minimal }: { status: string; minimal?: boolean }) {
  const normalizedStatus = status.toLowerCase();
  
  const styles: Record<string, string> = {
    completed: "bg-teal-500/10 text-teal-400 border-teal-500/50",
    initiated: "bg-blue-500/10 text-blue-400 border-blue-500/50",
    pending: "bg-neutral-800 text-neutral-400 border-neutral-700"
  };

  const currentStyle = styles[normalizedStatus] || styles.pending;
  
  if (minimal) {
     const dotColors: Record<string, string> = {
        completed: "bg-teal-500",
        initiated: "bg-blue-500",
        pending: "bg-neutral-500"
     }
     const currentDot = dotColors[normalizedStatus] || "bg-neutral-500";

     return (
        <div className="flex items-center gap-2">
           <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", currentDot)} />
           <span className="text-[9px] font-bold text-neutral-400 hidden sm:block">{status.toUpperCase()}</span>
        </div>
     )
  }
  
  return (
    <div className={cn("px-2 py-1 border text-[8px] font-black uppercase tracking-widest min-w-[60px] text-center", currentStyle)}>
      {status.toUpperCase()}
    </div>
  )
}

function getIconByType(type: string) {
   if (type.includes('BACKEND')) return <Database size={18} />;
   if (type.includes('SECURITY')) return <Lock size={18} />;
   if (type.includes('DEVOPS')) return <Cpu size={18} />;
   return <Terminal size={18} />;
}

function BootSequence() {
  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-teal-500 font-mono">
       <div className="w-64 mb-4">
          <div className="h-1 w-full bg-neutral-900 overflow-hidden">
             <div className="h-full bg-teal-500 animate-progress" style={{ width: '100%', animation: 'grow 1.5s ease-in-out' }} />
          </div>
       </div>
       <p className="text-xs tracking-[0.2em] animate-pulse">INITIALIZING SYSTEM CORE...</p>
       <style jsx>{`
          @keyframes grow { from { width: 0% } to { width: 100% } }
       `}</style>
    </div>
  )
}