"use client";
import React, { useState, FC } from 'react';

const HeroSection: FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* 1. BACKGROUND DESIGN */}
      <div className="absolute inset-0 z-0">
        {/* Subtle Grid Pattern for tech aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Soft Indigo Ambient Glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/60 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-50/50 blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-6 flex flex-col items-center text-center">
        
        {/* 2. TOP BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-10 transition-all hover:border-indigo-200 hover:bg-indigo-50/50 group cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors uppercase tracking-[0.1em]">
            v2.0 Infrastructure Engine is Live
          </span>
        </div>

        {/* 3. MAIN HEADLINE */}
        <h1 className="max-w-4xl text-5xl md:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.05]">
          Deploy a <span className="text-indigo-600">Department</span> <br className="hidden md:block" />
          in a single click.
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-500 mb-12 leading-relaxed">
          The infrastructure layer for AI-native teams. Orchestrate complex 
          workflows and scale your output without scaling your headcount.
        </p>

        {/* 4. CALL TO ACTION AREA */}
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-24">
          <button 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] active:scale-95"
          >
            <span className="relative z-10">Start Building Free</span>
            {/* Animated Gradient Fill */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button className="px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
            Book a Demo
          </button>
        </div>

        {/* 5. LOGO CLOUD / TRUST SIGNALS */}
        <div className="pt-8 border-t border-slate-100 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-8">
            Powering high-velocity engineering teams
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {['Stripe', 'Vercel', 'Linear', 'Supabase', 'GitHub'].map((brand) => (
              <span key={brand} className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 6. BOTTOM GRADIENT FADE */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-20" />
    </section>
  );
};

export default HeroSection;