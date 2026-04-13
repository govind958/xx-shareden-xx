"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider } from "@/src/context/AuthContext";
import { Toaster } from "sonner";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      import("@/src/lib/mixpanelClient").then((mod) => {
        mod.default.track("Page View", { page: pathname });
      });
    }
  }, [pathname]);

  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" theme="dark" richColors closeButton />
    </AuthProvider>
  );
}
