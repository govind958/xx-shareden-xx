"use client";

import { useEffect } from "react";
import { login, signInWithGoogle, signup } from "@/src/modules/login/actions";
import { Button } from "@/src/components/ui/button";
import { GithubIcon, RectangleGogglesIcon, GalleryVerticalEnd, Quote } from "lucide-react";
import mixpanel from "@/src/lib/mixpanelClient";
import Image from "next/image";

// Placeholder for the testimonial portrait
import JaneDoePortrait from "@/src/app/Image/alert.png"; // Assuming you have this image

export default function LoginPage() {
  useEffect(() => {
    mixpanel.track("Login Page Viewed");
  }, []);

  return (
    /* Changed bg-black to the Billing Page background #FDFDFD and text-white to text-slate-900 */
    <div className="grid min-h-svh lg:grid-cols-2 bg-[#FDFDFD] text-slate-900 font-sans">
      
      {/* LEFT SIDE: FORM SECTION */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Brand Logo */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            {/* Matches the Billing Header Navy #1A365D */}
            <div className="flex size-6 items-center justify-center rounded-md bg-[#1A365D] text-white">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#1A365D]">Stackboard.</span>
          </a>
        </div>

        {/* Centered Content Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">
            
            {/* Header Text */}
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[#1A365D]">
                Login to your account
              </h1>
              <p className="text-sm text-slate-500">
                Enter your email below to login to your account
              </p>
            </div>

            {/* Main Login Form */}
            <form className="space-y-4">
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  /* Matches Billing Input styles: white bg, slate borders */
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-[#2B6CB0] outline-none transition-all shadow-sm"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="ml-auto inline-block text-sm font-medium text-[#2B6CB0] underline underline-offset-4 hover:text-[#1A365D]">
                    Forgot your password?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-[#2B6CB0] outline-none transition-all shadow-sm"
                />
              </div>

              <Button
                formAction={login}
                /* Matches "Upgrade Plan" button: #2B6CB0 blue */
                className="w-full bg-[#2B6CB0] text-white hover:bg-[#1A365D] transition-all py-2 rounded shadow-md font-bold text-sm active:scale-95"
              >
                Login
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className="bg-[#FDFDFD] px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={signInWithGoogle}
                /* Matches Billing secondary button/table styles */
                className="w-full border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-2 rounded flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest shadow-sm transition-colors"
              >
                <RectangleGogglesIcon size={16} className="text-blue-600" />
                Login with Google
              </Button>
              
              <Button
                variant="outline"
                type="button"
                onClick={() => {}}
                className="w-full border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-2 rounded flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest shadow-sm transition-colors"
              >
                <GithubIcon size={16} className="text-slate-800" />
                Login with GitHub
              </Button>
            </div>

            {/* Footer Sign Up Link */}
            <div className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <button 
                formAction={signup} 
                className="font-bold text-[#2B6CB0] underline underline-offset-4 hover:text-[#1A365D]"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: PLACEHOLDER IMAGE SECTION */}
      {/* Changed bg-neutral-900 to bg-slate-50 (used in Billing table footers) */}
      <div className="relative hidden bg-slate-50 lg:block border-l border-slate-100">
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="relative">
                {/* Changed neutral-700 to slate-300 */}
                <div className="size-48 border border-slate-300 rounded-full flex items-center justify-center">
                   <div className="size-32 border border-slate-300 rounded-full flex items-center justify-center" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="h-px w-64 bg-slate-300 rotate-45" />
                   <div className="h-px w-64 bg-slate-300 -rotate-45" />
                </div>
            </div>
        </div>
        
        {/* NEW TESTIMONIAL CARD BASED ON THE IMAGE */}
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
              {/* Portrait (Placeholder) */}
              <Image 
                src={JaneDoePortrait}
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
              
              {/* Pagination Dots (Optional styling) */}
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