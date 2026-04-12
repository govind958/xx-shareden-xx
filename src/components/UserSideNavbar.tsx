"use client";

import React, { FC, useState, useEffect } from "react";
import Link from "next/link";

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Platform", href: "/platform" },
    { name: "Solutions", href: "/solutions" },
    { name: "Resources", href: "/resources" },
    { name: "Pricing", href: "/pricing" },
  ];

  const navBg = scrolled 
    ? "bg-slate-950/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl" 
    : "bg-white py-5 border-b border-transparent";
  
  const textColor = scrolled ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900";
  const logoColor = scrolled ? "text-white" : "text-slate-900";
  const buttonClass = scrolled 
    ? "bg-indigo-600 hover:bg-indigo-500 text-white" 
    : "bg-slate-900 hover:bg-indigo-600 text-white";

  return (
    <header className="fixed top-0 w-full z-50">
      
      {/* BLUE INFO BAR - Centered and Screen Fit */}
      <div className="bg-[#1a4789] text-white py-2.5 px-4 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
          <p className="text-[11px] sm:text-xs md:text-sm font-medium leading-tight">
            <span className="inline-block mr-2">🚀</span>
            <span className="font-bold">Breakpoint 2026:</span> Join 20K+ peers learning <span className="font-bold">AI in testing</span> from world's top tech leaders. Virtual & free.
            <Link href="/register" className="underline underline-offset-2 hover:text-blue-200 transition-colors ml-2 whitespace-nowrap">
              Register Now →
            </Link>
          </p>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className={`w-full transition-all duration-500 ease-in-out ${navBg}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`relative h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${scrolled ? 'bg-indigo-500 shadow-indigo-500/20' : 'bg-slate-900 shadow-slate-900/10'}`}>
              <div className="h-4 w-4 bg-white rounded-sm rotate-45 transition-transform group-hover:rotate-[135deg]" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight leading-none transition-colors duration-300 ${logoColor}`}>
                StackBoard<span className="text-indigo-500">AI</span>
              </span>
              <span className={`text-[9px] font-bold tracking-[0.2em] mt-1 uppercase transition-colors ${scrolled ? 'text-slate-500' : 'text-slate-400'}`}>
                Enterprise v1.0
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-300 relative group ${textColor}`}
                >
                  {link.name}
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200/20 mx-2" />

            <div className="flex items-center gap-3 ml-2">
              <Link
                href="/login"
                className={`text-sm font-bold px-4 transition-colors ${textColor}`}
              >
                Log in
              </Link>
              <Link
                href="/demo"
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 shadow-lg ${buttonClass}`}
              >
                Request Demo
              </Link>
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        <div 
          className={`lg:hidden absolute w-full left-0 transition-all duration-500 ease-in-out border-b ${
            isOpen 
              ? "top-full opacity-100 visible" 
              : "top-[120%] opacity-0 invisible"
          } ${scrolled ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}
        >
          <div className="p-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-2xl font-bold ${scrolled ? 'text-white' : 'text-slate-900'}`}
              >
                {link.name}
              </Link>
            ))}
            <hr className={scrolled ? 'border-slate-800' : 'border-slate-100'} />
            <Link href="/login" className={`text-lg font-bold ${scrolled ? 'text-slate-400' : 'text-slate-600'}`}>Login</Link>
            <Link href="/demo" className="bg-indigo-600 text-white text-center py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/30">
              Request Demo
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;