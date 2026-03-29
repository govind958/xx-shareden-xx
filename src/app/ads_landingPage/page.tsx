"use client";

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  Zap, 
  Briefcase, 
  UserCheck, 
  MessageSquare, 
  Handshake, 
  ShieldCheck 
} from 'lucide-react';

const CAPABILITIES = [
  { 
    name: "JD Creation", 
    saving: 60000, 
    icon: <Briefcase className="w-5 h-5" />, 
    description: "AI-driven job description generation." 
  },
  { 
    name: "Candidate Screening", 
    saving: 80000, 
    icon: <UserCheck className="w-5 h-5" />, 
    description: "Automated resume parsing and filtering." 
  },
  { 
    name: "Technical Interview", 
    saving: 120000, 
    icon: <Zap className="w-5 h-5" />, 
    description: "L1 technical vetting at scale." 
  },
  { 
    name: "Culture Interview", 
    saving: 40000, 
    icon: <MessageSquare className="w-5 h-5" />, 
    description: "Soft skills and culture fit analysis." 
  },
  { 
    name: "Offer Negotiation", 
    saving: 50000, 
    icon: <Handshake className="w-5 h-5" />, 
    description: "Market benchmarking and closing logic." 
  },
];

export default function App() {
  const [teamSize, setTeamSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleCapability = (name: string) => {
    setSelectedIds(prev => 
      prev.includes(name) 
        ? prev.filter(id => id !== name) 
        : [...prev, name]
    );
  };

  const stack = useMemo(() => 
    CAPABILITIES.filter(c => selectedIds.includes(c.name)),
    [selectedIds]
  );

  const totalSaving = useMemo(() => {
    const baseSaving = stack.reduce((acc, cap) => acc + cap.saving, 0);
    return baseSaving * (teamSize / 10);
  }, [stack, teamSize]);

  const progressPercentage = (selectedIds.length / CAPABILITIES.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-100">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
        
        {/* Header Section */}
        <div className="mb-16 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold mb-4 border border-rose-100">
            <TrendingUp size={16} />
            <span>ROI CALCULATOR</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Scale your hiring <br />
            <span className="text-rose-600">without the overhead.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            See how much you can save by plugging ShareDen’s capabilities into your existing workflow instead of scaling internal operations.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: The Results Card */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-12">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
              
              <div className="relative z-10">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Annual Savings Potential</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter transition-all duration-500">
                    ₹{totalSaving.toLocaleString()}
                  </span>
                  <span className="text-xl font-medium text-slate-500">/year</span>
                </div>
                
                <div className="mt-10 space-y-8">
                  {/* Slider Component */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Users size={18} className="text-rose-500" />
                        <span>Annual Hiring Target</span>
                      </div>
                      <span className="bg-slate-900 text-white px-3 py-1 rounded-lg font-mono text-lg">
                        {teamSize} Roles
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="10"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600 transition-all"
                    />
                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                      <span>10</span>
                      <span>100</span>
                      <span>200+</span>
                    </div>
                  </div>

                  {/* Summary Footer */}
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase mb-1">Stack Health</p>
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-rose-500 transition-all duration-700 ease-out"
                              style={{ width: `${progressPercentage}%` }}
                            />
                         </div>
                         <span className="text-xs font-bold text-slate-600">{selectedIds.length}/{CAPABILITIES.length}</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-rose-600 font-bold hover:gap-3 transition-all">
                      Get Detailed Report <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-rose-400" />
               </div>
               <p className="text-sm text-slate-300 leading-relaxed">
                 Calculated based on average vendor fees, recruiter man-hours, and tooling costs for Indian tech startups.
               </p>
            </div>
          </div>

          {/* RIGHT: Stack Builder */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Build Your Hiring Stack</h3>
                <p className="text-slate-500">Select the capabilities you want to outsource to ShareDen.</p>
              </div>

              <div className="grid gap-4">
                {CAPABILITIES.map((cap) => {
                  const isActive = selectedIds.includes(cap.name);
                  return (
                    <button
                      key={cap.name}
                      onClick={() => toggleCapability(cap.name)}
                      className={`group relative flex items-center text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                        isActive 
                        ? 'border-rose-500 bg-rose-50/50 ring-4 ring-rose-50' 
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isActive ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {cap.icon}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-lg text-slate-900">{cap.name}</h4>
                          <span className={`text-sm font-bold ${isActive ? 'text-rose-600' : 'text-slate-400'}`}>
                            ₹{cap.saving.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{cap.description}</p>
                      </div>

                      <div className="ml-4">
                        {isActive ? (
                          <div className="bg-rose-500 text-white rounded-full p-1 animate-in zoom-in duration-300">
                            <CheckCircle2 size={20} />
                          </div>
                        ) : (
                          <div className="text-slate-200 group-hover:text-slate-300 transition-colors">
                            <Plus size={24} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Empty State / Prompt */}
              {selectedIds.length === 0 && (
                <div className="mt-6 p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                  <p className="text-slate-400 font-medium">
                    Your stack is currently empty. <br />
                    Select features above to begin calculating your savings.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}