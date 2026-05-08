"use client";
import React, { useState, FC } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is included in the initial assessment?",
    answer: "A full structural audit and moisture detection roadmap with transparent, fixed pricing."
  },
  {
    question: "Are your specialists licensed and insured?",
    answer: "Yes. Every technician is fully licensed, background-checked, and liability-insured."
  },
  {
    question: "How long does a typical project take?",
    answer: "Residential repairs usually take 24–48 hours. Larger projects are phased to avoid disruption."
  },
  {
    question: "Do you offer emergency 24/7 support?",
    answer: "Our rapid-response team is available around the clock for plumbing and roofing emergencies."
  }
];

const FAQ: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative w-full py-24 bg-white border-t border-slate-50">
      {/* CENTRAL ALIGNMENT: 
          flex flex-col items-center ensures the entire block 
          is anchored to the middle of the screen.
      */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        
        {/* Centered Header Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
            Support
          </h2>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Common questions. <br />
            <span className="text-slate-400">Clear answers.</span>
          </h1>
        </div>

        {/* Centered Accordion - Constrained to 3xl (768px) for readability */}
        <div className="w-full max-w-3xl">
          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              
              return (
                <div key={index} className="py-2">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between py-8 text-left group outline-none"
                  >
                    <span className={`text-lg md:text-xl font-bold tracking-tight transition-all duration-300 ${
                      isOpen ? 'text-indigo-600 translate-x-2' : 'text-slate-900 group-hover:text-indigo-500'
                    }`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center transition-all duration-500 ${
                      isOpen ? 'rotate-180 bg-indigo-600 border-indigo-600' : 'bg-white'
                    }`}>
                      <ChevronDown 
                        size={18} 
                        className={`transition-colors duration-300 ${
                          isOpen ? 'text-white' : 'text-slate-300 group-hover:text-slate-400'
                        }`} 
                      />
                    </div>
                  </button>

                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-40 opacity-100 mb-10 translate-x-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Centered Support Link */}
          <div className="mt-16 flex justify-center">
            <button className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:shadow-xl group-hover:shadow-indigo-100 transition-all duration-500">
                <HelpCircle size={20} className="text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-900">Still have questions?</p>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-transparent group-hover:border-slate-200 transition-all">
                  Ask our dedicated team
                </span>
              </div>
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default FAQ;