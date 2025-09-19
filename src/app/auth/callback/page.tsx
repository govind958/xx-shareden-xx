"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        // Exchange the OAuth code for a session (for PKCE flow)
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

        if (error) {
          console.error("[Callback] Error exchanging code for session:", error.message);
          router.push("/login");
          return;
        }

        if (data?.session) {
          // ✅ Directly redirect Google users to /private
          router.push("/private");
        } else {
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
