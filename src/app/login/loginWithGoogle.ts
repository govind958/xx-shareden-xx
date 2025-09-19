"use client";

import { createClient } from "@/utils/supabase/client";

export async function loginWithGoogle() {
  console.log("[Google Login] Button clicked");

  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/auth/callback",
      },
    });

    console.log("[Google Login] Supabase response:", data, error);

    if (error) {
      console.error("[Google Login] Error:", error.message);
      alert("Login failed: " + error.message);
      return;
    }

    if (data?.url) {
      console.log("[Google Login] Redirecting browser to:", data.url);
      window.location.href = data.url; // 👈 browser redirect
    } else {
      console.warn("[Google Login] No URL returned from Supabase");
    }
  } catch (err) {
    console.error("[Google Login] Unexpected error:", err);
  }
}
