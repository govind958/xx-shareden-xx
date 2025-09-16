"use client"; // 👈 makes this a client component

import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import mixpanel from "../lib/mixpanelClient";

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
      <body>{children}</body>
    </html>
  );
}
