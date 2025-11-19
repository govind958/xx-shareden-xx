"use client";

import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import mixpanel from "mixpanel-browser";

// Initialize Mixpanel once
if (typeof window !== "undefined" && !(mixpanel as any).__loaded) {
  mixpanel.init("YOUR_MIXPANEL_TOKEN", { debug: false });
  (mixpanel as any).__loaded = true;
}

const App: FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [visitStartTime] = useState(Date.now());

  const glass = "bg-teal-500/10 backdrop-blur-xl rounded-2xl shadow-lg";

  /* -----------------------------
      Track Page View
  ------------------------------ */
  useEffect(() => {
    mixpanel.track("Page Viewed", {
      page_name: "shareden-homepage",
      source: getQuery("utm_source") || "direct",
      campaign: getQuery("utm_campaign") || "none",
      medium: getQuery("utm_medium") || "none",
      device: getDeviceType(),
    });
  }, []);

  /* -----------------------------
      Helpers
  ------------------------------ */
  const getQuery = (param: string) => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get(param);
  };

  const getDeviceType = () => {
    if (typeof navigator === "undefined") return "unknown";
    return /Mobile|Android|iPhone/i.test(navigator.userAgent)
      ? "mobile"
      : "desktop";
  };

  /* -----------------------------
      Track CTA Click
  ------------------------------ */
  const handleCTAClick = (type: string, href: string) => {
    mixpanel.track("CTA Clicked", {
      page_name: "shareden-homepage",
      button_type: type,
      source: getQuery("utm_source") || "direct",
      device: getDeviceType(),
    });

    window.location.href = href;
  };

  /* -----------------------------
      Time Spent
  ------------------------------ */
  useEffect(() => {
    const handleUnload = () => {
      const duration = Math.round((Date.now() - visitStartTime) / 1000);
      mixpanel.track("Page Time Spent", {
        page_name: "shareden-homepage",
        duration_seconds: duration,
      });
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [visitStartTime]);

  /* -----------------------------
      UI
  ------------------------------ */
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950 text-neutral-50 font-sans relative overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-1/3 -left-1/4 w-[55%] h-[55%] bg-teal-300 opacity-10 blur-3xl rounded-full animate-blob"></div>
        <div className="absolute -bottom-1/3 right-0 w-[55%] h-[55%] bg-teal-500 opacity-10 blur-3xl rounded-full animate-blob animation-delay-2000"></div>
      </div>

      {/* NAVBAR */}
      <nav className={`sticky top-4 z-50 mx-4 md:mx-8 lg:mx-16 p-4 border border-teal-200/20 ${glass}`}>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Share
            </span>
            <span className="text-white">Den</span>
          </h1>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <NavigationMenu>
              <NavigationMenuList className="text-base font-semibold">
                <NavigationMenuItem>
                  <a
                    href="/stacks"
                    className="hover:text-teal-400 transition"
                  >
                    List your Stacks
                  </a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              className="bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold rounded-full hover:opacity-90 transition"
              onClick={() => handleCTAClick("Login Navbar", "/login")}
            >
              Login
            </Button>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent className="bg-neutral-950 text-white border-none">
                <SheetHeader className="pb-8">
                  <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-6 text-xl font-bold">
                  <a href="/stacks" onClick={() => setIsSheetOpen(false)}>
                    List your stacks
                  </a>
                  <a href="/help" onClick={() => setIsSheetOpen(false)}>
                    Help
                  </a>
                  <a href="/login" onClick={() => setIsSheetOpen(false)}>
                    Login
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex-grow container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center z-10">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-snug mb-6 max-w-xl">
            Rent the{" "}
            <span className="underline decoration-teal-500">Stack</span>{" "}
            Your Startup Needs
          </h1>

          <p className="text-base md:text-lg text-neutral-400 mb-8 max-w-xl">
            ShareDen gives you <b>network + skills + systems + processes</b> by the hour. Scale on-demand.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-white text-neutral-900 font-semibold hover:bg-neutral-200"
              onClick={() => handleCTAClick("Discover Stacks Hero", "/discover")}
            >
              Discover Stacks
            </Button>

            <Button
              size="lg"
              className="border border-neutral-600 text-neutral-200 hover:border-white"
              onClick={() => handleCTAClick("Login Hero", "/login")}
            >
              Login
            </Button>
          </div>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="flex justify-center">
          <svg
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto text-white"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 2V22" stroke="currentColor" strokeWidth="2" />
            <path d="M22 7L12 12L2 7" stroke="currentColor" strokeWidth="2" />
            <path d="M12 12L2 17" stroke="currentColor" strokeWidth="2" />
            <path d="M22 17L12 12" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

      </section>

      <Footer />
    </main>
  );
};

export default App;
