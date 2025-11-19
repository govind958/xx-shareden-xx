"use client";

import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menu,
  ArrowRight,
  Zap,
  Calendar,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  Target,
  LucideIcon, // Importing a better type for Lucide/Feather icons
} from "lucide-react"; 
import mixpanel from "mixpanel-browser";

// ⚡ Initialize Mixpanel (Safe Check)
if (typeof window !== "undefined") {
  mixpanel.init("YOUR_MIXPANEL_TOKEN", {
    debug: false,
    track_pageview: false,
    persistence: "localStorage",
  });
}

// ────────────────────────────────────────────
// MOCK DATA & UTILITIES
// ────────────────────────────────────────────

// Type for a single event card
interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  icon: LucideIcon; // Using LucideIcon for better type definition of the component
  description: string;
  link: string;
}

const UPCOMING_EVENTS: Event[] = [
  {
    id: 101,
    title: "SaaS Sales Stack Review",
    date: "December 10, 2025",
    time: "9:00 AM EST",
    type: "Webinar",
    icon: Target,
    description: "Deep dive into renting an outbound Sales Development Stack. Learn metrics and ROI.",
    link: "/event/sales-stack-review",
  },
  {
    id: 102,
    title: "Scaling Engineering Capacity",
    date: "January 5, 2026",
    time: "2:00 PM PST",
    type: "Workshop",
    icon: Users,
    description: "How to rent an Engineering Stack to manage peak loads without hiring permanent staff.",
    link: "/event/engineering-capacity",
  },
  {
    id: 103,
    title: "Series B Growth Secrets",
    date: "January 20, 2026",
    time: "11:00 AM EST",
    type: "Panel",
    icon: TrendingUp,
    description: "Expert panel discussion on transitioning from founder-led sales to dedicated revenue stacks.",
    link: "/event/series-b-secrets",
  },
];


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
// MAIN COMPONENT: Event Page
// ────────────────────────────────────────────

const EventPage: FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // Define eventName as a static constant outside of the state/memoization for clarity
  const eventName = "Scaling Workshop Q4 2025"; 

  /* ────────────────────────────────────────────
      TRACK PAGE VIEW
  ──────────────────────────────────────────── */
  useEffect(() => {
    const eventProps: Record<string, string> = {
      page_name: "shareden-event-page",
      event_name: eventName,
      source: getQueryParam("utm_source") || "direct",
      campaign: getQueryParam("utm_campaign") || "none",
      medium: getQueryParam("utm_medium") || "none",
      device: getDeviceType(),
    };

    mixpanel.track("Page Viewed", eventProps);
  }, [eventName]); // eventName is correctly included as a dependency

  /* ────────────────────────────────────────────
      TRACK CTA CLICKS
  ──────────────────────────────────────────── */
  const handleCTAClick = (buttonType: string, href: string) => {
    mixpanel.track("CTA Clicked", {
      page_name: "shareden-event-page",
      event_name: eventName,
      button_type: buttonType,
    });

    // In a real application, you'd likely use router.push or link tags for internal navigation
    if (href.startsWith('/')) {
        // Mock internal navigation
    } else {
        window.location.href = href;
    }
  };

  const navItems = ['Explore Stacks', 'Pricing', 'Login'];

  return (
    <main className="flex flex-col min-h-screen bg-[#050505] text-neutral-50 font-sans selection:bg-teal-500/30">

      {/* 1. Global Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-teal-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* 2. Navbar (Copied from original) */}
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
              <SheetContent side="right" className="bg-[#0a0a0a] border-l border-white/10 text-white pt-20 w-[300px]">
                
                <SheetHeader className="text-left pb-8">
                  <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                     <div className="w-6 h-6 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-md flex items-center justify-center">
                        <div className="w-3 h-3 bg-black/20 rounded-sm" />
                     </div>
                     ShareDen
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6">
                    {navItems.map((item) => (
                        <a 
                          key={item} 
                          href="#" 
                          className="text-lg font-medium text-neutral-400 hover:text-teal-400 hover:pl-2 transition-all"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          {item}
                        </a>
                    ))}
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

      <div className="relative z-10 flex-grow flex flex-col">

        {/* 3. Event Hero Section (Main Event) */}
        <section className="bg-[#050505]/70 pt-20 pb-32">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-6">
              <Zap className="w-3 h-3" /> Live Webinar
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 text-white">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-300">Unbundling</span> of Scale:
              <br /> A Workshop for Series A Founders
            </h1>

            <p className="text-xl text-neutral-400 mb-10 leading-relaxed">
              Learn how to leverage **Rentable Stacks** to bypass massive payroll costs and achieve $1M ARR faster than traditional scaling models.
            </p>

            <div className="flex justify-center flex-wrap gap-6 mb-12 text-neutral-300">
                <div className="flex items-center gap-2 text-base">
                    <Calendar className="w-5 h-5 text-teal-400" />
                    <span>**November 28, 2025**</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                    <Clock className="w-5 h-5 text-teal-400" />
                    <span>10:00 AM PST (90 min)</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                    <MapPin className="w-5 h-5 text-teal-400" />
                    <span>Online (Zoom Link via Email)</span>
                </div>
            </div>

            <Button
              size="lg"
              className="bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-lg h-14 px-10 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all"
              onClick={() => handleCTAClick("Register Hero", "/event/register/scaling-workshop")}
            >
              Reserve Your Spot (Free) <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="mt-4 text-xs text-neutral-500">Limited to 50 founders.</p>
          </div>
        </section>

        ---

        {/* 4. Event Agenda/Details Section */}
        <section className="py-24 bg-[#0a0a0a]">
            <div className="container mx-auto px-6 max-w-5xl">
                
                <h2 className="text-4xl font-bold text-center mb-16 text-white">
                    What You Will Learn
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Agenda Item 1 */}
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/10 hover:border-teal-500/50 transition-all">
                        <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">
                            The Fractional Model
                        </h3>
                        <p className="text-neutral-400 text-sm">
                            How top startups are replacing full-time hires with **Fractional Systems** (Stacks) for $100k+ annual savings.
                        </p>
                    </div>

                    {/* Agenda Item 2 */}
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/10 hover:border-teal-500/50 transition-all">
                        <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center mb-4">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">
                            Stack Selection Strategy
                        </h3>
                        <p className="text-neutral-400 text-sm">
                            A step-by-step guide to identifying the right **Marketing, Sales, and Ops Stacks** for your current growth stage.
                        </p>
                    </div>

                    {/* Agenda Item 3 */}
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/10 hover:border-teal-500/50 transition-all">
                        <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center mb-4">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">
                            Implementation in 7 Days
                        </h3>
                        <p className="text-neutral-400 text-sm">
                            Our proprietary framework for deploying a complete, pre-vetted **Shareden Stack** in under one week.
                        </p>
                    </div>
                </div>

            </div>
        </section>
        
        ---

        {/* 5. Upcoming Events Section */}
        <section className="py-24 bg-[#050505]">
            <div className="container mx-auto px-6 max-w-5xl">
                <h2 className="text-4xl font-bold text-center mb-16 text-white">
                    🔥 Other Upcoming Events
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {UPCOMING_EVENTS.map((event) => {
                        const EventIcon = event.icon;
                        return (
                            <div 
                                key={event.id}
                                className="bg-neutral-900 p-6 rounded-xl border border-white/10 flex flex-col justify-between hover:shadow-lg hover:shadow-teal-500/10 transition-all"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-3 text-sm font-medium text-teal-400">
                                        <EventIcon className="w-4 h-4" />
                                        <span>{event.type}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-white">
                                        {event.title}
                                    </h3>
                                    <p className="text-neutral-400 text-sm mb-4">
                                        {event.description}
                                    </p>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-neutral-500" />
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-neutral-500" />
                                            <span>{event.time}</span>
                                        </div>
                                    </div>
                                    
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
                                        onClick={() => handleCTAClick(`View Event ${event.id}`, event.link)}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
        
        ---

        {/* 6. Final CTA Section (Moved down) */}
        <section className="py-20">
            <div className="container mx-auto px-6 max-w-4xl text-center">
                <h2 className="text-3xl font-bold mb-4 text-white">
                    Ready to scale smarter, not harder?
                </h2>
                <p className="text-lg text-neutral-400 mb-8">
                    Stop burning cash on headcount. Start renting the expertise your business needs today.
                </p>
                <Button
                    size="lg"
                    className="bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-lg h-14 px-10 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                    onClick={() => handleCTAClick("Register Footer", "/event/register/scaling-workshop")}
                >
                    Register for the Free Workshop <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </section>

      </div>

      {/* 7. Footer (Copied from original) */}
      <Footer />
    </main>
  );
};

export default EventPage;