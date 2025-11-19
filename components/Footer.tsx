"use client";

import React, { useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter, ChevronDown } from "lucide-react";

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="w-full mt-20 bg-neutral-950 border-t border-teal-300/10">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-neutral-300">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              ShareDen
            </h2>

            <p className="text-neutral-400 mt-3 text-sm">
              Renting the skills, systems & processes your startup needs.
            </p>

            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-teal-400 transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-teal-400 transition"><Instagram size={20} /></a>
              <a href="#" className="hover:text-teal-400 transition"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-teal-400 transition"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Mobile Collapsible Section */}
          {[
            {
              title: "Product",
              items: [
                ["Discover Stacks", "/discover"],
                ["List Your Stack", "/stacks"],
                ["Pricing", "/pricing"],
                ["Help Center", "/help"],
              ],
            },
            {
              title: "Company",
              items: [
                ["About Us", "/about"],
                ["Team", "/team"],
                ["Careers", "/careers"],
                ["Contact", "/contact"],
              ],
            },
            {
              title: "Legal",
              items: [
                ["Privacy Policy", "/privacy"],
                ["Terms of Service", "/terms"],
                ["Cookies", "/cookies"],
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              {/* Title for mobile */}
              <button
                className="w-full md:w-auto flex justify-between items-center md:block text-lg font-semibold text-white mb-3 md:mb-4"
                onClick={() => toggle(section.title)}
              >
                {section.title}
                <ChevronDown
                  className={`md:hidden transition-transform ${
                    openSection === section.title ? "rotate-180" : ""
                  }`}
                  size={18}
                />
              </button>

              {/* Links */}
              <ul
                className={`
                  space-y-3 text-sm transition-all overflow-hidden
                  ${openSection === section.title ? "max-h-40" : "max-h-0 md:max-h-none"}
                  md:space-y-3
                `}
              >
                {section.items.map(([label, link]) => (
                  <li key={label}>
                    <a href={link} className="hover:text-teal-400 transition">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-10 pt-4 text-center text-neutral-500 text-sm">
          © {new Date().getFullYear()} ShareDen. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
