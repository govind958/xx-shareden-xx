"use client";

import React, { FC } from "react";
import { Button } from "@/src/components/ui/button";
import {
  MessageSquare,
  Command,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const AetherClassic: FC = () => {
  return (
    // Background: Soft Light Gray (#F7FAFC)
    <div className="min-h-screen bg-[#F7FAFC] text-[#1A365D] font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Primary: Deep Navy (#1A365D) */}
            <div className="w-9 h-9 rounded-lg bg-[#1A365D] flex items-center justify-center">
              <Command className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#1A365D]">
              Stackboard
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-[#2B6CB0] transition">Product</a>
            <a href="#" className="hover:text-[#2B6CB0] transition">Solutions</a>
            <a href="#" className="hover:text-[#2B6CB0] transition">Pricing</a>
            <a href="#" className="hover:text-[#2B6CB0] transition">Resources</a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-600 hover:text-[#1A365D]">
              Sign In
            </Button>
            {/* Action: Electric Blue (#2B6CB0) */}
            <Button className="bg-[#2B6CB0] text-white hover:bg-[#1e4e80] transition-colors">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main>

        {/* HERO */}
        <section className="py-28 px-8">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#1A365D] leading-tight">
              Build smarter teams.
              <br />
              <span className="text-[#2B6CB0]">Close deals faster.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Aether helps modern businesses collaborate, automate workflows,
              and scale revenue — all in one intelligent workspace.
            </p>

            <div className="flex justify-center gap-4 pt-6">
              {/* Action: Electric Blue (#2B6CB0) */}
              <Button className="px-8 py-6 bg-[#2B6CB0] text-white hover:bg-[#1e4e80] shadow-lg shadow-blue-900/10">
                Start Free Trial
              </Button>
              <Button variant="outline" className="px-8 py-6 border-[#1A365D] text-[#1A365D] hover:bg-[#F7FAFC]">
                Book Demo
              </Button>
            </div>
          </div>
        </section>

        {/* TRUSTED BY */}
        <section className="py-16 border-t border-b border-blue-100 bg-white">
          <div className="max-w-6xl mx-auto px-8 text-center space-y-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Trusted by 300,000+ companies
            </p>

            <div className="flex flex-wrap justify-center gap-10 text-slate-400 font-semibold text-lg">
              {/* Success: Forest Green (#38A169) icons could go here */}
              <span>TAFE</span>
              <span>Blue Star</span>
              <span>Joyalukkas</span>
              <span>Hotstar</span>
              <span>IIFL</span>
              <span>Mercedes</span>
            </div>
          </div>
        </section>

        {/* COLLABORATION SECTION */}
        <section className="py-24 px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#38A169] font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>Seamless Integration</span>
              </div>
              <h2 className="text-4xl font-bold text-[#1A365D]">
                Teams that win together
              </h2>

              <p className="text-lg text-slate-600 leading-relaxed">
                Sales, marketing, and operations collaborate seamlessly inside
                shared workspaces. AI-powered insights help teams move faster
                and close smarter.
              </p>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-[#2B6CB0] font-semibold hover:gap-3 transition-all"
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white border-2 border-dashed border-blue-100 rounded-2xl h-[320px] flex items-center justify-center text-slate-400 shadow-inner">
              Product Preview
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 px-8 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto space-y-16">
            <h2 className="text-3xl font-bold text-center text-[#1A365D]">
              What our customers say
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "Aether increased our productivity by 80% within one year.",
                  name: "Thomas John",
                  role: "Managing Director",
                },
                {
                  quote:
                    "Reporting tools gave us insights we never had before.",
                  name: "Samer Zughul",
                  role: "Managing Partner",
                },
                {
                  quote:
                    "Collaboration improved dramatically across teams.",
                  name: "Ari Hernandez",
                  role: "Marketing Director",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#F7FAFC] p-8 rounded-2xl border border-blue-50 shadow-sm hover:border-[#2B6CB0] transition-colors"
                >
                  <p className="text-slate-700 leading-relaxed mb-6 italic">
                    "{item.quote}"
                  </p>

                  <div>
                    <p className="font-semibold text-[#1A365D]">
                      {item.name}
                    </p>
                    <p className="text-sm text-[#2B6CB0]">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-8 text-center bg-[#1A365D] text-white">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">
              Ready to scale your business?
            </h2>

            <p className="text-lg text-blue-100">
              Join thousands of modern companies using Aether to grow faster.
            </p>

            <Button className="px-10 py-6 bg-[#2B6CB0] text-white hover:bg-[#3182ce] border-none">
              Get Started Today
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#F7FAFC] border-t border-slate-200 py-10 text-center text-sm text-[#1A365D] font-medium">
        Stackboard © 2026. All rights reserved.
      </footer>

      {/* CHAT BUTTON - Action: Teal (#319795) */}
      <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#319795] text-white flex items-center justify-center shadow-xl hover:scale-110 hover:bg-[#2c7a7b] transition-all">
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AetherClassic;