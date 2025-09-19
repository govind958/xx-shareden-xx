"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    console.log("[Callback] Page loaded");

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("[Callback] Supabase session:", session, error);

        if (error) {
          console.error("[Callback] Error fetching session:", error);
        }

        if (session) {
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

    checkSession();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in with Google...</p>
    </div>
  );
}
