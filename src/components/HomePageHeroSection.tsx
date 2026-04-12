"use client";
import React, { useState, useEffect, useRef, FC } from 'react';

const HeroSection: FC = () => {
  const scrollTarget = useRef(0);
  const currentScroll = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  
  // Interaction & Animation States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    // 4-second loop timer for the mouth/glow emotions
    const timer = setInterval(() => {
      setTime((prev) => (prev + 16) % 4000);
    }, 16);

    // FIX: 4-second FIXED blink rate
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      scrollTarget.current = window.scrollY / totalHeight;
    };

    // TRACKING: Mouse position relative to the center of the screen
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    let rafId: number;
    const update = () => {
      const lerpFactor = 0.08;
      currentScroll.current += (scrollTarget.current - currentScroll.current) * lerpFactor;
      setDisplayProgress(currentScroll.current);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      clearInterval(blinkInterval);
      clearInterval(timer);
    };
  }, []);

  // 4s Loop Calculations for subtle pulsing
  const loopProgress = (time / 4000) * Math.PI * 2;
  const loopSine = Math.sin(loopProgress); 
  const normalizedSine = (loopSine + 1) / 2; 

  // Cursor Tracking Math (Offset amount for the eyes)
  const eyeX = mousePos.x * 8; // Horizontal range
  const eyeY = mousePos.y * 6; // Vertical range
  
  // Emotion styles
  const smileExpansion = 32 + normalizedSine * 8;
  const glowIntensity = isHoveringButton ? 40 : 15 + normalizedSine * 12;

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col font-sans">
      
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.1)_0%,_rgba(255,255,255,1)_80%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-indigo-50/40 via-white to-blue-50/40" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row items-center justify-center md:justify-between px-6 lg:px-12 py-20 md:py-0">
        
        {/* LEFT: TEXT CONTENT */}
        <div className="w-full md:w-1/2 flex flex-col justify-center z-20 text-center md:text-left">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-8">
            Deploy a <br />
            <span className="text-slate-900">Department</span> <br />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              in a click.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-lg mx-auto md:mx-0 leading-relaxed mb-10">
            Standardized, high-velocity workflows delivered by the hour. 
            Stop hiring, start deploying with <span className="font-bold text-slate-800">StackBoard<span className="text-indigo-500">AI</span></span>.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <button 
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
              className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-lg shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all active:scale-95"
            >
              Start Building
            </button>
            <button 
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
              className="px-10 py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-full font-bold text-lg hover:border-slate-300 transition-all"
            >
              View Demo
            </button>
          </div>
        </div>

        {/* RIGHT: THE HAPPY CAT (Clean silhouette, Tracking Eyes, 4s Blink) */}
        <div className="hidden md:flex md:w-1/2 h-full relative items-center justify-center">
          
          <div 
            className="relative flex flex-col items-center justify-center transition-transform duration-500 ease-out"
            style={{ 
              transform: `scale(${0.95 + displayProgress * 0.1})`,
              width: '200px',
              height: '440px'
            }}
          >
            {/* EARS */}
            <div className="absolute top-0 w-full flex justify-between px-3 z-0">
              <div className="w-16 h-16 bg-[#0a0c16] rounded-full" />
              <div className="w-16 h-16 bg-[#0a0c16] rounded-full" />
            </div>

            {/* BODY PILL */}
            <div className="w-full h-full bg-[#0a0c16] rounded-[100px] shadow-[0_40px_80px_rgba(0,0,0,0.2)] relative z-10 overflow-hidden border border-white/5">
              
              {/* FACE AREA */}
              <div className="mt-32 flex flex-col items-center">
                
                {/* EYES (Tracking & Fixed 4s Blink) */}
                <div className="flex gap-14 relative">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full transition-shadow duration-300"
                      style={{
                        backgroundColor: "#818cf8",
                        boxShadow: `0 0 ${glowIntensity}px 4px rgba(129, 140, 248, 0.6), 0 0 4px white`,
                        // Apply tracking transform + blink scale
                        transform: `translate(${eyeX}px, ${eyeY}px) scaleY(${isBlinking ? 0.05 : 1.1})`,
                        transition: isBlinking ? 'none' : 'transform 0.1s ease-out, box-shadow 0.3s ease'
                      }}
                    />
                  ))}
                </div>

                {/* HAPPY SMILE (Fixed Emotion Loop) */}
                <div className="mt-14">
                  <svg 
                    width={smileExpansion} 
                    height="18" 
                    viewBox="0 0 40 20" 
                    fill="none" 
                    className="transition-all duration-700 ease-in-out opacity-40"
                  >
                    <path 
                      d="M5 5C10 18 30 18 35 5" 
                      stroke="white" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Subtle Body Gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>

            {/* STATIC SHADOW */}
            <div className="absolute -bottom-8 w-44 h-8 bg-slate-900/5 rounded-[100%] blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;