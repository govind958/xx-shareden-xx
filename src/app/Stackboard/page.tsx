'use client'

import React, { useEffect, useState } from 'react';
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

/* ---------------- MOCK DATA ---------------- */
const PURCHASED_STACKS = [
  { id: 'stk-1', name: 'AUTH_PROTOCOL', type: 'SECURITY_CORE', price: 299.00, status: 'ENCRYPTED', icon: Lock },
  { id: 'stk-2', name: 'STRIPE_GATEWAY', type: 'PAYMENT_ENGINE', price: 450.00, status: 'SYNCING', icon: Zap },
  { id: 'stk-3', name: 'AWS_NODE_CLUSTER', type: 'INFRA_STRUCTURE', price: 1200.00, status: 'STABLE', icon: Server },
  { id: 'stk-4', name: 'EDGE_DATABASE', type: 'STORAGE_LAYER', price: 150.00, status: 'ACTIVE', icon: Database },
];

const SYSTEM_PROGRESS = [
  { label: 'Role_Identification', desc: 'Activist, Partner', status: 'completed' },
  { label: 'Value_Alignment', desc: 'Alertness Protocol', status: 'completed' },
  { label: 'Principles_Engine', desc: 'Recovery cycles for optimal cognitive performance.', status: 'completed' },
  { label: 'Conduct_Code', desc: 'Circadian rhythm synchronization established.', status: 'completed' },
  { label: 'Purpose_Logic', desc: 'Define primary impact vectors.', status: 'current' },
  { label: 'Vision_Matrix', desc: 'Target architectural life state.', status: 'pending' },
];

/* ---------------- UTILS ---------------- */
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

/* ---------------- MAIN COMPONENT ---------------- */

export default function TechNoirDashboard() {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const loader = setTimeout(() => setLoading(false), 1500);
    return () => {
      clearInterval(timer);
      clearTimeout(loader);
    };
  }, []);

  if (loading) return <BootSequence />;

  const progressPercent = 65; 

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

        {/* --- TECH-STACK HORIZONTAL SCROLL / GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PURCHASED_STACKS.map((stack) => (
            <StackCard key={stack.id} stack={stack} />
          ))}
        </section>

        {/* --- PRIMARY DATA INTERFACE --- */}
        <main className="grid grid-cols-12 gap-8 items-start">
          
          {/* LEFT: PROGRESS ARCHITECTURE */}
          <aside className="col-span-12 lg:col-span-4 bg-[#0a0a0a] border border-neutral-900 rounded-[32px] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-neutral-900">
              <div className="flex items-center justify-between mb-8">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.5em]">Global_Status</p>
                    <h2 className="text-white text-lg font-bold tracking-tight">System Initialization</h2>
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
                {SYSTEM_PROGRESS.map((step, idx) => (
                  <ProgressStep key={idx} step={step} />
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-neutral-900/20 flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
               <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.4em]">Kernel_Stream: Online</span>
            </div>
          </aside>

          {/* RIGHT: COMMAND CENTER / MESSAGING */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <MessageDashboard />
          </div>

        </main>
      </div>
    </div>
  );
}

/* ---------------- REFINED SUB-COMPONENTS ---------------- */

function StackCard({ stack }: { stack: any }) {
  const Icon = stack.icon;
  return (
    <div className="group bg-[#0a0a0a] border border-neutral-900 p-8 rounded-[32px] hover:border-teal-500/30 transition-all duration-500 relative overflow-hidden">
      <div className="flex justify-between items-start mb-12">
        <div className="p-3 bg-neutral-900 rounded-2xl group-hover:bg-teal-500 transition-colors duration-500 group-hover:text-black text-neutral-400">
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
          <p className="text-2xl font-mono text-white font-bold tracking-tighter">${stack.price.toFixed(2)}</p>
        </div>
        <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-600 group-hover:text-white group-hover:bg-neutral-800 transition-all">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </div>
  );
}

function ProgressStep({ step }: { step: any }) {
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
        <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">{step.desc}</p>
      </div>
    </div>
  );
}

function MessageDashboard() {
  return (
    <div className="bg-[#0a0a0a] border border-neutral-900 rounded-[32px] overflow-hidden flex flex-col h-[700px]">
      <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-teal-500 border border-white/5">
            <Terminal size={18} />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Deployment_Console</h3>
            <p className="text-[9px] font-mono text-neutral-600 uppercase mt-0.5">Vector: 40.7128 • 74.0060</p>
          </div>
        </div>
        <MoreHorizontal className="text-neutral-700" />
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8 scrollbar-hide">
        {/* Incoming File */}
        <div className="flex flex-col gap-3 max-w-[400px]">
          <span className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest ml-1">System_Output</span>
          <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-3xl rounded-tl-none flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-500">
              <FileText size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-white font-bold">CORE_MANIFEST.JSON</p>
              <p className="text-[10px] text-neutral-600 font-mono mt-0.5">12.8 KB • READY</p>
            </div>
            <button className="text-[10px] font-black text-teal-500 tracking-tighter hover:text-white transition-colors">DECODE</button>
          </div>
        </div>

        {/* Action Prompt */}
        <div className="flex flex-col gap-3 max-w-[460px] ml-auto items-end">
          <span className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest mr-1">User_Auth_Required</span>
          <div className="bg-neutral-900 border border-teal-500/20 p-8 rounded-[32px] rounded-tr-none text-right">
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              Primary architecture requires <span className="text-white font-bold">manual override</span> for Region_Sub_04 cluster deployment. Review logic gates before execution.
            </p>
            <div className="flex gap-4 justify-end">
              <button className="px-8 py-3 bg-teal-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-all">Authorize</button>
              <button className="px-8 py-3 bg-transparent border border-neutral-800 text-neutral-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-all">Abort</button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-neutral-900/30">
        <div className="relative">
          <input 
            type="text" 
            placeholder="EXECUTE COMMAND..." 
            className="w-full bg-black border border-neutral-800 rounded-2xl py-5 px-8 text-xs text-white font-mono focus:outline-none focus:border-teal-500/50 transition-all placeholder:text-neutral-800"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 text-neutral-600">
             <Command size={16} />
             <span className="text-[10px] font-bold">ENTER</span>
          </div>
        </div>
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