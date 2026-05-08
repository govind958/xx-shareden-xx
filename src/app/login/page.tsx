"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { login, signInWithGoogle, signup } from "@/src/modules/login/actions";
import { Button } from "@/src/components/ui/button";
import { GithubIcon, AlertCircle, Quote, Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import mixpanel from "@/src/lib/mixpanelClient";
import Image from "next/image";
import Link from "next/link";

import JaneDoePortrait from "@/src/app/Image/alert.png";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    mixpanel.track("Login Page Viewed");
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white text-slate-900 font-sans">
      
      {/* LEFT SIDE: FORM SECTION */}
      <div className="flex flex-col gap-4 p-6 md:p-10 relative overflow-hidden">
        {/* Subtle Background Glow for Premium feel */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-50/50 blur-[100px] rounded-full -z-10" />
        
        {/* BRAND LOGO */}
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg bg-slate-950 shadow-indigo-100">
              <div className="h-4 w-4 bg-white rounded-sm rotate-45 transition-transform group-hover:rotate-[135deg]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none text-slate-900">
                StackBoard<span className="text-indigo-600">AI</span>
              </span>
              <span className="text-[9px] font-black tracking-[0.3em] mt-1 uppercase text-slate-400">
                Enterprise v1.0
              </span>
            </div>
          </Link>
        </div>

        {/* Centered Content Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[340px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header Text */}
            <div className="flex flex-col space-y-3 text-center md:text-left">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900">
                Welcome back.
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4 text-sm text-red-600 animate-in zoom-in duration-300">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            {/* Main Form */}
            <form className="space-y-5">
              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="flex h-12 w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400" htmlFor="password">
                    Password
                  </label>
                  <a 
                    href="/forgot-password" 
                    data-shaking-hint="true" 
                    className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="flex h-12 w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  formAction={login}
                  className="flex-1 bg-slate-950 text-white hover:bg-indigo-600 transition-all h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95"
                >
                  Log in
                </Button>
                <Button
                  formAction={signup}
                  className="flex-1 bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 transition-all h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-95"
                >
                  Sign up
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
                <span className="bg-white px-4 text-slate-300">Social Authentication</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={signInWithGoogle}
                className="flex items-center justify-center gap-2 h-12 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-12 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <GithubIcon size={18} className="text-slate-900" />
              </button>
            </div>

            {/* Terms */}
            <p className="text-center text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
              By continuing, you agree to our <br />
              <Link href="/Terms" className="text-indigo-600 hover:underline">Terms</Link> & <Link href="/Privacy" className="text-indigo-600 hover:underline">Privacy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: CINEMATIC TESTIMONIAL SECTION */}
      <div className="relative hidden lg:flex items-center justify-center bg-slate-950 p-12 overflow-hidden border-l border-white/5">
        
        {/* Animated Background Rings */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] border border-indigo-500/20 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] border border-indigo-500/10 rounded-full" />
        </div>
        
        <div className="relative w-full max-w-lg space-y-12 z-10">
          {/* Section Kicker */}
          <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <Sparkles size={12} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
              The New Standard
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-[0.95]">
            Business <br />
            <span className="text-indigo-500">Intelligence.</span>
          </h2>
          
          {/* Glassmorphism Card */}
          <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-[40px] p-10 border border-white/5 shadow-2xl">
            {/* Floating Quote Icon */}
            <div className="absolute -top-5 left-10 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Quote size={18} className="text-slate-950" fill="currentColor" />
            </div>
            
            <div className="space-y-8">
              <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-300">
                Stackboard has transformed our document sharing. Securing, sharing, and organizing our files is now a breeze. It&apos;s a <span className="text-white font-bold">total game-changer.</span>
              </p>

              {/* Data Metric Row */}
              <div className="flex items-center gap-4 py-6 border-y border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
                    Case Study #402
                  </span>
                  <p className="text-2xl font-black text-white tracking-tighter">
                    45% faster processing.
                  </p>
                </div>
                <div className="ml-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all cursor-pointer group">
                  <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
              
              {/* Persona Section */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Image 
                    src={JaneDoePortrait}
                    alt="Jane Doe"
                    className="size-14 rounded-2xl border-2 border-indigo-500/30 object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 size-5 bg-indigo-600 rounded-lg flex items-center justify-center border-2 border-slate-950">
                    <div className="size-1.5 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white leading-none">Jane Doe</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mt-1">
                    COO, Innovate Tech Solutions
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Faded Partner Logos */}
          <div className="flex items-center gap-10 opacity-20 grayscale pt-4">
             <div className="h-4 w-20 bg-slate-500 rounded-full" />
             <div className="h-4 w-16 bg-slate-500 rounded-full" />
             <div className="h-4 w-24 bg-slate-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}