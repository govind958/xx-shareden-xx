"use client"

import React, { useState, useEffect } from "react";
import { 
  Rocket, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Users, 
  Layers,
  Sparkles,
  ChevronRight
} from "lucide-react";

const App = () => {
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* NAVIGATION */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md border-b py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-tr from-teal-600 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              ShareDen
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-teal-600 transition-colors">Stacks</a>
            <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How it works</a>
          </div>

          <a
            href="#early-access"
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-500/20 transition-all active:scale-95"
          >
            Get Early Access
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-60" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 mb-8 shadow-sm animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-teal-700 font-semibold uppercase tracking-wider text-[10px]">Pre-launch</span>
            <span className="w-px h-3 bg-slate-200 mx-1"></span>
            Limited early access spots
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600">
            Scale with fractional <br className="hidden md:block" />
            <span className="text-teal-600 relative">
              expert teams.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-teal-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
              </svg>
            </span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed">
            Skip the 6-month hiring cycle. Deploy high-performing stacks 
            across <span className="text-slate-900 font-medium">Finance, Growth, and Product</span> in under 7 days.
          </p>

          {/* ONBOARDING FORM CONTAINER */}
          <div
            id="early-access"
            className="max-w-xl mx-auto relative"
          >
            {/* Decorative Card Shadow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            
            <div className="relative bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-[2rem] p-10">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="relative group">
                      <label className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1.5 ml-1 block">
                        Work Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="founder@startup.com"
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all placeholder:text-slate-400"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <label className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1.5 ml-1 block">
                          Company
                        </label>
                        <input
                          name="company"
                          type="text"
                          required
                          placeholder="Acme Inc."
                          className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all placeholder:text-slate-400"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative group">
                        <label className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1.5 ml-1 block">
                          Phone
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          required
                          placeholder="+1 (555) 000"
                          className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all placeholder:text-slate-400"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <button className="w-full group relative bg-slate-900 hover:bg-teal-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] overflow-hidden">
                    <span className="relative z-10">Reserve My Free Month</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  <div className="flex items-center justify-center gap-6 pt-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-500" /> No CC Required
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      <Zap className="w-3.5 h-3.5 text-teal-500" /> 5 Min Setup
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-teal-200 rounded-full animate-ping opacity-20"></div>
                    <CheckCircle2 className="text-teal-600 w-10 h-10 relative z-10" />
                  </div>
                  <h3 className="text-3xl font-extrabold mb-3 text-slate-900">
                    You're on the list! 🎉
                  </h3>
                  <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                    We've prioritized <strong>{formData.company}</strong>. 
                    Expect a message from our founder within 24 hours.
                  </p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 inline-flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-teal-500" />
                    <span className="text-sm font-medium text-slate-600">Check your inbox for a surprise</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STACKS / FEATURES */}
      <section id="features" className="py-32 px-6 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-teal-600 uppercase tracking-[0.2em] mb-4">The Solution</h2>
            <p className="text-4xl font-extrabold text-slate-900">Proprietary stacks for every stage.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Finance Stack",
                desc: "Full-service CFO support, strategic bookkeeping, tax compliance & investor reporting.",
                icon: Layers,
                color: "text-blue-500",
                bg: "bg-blue-50"
              },
              {
                title: "Growth Stack",
                desc: "Go-to-market strategy, performance marketing, and automated growth operations.",
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-50"
              },
              {
                title: "Product & Eng",
                desc: "Rapid UI/UX design, full-stack engineering, and agile project management for speed.",
                icon: Users,
                color: "text-purple-500",
                bg: "bg-purple-50"
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="group p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:border-teal-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm mb-6">
                  {item.desc}
                </p>
                <button className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  Learn more <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / SOCIAL PROOF LITE */}
      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
            Ready to stop hiring and start building?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
            Join 40+ founders who are scaling faster with fractional teams. 
            Claim your 1-month trial today.
          </p>
          <a
            href="#early-access"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105"
          >
            Claim Free Month <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              ShareDen
            </div>
            <p className="text-slate-400 text-sm">Deploying excellence, fractionally.</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-slate-400 mb-2">© 2025 ShareDen. All rights reserved.</p>
            <div className="flex justify-center md:justify-end gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-teal-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-teal-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-teal-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        html {
          scroll-behavior: smooth;
        }
      `}} />
    </div>
  );
};

export default App;