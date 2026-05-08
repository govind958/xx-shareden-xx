"use client";

import React, { FC, useState, useEffect } from "react";
import Link from "next/link";
import { 
  Info, 
  Newspaper, 
  Briefcase, 
  MessageSquare, 
  Users, 
  Calendar,
  ChevronDown,
  ArrowRight,
  Layers,
  ShieldCheck,
  Zap,
  Globe2
} from "lucide-react";

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuData: any = {
    Solutions: {
      links: [
        { name: "Fractional Ops", icon: Layers, href: "/solutions" },
        { name: "Document Vault", icon: ShieldCheck, href: "/solutions" },
        { name: "Growth Loops", icon: Zap, href: "/solutions" },
        { name: "Global Edge", icon: Globe2, href: "/solutions" },
      ],
      featured: [
        {
          title: "Reduce processing time by 45% with modular stacks.",
          tag: "CASE STUDY #402",
          href: "/solutions"
        },
        {
          title: "How CAs are automating 80% of client onboarding.",
          tag: "ENTERPRISE GUIDE",
          href: "/solutions"
        }
      ]
    },
    Company: {
      links: [
        { name: "About us", icon: Info, href: "/company" },
        { name: "Newsroom", icon: Newspaper, href: "/company" },
        { name: "Careers", icon: Briefcase, href: "/company" },
        { name: "Contact us", icon: MessageSquare, href: "/company" },
        { name: "Partners", icon: Users, href: "/company" },
        { name: "Events", icon: Calendar, href: "/company" },
      ],
      featured: [
        {
          title: "How AI drives operation and maintenance improvements.",
          tag: "FACILITIES DIVE",
          href: "/company"
        },
        {
          title: "Entering A New Era of Refrigerant Management",
          tag: "THE NEWS",
          href: "/company"
        }
      ]
    }
  };

  const navLinks = [
    { name: "Platform", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Resources", href: "/resources" },
    { name: "Company", href: "/company" },
    { name: "Pricing", href: "/HomePricePage" },
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
    <header className="fixed top-0 w-full z-50 transition-all duration-300" onMouseLeave={() => setActiveTab(null)}>
      
      {/* BLUE INFO BAR */}
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
                Deploy a full team in one click
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-2 h-full">
            <div className="flex items-center gap-1 mr-4">
              {navLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="relative group"
                  onMouseEnter={() => (link.name === "Solutions" || link.name === "Company") ? setActiveTab(link.name) : setActiveTab(null)}
                >
                  <Link
                    href={link.href}
                    className={`px-4 py-2 text-sm font-semibold transition-all duration-300 flex items-center gap-1 ${textColor} ${activeTab === link.name ? 'text-indigo-500' : ''}`}
                  >
                    {link.name}
                    {(link.name === "Solutions" || link.name === "Company") && (
                      <ChevronDown size={14} className={`transition-transform duration-300 ${activeTab === link.name ? 'rotate-180' : ''}`} />
                    )}
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200/20 mx-2" />

            <div className="flex items-center gap-3 ml-2">
              <Link href="/login" className={`text-sm font-bold px-4 transition-colors ${textColor}`}>Log in</Link>
              <Link href="/demo" className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 shadow-lg ${buttonClass}`}>
                Request Demo
              </Link>
            </div>
          </div>

          {/* MOBILE TOGGLE (KEEPING YOUR ORIGINAL) */}
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

        {/* MEGA MENU CARD (DESKTOP) */}
        <div 
          className={`absolute left-0 w-full bg-white border-b border-slate-200 transition-all duration-300 ease-out overflow-hidden shadow-2xl z-40 ${
            activeTab ? "max-h-[500px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-12 min-h-[350px]">
            <div className="col-span-4 p-10 border-r border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 block">
                {activeTab === "Solutions" ? "Core Stacks" : "Resources"}
              </span>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {activeTab && menuData[activeTab]?.links.map((item: any) => (
                  <Link key={item.name} href={item.href} className="group flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                      <item.icon size={16} className="text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-[13px] font-bold text-slate-600 group-hover:text-slate-950 transition-colors">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {activeTab && menuData[activeTab]?.featured.map((post: any, idx: number) => (
              <div key={idx} className="col-span-4 p-10 border-r border-slate-100 last:border-r-0 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 block">Featured</span>
                <div className="aspect-video bg-slate-900 rounded-xl mb-6 flex items-center justify-center p-8 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
                   <span className="text-xl font-black tracking-tighter text-white/20 uppercase relative z-10">{post.tag}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors mb-4">{post.title}</h4>
                <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                   Read article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE MENU (KEEPING YOUR ORIGINAL) */}
        <div 
          className={`lg:hidden absolute w-full left-0 transition-all duration-500 ease-in-out border-b ${
            isOpen 
              ? "top-full opacity-100 visible" 
              : "top-[120%] opacity-0 invisible"
          } ${scrolled ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}
        >
          <div className="p-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`text-2xl font-bold ${scrolled ? 'text-white' : 'text-slate-900'}`}>{link.name}</Link>
            ))}
            <hr className={scrolled ? 'border-slate-800' : 'border-slate-100'} />
            <Link href="/login" className={`text-lg font-bold ${scrolled ? 'text-slate-400' : 'text-slate-600'}`}>Login</Link>
            <Link href="/demo" className="bg-indigo-600 text-white text-center py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/30">Request Demo</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;