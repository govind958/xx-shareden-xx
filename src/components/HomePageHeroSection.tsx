"use client";
import React, { useState, FC } from 'react';
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
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">AI-Powered Speed-To-Lead for Roofers</span>
          <div className="w-px h-3 bg-slate-200" />
          <span className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.1em] flex items-center gap-1">
            <Sparkles size={12} /> Special Offer
          </span>
        </div>

        {/* The Headline */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Automate roofing leads <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
           Close more roofing deals
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
         The absolute easiest CRM & Automated Text-Back tool for roofing contractors. Instantly text back missed calls so homeowners don't call your competitors. No complex setup, no credit card required.
        </p>

        {/* Unified Action Card */}
        <div className="w-full max-w-3xl bg-slate-950 rounded-[40px] p-2 md:p-3 mb-8 shadow-2xl shadow-indigo-200 animate-in fade-in zoom-in duration-1000 delay-500">
          <div className="bg-slate-900 rounded-[32px] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-slate-500 font-bold text-xl">$</span>
                <span className="text-5xl font-black tracking-tighter text-white">297</span>
                <span className="text-slate-500 font-bold text-lg">/mo</span>
              </div>
              <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">+ 1 Months for free</p>
            </div>

            <div className="h-px md:h-12 w-full md:w-px bg-slate-800" />

            <div className="flex flex-col items-center gap-3">
               <div className="flex flex-col sm:flex-row gap-3 w-full">
                 <button className="border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 px-6 py-4 rounded-2xl font-black text-sm hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                   Calculate Saved Revenue
                 </button>
                 <button className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group whitespace-nowrap">
                   Claim Offer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
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
        <div className="relative w-full max-w-5xl bg-slate-50 rounded-[48px] border border-slate-100 p-6 md:p-8 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-1000 delay-700">
          
          {/* Inner Content Area arranged in a 2-column dashboard layout (3:2 ratio) */}
          <div className="w-full h-full bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 flex flex-col items-center">
            
            {/* Top decorative tracking bar */}
            <div className="w-20 h-1.5 bg-slate-100 rounded-full mb-8" />
            
            {/* Left and Right Dashboards layout wrapper */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full max-w-4xl text-left">
              
              {/* Left Box (Lead Conversion Funnel) */}
              <div className="lg:col-span-3 min-h-[320px] bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-between">
                
                {/* Header & Status Indicator */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Lead Conversion Funnel</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">Active This Month</span>
                </div>

                {/* Funnel Progress Bars */}
                <div className="space-y-4 mb-6">
                  {/* Row 1 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>New Incoming Inquiries (Website + Ads)</span>
                      <span className="text-indigo-600 font-bold">88% Capture</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full w-[88%]" />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>AI Auto-Text Initiated (No-Answers)</span>
                      <span className="text-indigo-600 font-bold">95% Dispatched</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full w-[95%]" />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>Estimates Scheduled</span>
                      <span className="text-amber-500 font-bold">62% Converted</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[62%]" />
                    </div>
                  </div>
                </div>
                
                {/* Bottom Row Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200/60 text-left">
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Average Speed</span>
                    <span className="text-sm md:text-base font-black text-slate-800">42 Seconds</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">New Leads</span>
                    <span className="text-sm md:text-base font-black text-indigo-600">+142</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Deals Won</span>
                    <span className="text-sm md:text-base font-black text-slate-800">18 This Wk</span>
                  </div>
                </div>
              </div>
              
              {/* Right Box (Contractor Trust Rating & Graph) */}
              <div className="lg:col-span-2 min-h-[320px] bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-between">
                
                {/* Header */}
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">Contractor Trust Rating</span>
                    <span className="text-[9px] text-slate-400 font-semibold">Real-time status</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-2xl font-black tracking-tight text-slate-800">$148,200</span>
                    <span className="text-xs font-bold text-indigo-600">+18.4%</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 leading-normal">
                    Contract value retained from missed-calls text back
                  </p>
                </div>
                
                {/* Live SVG Graph Wave */}
                <div className="w-full h-20 my-2 relative">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(79, 70, 229)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="rgb(79, 70, 229)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0,70 Q 40,50 80,75 T 160,35 T 240,65 T 300,45 L 300,100 L 0,100 Z" 
                      fill="url(#curveGradient)"
                    />
                    <path 
                      d="M 0,70 Q 40,50 80,75 T 160,35 T 240,65 T 300,45" 
                      fill="none" 
                      stroke="rgb(79, 70, 229)" 
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                
                {/* Bottom Notification Alert Pill */}
                <div className="w-full bg-white border border-slate-100 rounded-xl px-3 py-2 flex justify-between items-center text-xs shadow-sm">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <span className="text-amber-500">⚡</span>
                    <span>Saved job just now</span>
                  </div>
                  <span className="font-bold text-indigo-600">+$8,400 bid</span>
                </div>
              </div>

            </div>
          </div>
          
         
        </div>

      </div>
    </section>
  );
};

export default Hero;