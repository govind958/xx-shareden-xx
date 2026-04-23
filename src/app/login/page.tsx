"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { login, signInWithGoogle, signup } from "@/src/modules/login/actions";
import { Button } from "@/src/components/ui/button";
import { GithubIcon, GalleryVerticalEnd, Quote, AlertCircle } from "lucide-react";
import mixpanel from "@/src/lib/mixpanelClient";
import Image from "next/image";
import Link from "next/link"; // Added Link import

import JaneDoePortrait from "@/src/app/Image/alert.png";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    mixpanel.track("Login Page Viewed");
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-[#FDFDFD] text-slate-900 font-sans">
      
      {/* LEFT SIDE: FORM SECTION */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        
        {/* NEW BRAND LOGO INTEGRATED HERE */}
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg bg-slate-900 shadow-slate-900/10">
              <div className="h-4 w-4 bg-white rounded-sm rotate-45 transition-transform group-hover:rotate-[135deg]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight leading-none transition-colors duration-300 text-[#1A365D]">
                StackBoard<span className="text-indigo-500">AI</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] mt-1 uppercase transition-colors text-slate-400">
                Enterprise v1.0
              </span>
            </div>
          </Link>
        </div>

        {/* Centered Content Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">
            
            {/* Header Text */}
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[#1A365D]">
                Welcome to Stackboard
              </h1>
              <p className="text-sm text-slate-500">
                Login to your account or create a new one
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Main Form */}
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
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-[#2B6CB0] outline-none transition-all shadow-sm"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="password">
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-[#2B6CB0] outline-none transition-all shadow-sm"
                />
                  <a href="/forgot-password" className="ml-auto inline-block text-xs font-medium text-[#2B6CB0] underline underline-offset-4 hover:text-[#1A365D]">
                    Forgot your password?
                  </a>
              </div>

              {/* Login & Sign Up buttons side by side */}
              <div className="flex gap-3 pt-2">
                <Button
                  formAction={login}
                  className="flex-1 bg-[#2B6CB0] text-white hover:bg-[#1A365D] transition-all py-2 rounded shadow-md font-bold text-sm active:scale-95"
                >
                  Log in
                </Button>
                <Button
                  formAction={signup}
                  className="flex-1 bg-[#1A365D] text-white hover:bg-[#2B6CB0] transition-all py-2 rounded shadow-md font-bold text-sm active:scale-95"
                >
                  Sign up
                </Button>
              </div>
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
                className="w-full border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-2 rounded flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest shadow-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" className="shrink-0">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"/>
                  <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"/>
                </svg>
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                type="button"
                onClick={() => {}}
                className="w-full border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-2 rounded flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest shadow-sm transition-colors"
              >
                <GithubIcon size={16} className="text-slate-800" />
                Continue with GitHub
              </Button>
            </div>

            {/* Terms */}
            <div className="text-center text-xs text-slate-400">
              By continuing, you agree to our{" "}
              <a href="/Terms_of_service" className="underline underline-offset-4 hover:text-[#2B6CB0]">Terms of Service</a>{" "}
              and{" "}
              <a href="/Privacy_Policy" className="underline underline-offset-4 hover:text-[#2B6CB0]">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: TESTIMONIAL SECTION */}
      <div className="relative hidden bg-slate-50 lg:block border-l border-slate-100">
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
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg space-y-8 p-10 font-sans z-10">
          <h2 className="text-5xl font-extrabold tracking-tighter text-[#1A365D]">
            Trusted by businesses and CAs
          </h2>
          
          <div className="bg-[#1A365D] rounded-3xl p-10 text-white relative shadow-2xl">
            <Quote className="size-14 text-[#2B6CB0] absolute -top-7 left-10" />
            
            <div className="space-y-6 pt-6">
              <p className="text-xl font-medium leading-relaxed">
                Stackboard has transformed our document sharing. Securing, sharing, and organizing our files is now a breeze. It&apos;s truly a game-changer for our collaborative projects.
              </p>
              <p className="text-xl font-bold">
                We have reduced processing time by 45% using Stackboard.
              </p>
            </div>
            
            <div className="my-8 h-px bg-[#2B6CB0] opacity-30" />
            
            <div className="flex items-center gap-6">
              <Image 
                src={JaneDoePortrait}
                alt="Jane Doe"
                className="size-20 rounded-full border-4 border-[#2B6CB0] object-cover shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Jane Doe</span>
                <span className="text-sm font-semibold uppercase tracking-wider text-[#90CDF4]">
                  CHIEF OPERATIONS OFFICER, INNOVATE TECH SOLUTIONS
                </span>
              </div>
              
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