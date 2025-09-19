"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    console.log("[Callback] Page loaded");

    const handleOAuth = async () => {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

        console.log("[Callback] Supabase session from URL:", data, error);

        if (error) {
          console.error("[Callback] Error getting session:", error.message);
          router.push("/login");
          return;
        }

        if (data?.session) {
          console.log("[Callback] Session exists → redirecting to /private");
          router.push("/private");
        } else {
          console.log("[Callback] No session → redirecting to /login");
          router.push("/login");
        }
      } catch (err) {
        console.error("[Callback] Unexpected error:", err);
        router.push("/login");
      }
    };

    handleOAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in with Google...</p>
    </div>
  );
}

