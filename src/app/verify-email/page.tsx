"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-teal-50 via-white to-teal-100 text-center px-6">
      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 max-w-md w-full">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Verify Your{" "}
          <span className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
            Email
          </span>
        </h1>

        <p className="text-gray-600 text-sm sm:text-base mb-8">
          We’ve sent you a verification link. Please check your inbox to confirm
          your account. Once verified, you can log in and start using{" "}
          <span className="font-semibold text-teal-600">ShareDen</span>.
        </p>

        {/* Button back to login */}
        <Link href="/login">
          <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-600 hover:to-teal-700 rounded-lg">
            Back to Login
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-sm text-gray-500">
        © 2025 ShareDen. All rights reserved.
      </footer>
    </main>
  );
}
