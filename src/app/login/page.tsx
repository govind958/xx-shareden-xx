"use client";

import { useEffect } from "react";
import { login, signInWithGoogle, signup } from "@/src/modules/login/actions";
import { Button } from "@/src/components/ui/button";
import { Mail, Lock,GithubIcon,RectangleGogglesIcon } from "lucide-react";
import mixpanel from "@/src/lib/mixpanelClient";

// Glassmorphism style
const glassmorphismClass =
  "bg-neutral-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-teal-500/20";

export default function LoginPage() {
  useEffect(() => {
    mixpanel.track("Login Page Viewed");
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-neutral-950 text-neutral-50 font-sans overflow-hidden relative">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-300 rounded-full mix-blend-screen opacity-10 blur-3xl animate-blob"></div>
        <div className="absolute -bottom-1/4 right-0 w-1/2 h-1/2 bg-teal-500 rounded-full mix-blend-screen opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Centered login card */}
      <div
        className={`relative z-10 w-full max-w-md mx-auto my-auto px-6 py-10 sm:p-12 space-y-8 ${glassmorphismClass} animate-fade-in-up`}
      >
        {/* Title */}
        <div className="space-y-3 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent drop-shadow-md">
            Welcome Back 👋
          </h1>
          <p className="text-sm sm:text-base text-neutral-300">
            Login or create a new account
          </p>
        </div>

 <div className="flex flex-col gap-3">
         <Button
  onClick={signInWithGoogle}
  className="w-full bg-white/10 backdrop-blur-sm border border-teal-500/30 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-teal-500/30 transition rounded-xl"
>
  <div className="flex items-center justify-center space-x-2">
    <RectangleGogglesIcon size={24} />
    <span>Continue with Google</span>
  </div>
</Button>

<Button
onClick={() => {}}
className="w-full bg-white/10 backdrop-blur-sm border border-teal-500/30 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-teal-500/30 transition rounded-xl"
>
<div className="flex items-center justify-center space-x-2">
    <GithubIcon size={24} />
    <span>Continue with GitHub</span>
  </div>
</Button>
        </div>


 {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-teal-500/30"></div>
          <span className="text-sm text-neutral-400">or</span>
          <div className="h-px flex-1 bg-teal-500/30"></div>
        </div>








        {/* Form */}
        <form className="space-y-6">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 w-5 h-5" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full pl-10 rounded-xl border border-teal-500/20 bg-white/5 text-white shadow-md focus:border-teal-500 focus:ring-2 focus:ring-teal-400/40 px-4 py-3 text-sm sm:text-base transition backdrop-blur-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 w-5 h-5" />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full pl-10 rounded-xl border border-teal-500/20 bg-white/5 text-white shadow-md focus:border-teal-500 focus:ring-2 focus:ring-teal-400/40 px-4 py-3 text-sm sm:text-base transition backdrop-blur-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              formAction={login}
              className="w-full sm:w-1/2 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.03] hover:shadow-teal-500/40 transition transform"
            >
              Log in
            </Button>
            <Button
              formAction={signup}
              className="w-full sm:w-1/2 bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold rounded-xl shadow-lg hover:scale-[1.03] hover:shadow-teal-500/40 transition transform"
            >
              Sign up
            </Button>
          </div>
        </form>

       

        {/* Social Login */}
       
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
      </div>

      {/* Footer (same vibe as landing page) */}
  
    </main>
  );
}
