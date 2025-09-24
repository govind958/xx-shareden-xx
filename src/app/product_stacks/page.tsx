"use client"

import React, { useEffect, useState } from "react"
import { Database, Zap, Sparkles, TrendingUp, Cpu, Users, CheckCircle } from "lucide-react"

interface Stack {
  id: string;
  name: string;
  type: string;
  description: string;
  base_price: string;
  special?: boolean;
  features?: string[];
}

// A simple utility to get a dynamic icon based on stack type
const getIconForStack = (type: string) => {
  switch (type.toLowerCase()) {
    case 'sales':
      return <TrendingUp size={28} className="text-teal-400" />;
    case 'hr':
      return <Users size={28} className="text-pink-400" />;
    case 'devops':
      return <Cpu size={28} className="text-blue-400" />;
    default:
      return <Sparkles size={28} className="text-yellow-400" />;
  }
};

const stacksData: Stack[] = [
  {
    id: 'sales-01',
    name: 'Sales Development Stack',
    type: 'Sales',
    description: 'A complete outbound sales engine including lead generation, CRM, and automated outreach campaigns.',
    base_price: '250',
  },
  {
    id: 'devops-01',
    name: 'DevOps Automation Stack',
    type: 'DevOps',
    description: 'Automate your entire software delivery pipeline, from code to production, with CI/CD and monitoring.',
    base_price: '300',
  },
  {
    id: 'hr-01',
    name: 'HR & Talent Acquisition Stack',
    type: 'HR',
    description: 'Streamline your hiring process and build a thriving team with our all-in-one HR solution. Includes custom features designed to save you time and money.',
    base_price: '180',
    special: true,
    features: [
      '3 Free Interns included for the first quarter',
      'Full Interview Form Review & Feedback',
      'Automated Candidate Screening',
      'Contract & Onboarding Template Library',
    ],
  },
  {
    id: 'marketing-01',
    name: 'Growth Marketing Stack',
    type: 'Marketing',
    description: 'Drive traffic and convert users with a suite of tools for content, SEO, and paid ad campaign management.',
    base_price: '220',
  },
  {
    id: 'finance-01',
    name: 'Financial Modeling Stack',
    type: 'Finance',
    description: 'Gain clear financial insights with automated reporting, budget tracking, and forecasting tools.',
    base_price: '280',
  },
  {
    id: 'support-01',
    name: 'Customer Support Stack',
    type: 'Support',
    description: 'Deliver exceptional support with an integrated ticketing system, knowledge base, and live chat widget.',
    base_price: '150',
  },
];


export default function StacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // A helper class string for glassmorphism style, as seen in the provided code
  const glassmorphismClass = "bg-neutral-800/20 backdrop-blur-lg rounded-2xl shadow-xl border border-neutral-700 hover:scale-[1.02] transition-transform duration-500 ease-in-out";

  useEffect(() => {
    const fetchStacks = async () => {
      setIsLoading(true);
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStacks(stacksData);
      setIsLoading(false);
    };

    fetchStacks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-neutral-50 p-6 font-sans">
        <div className="w-20 h-20 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-mono tracking-wide text-neutral-300">Activating the stack matrix...</h3>
        <p className="text-neutral-500 mt-2 text-sm">Connecting to the Shareden network.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-300 rounded-full mix-blend-screen opacity-10 blur-3xl animate-blob"></div>
        <div className="absolute -bottom-1/4 right-0 w-1/2 h-1/2 bg-teal-500 rounded-full mix-blend-screen opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
        {/* Hero Section */}
        <div className="text-center py-16 md:py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">
            Discover Your Next Fractional Stack
          </h1>
          <p className="mt-4 text-lg text-neutral-400 max-w-3xl mx-auto">
            Find and subscribe to pre-built business functions for your startup, powered by people, tools, and systems.
          </p>
        </div>

        {/* Stacks Grid */}
        {stacks.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {stacks.map((stack) => (
              <div
                key={stack.id}
                className={`relative p-8 transition-all duration-300 group ${glassmorphismClass}
                ${stack.special ? 'bg-pink-900/10 border-pink-700' : ''}`}
              >
                {/* Special highlight for the HR stack */}
                {stack.special && (
                  <span className="absolute -top-3 -right-3 text-xs font-semibold px-3 py-1 bg-pink-500 text-white rounded-full animate-pulse z-20">
                    SPECIAL OFFER
                  </span>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl backdrop-blur-sm ${stack.special ? 'bg-pink-500/20' : 'bg-teal-500/20'}`}>
                    {getIconForStack(stack.type || "")}
                  </div>
                  <span className={`text-sm font-semibold tracking-wide uppercase ${stack.special ? 'text-pink-400' : 'text-teal-400'}`}>
                    {stack.type || "General"}
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2">{stack.name}</h3>
                <p className="text-neutral-400 text-sm flex-grow mb-6">{stack.description}</p>
                
                {stack.special && stack.features && (
                  <ul className="list-none space-y-2 mb-6 text-neutral-300">
                    {stack.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="mt-auto pt-4 border-t border-neutral-700 flex items-center justify-between">
                  <span className="text-lg font-bold text-white flex items-center gap-2">
                    <Database size={18} className="text-neutral-500" />
                    <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
                      {stack.base_price} / month
                    </span>
                  </span>
                  <a
                    href="#"
                    className={`px-6 py-2 text-sm font-bold text-white rounded-full bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 transition-colors shadow-md ${stack.special ? 'from-pink-500 to-pink-700' : ''}`}
                  >
                    Subscribe
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-neutral-400">
            <Zap className="mx-auto h-16 w-16 text-teal-600 mb-4 animate-pulse" />
            <p className="text-xl font-semibold">No Stacks online right now.</p>
            <p className="mt-2 text-sm">
              Our engineers are deploying new fractional teams. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
