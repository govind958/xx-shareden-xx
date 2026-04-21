"use client";
import React, { FC } from 'react';
import { ArrowLeft, Home, Search, HelpCircle, Menu } from 'lucide-react';
import Link from 'next/link';

// --- MOCK COMPONENTS (Replace these with your actual imports) ---
const MockNavbar = () => (
  <header className="sticky top-0 z-50 bg-[#f8f7f2]/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 font-bold text-xl text-[#1A365D]">
        <div className="w-8 h-8 bg-[#2B6CB0] rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm" />
        </div>
        <Link href="/">Stackboard</Link>

      </div>
      <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
        <a href="/" className="hover:text-[#2B6CB0] transition">Product</a>
        <a href="/" className="hover:text-[#2B6CB0] transition">Solutions</a>
        <a href="/" className="hover:text-[#2B6CB0] transition">Pricing</a>
      </nav>
      <div className="hidden md:flex items-center gap-4">
        <Link href="/login" className="text-sm font-semibold text-[#1A365D] hover:text-[#2B6CB0] transition">Log in</Link>
        <Link href="/login" className="px-4 py-2 bg-[#1A365D] text-white rounded-lg text-sm font-semibold hover:bg-black transition-all">Get Started</Link>
      </div>
      <button className="md:hidden text-slate-600"><Menu className="w-6 h-6" /></button>
    </div>
  </header>
);

const MockFooter = () => (
  <footer className="bg-white border-t border-slate-200 py-12 px-6 mt-auto">
    <div className="max-w-7xl mx-auto text-center text-slate-500 text-sm">
      <p>&copy; {new Date().getFullYear()} Stackboard All rights reserved.</p>
    </div>
  </footer>
);
// -----------------------------------------------------------------

const NotFoundPage: FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#0a0a0a] font-sans antialiased selection:bg-[#c53030] selection:text-white flex flex-col">
      {/* Swap with your actual <UserSideNavbar /> */}
      <MockNavbar />

      <main className="flex-grow flex items-center justify-center py-20 px-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
        
        <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-600 text-sm font-bold tracking-wide">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Error 404
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1A365D] leading-[1.1]">
              Looks like this task is <span className="text-[#2B6CB0]">not in the backlog.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps it never existed in this sprint.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <a 
                href="/" 
                className="px-8 py-3.5 bg-[#2B6CB0] text-white rounded-xl text-base font-semibold hover:bg-[#1e4e80] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Home className="w-5 h-5" />
                Back to Dashboard
              </a>
              <button 
                onClick={() => window.history.back()}
                className="px-8 py-3.5 border-2 border-[#1A365D] text-[#1A365D] rounded-xl text-base font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-500">
              <a href="/help" className="hover:text-[#2B6CB0] transition flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> Help Center
              </a>
              <a href="/search" className="hover:text-[#2B6CB0] transition flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Search Site
              </a>
            </div>
          </div>

          {/* Visual/UI Mockup */}
          <div className="relative z-10 hidden md:block">
            {/* Background Accent Card */}
            <div className="absolute inset-0 bg-[#2B6CB0] rounded-[2.5rem] transform rotate-3 scale-105 opacity-10" />
            <div className="absolute inset-0 bg-[#1A365D] rounded-[2.5rem] transform -rotate-3 scale-105 opacity-5" />
            
            {/* Main Error Card (Styled like a Stackboard Task) */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                <h4 className="text-[11px] font-bold text-red-500 uppercase tracking-[0.2em]">
                  Task Status: Blocked
                </h4>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-[#1A365D] mb-4 tracking-tight">404: Page Missing</h2>
              <p className="text-slate-500 text-base mb-8 leading-relaxed">
                The requested resource URL was not found on this server. Please verify the link and try again.
              </p>
              
              {/* Fake UI Fields matching the homepage theme */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium text-sm">Assignee</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white border-dashed flex items-center justify-center">
                      <span className="text-slate-400 text-xs font-bold">?</span>
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">Unknown</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium text-sm">Priority</span>
                  <span className="font-bold text-[#1A365D] bg-blue-100 px-3 py-1 rounded-lg text-xs">CRITICAL</span>
                </div>

                <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium text-sm">Status</span>
                  <span className="font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-lg text-xs">LOST IN SPACE</span>
                </div>
              </div>
            </div>
            
            {/* Floating decoration badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#1A365D] text-white p-4 rounded-2xl shadow-xl border border-white/20 transform rotate-12">
              <span className="block text-2xl font-bold">Oops!</span>
            </div>
          </div>

        </div>
      </main>

      {/* Swap with your actual <Footer /> */}
      <MockFooter />
    </div>
  );
};

export default NotFoundPage;
