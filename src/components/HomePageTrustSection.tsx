"use client";
import React from 'react';

interface Brand {
  name: string;
  logo: React.ReactNode;
}

const brands: Brand[] = [
  { 
    name: "Roofline", 
    logo: (
      <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v11a1 1 0 01-1 1h-3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    name: "Plumbly", 
    logo: (
      <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    )
  },
  { 
    name: "Estately", 
    logo: (
      <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="4" y="4" width="16" height="16" rx="3" strokeLinecap="round"/>
        <path d="M9 9h6v6H9z" fill="currentColor" />
      </svg>
    )
  },
  { 
    name: "ApexBuild", 
    logo: (
      <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 3L2 21h20L12 3z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    name: "HydroFlow", 
    logo: (
      <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 22a7 7 0 007-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 007 7z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    name: "VistaHome", 
    logo: (
      <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M4 4h16v16H4z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 12h16" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
];

const TrustedBy: React.FC = () => {
  return (
    <section className="relative w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        
        {/* Minimalist Subtitle Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase">
            Trusted by modern contracting leaders
          </p>
        </div>

        {/* Clean Logo Row */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-16 lg:gap-x-20 w-full">
          {brands.map((brand) => (
            <div 
              key={brand.name} 
              className="flex items-center space-x-2.5 text-slate-400 hover:text-slate-900 opacity-40 hover:opacity-100 transition-all duration-300 ease-out cursor-default"
            >
              {/* Modern Vector Icon */}
              <div className="flex-shrink-0">
                {brand.logo}
              </div>
              {/* Refined Brand Name */}
              <span className="text-base font-bold tracking-tight">
                {brand.name}
              </span>
            </div>
          ))}
        </div>

        {/* Ultra-Minimal Bottom Indicators */}
       

      </div>
    </section>
  );
};

export default TrustedBy;