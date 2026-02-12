"use client";

import { useEffect, useState } from "react";
import { employeeLogin } from "@/src/modules/employee/actions";
import { Button } from "@/src/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const glassmorphismClass =
    "bg-neutral-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-teal-500/20";

export default function EmployeeLoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (error === "missing_fields") {
            setErrorMessage("Please fill in all fields");
        } else if (error === "invalid_credentials") {
            setErrorMessage("Invalid email or password");
        } else if (error === "session_error") {
            setErrorMessage("Failed to create session. Please try again.");
        }
    }, [error]);

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
                        Employee Portal 👋
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-300">
                        Sign in to your employee account
                    </p>
                </div>

                {/* Error message */}
                {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-6" action={employeeLogin}>
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

                    {/* Login Button */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.03] hover:shadow-teal-500/40 transition transform"
                    >
                        Log in
                    </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-teal-500/30"></div>
                    <span className="text-sm text-neutral-400">or</span>
                    <div className="h-px flex-1 bg-teal-500/30"></div>
                </div>

                {/* Signup Link */}
                <div className="text-center">
                    <Link
                        href="/Employee_portal/signup"
                        className="text-sm text-teal-400 hover:text-teal-300 transition underline underline-offset-4"
                    >
                        Don&apos;t have an account? Sign up
                    </Link>
                </div>

                {/* Footer */}
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                    By signing in, you agree to our{" "}
                    <a href="#">Terms of Service</a> and{" "}
                    <a href="#">Privacy Policy</a>.
                </div>
            </div>
        </main>
    );
}
