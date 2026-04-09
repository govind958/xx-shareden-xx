'use client';

import React, { useState } from 'react';
import { 
  Search, Box, Database, Shield, Cpu, Globe, Zap, 
  BoxSelect, Server, Fingerprint, Activity, MousePointer2, 
  Plus, Terminal, LayoutGrid, Info, ArrowUpRight
} from 'lucide-react';
import { Stack, useDnD, getIconForType } from '@/src/modules/product_stacks';

interface SidebarProps {
  stacks: Stack[];
}

interface StackCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  modules: Stack[];
}

/**
 * THEME PALETTE: Deep Ocean Industrial
 * Focusing on Blue tones as requested while maintaining the Dark Engineering style.
 */
const getStackTheme = (type: string = '') => {
  const themes: Record<string, { shadow: string; text: string; dot: string; icon: any }> = {
    database: { shadow: 'hover:shadow-[0_0_15px_rgba(30,144,255,0.2)]', text: 'text-blue-400', dot: 'bg-blue-400', icon: Database },
    compute: { shadow: 'hover:shadow-[0_0_15px_rgba(0,191,255,0.2)]', text: 'text-sky-400', dot: 'bg-sky-400', icon: Cpu },
    storage: { shadow: 'hover:shadow-[0_0_15px_rgba(70,130,180,0.2)]', text: 'text-blue-500', dot: 'bg-blue-500', icon: Server },
    network: { shadow: 'hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]', text: 'text-cyan-400', dot: 'bg-cyan-400', icon: Globe },
    security: { shadow: 'hover:shadow-[0_0_15px_rgba(100,149,237,0.2)]', text: 'text-indigo-400', dot: 'bg-indigo-400', icon: Shield },
    auth: { shadow: 'hover:shadow-[0_0_15px_rgba(0,120,255,0.2)]', text: 'text-blue-300', dot: 'bg-blue-300', icon: Fingerprint },
    default: { shadow: 'hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]', text: 'text-blue-400', dot: 'bg-blue-400', icon: Box },
  };

  const key = Object.keys(themes).find(k => type.toLowerCase().includes(k)) || 'default';
  return themes[key];
};

export const Sidebar: React.FC<SidebarProps> = ({ stacks }) => {
  const [, setDragItem] = useDnD();
  const [searchQuery, setSearchQuery] = useState('');

  const onDragStart = (event: React.DragEvent, stack: Stack) => {
    setDragItem(stack);
    event.dataTransfer.effectAllowed = 'move';
  };

  const categoryMap = new Map<string, StackCategory>();
  stacks.forEach((stack) => {
    if (searchQuery && !stack.name.toLowerCase().includes(searchQuery.toLowerCase())) return;
    const key = stack.type || 'standard';
    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        id: key,
        title: key.toUpperCase(),
        icon: getIconForType(stack.type),
        modules: [],
      });
    }
    categoryMap.get(key)!.modules.push(stack);
  });

  const categories = Array.from(categoryMap.values());

  return (
    <aside className="w-80 bg-[#0F1115] border-r border-white/5 flex flex-col h-full text-slate-300 font-sans">
      
      {/* 1. TOP NAV & IDENTITY */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Terminal size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight leading-none">Core Registry</h2>
            <span className="text-[10px] text-blue-500/70 font-mono uppercase tracking-widest">System v4.0</span>
          </div>
        </div>

        {/* 2. ACTION INSTRUCTIONS */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 mb-5">
          <div className="flex items-start gap-3">
            <MousePointer2 size={16} className="text-blue-400 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[12px] leading-tight text-slate-200">
                <span className="text-blue-400 font-black">DRAG</span> components to the canvas to initialize your build.
              </p>
            </div>
          </div>
        </div>

        {/* 3. SEARCH */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text"
            placeholder="Filter components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-md py-2.5 pl-10 pr-3 text-xs focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* 4. COMPONENT LIST */}
      <div className="flex-grow overflow-y-auto px-4 py-4 space-y-8 scrollbar-hide">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 opacity-20">
            <Activity size={40} strokeWidth={1} className="text-blue-500" />
            <span className="text-[10px] uppercase tracking-tighter mt-2">Zero Matches Found</span>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center gap-2 px-1 mb-3">
                <h3 className="text-[10px] font-black text-blue-500/50 tracking-[0.2em] whitespace-nowrap">
                  {category.title}
                </h3>
                <div className="h-[1px] flex-grow bg-blue-500/10"></div>
              </div>

              <div className="space-y-2">
                {category.modules.map((stack) => {
                  const theme = getStackTheme(stack.type || stack.name);
                  const Icon = theme.icon;

                  return (
                    <div key={stack.id} className="group">
                      <div
                        draggable
                        onDragStart={(e) => onDragStart(e, stack)}
                        className={`
                          relative flex flex-col p-4 rounded-xl bg-white/[0.02] border border-white/5
                          hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300
                          cursor-grab active:cursor-grabbing active:scale-[0.98]
                          ${theme.shadow}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-lg bg-blue-500/10 ${theme.text}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex flex-col flex-grow">
                            <span className="text-[14px] font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                              {stack.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className={`w-1 h-1 rounded-full animate-pulse ${theme.dot}`} />
                              <span className="text-[9px] text-slate-500 uppercase font-mono">Status: Ready</span>
                            </div>
                          </div>
                          <Plus size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* SUB-STACKS: Increased size and readability */}
                        {stack.sub_stacks && stack.sub_stacks.length > 0 && (
                          <div className="ml-0 mt-4 pt-3 border-t border-white/5 flex flex-col gap-2">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Sub-Modules</span>
                            <div className="flex flex-wrap gap-2">
                              {stack.sub_stacks.map((sub) => (
                                <button
                                  key={sub.id}
                                  draggable
                                  onDragStart={(e) => {
                                    e.stopPropagation();
                                    onDragStart(e, {
                                      ...stack,
                                      id: `${stack.id}::${sub.id}`,
                                      name: sub.name,
                                      sub_stacks: [],
                                    });
                                  }}
                                  className="px-3 py-2 rounded-lg border border-white/5 bg-white/5 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/40 transition-all flex items-center justify-between gap-2 min-w-[80px]"
                                >
                                  {sub.name}
                                  <ArrowUpRight size={12} className="text-blue-500/50" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. DOCK / FOOTER */}
      <div className="p-5 bg-black/60 border-t border-white/5 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid size={14} className="text-blue-500" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Global Assets</span>
          </div>
          <span className="text-xs font-black text-white bg-blue-600 px-2.5 py-1 rounded shadow-lg shadow-blue-500/20">
            {stacks.length}
          </span>
        </div>
      </div>
    </aside>
  );
};