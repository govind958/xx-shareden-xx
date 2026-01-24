'use client';

import { useState, useEffect } from 'react';
import { Stack } from '@/src/types/product_stack';
import { ArrowRight, Search, Trash2, User,X,Clock, Users, BarChart3, LayoutGrid, Globe, Layers, Box, Database, Shield, Zap, Server, Mail, Target, LucideIcon } from 'lucide-react'; 
import { createClient } from '@/utils/supabase/client';
import React from 'react';

interface PreMadeStacksProps {
  stacks: Stack[];
  onDelete: (id: string) => void
}
  /* ---------------- ICON MAPPING ---------------- */
  const getIconForType = (type?: string) => {
    const typeMap: Record<string, LucideIcon> = {
      'database': Database,
      'auth': Shield,
      'compute': Zap,
      'storage': Box,
      'cache': Layers,
      'network': Globe,
      'server': Server,
      'group': LayoutGrid,
      'analytics': BarChart3,
      'crm': Users,
      'mail': Mail,
      'tracking': Target,
    };
    return typeMap[type?.toLowerCase() || ''] || Database;
  };
export function PreMadeStacks({ stacks , onDelete}: PreMadeStacksProps, ) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [viewingStack, setViewingStack] = useState<Stack | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        setCurrentUserId(data.user?.id ?? null);
      } catch {
        setCurrentUserId(null);
      }
    };
    loadUser();
  }, []);
  const filteredStacks = stacks.filter((stack) =>
    stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stack.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
 const formatSubstackName = (name: string) => {
    if (name.length>12) return name.substring(0,10) + "...";
    const words = name.split(' ');
    if (words.length === 1 && name.length > 8) return name.substring(0, 8) + "..";
    return name;
  };


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
                <div className="flex justify-between items-start">
                  <h3 className="text-neutral-200 font-medium group-hover:text-white transition-colors">
                    {stack.name}
                  </h3>
                    {/* Delete Button for User's Own Stacks */}
                    {stack.author_id && stack.author_id === currentUserId && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(stack.id);
                        }}
                        className="text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Template"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  
                  <p className="mt-3 text-xs text-neutral-500 leading-relaxed line-clamp-3">
                    {stack.description || "No description provided for this template stack."}
                  </p>
                </div>

                <div className="mt-4 flex-grow flex items-center">
                  {/* Horizontal Stepper / Nodes Visualization */}
                  <div className="flex items-center w-full overflow-hidden">
                    {stack.sub_stacks?.slice(0, 4).map((sub, index) => (
                      <React.Fragment key={sub.id}>
                        {/* Connector Line (except first) */}
                        {index > 0 && (
                          <div className="h-px w-6 bg-neutral-800 flex-shrink-0" />
                        )}
                        
                        {/* The Node (Circle) */}
                        <div 
                          className="flex-shrink-0 w-12 h-12 rounded-full border border-neutral-800 bg-[#0f0f0f] flex items-center justify-center p-1 z-10 shadow-sm hover:border-teal-500/50 transition-colors cursor-help"
                          title={sub.name}
                        >
                          <span className="text-[9px] text-center font-medium text-neutral-400 leading-tight break-words w-full px-0.5">
                            {formatSubstackName(sub.name)}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                    
                    {/* Overflow Indicator */}
                    {stack.sub_stacks && stack.sub_stacks.length > 4 && (
                       <>
                         <div className="h-px w-4 bg-neutral-800 flex-shrink-0" />
                         <div className="flex-shrink-0 w-8 h-8 rounded-full border border-neutral-800 bg-[#0f0f0f] flex items-center justify-center z-10">
                            <span className="text-[8px] text-neutral-600">+{stack.sub_stacks.length - 4}</span>
                         </div>
                       </>
                    )}
                  </div>
                </div>
                  
                {/* Footer with Price and Link */}
                <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                  <span className="text-xs font-mono text-teal-600">₹{stack.base_price.toLocaleString()}</span>
                  <span
                    onClick={() => setViewingStack(stack)}
                    className="text-[11px] font-medium text-neutral-500 group-hover:text-neutral-200 transition-colors cursor-pointer hover:underline"
                  >
                    Load Template →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-neutral-800 rounded-xl">
            <p className="text-sm text-neutral-600">No templates found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
      <TemplateDetailsPanel stack={viewingStack} onClose={() => setViewingStack(null)} />
    </section>
  );
}

const TemplateDetailsPanel = ({ stack, onClose }: { stack: Stack | null; onClose: () => void }) => {
  if (!stack) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[#0c0c0c] border-l border-neutral-800 h-full shadow-2xl flex flex-col">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-start bg-[#0a0a0a]">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{stack.name}</h2>
            <div className="flex items-center gap-3 text-neutral-500 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <User size={12} /> {stack.author_id || 'System'}
              </span>
              <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> {new Date(stack.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div>
            <h3 className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] mb-3">Overview</h3>
            <p className="text-sm text-neutral-400 leading-relaxed border-l-2 border-neutral-800 pl-4">
              {stack.description || 'No detailed description provided for this template.'}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em]">Architecture Modules</h3>
              <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                {stack.sub_stacks?.length || 0} Units
              </span>
            </div>

            <div className="space-y-3">
              {stack.sub_stacks?.map((sub, i) => {
                const Icon = getIconForType(sub.type);
                return (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-[#050505] border border-neutral-800 flex items-center justify-center text-neutral-500 group-hover:text-teal-500 transition-colors">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{sub.name}</p>
                      <p className="text-[10px] text-neutral-600 uppercase tracking-wider">{sub.type || 'Custom Module'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-800 bg-[#0a0a0a]">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Estimated Cost</span>
              <div className="text-2xl font-mono font-bold text-white mt-1">₹{stack.base_price.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-600">Monthly billing</span>
            </div>
          </div>
          <button className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.15)] hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] flex items-center justify-center gap-2">
            Load Configuration <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};


