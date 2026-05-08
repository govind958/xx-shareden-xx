"use client";
import React, { FC } from 'react';
import { ClipboardCheck, Hammer, BadgeCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Discovery",
    detail: "Thorough assessment of your site to identify structural needs.",
    icon: <ClipboardCheck size={24} className="text-indigo-600" />,
  },
  {
    id: "02",
    title: "Execution",
    detail: "Licensed specialists carry out work with premium materials.",
    icon: <Hammer size={24} className="text-indigo-600" />,
  },
  {
    id: "03",
    title: "Assurance",
    detail: "Multi-point inspection to ensure our rigorous standards.",
    icon: <BadgeCheck size={24} className="text-indigo-600" />,
  },
];

const SimpleProcess: FC = () => {
  return (
    <section className="relative w-full py-24 bg-white border-t border-slate-50">
      {/* CENTERED WRAPPER */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        
        {/* Centered Header Section */}
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
            The Roadmap
          </h2>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Excellence in every <br />
            <span className="text-slate-400">square foot.</span>
          </h1>
        </div>

        {/* Minimalist Step Grid - Centered items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative w-full">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent z-0" />

          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="relative z-10 flex flex-col items-center text-center group animate-in fade-in slide-in-from-bottom-8 duration-1000"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon Circle Container */}
              <div className="w-24 h-24 bg-white border border-slate-100 rounded-[32px] flex items-center justify-center mb-8 shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-100/50 group-hover:border-indigo-100 transition-all duration-500 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  {step.icon}
                </div>
              </div>

              {/* Step Number Badge */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em]">
                  Step {step.id}
                </span>
              </div>

              {/* Text Content */}
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-[260px]">
                {step.detail}
              </p>
            </div>
          ))}
        </div>

        {/* --- REVISED CTA CARD WITH ABSTRACT ART --- */}
        <div className="relative mt-32 w-full max-w-4xl p-1 md:p-1.5 overflow-hidden rounded-[40px] shadow-2xl shadow-indigo-200/40 animate-in zoom-in duration-1000">
          
          {/* Background Art Layer */}
          <div className="absolute inset-0 z-0 bg-slate-950">
            {/* Animated/Blurry Abstract Orbs */}
            <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[140%] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[120%] bg-fuchsia-600/20 rounded-full blur-[100px]" />
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")` }} 
            />
          </div>

          {/* Card Content Container - backdrop-blur-xl allows the art to peek through */}
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