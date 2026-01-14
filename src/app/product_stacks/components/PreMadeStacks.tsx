'use client';

import { useState } from 'react';
import { Stack } from '@/src/types/product_stack';
import { Search } from 'lucide-react'; 

interface PreMadeStacksProps {
  stacks: Stack[];
}

export function PreMadeStacks({ stacks }: PreMadeStacksProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStacks = stacks.filter((stack) =>
    stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stack.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="w-full py-12">
      {/* Container - matching your page's border style */}
      <div className="border border-neutral-800 bg-[#050505]/50 rounded-2xl p-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-xl font-medium text-neutral-100">Pre-made Templates</h2>
            <p className="text-sm text-neutral-500 mt-1">Quick-start your workflow with curated configurations.</p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#020202] border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
        </div>

        {/* Grid Area */}
        {filteredStacks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStacks.map((stack) => (
              <div
                key={stack.id}
                className="group flex flex-col justify-between p-6 h-52 rounded-xl border border-neutral-800 bg-[#020202] hover:bg-[#080808] transition-all duration-200"
              >
                <div>
                  <h3 className="text-neutral-200 font-medium group-hover:text-white transition-colors">
                    {stack.name}
                  </h3>
                  <p className="mt-3 text-xs text-neutral-500 leading-relaxed line-clamp-3">
                    {stack.description || "No description provided for this template stack."}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {stack.sub_stacks?.slice(0, 2).map((sub) => (
                      <span 
                        key={sub.id} 
                        className="text-[10px] px-2 py-1 rounded border border-neutral-800 bg-neutral-900/50 text-neutral-400"
                      >
                        {sub.name}
                      </span>
                    ))}
                    {stack.sub_stacks && stack.sub_stacks.length > 2 && (
                      <span className="text-[10px] text-neutral-600 self-center ml-1">
                        +{stack.sub_stacks.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  {/* Subtle Action Link */}
                  <div className="mt-4 pt-4 border-t border-neutral-900 flex justify-end">
                    <span className="text-[11px] font-medium text-neutral-500 group-hover:text-neutral-200 transition-colors">
                      View Stack →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-neutral-800 rounded-xl">
            <p className="text-sm text-neutral-600">No templates found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </section>
  );
}