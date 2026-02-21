"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { login, signInWithGoogle, signup } from "@/src/modules/login/actions";
import { Button } from "@/src/components/ui/button";
import { Mail, Lock, Github, ArrowRight, EyeOff } from "lucide-react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import mixpanel from "@/src/lib/mixpanelClient";

// --- MAGNETIC EFFECT (Keeping your original logic) ---
const MagneticWrapper = ({ children, strength = 0.2 }: { children: ReactNode, strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY }}
      className="w-full max-w-md"
    >
      {children}
    </motion.div>
  );
};

export default function LoginPage() {
  useEffect(() => {
    mixpanel.track("Login Page Viewed");
  }, []);

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- AMBIENT BACKGROUND (Micro-grid 15px) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.12]" 
          style={{ 
            backgroundImage: `radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)`,
            backgroundSize: '15px 15px' 
          }} 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/[0.05] blur-[120px] rounded-full" />
      </div>

      {/* --- LOGO --- */}
      <div className="absolute top-12 left-12 flex items-center gap-2 z-20">
        <div className="w-5 h-5 bg-teal-500 rounded-sm shadow-[0_0_15px_rgba(20,184,166,0.4)]" />
        <span className="text-sm font-black tracking-[0.2em] uppercase">ShareDen</span>
      </div>

      <MagneticWrapper strength={0.15}>
        <div className="relative z-10 w-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
              Protocol <span className="text-teal-500">Access</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
              Identify to continue to dashboard
            </p>
          </div>

          {/* Social Auth Stacks */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Button
              type="button"
              onClick={() => signInWithGoogle()}
              className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-teal-500/30 text-white rounded-xl h-12 transition-all group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-[10px] font-black tracking-widest uppercase">Google</span>
            </Button>

            <Button
              type="button"
              className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-teal-500/30 text-white rounded-xl h-12 transition-all group"
            >
              <Github className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black tracking-widest uppercase">GitHub</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-white/5"></div>
            <span className="text-[9px] font-black tracking-[0.3em] text-neutral-800 uppercase">OR</span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-teal-500 transition-colors w-4 h-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="EMAIL ADDRESS"
                  className="w-full pl-12 pr-4 bg-white/[0.03] border border-white/5 rounded-xl h-14 text-xs focus:border-teal-500/50 focus:ring-0 transition-all placeholder:text-neutral-700 placeholder:font-black placeholder:tracking-widest placeholder:text-[9px] outline-none"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-teal-500 transition-colors w-4 h-4" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="PASSWORD"
                  className="w-full pl-12 pr-12 bg-white/[0.03] border border-white/5 rounded-xl h-14 text-xs focus:border-teal-500/50 focus:ring-0 transition-all placeholder:text-neutral-700 placeholder:font-black placeholder:tracking-widest placeholder:text-[9px] outline-none"
                />
                <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-700 w-4 h-4 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                formAction={login}
                className="bg-white text-black hover:bg-neutral-200 font-black text-[10px] tracking-widest rounded-xl h-14 uppercase"
              >
                Log in
              </Button>
              <Button
                formAction={signup}
                className="bg-teal-500 text-black hover:bg-teal-400 font-black text-[10px] tracking-widest rounded-xl h-14 uppercase transition-colors"
              >
                Sign up
              </Button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-[0.2em] leading-relaxed">
              By authenticating, you agree to our <br />
              <a href="#" className="text-neutral-400 hover:text-white transition-colors underline underline-offset-4">Terms</a> and <a href="#" className="text-neutral-400 hover:text-white transition-colors underline underline-offset-4">Privacy Standards</a>.
            </p>
          </div>
        </div>
      </MagneticWrapper>

      {/* FOOTER LINK */}
      <a href="/" className="mt-12 group flex items-center gap-2 text-neutral-600 hover:text-white transition-colors z-20">
        <span className="text-[10px] font-black tracking-widest uppercase">Back to Terminal</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </a>
    </main>
  );
}