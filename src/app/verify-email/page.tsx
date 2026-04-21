"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { MailCheck, GalleryVerticalEnd } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-[#FDFDFD] text-center px-6 font-sans">
      <div className="bg-white shadow-lg border border-slate-100 rounded-2xl p-8 sm:p-12 max-w-md w-full space-y-6">
        {/* Brand */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-[#1A365D] text-white">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#1A365D]">Stackboard</span>
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-blue-50">
            <MailCheck className="size-8 text-[#2B6CB0]" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A365D]">
          Check your email
        </h1>

        <p className="text-slate-500 text-sm sm:text-base">
          We&apos;ve sent a verification link to your email address. 
          Click the link to verify your account, then come back here to log in.
        </p>

        <Link href="/login">
          <Button className="w-full bg-[#2B6CB0] text-white font-bold hover:bg-[#1A365D] rounded-lg shadow-md transition-all active:scale-95">
            Back to Login
          </Button>
        </Link>

        <p className="text-xs text-slate-400">
          Didn&apos;t receive the email? Check your spam folder or try signing up again.
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-sm text-gray-500">
        © 2025 ShareDen. All rights reserved.
      </footer>
    </main>
  );
}
