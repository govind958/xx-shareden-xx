"use client";
import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { AlertCircle, CheckCircle2, ArrowLeft, Quote, Sparkles, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import JaneDoePortrait from "@/src/app/Image/alert.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  };

  return (  
    <div className="grid min-h-svh lg:grid-cols-2 bg-white text-slate-900 font-sans">
      
      {/* LEFT SIDE: FORM SECTION */}
      <div className="flex flex-col gap-4 p-6 md:p-10 relative overflow-hidden">
        {/* Subtle Background Glow */}
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
                Reset password.
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Enter your email and we&apos;ll send you a secure link.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4 text-sm text-red-600 animate-in zoom-in duration-300">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            {/* Success Message UI */}
            {success ? (
              <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center justify-center gap-4 rounded-[32px] border border-emerald-100 bg-emerald-50/30 p-8 text-center shadow-sm">
                  <div className="size-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                    <CheckCircle2 className="size-8 text-white" strokeWidth={3} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black text-slate-900 tracking-tight">Check your inbox.</p>
                    <p className="text-[13px] font-bold text-slate-500 leading-relaxed">
                      We&apos;ve sent a reset link to your email address. It may take a minute to arrive.
                    </p>
                  </div>
                </div>
                <Link
                  href="/login"
                  className="w-full flex justify-center items-center gap-2 bg-slate-950 text-white hover:bg-indigo-600 transition-all h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-95 shadow-xl shadow-slate-200"
                >
                  <ArrowLeft size={16} />
                  Return to Login
                </Link>
              </div>
            ) : (
              /* Main Form */
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex h-12 w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-950 text-white hover:bg-indigo-600 transition-all h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={12} />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
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
          
          <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-[40px] p-10 border border-white/5 shadow-2xl">
            <div className="absolute -top-5 left-10 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Quote size={18} className="text-slate-950" fill="currentColor" />
            </div>
            
            <div className="space-y-8">
              <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-300">
                Stackboard has transformed our document sharing. Securing, sharing, and organizing our files is now a breeze. It&apos;s a <span className="text-white font-bold">total game-changer.</span>
              </p>

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