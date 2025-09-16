"use client";

import { useEffect } from "react";
import { login, signup } from "./actions";
import { Button } from "@/src/components/ui/button";
import { Mail, Lock } from "lucide-react";
import mixpanel from "@/src/lib/mixpanelClient";

export default function LoginPage() {
  // Track page view when user lands here
  useEffect(() => {
    mixpanel.track("Login Page Viewed");
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-teal-50 p-6 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-10 space-y-8 border border-teal-200/40">
        {/* Title */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
            Welcome Back 👋
          </h1>
          <p className="text-teal-700/80">Login or create a new account</p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500/70 w-5 h-5" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full pl-10 rounded-xl border border-teal-300/50 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 px-4 py-3 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500/70 w-5 h-5" />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full pl-10 rounded-xl border border-teal-300/50 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 px-4 py-3 transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              formAction={login}
              className="w-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:scale-[1.02] hover:shadow-lg transition"
            >
              Log in
            </Button>
            <Button
              formAction={signup}
              className="w-1/2 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:scale-[1.02] hover:shadow-lg transition"
            >
              Sign up
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-teal-200"></div>
          <span className="text-sm text-teal-600/70">or</span>
          <div className="h-px flex-1 bg-teal-200"></div>
        </div>

        {/* Social Login */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 shadow-sm">
            Continue with Google
          </Button>
          <Button className="flex-1 bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 shadow-sm">
            Continue with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
