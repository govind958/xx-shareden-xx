"use client";
import React, { FC } from 'react';
import { Check, ShieldCheck, RefreshCcw, Headset, ArrowRight } from 'lucide-react';

const planFeatures = [
  { text: "Free domain", value: "$9.99 value" },
  { text: "5 mailboxes per website", value: "Free for 1 year" },
  { text: "Create up to 50 websites" },
  { text: "5 vibe coding credits" },
  { text: "Sell up to 1000 products" },
  { text: "AI Website Builder & Logo Maker" },
  { text: "100% profits with zero transaction fees" },
];

const PricingSection: FC = () => {
  return (
    <section className="relative w-full py-24 bg-white font-sans text-slate-900 border-t border-slate-50">
      {/* Container aligned to max-w-6xl for global symmetry */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        
        {/* Header Section - Centered Parity */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
            Pricing
          </h2>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-8">
            Everything you need for <br />
            your <span className="text-slate-400">ecommerce website.</span>
          </h1>
          
          {/* Trust Badges - Centered row */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-500">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" />
              30-day guarantee
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <RefreshCcw size={14} className="text-indigo-500" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <Headset size={14} className="text-slate-400" />
              24/7 support
            </div>
          </div>
        </div>

        {/* Pricing Card - Centered Action Card Style */}
        <div className="w-full max-w-4xl p-2 md:p-3 bg-slate-950 rounded-[48px] shadow-2xl shadow-indigo-100/30 animate-in zoom-in duration-1000">
          <div className="bg-slate-900 rounded-[40px] overflow-hidden border border-slate-800">
            
            {/* Main Price Block - Centered */}
            <div className="p-10 md:p-16 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6 border border-white/10">
                <span className="text-white font-black text-[10px] uppercase tracking-widest">Business Plan</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-slate-500 font-bold line-through text-lg">$18.99</span>
                <span className="bg-[#d9ff00] text-black text-[10px] font-black uppercase px-3 py-1 rounded-lg">
                  Save 79%
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black tracking-tight text-white/50">$</span>
                <span className="text-7xl md:text-8xl font-black tracking-tighter text-white">3.99</span>
                <span className="text-xl text-white/40 font-bold">/mo</span>
              </div>

              <div className="mb-10 inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-indigo-400 font-black text-[11px] uppercase tracking-widest">+3 months free</span>
              </div>

              <button className="w-full max-w-sm bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] mb-4">
                Get Started Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                No credit card required to start
              </p>
            </div>

            {/* Features Area - Now Nested and Centered */}
            <div className="bg-white/5 m-4 md:m-8 rounded-[32px] p-8 md:p-12 border border-white/5">
              <h3 className="text-center text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10">
                Premium Features Included
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-3xl mx-auto">
                {planFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="text-indigo-400" size={12} strokeWidth={4} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-200">
                        {feature.text}
                      </span>
                      {feature.value && (
                        <span className="text-[11px] font-black text-indigo-400/80 uppercase tracking-wider">
                          {feature.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Fine Print - Centered */}
        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-300 leading-relaxed max-w-2xl">
          * Paid upfront. Standard renewal rates apply. <br />
          Renews at $16.99/mo after the selected period.
        </p>

      </div>
    </section>
  );
};

export default PricingSection;