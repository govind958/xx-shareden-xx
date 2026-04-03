"use client";
import React, { useState } from "react";
import { Mail, ShieldCheck, Clock, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { employeeForgotPassword } from "@/src/modules/employee/actions";

export default function EmployeeForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    const result = await employeeForgotPassword(email);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

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

      {/* RIGHT SIDE PASSWORD RESET */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-md">
          
          {/* Back to login link */}
          <Link
            href="/Employee_portal/login"
            className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>

          {success ? (
            /* SUCCESS STATE */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-teal-400" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">
                Check your email
              </h2>
              <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                We&apos;ve sent a password reset link to <span className="text-white font-medium">{email}</span>. 
                Please check your inbox and follow the instructions to reset your password.
              </p>
              
              <button
                onClick={() => setSuccess(false)}
                className="w-full bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-white py-3 rounded-lg font-semibold transition"
              >
                Try another email
              </button>
            </div>
          ) : (
            /* FORM STATE */
            <div className="animate-in fade-in duration-500">
              {/* Heading */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Forgot Password
                </h2>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  Enter your registered work email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="employee@company.com"
                      disabled={isLoading}
                      className="w-full rounded-lg border border-white/10 bg-neutral-900 px-10 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              {/* Support Notice */}
              <p className="text-center text-sm text-neutral-500 mt-8">
                If you no longer have access to your work email, please contact {" "}
                <a href="#" className="text-teal-400 hover:text-teal-300 transition">
                  IT Support
                </a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}