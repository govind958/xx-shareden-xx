"use client";

import { Suspense, useEffect, useState } from "react";
import { employeeLogin } from "@/src/modules/employee/actions";
import { Button } from "@/src/components/ui/button";
import { Mail, Lock, ShieldCheck, Clock, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function EmployeeLoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error === "missing_fields") {
      setErrorMessage("Please fill in all required fields.");
    } else if (error === "invalid_credentials") {
      setErrorMessage("Invalid email or password.");
    } else if (error === "session_error") {
      setErrorMessage("Failed to create session. Please try again.");
    } else if(error === "pending_approval") {
      setErrorMessage("Your account is pending admin approval. Please wait for approval.");
    } else if (error === "account_rejected") {
      setErrorMessage("Your account request was rejected. Please contact your administrator.");
    } else if (error === "not_employee") {
      setErrorMessage("You are not registered as an employee. Please use the correct login portal.");
    }
  }, [error]);

  return (
    <main className="min-h-screen flex bg-neutral-950 text-white">

      {/* LEFT SIDE INFO PANEL */}

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


      {/* RIGHT SIDE LOGIN */}

      <div className="flex flex-1 items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}

          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">
              Sign in
            </h2>

            <p className="text-sm text-neutral-400 mt-2">
              Enter your employee credentials to access the portal.
            </p>
          </div>

          {/* Error */}

          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          {/* FORM */}

          <form action={employeeLogin} className="space-y-6">

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
                  placeholder="employee@company.com"
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-10 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition"
                />
              </div>
            </div>


            {/* Password */}

            <div>
              <label className="block text-sm text-neutral-300 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />

                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-10 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition"
                />
              </div>
            </div>


            {/* Forgot password */}

            <div className="flex justify-end">
              <Link
                href="/Employee_portal/forgot-password"
                className="text-sm text-teal-400 hover:text-teal-300 transition"
              >
                Forgot password?
              </Link>
            </div>


            {/* Button */}

            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold"
            >
              Sign In
            </Button>

          </form>


          {/* Divider */}

          <div className="flex items-center gap-3 my-8 text-neutral-500 text-xs">
            <div className="flex-1 h-px bg-white/10"></div>
            OR
            <div className="flex-1 h-px bg-white/10"></div>
          </div>


          {/* Signup */}

          <p className="text-center text-sm text-neutral-400">
            Don’t have an employee account?{" "}
            <Link
              href="/Employee_portal/signup"
              className="text-teal-400 hover:text-teal-300 font-medium"
            >
              Request Access
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
}

export default function EmployeeLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse [animation-delay:200ms]" />
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    }>
      <EmployeeLoginContent />
    </Suspense>
  );
}