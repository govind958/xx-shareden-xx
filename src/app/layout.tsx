"use client"; // 👈 makes this a client component

import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import mixpanel from "../lib/mixpanelClient";
import { AuthProvider } from "@/src/context/AuthContext";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      // ✅ Track page view on first load + route changes
      mixpanel.track("Page View", { page: pathname });
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster 
          position="top-right"
          theme="dark"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
