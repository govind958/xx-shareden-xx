"use client";

import React from 'react';
import Link from 'next/link';

const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      { name: "Platform", href: "/platform" },
      { name: "Goals & OKRs", href: "/okrs" },
      { name: "Surveys & 360s", href: "/surveys" },
      { name: "Reviews & 1:1s", href: "/reviews" },
      { name: "Calibrations", href: "/calibrations" },
      { name: "IDPs & Competencies", href: "/idp" }
    ]
  },
  {
    title: "Solutions",
    links: [
      { name: "Predictability", href: "/predictability" },
      { name: "Engagement", href: "/engagement" },
      { name: "Decision Making", href: "/decision-making" },
      { name: "Visibility", href: "/visibility" },
      { name: "Retention", href: "/retention" },
      { name: "Ease of Use", href: "/ease-of-use" },
      { name: "Automation", href: "/automation" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Customer Stories", href: "/stories" },
      { name: "Blogs", href: "/blogs" },
      { name: "Guides & Playbooks", href: "/guides" },
      { name: "Security", href: "/security" },
      { name: "News", href: "/news" },
      { name: "Tools & Assessments", href: "/tools" },
      { name: "Integrations", href: "/integrations" },
      { name: "Partners", href: "/partners" }
    ]
  },
  {
    title: "Pricing",
    links: [
      { name: "Plans", href: "/pricing" },
      { name: "Enterprise", href: "/enterprise" }
    ]
  }
];

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-white/10">
      {/* Main Content Container - Aligned with Navbar max-width and padding */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Left Branding Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Box dimensions matched to Nav: h-9 w-9 */}
              <div className="relative h-9 w-9 rounded-xl flex items-center justify-center bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-300">
                <div className="h-4 w-4 bg-white rounded-sm rotate-45 transition-transform group-hover:rotate-[135deg]" />
              </div>
              <div className="flex flex-col">
                {/* Font sizes matched to Nav: text-xl / text-[9px] */}
                <span className="text-xl font-bold tracking-tight leading-none text-white">
                  StackBoard<span className="text-indigo-500">AI</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] mt-1 uppercase text-slate-500">
                  Enterprise v1.0
                </span>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Transforming performance management into a powerful driver of growth. 
              Built by HR leaders, powered by AI.
            </p>

            <div className="pt-2">
              <Link
                href="/demo"
                className="inline-block px-6 py-2.5 rounded-full text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-300 shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                Request Demo
              </Link>
            </div>
          </div>

          {/* Links Sections - Grid matched for better horizontal flow */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-4">
            {FOOTER_LINKS.map((col) => (
              <div key={col.title}>
                <h5 className="font-bold text-white mb-8 text-sm uppercase tracking-widest">
                  {col.title}
                </h5>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-slate-400 hover:text-white text-sm transition-all duration-300 relative group inline-block"
                      >
                        {link.name}
                        {/* Hover underline effect matched from Nav links */}
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium">
            © 2026 StackBoard AI Inc. All rights reserved.
          </div>
          
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-medium text-slate-500">
            <Link href="/privacy" className="hover:text-indigo-400 transition-colors duration-300">Privacy</Link>
            <Link href="/terms" className="hover:text-indigo-400 transition-colors duration-300">Terms</Link>
            <Link href="/security" className="hover:text-indigo-400 transition-colors duration-300">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;