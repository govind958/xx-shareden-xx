"use client";
import React, { useState, FC } from "react";
import { Check, Zap, Shield, Crown, Info, ArrowRight, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals and small side projects.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Zap,
    features: ["3 Active Stacks", "Basic Analytics", "Community Support", "1GB Storage"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    description: "Advanced tools for growing teams and professionals.",
    monthlyPrice: 29,
    yearlyPrice: 19,
    icon: Shield,
    features: ["Unlimited Stacks", "Advanced Analytics", "Priority Email Support", "10GB Storage", "Custom Domains"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    description: "Scale without limits with dedicated support.",
    monthlyPrice: 99,
    yearlyPrice: 79,
    icon: Crown,
    features: ["Everything in Pro", "SLA Guarantee", "Dedicated Manager", "Unlimited Storage", "Custom Contracts"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const PricingPage: FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-50/40 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center">
        
        {/* Header Section - Centered Cinematic Style */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 mb-6">
            <Sparkles size={12} className="text-indigo-600" />
            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">Flexible Plans</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
            Simple, Transparent <br />
            <span className="text-slate-400">Pricing.</span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg font-medium mt-6 max-w-xl mx-auto">
            Choose the plan that best fits your workflow. Save up to 30% when you choose yearly billing.
          </p>

          {/* Centered Toggle Switch */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"}`}>
              Monthly
            </span>
            <button 
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-14 h-7 bg-slate-100 border border-slate-200 rounded-full relative transition-all duration-300 focus:outline-none p-1"
            >
              <div className={`w-5 h-5 bg-indigo-600 rounded-full shadow-lg transform transition-transform duration-300 ${billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"}`} />
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${billingCycle === "yearly" ? "text-slate-900" : "text-slate-400"}`}>
                Yearly
              </span>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 uppercase tracking-tighter">
                Save 30%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative rounded-[40px] p-1 transition-all duration-500 flex flex-col group ${
                plan.highlight 
                ? "bg-slate-950 shadow-2xl shadow-indigo-100 scale-105 z-10" 
                : "bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100"
              }`}
            >
              {/* Internal Card Content */}
              <div className={`p-8 md:p-10 rounded-[36px] flex flex-col h-full ${plan.highlight ? "bg-slate-900 border border-slate-800" : "bg-white"}`}>
                
                {/* Plan Identity */}
                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${plan.highlight ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-50 text-slate-400"}`}>
                    <plan.icon size={24} />
                  </div>
                  <h3 className={`text-2xl font-black tracking-tight ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mt-3 font-medium leading-relaxed ${plan.highlight ? "text-slate-400" : "text-slate-500"}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Pricing Display */}
                <div className="mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-black ${plan.highlight ? "text-slate-500" : "text-slate-400"}`}>$</span>
                    <span className={`text-5xl md:text-6xl font-black tracking-tighter ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                      {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className={`text-sm font-bold ${plan.highlight ? "text-slate-500" : "text-slate-400"}`}>/mo</span>
                  </div>
                  {billingCycle === "yearly" && plan.yearlyPrice > 0 && (
                    <p className="text-[10px] text-indigo-400 font-black mt-3 uppercase tracking-[0.2em]">
                      Billed ${plan.yearlyPrice * 12} annually
                    </p>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-5 mb-12 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-indigo-500/20" : "bg-emerald-50"}`}>
                        <Check size={12} className={plan.highlight ? "text-indigo-400" : "text-emerald-500"} strokeWidth={4} />
                      </div>
                      <span className={`text-[13px] font-bold ${plan.highlight ? "text-slate-300" : "text-slate-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button 
                  className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 ${
                    plan.highlight 
                    ? "bg-white text-slate-950 hover:bg-indigo-50 shadow-xl" 
                    : "bg-slate-950 text-white hover:bg-indigo-600"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info Section - Centered Action Card Style */}
        <div className="mt-24 w-full max-w-4xl bg-slate-50 rounded-[32px] p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:shadow-xl hover:shadow-slate-200/50">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
              <Info size={20} className="text-indigo-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-900 tracking-tight">
                Need a custom solution?
              </p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Our experts can build a custom stack for your scale.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-[11px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest group">
            Schedule a Demo 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Minimal Footer */}
        <div className="mt-16 text-center">
          <p className="text-[10px] text-slate-300 uppercase tracking-[0.3em] font-black">
            SECURE SSL ENCRYPTION • DAILY BACKUPS • GLOBAL EDGE
          </p>
        </div>
      </div>
    </main>
  );
};

export default PricingPage;