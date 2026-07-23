"use client";
import React, { useState, FC } from 'react';

const RevenueCalculator: FC = () => {
  // Interactive States for the Sliders
  const [missedCalls, setMissedCalls] = useState<number>(10);
  const [jobValue, setJobValue] = useState<number>(9500);

  // Calculator Logic based on the screenshot text details:
  // 1. Estimated Monthly Loss: assuming 30% of missed leads would have hired them.
  const estimatedMonthlyLoss = Math.round(missedCalls * 0.3 * jobValue);
  
  // 2. Saved with StackboardAI: assuming a 40% recovery rate out of that total loss.
  const savedRevenue = Math.round(estimatedMonthlyLoss * 0.4);

  return (
    <section className="relative w-full py-24 bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Top Minimalist Badge */}
        <div className="inline-flex items-center px-4 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
            Revenue Loss Calculator
          </span>
        </div>

        {/* Section Headers */}
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 max-w-3xl">
          How much are missed calls costing your business?
        </h2>
        <p className="text-sm md:text-base text-slate-500 font-medium max-w-2xl mb-16">
          US roofers miss up to 40% of standard phone inquiries. Calculate your leaking revenue below.
        </p>

        {/* Calculator Main Box */}
        <div className="w-full max-w-4xl bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-2xl shadow-slate-200/60 grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-stretch">
          
          {/* LEFT INTERACTIVE CONTROLS COLUMN (7/12 Width) */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-10 pr-0 md:pr-4 py-4">
            
            {/* Control 1: Estimated Missed Calls */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-800 tracking-tight">
                  Estimated Missed Calls (per month)
                </label>
                <div className="bg-slate-950 text-white font-mono font-bold text-sm px-3 py-1.5 rounded-lg">
                  {missedCalls}
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={missedCalls}
                onChange={(e) => setMissedCalls(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] font-medium text-slate-400">
                Industry average is 15 missed calls/mo.
              </p>
            </div>

            {/* Control 2: Average Job Value */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-slate-800 tracking-tight">
                  Average Roofing Job Value ($ USD)
                </label>
                <div className="bg-slate-950 text-white font-mono font-bold text-sm px-3 py-1.5 rounded-lg">
                  ${jobValue.toLocaleString()}
                </div>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="30000" 
                step="500"
                value={jobValue}
                onChange={(e) => setJobValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] font-medium text-slate-400">
                Average single roof replacement ranges from $8,000 to $15,000.
              </p>
            </div>

          </div>

          {/* RIGHT METRICS DISPLAY COLUMN (5/12 Width) */}
          <div className="md:col-span-5 bg-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            
            {/* Block A: Total Loss calculation */}
            <div className="mb-6">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Estimated Monthly Loss
              </span>
              <span className="text-3xl md:text-4xl font-black text-amber-500 tracking-tight">
                ${estimatedMonthlyLoss.toLocaleString()}
              </span>
              <p className="text-[11px] text-slate-400 mt-2 leading-normal font-medium">
                Assuming only 30% of those missed leads would have hired you.
              </p>
            </div>

            {/* Separator Divider */}
            <div className="h-px bg-slate-800 w-full mb-6" />

            {/* Block B: StackboardAI Recovery calculation */}
            <div className="mb-8">
              <span className="block text-[10px] font-black uppercase tracking-wider text-indigo-400 mb-1">
                Saved with StackboardAI (40% Recovery)
              </span>
              <span className="text-3xl md:text-4xl font-black text-emerald-400 tracking-tight">
                ${savedRevenue.toLocaleString()}
              </span>
              <p className="text-[11px] text-slate-400 mt-2 leading-normal font-medium">
                Stackboard's automated text-backs capture missed callers before they move on to your competition.
              </p>
            </div>

            {/* Interactive Call-To-Action Button inside panel */}
            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition-all text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-600/20 text-center">
              Recover My Missed Jobs Now
            </button>
            
          </div>

        </div>

      </div>
    </section>
  );
};

export default RevenueCalculator;