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
    <div className="min-h-screen bg-white text-slate-800 font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
              <Command className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Aether
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-slate-900 transition">Product</a>
            <a href="#" className="hover:text-slate-900 transition">Solutions</a>
            <a href="#" className="hover:text-slate-900 transition">Pricing</a>
            <a href="#" className="hover:text-slate-900 transition">Resources</a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-600">
              Sign In
            </Button>
            <Button className="bg-slate-900 text-white hover:bg-slate-800">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main>

        {/* HERO */}
        <section className="py-28 px-8">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Build smarter teams.
              <br />
              Close deals faster.
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Aether helps modern businesses collaborate, automate workflows,
              and scale revenue — all in one intelligent workspace.
            </p>

            <div className="flex justify-center gap-4 pt-6">
              <Button className="px-8 py-6 bg-slate-900 text-white hover:bg-slate-800">
                Start Free Trial
              </Button>
              <Button variant="outline" className="px-8 py-6">
                Book Demo
              </Button>
            </div>
          </div>
        </section>

        {/* TRUSTED BY */}
        <section className="py-16 border-t border-b border-slate-100 bg-slate-50">
          <div className="max-w-6xl mx-auto px-8 text-center space-y-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Trusted by 300,000+ companies
            </p>

            <div className="flex flex-wrap justify-center gap-10 text-slate-400 font-semibold text-lg">
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
              <h2 className="text-4xl font-bold text-slate-900">
                Teams that win together
              </h2>

              <p className="text-lg text-slate-600 leading-relaxed">
                Sales, marketing, and operations collaborate seamlessly inside
                shared workspaces. AI-powered insights help teams move faster
                and close smarter.
              </p>

              <a
                href="#"
                className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:gap-3 transition-all"
              >
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-100 rounded-2xl h-[320px] flex items-center justify-center text-slate-400">
              Product Preview
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 px-8 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto space-y-16">
            <h2 className="text-3xl font-bold text-center text-slate-900">
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
                  className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
                >
                  <p className="text-slate-700 leading-relaxed mb-6">
                    "{item.quote}"
                  </p>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-500">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-slate-900">
              Ready to scale your business?
            </h2>

            <p className="text-lg text-slate-600">
              Join thousands of modern companies using Aether to grow faster.
            </p>

            <Button className="px-10 py-6 bg-slate-900 text-white hover:bg-slate-800">
              Get Started Today
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-10 text-center text-sm text-slate-500">
        Aether © 2026. All rights reserved.
      </footer>

      {/* CHAT BUTTON */}
      <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:scale-105 transition">
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AetherClassic;