"use client";

import React, { FC } from "react";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";

// Main App component
const App: FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  // A helper class string for glassmorphism style
  const glassmorphismClass =
    "bg-teal-500/10 backdrop-blur-md rounded-2xl shadow-lg";

  return (
    <main className="flex flex-col min-h-screen bg-neutral-950 text-neutral-50 font-sans overflow-hidden relative">
      {/* Background gradient effect */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-300 rounded-full mix-blend-screen opacity-10 blur-3xl animate-blob"></div>
        <div className="absolute -bottom-1/4 right-0 w-1/2 h-1/2 bg-teal-500 rounded-full mix-blend-screen opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav
        className={`sticky top-4 z-50 mx-4 md:mx-8 lg:mx-16 p-4 ${glassmorphismClass} border border-teal-200/20`}
      >
        <div className="flex items-center justify-between">
          {/* Left side: Logo */}
          <div className="flex-none">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
                Share
              </span>
              <span className="text-white">Den</span>
            </h1>
          </div>

          {/* Right side: Navigation links (Desktop) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="text-base font-semibold">
                <NavigationMenuItem>
                  <a
                    href="/stacks"
                    className="text-neutral-50 hover:text-teal-400 transition-colors"
                  >
                    List your Stacks
                  </a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Button
              variant="secondary"
              className="bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold hover:from-teal-500 hover:to-teal-700 transition-colors rounded-full"
            >
              <a href="/login">Login</a>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <Menu className="h-6 w-6 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className={`bg-neutral-950 text-white border-none`}
              >
                <SheetHeader className="pb-8">
                  <SheetTitle className="text-white text-2xl font-bold">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-6">
                  <a
                    href="/stacks"
                    className="text-xl font-bold hover:underline transition-all"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    List your stacks
                  </a>
                  <a
                    href="/help"
                    className="text-xl font-bold hover:underline transition-all"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Help
                  </a>
                  <a
                    href="/login"
                    className="text-xl font-bold hover:underline transition-all"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Login
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-8 md:gap-16 items-center z-10 relative">
        {/* Left side: Text and buttons */}
       <div className="flex flex-col items-center md:items-start text-center md:text-left animate-fade-in-up">
  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-snug mb-6 max-w-2xl">
    Rent the <span className="text-white underline decoration-teal-500">Stack</span>{" "}
    Your Startup Needs
  </h1>
  <p className="text-base md:text-lg text-neutral-400 mb-8 max-w-2xl">
    ShareDen gives you <b>network + skills + systems + processes</b> by the hour. Scale on-demand.
  </p>
  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
    <Button size="lg" className="bg-white text-neutral-900 font-semibold hover:bg-neutral-200 transition">
      <a href="/discover">Discover Stacks</a>
    </Button>
    <Button size="lg" className="border border-neutral-500 text-neutral-200 hover:border-white hover:text-white transition">
      <a href="/login">Login</a>
    </Button>
  </div>
</div>


        {/* Right side: Illustration */}
        <div className="flex justify-center p-0 md:p-8 animate-fade-in-right">
          <svg
            className="w-full h-auto max-w-md md:max-w-none text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M12 2V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M22 7L12 12L2 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M12 12L2 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M22 17L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm bg-black/20 text-neutral-400">
        <p>&copy; 2025 ShareDen. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default App;
