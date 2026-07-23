"use client";
import React, { FC } from 'react';
import UserSideNavbar from "../components/UserSideNavbar";
import Footer from "../components/UserSideFooterHomePage";
import Hero from "../components/HomePageHeroSection";
import TrustedBy from "../components/HomePageTrustSection";
import RevenueCalculator from '../components/HomePageRevenueLossSection';
import FAQ from "../components/HomePageFAQ";
import ProblemSection from "../components/HomePageProblemSection";
import MoneyBack from "../components/HomePageMoneyBack"; // Added your new process section

const StackboardClassic: FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100">
      {/* Navigation */}
      <UserSideNavbar />

      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Trust Section (Gray logos) */}
        <TrustedBy />

        <RevenueCalculator />
        
        {/* 3. Problem Section - Using a clean standard flow instead of nested sticky */}
        <section className="relative bg-white">
           <ProblemSection />
        </section>

        {/* 4. How It Works (The 01-02-03 Process) */}
        <MoneyBack />

        {/* 5. FAQ Section */}
        <section className="relative bg-white py-10">
           <FAQ />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StackboardClassic;