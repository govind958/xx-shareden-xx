"use client";

import React, { useState } from "react";
import { Check, Zap, Shield, Crown, Info, ArrowRight } from "lucide-react";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

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
      highlight: true, // Most Popular
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

  return (
    <main className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A365D]">
            Simple, Transparent Pricing
          </h1>
          <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">
            Choose the plan that best fits your workflow. Save up to 30% when you choose yearly billing.
          </p>

          {/* Toggle Switch */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-xs font-bold uppercase tracking-wider ${billingCycle === "monthly" ? "text-[#1A365D]" : "text-slate-400"}`}>
              Monthly
            </span>
            <button 
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 bg-slate-200 rounded-full relative transition-colors duration-200 focus:outline-none"
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${billingCycle === "yearly" ? "translate-x-6 bg-[#2B6CB0]" : ""}`} />
            </button>
            <span className={`text-xs font-bold uppercase tracking-wider ${billingCycle === "yearly" ? "text-[#1A365D]" : "text-slate-400"}`}>
              Yearly <span className="ml-1 text-emerald-600 text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Save 30%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative bg-white rounded-xl border p-8 transition-all duration-300 ${
                plan.highlight 
                ? "border-[#2B6CB0] shadow-xl scale-105 z-10" 
                : "border-slate-200 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2B6CB0] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col h-full">
                {/* Plan Identity */}
                <div className="mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${plan.highlight ? "bg-blue-50 text-[#2B6CB0]" : "bg-slate-50 text-slate-400"}`}>
                    <plan.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A365D]">{plan.name}</h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">{plan.description}</p>
                </div>

                {/* Pricing Display */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#1A365D]">
                      ₹{billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-slate-400 text-sm">/month</span>
                  </div>
                  {billingCycle === "yearly" && plan.yearlyPrice > 0 && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-tight">
                      Billed ₹{plan.yearlyPrice * 12} annually
                    </p>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button 
                  className={`w-full py-3 rounded text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    plan.highlight 
                    ? "bg-[#2B6CB0] text-white shadow-md hover:bg-[#1A365D]" 
                    : "bg-white border border-slate-200 text-[#1A365D] hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info Section */}
        <div className="mt-16 bg-slate-50 rounded-lg p-6 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-full border border-slate-200">
              <Info size={16} className="text-[#2B6CB0]" />
            </div>
            <p className="text-xs text-slate-600 font-medium text-center md:text-left">
              Not sure which plan is right for you? Our experts can help you build a custom stack.
            </p>
          </div>
          <button className="text-xs font-bold text-[#2B6CB0] hover:text-[#1A365D] uppercase tracking-widest whitespace-nowrap">
            Schedule a Demo →
          </button>
        </div>

        {/* Minimal Footer */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
            All plans include SSL security and daily backups.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PricingPage;