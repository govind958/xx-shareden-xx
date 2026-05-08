"use client";
import React, { useState, useEffect, FC } from 'react';
import { 
  Plus, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe
} from 'lucide-react';

const Hero: FC = () => {
  const [timeLeft, setTimeLeft] = useState('01 : 16 : 56 : 28');

  return (
    <section className="relative w-full bg-white overflow-hidden flex flex-col items-center">
      
      {/* Top Margin for Navbar */}
      <div className="pt-32 lg:pt-48 pb-20 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Minimalist Reveal Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Version 4.0 Launch</span>
          <div className="w-px h-3 bg-slate-200" />
          <span className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.1em] flex items-center gap-1">
            <Sparkles size={12} /> Special Offer
          </span>
        </div>

        {/* The Headline - Smaller, punchier, and elegant */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Your vision deserves <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
            a better home online.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          High-performance hosting and AI-design tools tailored for creators. 
          Everything you need, nothing you don't.
        </p>

        {/* Unified Action Card */}
        <div className="w-full max-w-3xl bg-slate-950 rounded-[40px] p-2 md:p-3 mb-8 shadow-2xl shadow-indigo-200 animate-in fade-in zoom-in duration-1000 delay-500">
          <div className="bg-slate-900 rounded-[32px] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-slate-500 font-bold text-xl">$</span>
                <span className="text-5xl font-black tracking-tighter text-white">3.99</span>
                <span className="text-slate-500 font-bold text-lg">/mo</span>
              </div>
              <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">+ 3 Months for free</p>
            </div>

            <div className="h-px md:h-12 w-full md:w-px bg-slate-800" />

            <div className="flex flex-col items-center gap-3">
               <button className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 group">
                 Claim Offer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </button>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{timeLeft}</span>
            </div>

          </div>
        </div>

        {/* Small Trust Line */}
        <div className="flex flex-wrap justify-center gap-8 text-slate-400 mb-20 animate-in fade-in duration-1000 delay-700">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-emerald-500" /> Free Domain
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-indigo-500" /> Money-back guarantee
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <Globe size={14} className="text-slate-400" /> Global Edge Network
          </div>
        </div>

        {/* Dashboard Preview Overlay */}
        <div className="relative w-full max-w-5xl aspect-video bg-slate-50 rounded-t-[48px] border-x border-t border-slate-100 p-4 md:p-6 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-1000 delay-700">
          <div className="w-full h-full bg-white rounded-t-[32px] border border-slate-100 shadow-sm p-8 flex flex-col items-center">
            <div className="w-20 h-1.5 bg-slate-100 rounded-full mb-12" />
            <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
              <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
              <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
              <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
            </div>
          </div>
          
          {/* Decorative Floating Tool */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 animate-bounce-slow">
            <Plus size={24} />
          </div>
        </div>

      </div>

      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-indigo-50/50 blur-[120px] rounded-full pointer-events-none -z-10" />
    </section>
  );
};

export default Hero;