"use client";
import React from 'react';

const brands = [
  { name: "Roofline" },
  { name: "Plumbly" },
  { name: "Estately" },
  { name: "ApexBuild" },
  { name: "HydroFlow" },
  { name: "VistaHome" },
];

const TrustedBy: React.FC = () => {
  return (
    <section className="relative w-full py-24 bg-white">
      {/* Container matches the Hero's max-w-6xl */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        
        {/* Minimalist Heading - Centered */}
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <p className="text-[10px] font-black tracking-[0.4em] text-slate-300 uppercase">
            Powering the world's best creators
          </p>
        </div>

        {/* Centered Logo Flex/Grid 
            - Center alignment for a "Cinematic" feel
            - Increased gap for better whitespace
        */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 md:gap-x-16 lg:gap-x-20">
          {brands.map((brand) => (
            <div 
              key={brand.name} 
              className="group cursor-default animate-in fade-in zoom-in duration-1000"
            >
              <div className="flex items-center space-x-3 transition-all duration-700 ease-in-out opacity-30 hover:opacity-100 filter grayscale hover:grayscale-0">
                
                {/* Minimalist Symbol - Matches the Hero sidebar style */}
                <div className="w-9 h-9 flex-shrink-0 bg-slate-50 group-hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:shadow-indigo-100 group-hover:-rotate-6">
                  <span className="text-slate-400 group-hover:text-white text-[10px] font-black">
                    {brand.name.charAt(0)}
                  </span>
                </div>
                
                {/* Brand Name Typography - Refined weight */}
                <span className="text-base md:text-lg font-black tracking-tighter text-slate-900">
                  {brand.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Centered Trust Indicators 
            - Removed the top border to keep the "Floating" feel
            - Uses a wider gap for a cleaner horizontal line
        */}
        <div className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {["Licensed Professionals", "Trusted Support", "Quality Guaranteed"].map((item) => (
            <div key={item} className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full opacity-50 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                {item}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrustedBy;