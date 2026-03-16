"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

const glassmorphismClass =
  "bg-neutral-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-teal-500/20";

export default function PendingApprovalPage() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950 text-neutral-50 font-sans overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-300 rounded-full mix-blend-screen opacity-10 blur-3xl animate-blob"></div>
        <div className="absolute -bottom-1/4 right-0 w-1/2 h-1/2 bg-teal-500 rounded-full mix-blend-screen opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div
        className={`relative z-10 w-full max-w-md mx-auto my-auto px-6 py-10 sm:p-12 space-y-8 ${glassmorphismClass} animate-fade-in-up`}
      >
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <Clock className="w-12 h-12 text-amber-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent drop-shadow-md">
            Pending Approval
          </h1>
          <p className="text-sm sm:text-base text-neutral-300">
            Your account has been created successfully. An administrator will review your request and approve your access. You will receive an email once your account is approved.
          </p>
        </div>

        <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 text-sm text-teal-200">
          <p className="mb-0">
            In the meantime, you can close this page. Check your email for the approval notification, then sign in at the Employee Portal.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/Employee_portal/login"
            className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition underline underline-offset-4"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}