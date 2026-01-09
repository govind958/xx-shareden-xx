'use server'

import { createClient } from "@/utils/supabase/client";

export async function loginWithGoogle() {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google login error:", error.message);
    alert("Login failed: " + error.message);
  }
}
