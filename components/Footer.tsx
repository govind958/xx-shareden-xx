"use client";

import React from "react";
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Github
} from "lucide-react";

// Refactored data structures for better maintainability and stable keys

const socialLinks = [
  { name: "Twitter", Icon: Twitter, href: "/twitter" },
  { name: "Github", Icon: Github, href: "/github" },
  { name: "LinkedIn", Icon: Linkedin, href: "/linkedin" },
  { name: "Instagram", Icon: Instagram, href: "/instagram" },
];

const navSections = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/features" },
            { label: "Integrations", href: "/integrations" },
            { label: "Pricing", href: "/pricing" },
            { label: "Changelog", href: "/changelog" },
        ]
    },
    {
        title: "Resources",
        links: [
            { label: "Documentation", href: "/docs" },
            { label: "API Reference", href: "/api" },
            { label: "Community", href: "/community" },
             { label: "Event", href: "/Event" },
            { label: "Help Center", href: "/help" },
        ]
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Careers", href: "/careers", badge: "Hiring" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
        ]
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Security", href: "/security" },
            { label: "Cookie Settings", href: "/cookies" },
        ]
    },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-16 pb-8 font-sans relative overflow-hidden">
      
      {/* Subtle Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-20">
          
          {/* --- Brand Identity (2 cols) --- */}
          <div className="lg:col-span-2 pr-8">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
                   <div className="w-4 h-4 bg-black/20 rounded-sm" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">ShareDen</span>
            </div>

            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-xs">
              The operating system for startups. We provide the infrastructure, you build the future.
            </p>

            {/* FIX: Using stable names as keys instead of index 'i' */}
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name} // Stable key fix
                  href={link.href} 
                  aria-label={`ShareDen on ${link.name}`}
                  className="text-neutral-600 hover:text-white transition-colors duration-200"
                >
                  <link.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* --- Navigation Links (4 cols) --- */}
          {navSections.map((section) => (
            <div key={section.title}>
                <h4 className="text-white font-medium mb-4 text-sm">{section.title}</h4>
                <ul className="space-y-3 text-sm text-neutral-500">
                    {section.links.map((link) => (
                        <li key={link.label}>
                            <a href={link.href} className="hover:text-teal-400 transition-colors">
                                {link.label}
                                {link.badge && (
                                    <span className="text-[10px] bg-white/10 text-white px-1.5 py-0.5 rounded ml-1">
                                        {link.badge}
                                    </span>
                                )}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
          ))}

        </div>

        {/* --- Bottom Bar - Enhanced Spacing --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-xs text-neutral-500">
          
          {/* Copyright and Sitemap links (Left Side) */}
          {/* Increased gap from 4 to 6 for better separation */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6"> 
             <p className="whitespace-nowrap">© {new Date().getFullYear()} ShareDen Inc. All rights reserved.</p>
             
             {/* Subtle Divider and Sitemap Link on desktop */}
             <div className="hidden md:flex items-center">
                {/* Added px-3 spacing around the pipe divider */}
                <span className="text-neutral-700/50 text-base px-3">|</span> 
                <a href="/sitemap" className="hover:text-teal-400 transition-colors whitespace-nowrap">Sitemap</a>
             </div>
          </div>

          {/* System Status (Right Side) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
             <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 group-hover:bg-emerald-400"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 group-hover:bg-emerald-400"></span>
              </div>
              <span className="text-neutral-400 font-medium group-hover:text-white">All systems normal</span>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;