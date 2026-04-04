"use client";
import React, { useState, useEffect, useRef, FC } from 'react';

// --- Enhanced Suprematist Reconstruction Component ---
// Focused on rounded geometries and responsive scaling
const SuprematistArt: FC<{ progress: number }> = ({ progress }) => {
  const shiftX = progress * 20;
  const shiftY = progress * -20;

  return (
    <svg
      viewBox="0 0 500 800"
      className="w-full h-full transition-transform duration-500 ease-out"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Background Large Rounded Rect */}
      <rect
        x={100 + shiftX * 0.5}
        y={200 + shiftY * 0.2}
        width="300"
        height="400"
        rx="150" // High rounding
        fill="#f3f4f6"
        className="opacity-50"
      />

      {/* Primary Indigo Circle */}
      <circle
        cx={250 + shiftX}
        cy={400 + shiftY}
        r={120 + progress * 20}
        fill="#4F46E5"
        className="transition-all duration-700"
      />

      {/* Floating Teal Pill Shape */}
      <rect
        x={150 - shiftX}
        y={150 + shiftY}
        width="240"
        height="60"
        rx="30"
        fill="#0D9488"
        transform={`rotate(-25 ${150 + 120} ${150 + 30})`}
        className="opacity-90"
      />

      {/* Secondary Rose Circle */}
      <circle
        cx={350 + shiftX * 1.5}
        cy={250 + shiftY * 0.5}
        r="45"
        fill="#E11D48"
      />

      {/* The "Cross" reimagined with rounded caps */}
      <rect
        x={180 + shiftX * 2}
        y={500 + shiftY}
        width="160"
        height="12"
        rx="6"
        fill="#111827"
        transform={`rotate(45 ${180 + 80} ${500 + 6})`}
      />
      <rect
        x={254 + shiftX * 2}
        y={426 + shiftY}
        width="12"
        height="160"
        rx="6"
        fill="#111827"
        transform={`rotate(45 ${254 + 6} ${426 + 80})`}
      />

      {/* Small Amber Accent */}
      <circle
        cx={120 + shiftX}
        cy={600 + shiftY * 1.2}
        r="20"
        fill="#F59E0B"
      />
    </svg>
  );
};

const ProblemSolutionSection: FC = () => {
  const scrollTarget = useRef(0);
  const currentScroll = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      scrollTarget.current = window.scrollY / totalHeight;
    };

    let rafId: number;
    const update = () => {
      currentScroll.current += (scrollTarget.current - currentScroll.current) * 0.1;
      setDisplayProgress(currentScroll.current);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(update);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const progress = displayProgress * 3.5;

  const steps = [
    {
      id: 1,
      problem: "Traditional SaaS: No accountability.",
      solution: "Outcome-Based Machines",
      detail: "Infrastructure built to deliver results, not just tools."
    },
    {
      id: 2,
      problem: "High overhead & slow scaling.",
      solution: "Fractional Dept. Rental",
      detail: "Deploy Sales or Tech units as modular components."
    },
    {
      id: 3,
      problem: "Fragmented tech stacks.",
      solution: "Unified Digital Ecosystem",
      detail: "Integrated operations via a high-perf interface."
    }
  ];

  return (
    <section className="relative w-full min-h-screen flex flex-col md:flex-row items-stretch bg-white overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_50%,_rgba(20,184,166,0.03)_0%,_rgba(255,255,255,1)_70%)]" />

      {/* Left Content Area - Responsive width/padding */}
      <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col justify-center px-6 py-16 md:py-0 md:pl-12 lg:pl-24 z-10">
        
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-teal-600 mb-2">Process Flow</h2>
          <p className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
            The <span className="text-indigo-600">SaaS 2.0</span><br /> Evolution.
          </p>
        </div>

        {/* Steps */}
        <div className="relative flex flex-col space-y-8">
          {steps.map((item, idx) => {
            const isActive = progress > idx + 0.4;
            const isFullyDone = progress > idx + 1.1;

            return (
              <div key={item.id} className="relative flex gap-5 md:gap-8 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-500 
                    ${isActive ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white border-gray-100'}`}>
                    <span className={`font-mono text-xs font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>{item.id}</span>
                  </div>
                  {idx !== steps.length - 1 && (
                    <div className="w-[2px] h-14 bg-gray-50 relative mt-2">
                      <div 
                        className="absolute top-0 left-0 w-full bg-indigo-500 transition-all duration-300 ease-out"
                        style={{ height: `${Math.min(100, Math.max(0, (progress - (idx + 0.7)) * 150))}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className={`flex-1 pt-1 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                  <div className="flex flex-col xl:flex-row xl:items-center xl:gap-3">
                    <p className={`text-xs text-gray-400 line-through decoration-gray-300 transition-opacity ${isActive ? 'block' : 'hidden md:block'}`}>
                      {item.problem}
                    </p>
                    <h3 className={`text-xl font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {item.solution}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm">
                    {item.detail}
                  </p>
                  {isActive && !isFullyDone && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 bg-teal-50 text-teal-600 rounded-lg text-[9px] font-bold">
                      <div className="w-1 h-1 bg-teal-500 rounded-full animate-pulse" />
                      LIVE_DEPLOYMENT
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Art Area - Hidden on small mobile, shown as a header/footer or side-car */}
      <div className="relative w-full md:w-2/5 lg:w-1/2 min-h-[300px] md:h-screen bg-gray-50/30 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-16">
           <SuprematistArt progress={displayProgress} />
        </div>
        
        {/* Decorative mask for soft edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent md:hidden" />
      </div>
    </section>
  );
};

export default ProblemSolutionSection;