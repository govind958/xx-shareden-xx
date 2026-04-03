"use client";
import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { GalleryVerticalEnd, AlertCircle, CheckCircle2, ArrowLeft, Quote } from "lucide-react";

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
    <div className="grid min-h-svh lg:grid-cols-2 bg-[#FDFDFD] text-slate-900 font-sans">
      
      {/* LEFT SIDE: FORM SECTION */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        
        {/* Brand Logo */}
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-[#1A365D] text-white transition-transform hover:scale-105">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#1A365D]">Stackboard.</span>
          </Link>
        </div>

        {/* Centered Content Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">
            
            {/* Header Text */}
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[#1A365D]">
                Forgot Password
              </h1>
              <p className="text-sm text-slate-500">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success ? (
              <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-green-200 bg-green-50 p-6 text-center shadow-sm">
                  <CheckCircle2 className="size-10 text-green-600" />
                  <div className="space-y-1">
                    <p className="font-bold text-green-800">Check your email!</p>
                    <p className="text-sm text-green-700">
                      We&apos;ve sent a password reset link to your email address.
                    </p>
                  </div>
                </div>
                <a
                  href="/login"
                  className="w-full flex justify-center items-center gap-2 bg-[#1A365D] text-white hover:bg-[#2B6CB0] transition-all py-2.5 rounded shadow-md font-bold text-sm active:scale-95"
                >
                  <ArrowLeft size={16} />
                  Return to Login
                </a>
              </div>
            ) : (
              /* Main Form */
              <form className="space-y-4 animate-in fade-in duration-300" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-300 focus:border-[#2B6CB0] outline-none transition-all shadow-sm"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2B6CB0] text-white hover:bg-[#1A365D] transition-all py-2.5 rounded shadow-md font-bold text-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>

                {/* Back to Login Link */}
                <div className="text-center pt-4">
                  <a href="/login" className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1A365D] transition-colors">
                    <ArrowLeft size={12} />
                    Back to Login
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: TESTIMONIAL SECTION */}
      <div className="relative hidden bg-slate-50 lg:block border-l border-slate-100 overflow-hidden">
        
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="relative">
                <div className="size-48 border border-slate-300 rounded-full flex items-center justify-center">
                   <div className="size-32 border border-slate-300 rounded-full flex items-center justify-center" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="h-px w-64 bg-slate-300 rotate-45" />
                   <div className="h-px w-64 bg-slate-300 -rotate-45" />
                </div>
            </div>
        </div>
        
        {/* Testimonial Card Overlay */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg space-y-8 p-10 font-sans z-10">
          
          {/* Header */}
          <h2 className="text-5xl font-extrabold tracking-tighter text-[#1A365D]">
            Trusted by businesses and CAs
          </h2>
          
          {/* Testimonial Box */}
          <div className="bg-[#1A365D] rounded-3xl p-10 text-white relative shadow-2xl">
            {/* Quote Icon */}
            <Quote className="size-14 text-[#2B6CB0] absolute -top-7 left-10" />
            
            {/* Quote Content */}
            <div className="space-y-6 pt-6">
              <p className="text-xl font-medium leading-relaxed">
                Stackboard has transformed our document sharing. Securing, sharing, and organizing our files is now a breeze. It&apos;s truly a game-changer for our collaborative projects.
              </p>
              
              {/* Stat Line */}
              <p className="text-xl font-bold">
                We have reduced processing time by 45% using Stackboard.
              </p>
            </div>
            
            {/* Divider */}
            <div className="my-8 h-px bg-[#2B6CB0] opacity-30" />
            
            {/* Profile Section */}
            <div className="flex items-center gap-6">
              {/* Portrait Placeholder replacing Next.js Image for Preview */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://i.pravatar.cc/150?img=47"
                alt="Jane Doe"
                className="size-20 rounded-full border-4 border-[#2B6CB0] object-cover shadow-lg"
              />
              
              {/* Name and Title */}
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Jane Doe</span>
                <span className="text-sm font-semibold uppercase tracking-wider text-[#90CDF4]">
                  CHIEF OPERATIONS OFFICER, INNOVATE TECH SOLUTIONS
                </span>
              </div>
              
              {/* Pagination Dots */}
              <div className="ml-auto flex items-center gap-2">
                <div className="h-2 w-10 rounded-full bg-[#2B6CB0]" />
                <div className="size-2 rounded-full bg-slate-600" />
                <div className="size-2 rounded-full bg-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}