'use client';

import { useState, useEffect } from 'react';
import { Stack } from '@/src/types/product_stacks';
import { 
  ArrowRight, Search, Trash2, User, X, Clock, Users, 
  BarChart3, LayoutGrid, Globe, Layers, Box, Database, 
  Shield, Zap, Server, Mail, Target, LucideIcon 
} from 'lucide-react'; 
import { createClient } from '@/utils/supabase/client';
import React from 'react';
import { useRouter } from 'next/navigation';

interface PreMadeStacksProps {
  stacks: Stack[];
  onDelete: (id: string) => void;
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

export function PreMadeStacks({ stacks, onDelete }: PreMadeStacksProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [viewingStack, setViewingStack] = useState<Stack | null>(null);
  const [loadingStackId, setLoadingStackId] = useState<string | null>(null);
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});

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

  useEffect(() => {
    const fetchUserCounts = async () => {
      if (stacks.length === 0) return;
      const supabase = createClient();
      
      const { data } = await supabase
        .from('order_items')
        .select('stack_id, user_id')
        .in('stack_id', stacks.map((s) => s.id));

      const counts: Record<string, Set<string>> = {};
      data?.forEach((item) => {
        if (!counts[item.stack_id]) counts[item.stack_id] = new Set();
        counts[item.stack_id].add(item.user_id);
      });

      setUserCounts(
        Object.fromEntries(
          Object.entries(counts).map(([id, users]) => [id, users.size])
        )
      );
    };

    fetchUserCounts();
  }, [stacks]);

  const filteredStacks = stacks.filter((stack) =>
    stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stack.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadTemplate = async (stack: Stack) => {
    if (loadingStackId === stack.id) return;
    setLoadingStackId(stack.id);
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        alert('Please sign in to continue.');
        return;
      }

      let subStackIds: string[] = [];
      let totalPrice = stack.base_price || 0;

      if (stack.sub_stacks && stack.sub_stacks.length > 0) {
        subStackIds = stack.sub_stacks.map((sub) => sub.id).filter(Boolean);
        totalPrice = stack.sub_stacks.reduce((sum, sub) => sum + (sub.price || 0), 0);
      } else {
        const { data: subRows, error: subError } = await supabase
          .from('sub_stacks')
          .select('id, price')
          .eq('stack_id', stack.id);

        if (subError) throw subError;
        subStackIds = (subRows || []).map((row: { id: string }) => row.id);
        if (subRows && subRows.length > 0) {
          totalPrice = subRows.reduce((sum: number, row: { price: number }) => sum + (row.price || 0), 0);
        }
      }

      const { error: cartError } = await supabase.from('cart_stacks').insert({
        user_id: authData.user.id,
        stack_id: stack.id,
        sub_stack_ids: subStackIds,
        total_price: totalPrice,
        status: 'active',
      });

      if (cartError) throw cartError;
      router.push('/Stacks_Cart');
    } catch (error) {
      console.error('Error loading template into cart:', error);
      alert('Unable to add this template to cart right now.');
    } finally {
      setLoadingStackId(null);
    }
  };

  return (
    <section className="w-full">
      <div className="border border-neutral-800 bg-[#050505]/50 rounded-2xl p-4 md:p-8">
        
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 w-full">
            {filteredStacks.map((stack) => (
              <div 
                key={stack.id} 
                className="group relative flex flex-col bg-white border border-neutral-100 rounded-[3rem] transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] overflow-hidden w-full mx-auto min-h-[620px]"
              >
                {/* 1. Header Area - Static Height */}
                <div className="p-7 pb-4 flex justify-between items-start shrink-0">
                  <div className="w-9 h-9 bg-[#4f46e5] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0 group-hover:rotate-3 transition-transform">
                    <LayoutGrid className="text-white" size={14} />
                  </div>
                  
                  <button
                    onClick={() => setViewingStack(stack)}
                    className="flex items-center gap-2 py-2 px-4 bg-neutral-50 hover:bg-white border border-neutral-100 rounded-full text-neutral-400 hover:text-[#4f46e5] hover:shadow-sm transition-all shrink-0 active:scale-95"
                  >
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
                  </button>
                </div>

                {/* 2. Body Area - Flexible Height with Content Clamping */}
                <div className="px-8 flex-grow flex flex-col">
                  <div className="mb-4">
                    <div className="inline-flex px-3 py-1 bg-indigo-50/50 text-[#4f46e5] text-[10px] font-black rounded-lg tracking-widest uppercase mb-4 border border-indigo-100/50">
                       {stack.sub_stacks?.length || 0} Modules Integrated
                    </div>
                    {/* Clamped to 2 lines to maintain structure */}
                    <h3 className="text-2xl font-black text-neutral-900 leading-[1.1] tracking-tight line-clamp-2 h-[3.2em]">
                      {stack.name}
                    </h3>
                  </div>

                  {/* Clamped to 3 lines to maintain structure */}
                  <p className="text-neutral-500 text-sm leading-relaxed mb-6 font-medium line-clamp-3 h-[4.5em]">
                    {stack.description || "High-performance architecture pre-configured for scale and reliability."}
                  </p>

                  <div className="space-y-2 mb-6">
                    {stack.sub_stacks?.slice(0, 3).map(s => (
                      <div key={s.id} className="flex items-center gap-2 text-neutral-400">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0" />
                         <span className="text-[11px] font-bold uppercase tracking-wider truncate">{s.name}</span>
                      </div>
                    ))}
                    <div className="h-4"> {/* Spacer to prevent jumping if no 'more' text */}
                      {(stack.sub_stacks?.length ?? 0) > 3 && (
                        <span className="text-[10px] font-black text-[#4f46e5] ml-3">
                          +{(stack.sub_stacks?.length ?? 0) - 3} MORE CAPABILITIES
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Community Stats - Pushed to bottom of card area */}
                <div className="px-6 mb-2 mt-auto">
                  <div className="flex items-center justify-between py-4 px-5 bg-neutral-50/80 rounded-[2rem] border border-neutral-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex -space-x-2 shrink-0">
                         <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center">
                           <User className="text-amber-600" size={14} />
                         </div>
                         <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">
                           {userCounts[stack.id] || 0}
                         </div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-tighter">Community</span>
                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest truncate">Active Live</span>
                      </div>
                    </div>
                   
                  </div>
                </div>

                {/* 4. Footer - Always Fixed at Bottom */}
                <div className="p-6 pt-2 shrink-0">
                  <div className="flex items-center gap-2 mb-2 justify-end h-6">
                    {stack.author_id === currentUserId && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(stack.id); }}
                        className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
                        title="Delete Template"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleLoadTemplate(stack)}
                    disabled={loadingStackId === stack.id}
                    className="w-full h-16 bg-[#0f172a] hover:bg-[#4f46e5] text-white rounded-[1.5rem] transition-all duration-300 flex items-center justify-between px-6 group/btn active:scale-[0.98] disabled:bg-neutral-200"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Package Price</span>
                      <span className="text-lg font-black tracking-tight">
                         ₹{stack.base_price?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest">
                        {loadingStackId === stack.id ? 'Processing...' : 'Buy Stack'}
                      </span>
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </button>
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

      <TemplateDetailsPanel
        stack={viewingStack}
        onClose={() => setViewingStack(null)}
        onLoad={handleLoadTemplate}
        isLoading={loadingStackId === viewingStack?.id}
      />
    </section>
  );
}

/* ---------------- PANEL COMPONENT (Unchanged structure, fixed spacing) ---------------- */
const TemplateDetailsPanel = ({ stack, onClose, onLoad, isLoading }: {
  stack: Stack | null;
  onClose: () => void;
  onLoad: (stack: Stack) => void;
  isLoading: boolean;
}) => {
  if (!stack) return null;

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0c0c0c] border-l border-neutral-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-start bg-[#0a0a0a] shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{stack.name}</h2>
            <div className="flex items-center gap-3 text-neutral-500 text-xs font-mono">
              <span className="flex items-center gap-1.5">
                <User size={12} /> {stack.author_id === 'system' ? 'System' : 'Verified Author'}
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
            <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3">Overview</h3>
            <p className="text-sm text-neutral-400 leading-relaxed border-l-2 border-neutral-800 pl-4">
              {stack.description || 'No detailed description provided for this template.'}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Architecture Modules</h3>
              <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                {stack.sub_stacks?.length || 0} Units
              </span>
            </div>

            <div className="space-y-3">
              {stack.sub_stacks?.map((sub, i) => {
                const Icon = getIconForType(sub.type);
                return (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-[#050505] border border-neutral-800 flex items-center justify-center text-neutral-500 group-hover:text-indigo-500 transition-colors shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors truncate">{sub.name}</p>
                      <p className="text-[10px] text-neutral-600 uppercase tracking-wider">{sub.type || 'Custom Module'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-800 bg-[#0a0a0a] shrink-0">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Estimated Cost</span>
              <div className="text-2xl font-mono font-bold text-white mt-1">₹{stack.base_price?.toLocaleString() || '0'}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-600">Ready to deploy</span>
            </div>
          </div>
          <button
            onClick={() => onLoad(stack)}
            disabled={isLoading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.15)] flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing...' : 'Add to Cart'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
