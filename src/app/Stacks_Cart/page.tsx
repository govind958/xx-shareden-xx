'use client'

import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Database,
  Lock,
  Zap,
  Server,
  Check,
  CreditCard,
  ChevronLeft,
  Globe,
  ShieldCheck,
  Cpu,
  Activity,
  ChevronRight
} from 'lucide-react';

/* ---------------- MOCK DATA ---------------- */
const PURCHASED_STACKS = [
  { id: 'stk-1', name: 'AUTH_PROTOCOL', type: 'SEC_CORE', price: 299.00, status: 'ENCRYPTED', icon: Lock },
  { id: 'stk-2', name: 'STRIPE_GATEWAY', type: 'PAY_ENGINE', price: 450.00, status: 'SYNCING', icon: Zap },
  { id: 'stk-3', name: 'AWS_NODE_CLUSTER', type: 'INFRA', price: 1200.00, status: 'STABLE', icon: Server },
  { id: 'stk-4', name: 'EDGE_DATABASE', type: 'STORAGE', price: 150.00, status: 'ACTIVE', icon: Database },
];

const FEATURES = [
  "Create, assign, and track tasks",
  "Activity Logging & Full Reporting",
  "Priority Email Support",
  "4 GB Encrypted Storage",
  "Customizable Neural Templates",
  "Integration with Slack & Matrix"
];

/* ---------------- UTILS ---------------- */
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

/* ---------------- MAIN COMPONENT ---------------- */

export default function TechNoirCheckout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(loader);
  }, []);

  if (loading) return <BootSequence />;

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* ATMOSPHERIC GRADIENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-teal-500/5 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-teal-900/10 blur-[120px] rounded-full" />
      </div>

      {/* --- REFINED NAV SECTION (ACTIVE MODULES) --- */}
     <div className="sticky top-0 z-20 rounded-2xl border border-neutral-900 bg-[#020202]/80 backdrop-blur-md shadow-lg">
  <nav>
    <div className="max-w-[1700px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
      {/* Cart Icon */}
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 transition"
            aria-label="Cart"
          >


            {/* Optional Cart Badge */}
            {/* <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-[10px] text-black flex items-center justify-center">
              3
            </span> */}
          </button>
      
      {/* Horizontal Scroll Area for StackCards */}
      <div className="flex-1 flex gap-4 overflow-x-auto no-scrollbar py-2">

        {PURCHASED_STACKS.map((stack) => (
          <NavStackCard key={stack.id} stack={stack} />
        ))}
      </div>

    </div>
  </nav>



</div>


      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
      

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: PLAN SUMMARY */}
          <section className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <p className="text-teal-500 text-[10px] font-black uppercase tracking-[0.4em]">Upgrade_Matrix</p>
              <div className="flex items-baseline gap-4">
                <h1 className="text-5xl font-black text-white tracking-tighter">$49.99<span className="text-lg text-neutral-600 font-medium tracking-normal">/m</span></h1>
                <span className="bg-teal-500/10 border border-teal-500/20 text-teal-500 text-[10px] px-3 py-1 rounded-full font-bold">SAVE 30%</span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">Subscribe to the Driply Team Plan for advanced collaborative architecture and expanded neural storage.</p>
            </div>

            <div className="space-y-4 border-t border-neutral-900 pt-10">
              {FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-5 h-5 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-teal-500/40 transition-colors">
                    <Check size={12} className="text-teal-500" />
                  </div>
                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-neutral-900 space-y-3">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <span>Base_Protocol</span>
                <span className="text-white font-mono">$45.99</span>
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-neutral-600">
                <span>Encryption_Tax</span>
                <span className="text-white font-mono">$4.00</span>
              </div>
              <div className="flex justify-between pt-6 text-2xl font-black border-t border-neutral-900">
                <span className="text-white uppercase tracking-tighter">Total_Cost</span>
                <span className="text-teal-500 font-mono">$49.99</span>
              </div>
              <p className="text-[10px] text-neutral-700 italic">Renews for $49.99 every month until terminated.</p>
            </div>
          </section>

          {/* RIGHT COLUMN: SECURE PAYMENT */}
          <section className="lg:col-span-7 bg-[#0a0a0a] border border-neutral-900 rounded-[40px] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <form className="space-y-8">
              <div className="space-y-6">
                <label className="block">
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-1">Identity_Endpoint</span>
                  <input type="email" defaultValue="samuxldesigns@gmail.com" className="mt-2 w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-teal-500/50 transition-all font-mono" />
                </label>

                <div className="space-y-4">
                   <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-1">Payment_Transceiver</span>
                   <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden focus-within:border-teal-500/50 transition-all">
                      <div className="p-6 border-b border-neutral-800 flex items-center gap-4">
                        <CreditCard className="text-neutral-600" size={20} />
                        <input type="text" placeholder="1234 5678 9876 5432" className="bg-transparent w-full text-white focus:outline-none font-mono tracking-widest" />
                        <div className="flex gap-2">
                           <div className="w-8 h-5 bg-neutral-800 rounded-md" />
                           <div className="w-8 h-5 bg-neutral-800 rounded-md" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2">
                        <input type="text" placeholder="MM / YY" className="p-6 bg-transparent border-r border-neutral-800 focus:outline-none text-white font-mono" />
                        <input type="text" placeholder="CVC" className="p-6 bg-transparent focus:outline-none text-white font-mono" />
                      </div>
                   </div>
                </div>

                <label className="block">
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-1">Authorized_Signatory</span>
                  <input type="text" defaultValue="Mikun Lacoste" className="mt-2 w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-teal-500/50 transition-all uppercase tracking-tight" />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-1">Geographic_Node</span>
                    <div className="relative">
                        <select className="mt-2 w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white focus:outline-none appearance-none">
                            <option>Japan</option>
                            <option>United States</option>
                            <option>Germany</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-neutral-600 pointer-events-none" size={16} />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] ml-1">Postal_Code</span>
                    <input type="text" placeholder="Address line 1" className="mt-2 w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-6 py-4 text-white focus:outline-none" />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-3xl bg-teal-500/5 border border-teal-500/10">
                <div className="pt-1">
                    <input type="checkbox" className="w-4 h-4 accent-teal-500 bg-black border-neutral-800 rounded" />
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-500">
                  By clicking Subscribe, you agree to the <span className="text-teal-500">Terms of Decryption</span> and authorize monthly protocol charges. Cancel anytime via the dashboard.
                </p>
              </div>

              <button className="w-full bg-teal-500 hover:bg-teal-400 text-black font-black py-6 rounded-2xl transition-all duration-300 uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(20,184,166,0.15)] active:scale-[0.98]">
                Complete Subscription
              </button>
              
              <div className="flex items-center justify-center gap-8 opacity-30 grayscale hover:opacity-60 transition-opacity">
                <ShieldCheck size={18} />
                <Globe size={18} />
                <Lock size={18} />
                <Cpu size={18} />
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PRESERVED & ADAPTED NAV STACKCARDS ---------------- */

function NavStackCard({ stack }: { stack: any }) {
  const Icon = stack.icon;
  return (
    <div className="group flex items-center gap-4 bg-neutral-900/40 border border-neutral-800/50 p-3 rounded-2xl min-w-[200px] hover:border-teal-500/30 transition-all cursor-default">
      <div className="p-2 bg-neutral-800 rounded-xl group-hover:bg-teal-500 transition-colors group-hover:text-black text-neutral-400">
        <Icon size={14} />
      </div>
      <div className="flex flex-col">
        <span className="text-[8px] font-black text-teal-500/60 uppercase tracking-widest">{stack.type}</span>
        <span className="text-[10px] font-bold text-white tracking-tight uppercase whitespace-nowrap">{stack.name}</span>
      </div>
      <div className="ml-auto text-[8px] font-mono text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded">
        {stack.status}
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
          <p className="text-[10px] tracking-[0.8em] text-teal-500 uppercase animate-pulse">Syncing Active Modules</p>
       </div>
       <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-loading {
            animation: loading 1.5s infinite ease-in-out;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
       `}</style>
    </div>
  )
}