"use client";

import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import {
  // NavigationMenu,
  // NavigationMenuItem,
  // NavigationMenuList,
} from "@/components/ui/navigation-menu"; // Commented out unused imports
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ArrowRight, CheckCircle2 } from "lucide-react";
import mixpanel from "mixpanel-browser"; // Removed Dict import

// ⚡ Initialize Mixpanel (Safe Check)
if (typeof window !== "undefined") {
  mixpanel.init("YOUR_MIXPANEL_TOKEN", {
    debug: false,
    track_pageview: false,
    persistence: "localStorage",
  });
}

// ────────────────────────────────────────────
// UTILITY FUNCTIONS MOVED OUTSIDE COMPONENT
// ────────────────────────────────────────────

const getQueryParam = (param: string): string | null => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(param);
};

const getDeviceType = (): string => {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  return /Mobile|Android|iP(hone|od)/.test(ua) ? "mobile" : "desktop";
};

// ────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────

const App: FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  /* ────────────────────────────────────────────
      TRACK PAGE VIEW
  ──────────────────────────────────────────── */
  useEffect(() => {
    // Using Record<string, string> ensures specific typing for event properties
    const eventProps: Record<string, string> = {
      page_name: "shareden-homepage",
      source: getQueryParam("utm_source") || "direct",
      campaign: getQueryParam("utm_campaign") || "none",
      medium: getQueryParam("utm_medium") || "none",
      device: getDeviceType(),
    };

    mixpanel.track("Page Viewed", eventProps);
  }, []); // Empty dependency array is safe now that utilities are outside

  /* ────────────────────────────────────────────
      TRACK CTA CLICKS
  ──────────────────────────────────────────── */
  const handleCTAClick = (buttonType: string, href: string) => {
    mixpanel.track("CTA Clicked", {
      page_name: "shareden-homepage",
      button_type: buttonType,
    });

    window.location.href = href;
  };

  const menuItems = [
      { name: "Explore Stacks", href: "/stacks" },
      { name: "Pricing", href: "/pricing" },
      { name: "Events", href: "/Event" }, // NEW ITEM
      { name: "Login", href: "/login" },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-[#050505] text-neutral-50 font-sans selection:bg-teal-500/30">

      {/* 1. Global Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-teal-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* 2. Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl transition-all">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-8 h-8 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
               <div className="w-4 h-4 bg-black/20 rounded-sm" />
            </div>
            <span className="text-xl font-bold tracking-tight">ShareDen</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/stacks" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Explore Stacks
            </a>
            <a href="/pricing" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Pricing
            </a>
            {/* ADDED EVENTS LINK */}
            <a href="/Event" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Events
            </a>
            {/* END ADDED EVENTS LINK */}
            <div className="h-4 w-px bg-white/10"></div>
            <a href="/login" className="text-sm font-medium text-white hover:text-teal-400 transition-colors" onClick={() => handleCTAClick("Login Nav", "/login")}>
              Login
            </a>
            <Button
              size="sm"
              className="bg-white text-black hover:bg-neutral-200 font-semibold rounded-full px-6"
              onClick={() => handleCTAClick("Start Now Nav", "/register")}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-neutral-400">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              
              {/* 👇 FIXED: Added pt-20 to push content down, away from the Close button */}
              <SheetContent side="right" className="bg-[#0a0a0a] border-l border-white/10 text-white pt-20 w-[300px]">
                
                <SheetHeader className="text-left pb-8">
                  <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                     {/* Added logo icon here for consistency */}
                     <div className="w-6 h-6 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-md flex items-center justify-center">
                        <div className="w-3 h-3 bg-black/20 rounded-sm" />
                     </div>
                     ShareDen
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6">
                    {/* Updated to map the array for all navigation items */}
                    {menuItems.slice(0, 3).map((item) => ( // Show Explore, Pricing, Events
                        <a 
                          key={item.name} 
                          href={item.href} 
                          className="text-lg font-medium text-neutral-400 hover:text-teal-400 hover:pl-2 transition-all"
                          onClick={() => {
                            // Track the click and close the sheet
                            handleCTAClick(`${item.name} Mobile Nav`, item.href);
                            setIsSheetOpen(false);
                          }}
                        >
                          {item.name}
                        </a>
                    ))}
                    {/* Separate Login link using handleCTAClick */}
                    <a 
                      key="Login" 
                      href={menuItems.find(i => i.name === 'Login')?.href || "#"} 
                      className="text-lg font-medium text-neutral-400 hover:text-teal-400 hover:pl-2 transition-all"
                      onClick={() => {
                        handleCTAClick("Login Mobile Nav", "/login");
                        setIsSheetOpen(false);
                      }}
                    >
                      Login
                    </a>

                    <Button 
                      className="bg-teal-500 hover:bg-teal-400 text-neutral-950 w-full mt-4 font-bold"
                      onClick={() => handleCTAClick("Get Started Mobile", "/register")}
                    >
                      Get Started
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* 3. Hero Section */}
      <section className="relative z-10 flex-grow flex items-center pt-20 pb-32">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              New Stacks Added Weekly
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white">
              Rent the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">Stack</span> <br />
              Your Startup Needs.
            </h1>

            <p className="text-lg text-neutral-400 mb-8 leading-relaxed max-w-lg">
              Don&apos;t hire a full team. Rent the <b>systems, processes, and skills</b> you need by the hour. Scale your startup without the overhead.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-base h-12 px-8 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all"
                onClick={() => handleCTAClick("Discover Stacks Hero", "/discover")}
              >
                Discover Stacks <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white h-12 px-8 rounded-full backdrop-blur-sm transition-all"
                onClick={() => handleCTAClick("List Stack Hero", "/stacks")}
              >
                List Your Stack
              </Button>
            </div>

            {/* Social Proof / Trust */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-4">
               <p className="text-xs text-neutral-500 uppercase tracking-wider">Trusted by founders at</p>
               <div className="flex gap-6 opacity-40 grayscale">
                   <div className="h-6 w-20 bg-white/20 rounded"></div>
                   <div className="h-6 w-20 bg-white/20 rounded"></div>
                   <div className="h-6 w-20 bg-white/20 rounded"></div>
               </div>
            </div>
          </div>

          {/* Visual Content: The "Stack" Representation */}
          <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center perspective-1000 hidden lg:flex">
             <div className="relative w-64 h-80">
                <div className="absolute top-0 left-12 w-full h-full bg-neutral-900 border border-white/5 rounded-2xl transform rotate-6 scale-90 opacity-40 shadow-2xl"></div>
                <div className="absolute top-4 left-6 w-full h-full bg-neutral-800 border border-white/10 rounded-2xl transform rotate-3 scale-95 opacity-70 shadow-2xl"></div>
                <div className="absolute top-8 left-0 w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 flex flex-col justify-between overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50"></div>
                    <div>
                        <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center mb-4">
                            <CheckCircle2 className="text-teal-400 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Growth Stack</h3>
                        <p className="text-sm text-neutral-400 mt-2">SEO, Content, & Ads setup.</p>
                    </div>

                    <div className="space-y-2">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-teal-500 rounded-full"></div>
                        </div>
                        <div className="flex justify-between text-xs text-neutral-400">
                            <span>Availability</span>
                            <span className="text-teal-400">High</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* 4. Footer */}
      <Footer />
    </main>
  );
};

export default App;