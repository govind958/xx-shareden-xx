"use client";
import React from 'react';

const brands = [
  { name: "InCred", logo: "https://logo.clearbit.com/incred.com" },
  { name: "Kissht", logo: "https://logo.clearbit.com/kissht.com" },
  { name: "CRIF", logo: "https://logo.clearbit.com/crif.in" },
  { name: "LenDen", logo: "https://logo.clearbit.com/lendenclub.com" },
  { name: "SuperMoney", logo: "https://logo.clearbit.com/supermoney.com" },
  { name: "Upstox", logo: "https://logo.clearbit.com/upstox.com" },
  { name: "Navi", logo: "https://logo.clearbit.com/navi.com" },
  { name: "KreditBee", logo: "https://logo.clearbit.com/kreditbee.in" },
  { name: "LendingKart", logo: "https://logo.clearbit.com/lendingkart.com" },
  { name: "Open", logo: "https://logo.clearbit.com/open.money" },
];

const TrustedBy: React.FC = () => {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-widest mb-10">
          Trusted by
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.map((brand) => (
            <div key={brand.name} className="h-12 w-32 flex items-center justify-center">
               {/* Replace src with your local SVG/PNG paths as needed */}
               <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;