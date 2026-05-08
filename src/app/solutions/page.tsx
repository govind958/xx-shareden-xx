"use client";
import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Users2, 
  Globe2, 
  Layers, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

const solutions = [
  {
    title: "Fractional Operations",
    description: "Scale your back-office without the full-time overhead. Modular HR, Legal, and Admin stacks.",
    icon: Layers,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Secure Document Vault",
    description: "Enterprise-grade encryption for CAs and Finance teams. Sharing made effortless.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Automated Growth Loops",
    description: "Engineered high-ticket B2B sales funnels that run on autopilot using our proprietary tech.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent blur-[120px] -z-10" />
        
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles size={12} className="text-indigo-600" />
            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">Built for Scale</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900">
            One platform. <br />
            <span className="text-slate-400 font-medium">Infinite Solutions.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed">
            From early-stage founders to established CAs, Stackboard provides the modular infrastructure needed to run a modern, productized business.
          </p>
        </div>
      </section>

      {/* --- MAIN SOLUTIONS GRID --- */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((item, i) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-[40px] border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon className={item.color} size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-4">{item.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                {item.description}
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 group/link">
                Learn More <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURED CASE STUDY (The "Cinematic" Card) --- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="relative bg-slate-950 rounded-[48px] p-8 md:p-16 overflow-hidden shadow-2xl">
          {/* Background Decorative Rings */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 right-0 w-[400px] h-[400px] border border-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] border border-white rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-white font-black text-[10px] uppercase tracking-widest">Enterprise Ready</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
                Productize your <br />
                <span className="text-indigo-500">Service Delivery.</span>
              </h2>

              <ul className="space-y-4">
                {[
                  "White-labeled client dashboards",
                  "Automated recurring billing",
                  "Built-in project management stacks"
                ].map((text, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-400 font-medium">
                    <CheckCircle2 size={18} className="text-indigo-500" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-500/10">
                Explore Enterprise
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <BarChart3 className="text-indigo-400" size={32} />
                <p className="text-3xl font-black text-white">12.5k</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Monthly Stacks</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mt-8 space-y-4">
                <Users2 className="text-emerald-400" size={32} />
                <p className="text-3xl font-black text-white">400+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verified CAs</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <Globe2 className="text-amber-400" size={32} />
                <p className="text-3xl font-black text-white">99.9%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uptime SLA</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mt-8 space-y-4">
                <ShieldCheck className="text-indigo-400" size={32} />
                <p className="text-3xl font-black text-white">AES</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">256-bit Security</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-6">
          Ready to build your legacy business?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
          >
            Get Started Free
          </Link>
          <Link 
            href="/pricing" 
            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* --- FOOTER KICKER --- */}
      <footer className="py-12 border-t border-slate-50 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Stackboard v1.0 • Global Infrastructure for Modern Founders
        </p>
      </footer>
    </main>
  );
}