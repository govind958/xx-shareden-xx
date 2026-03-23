"use client";

import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, Clock, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function EmployeeResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Invalid or expired reset link. Please request a new one.");
      }
      setSessionChecked(true);
    };
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount to verify recovery session
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    const {error } = await supabase.auth.updateUser({ password: password });

    if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
    
      setIsLoading(false);
      setSuccess(true);
  };
  return (
    <main className="min-h-screen flex bg-neutral-950 text-white font-sans w-full">
      {/* LEFT SIDE INFO PANEL (Kept identical to maintain theme) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-16 border-r border-white/10">
        {/* Logo / Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Workspace
          </h1>
          <p className="text-neutral-400 mt-3 max-w-md">
            Secure internal portal for employees to manage tasks,
            schedules, and collaboration across teams.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="text-teal-400 w-6 h-6 mt-1" />
            <div>
              <h3 className="font-semibold">Secure Access</h3>
              <p className="text-sm text-neutral-400">
                Enterprise-grade authentication protects employee data
                and internal resources.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="text-teal-400 w-6 h-6 mt-1" />
            <div>
              <h3 className="font-semibold">Track Work Efficiently</h3>
              <p className="text-sm text-neutral-400">
                Log hours, manage schedules, and keep productivity
                transparent across teams.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Users className="text-teal-400 w-6 h-6 mt-1" />
            <div>
              <h3 className="font-semibold">Team Collaboration</h3>
              <p className="text-sm text-neutral-400">
                Stay connected with colleagues and departments through
                a unified workspace.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} Stackboard Internal Systems
        </p>
      </div>

      {/* RIGHT SIDE PASSWORD RESET FORM */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-md">
          
          {success ? (
            /* SUCCESS STATE */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-teal-400" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">
                Password Updated
              </h2>
              <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                Your password has been changed successfully. You can now use your new password to sign in to your account.
              </p>
              
              <Link
                href="/Employee_portal/login"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition flex justify-center"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            /* FORM STATE */
            <div className="animate-in fade-in duration-500">
              {/* Back Link (Optional, good for UX if they clicked the email link by mistake) */}
              <Link
                href="/Employee_portal/login"
                className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>

              {/* Heading */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Create New Password
                </h2>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  Your new password must be different from previously used passwords and at least 8 characters long.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                  {error.includes("Invalid or expired") && (
                    <Link
                      href="/Employee_portal/forgot-password"
                      className="block mt-2 text-teal-400 hover:text-teal-300 font-medium"
                    >
                      Request a new reset link →
                    </Link>
                  )}
                </div>  
              )}

              {/* FORM */}
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                    <input
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      disabled={isLoading}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-10 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      disabled={isLoading}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-10 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !sessionChecked || (error?.includes("Invalid or expired") ?? false)}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-70 flex items-center justify-center mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}