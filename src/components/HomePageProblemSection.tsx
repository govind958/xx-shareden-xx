"use client";
import React, { FC } from 'react';
import { 
  MessageSquare, 
  Layers, 
  Star, 
  ArrowRight 
} from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Instant Missed-Call Auto-Response",
    detail: "If a prospective client calls and you are on a roof or out driving, StackboardAI instantly text-backs them:",
    icon: <MessageSquare size={20} className="text-indigo-600" />,
    quote: "“Hey, sorry we missed you. Do you need an estimate on residential shingles?”"
  },
  {
    id: "02",
    title: 'One-Click Lead Pipeline ("The Board")',
    detail: "Never lose track of estimates or inspection sheets again. Drag and drop cards from \"Inquiry\" to \"Inspection Pending\", \"Estimate Sent\", and \"Deposit Received\". Clear, straightforward, visual control.",
    icon: <Layers size={20} className="text-indigo-600" />,
    quote: null
  },
  {
    id: "03",
    title: "5-Star Google Review Generator",
    detail: "Once a roof install is completed, trigger an automated text sequence with a single click asking for a Google Review. Build massive local SEO authority on autopilot without awkward calling conversations.",
    icon: <Star size={20} className="text-indigo-600" />,
    quote: null
  },
];

const SimpleProcess: FC = () => {
  return (
    <section className="relative w-full py-24 bg-white border-t border-slate-50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        
        {/* Header Section from Screenshot */}
        <div className="text-center mb-16 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
            POWERFUL FEATURES BUILT FOR CONTRACTORS
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            Stop losing money to speed-to-lead problems
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
            We built simple automated pipelines that operate completely hands-free so you can focus on supervising crew installations.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-24">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="bg-slate-50/50 hover:bg-slate-50/80 border border-slate-100/80 rounded-3xl p-8 flex flex-col justify-between items-start text-left shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-1000"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-full">
                {/* Icon Container with subtle color tone */}
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  {step.icon}
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight leading-snug">
                  {step.title}
                </h3>

                {/* Card Detail Text */}
                <p className="text-slate-500 text-xs md:text-[13px] font-medium leading-relaxed mb-6">
                  {step.detail}
                </p>
              </div>

              {/* Unique layout inner element (Quote preview box for Step 1) */}
              {step.quote && (
                <div className="w-full bg-white border border-slate-100 rounded-xl p-3 shadow-sm mt-auto">
                  <p className="text-[11px] font-mono text-slate-400 italic">
                    {step.quote}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* --- Unified CTA Card --- */}
        <div className="relative w-full p-1 md:p-1.5 overflow-hidden rounded-[40px] shadow-2xl shadow-indigo-200/40 animate-in zoom-in duration-1000">
          
          {/* Background Art Layer */}
          <div className="absolute inset-0 z-0 bg-slate-950">
            <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[140%] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[120%] bg-fuchsia-600/20 rounded-full blur-[100px]" />
            <div className="absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")` }} 
            />
          </div>

          {/* Card Content */}
          <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 shadow-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-white font-black tracking-tight text-lg">
                  Ready to start?
                </p>
                <p className="text-indigo-300/60 text-[10px] font-bold uppercase tracking-widest">
                  500+ satisfied homeowners
                </p>
              </div>
            </div>
            
            <button className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-950 font-black text-sm rounded-2xl hover:bg-indigo-50 transition-all group active:scale-[0.98] shadow-xl">
              Get your free estimate 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SimpleProcess;