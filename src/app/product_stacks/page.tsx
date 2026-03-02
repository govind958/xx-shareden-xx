'use client';

import { useState, useEffect } from 'react';
import { getStacks } from '@/src/modules/product_stacks';
import { createClient } from '@/utils/supabase/client';
import { Stack, SubStack } from '@/src/modules/product_stacks';
import { CanvasContainer, Footer, PreMadeStacks } from '@/src/components/product-stacks';
import { DnDProvider } from '@/src/modules/product_stacks';

export default function ProductStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [subStacks, setSubStacks] = useState<SubStack[]>([]);
  const [mounted, setMounted] = useState(false);

  const handleDeleteStack = async (id: string) => {
    try {
      const supabase = createClient();
      const { count, error: countError } = await supabase
        .from('order_items')
        .select('id', { count: 'exact', head: true })
        .eq('stack_id', id);

      if (countError) throw countError;
      if ((count || 0) > 0) {
        alert('This stack is already ordered and cannot be deleted.');
        return;
      }

      await supabase.from('cart_stacks').delete().eq('stack_id', id);
      await supabase.from('sub_stacks').delete().eq('stack_id', id);
      const { error } = await supabase.from('stacks').delete().eq('id', id);
      
      if (error) throw error;

      setStacks(prev => prev.filter(t => t.id !== id));
      setSubStacks(prev => prev.filter(s => s.stack_id !== id));
    } catch (error) {
      console.error('Error deleting stack:', error);
    }
  };

  useEffect(() => {
    setMounted(true);
    async function loadStacks() {
      try {
        const data = await getStacks();
        setStacks(data || []);
        setSubStacks(data?.flatMap(stack => stack.sub_stacks as SubStack[]) || []);
      } catch (error) {
        console.error('Error loading stacks:', error);
      }
    }
    loadStacks();
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />;

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30 selection:text-white">
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-teal-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 space-y-20">
        
        {/* Cinematic Canvas Focus Zone */}
        <section className="relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[32px]" />
          
          <div className="relative flex flex-col items-center">
            <div className="mb-6 flex flex-col items-center gap-2">
              <span className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 text-[10px] font-medium tracking-[0.2em] text-teal-500 uppercase">
                Interactive Preview
              </span>
              <h2 className="text-white font-light text-xl tracking-tight">Project Canvas</h2>
            </div>

            <div className="w-full max-w-5xl aspect-[21/9] bg-[#050505] border border-neutral-800/50 rounded-[32px] overflow-hidden shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 hover:border-neutral-700/50">
              <CanvasContainer stacks={stacks} subStacks={subStacks} />
            </div>
          </div>
        </section>

        {/* Template Library Section */}
        <section className="relative">
          <div className="bg-[#080808]/80 backdrop-blur-xl border border-neutral-800/60 rounded-[32px] overflow-hidden flex flex-col shadow-3xl">
            
            {/* Glossy Header */}
            <header className="px-10 py-6 border-b border-neutral-800/50 bg-neutral-900/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping opacity-40" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white">Template Library</h3>
                  <p className="text-[10px] text-neutral-500 tracking-wide mt-0.5">DRAG & DROP TO CANVAS</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="h-8 w-[1px] bg-neutral-800" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-neutral-500">ASSETS</span>
                  <span className="text-sm font-medium text-white tabular-nums">
                    {stacks.length.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </header>

            {/* Library Content */}
            <div className="flex flex-grow overflow-hidden relative min-h-[500px]">
              <DnDProvider>
                <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
                  <PreMadeStacks stacks={stacks} onDelete={handleDeleteStack} />
                </div>
              </DnDProvider>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      <style jsx global>{`
        @keyframes dash {
          to { stroke-dashoffset: -10; }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1c1c1c;
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #262626;
          background-clip: content-box;
        }

        /* Smooth reveal for content */
        main {
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}