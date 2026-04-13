import "./globals.css";
import type { Metadata } from "next";
import ClientProviders from "@/src/components/ClientProviders";

export const metadata: Metadata = {
  title: "Stackboard",
  description: "Infrastructure Made Simple",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
