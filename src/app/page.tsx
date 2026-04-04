"use client";
import React, { FC } from 'react';
import UserSideNavbar from "../components/UserSideNavbar";
import Footer from "../components/UserSideFooterHomePage";
import Hero from "../components/HomePageHeroSection";
import TrustedBy from "../components/HomePageTrustSection";
import ProblemSection from "../components/HomePageProblemSection";

const StackboardClassic: FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#0a0a0a] font-sans antialiased selection:bg-[#c53030] selection:text-white">
      <UserSideNavbar />

      <main>
        <Hero />
        <TrustedBy />
        
        {/* PINNING TRACK: 
          h-[300vh] creates the "duration" of the scroll. 
          The higher the value, the slower the cat animates.
        */}
        <section className="relative h-[100vh] bg-slate-850">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <ProblemSection />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StackboardClassic;