'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getStacks, Stack, SubStack, DnDProvider } from '@/src/modules/product_stacks';
import { CanvasContainer, Footer, PreMadeStacks } from '@/src/components/product-stacks';

/* --- LOADING --- */

const LoadingPage = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="flex gap-2">
      <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
      <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-75" />
      <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-150" />
      <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-300" />
      <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-500" />
    </div>
  </div>
);

export default function ProductStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [subStacks, setSubStacks] = useState<SubStack[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStacks = async () => {
    try {
      const data = await getStacks();
      setStacks(data || []);
      setSubStacks(data?.flatMap(s => s.sub_stacks as SubStack[]) || []);
    } catch (error) {
      console.error('Failed to load stacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStack = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stack?')) return;

    try {
      const supabase = createClient();
      const { count } = await supabase
        .from('order_items')
        .select('id', { count: 'exact', head: true })
        .eq('stack_id', id);

      if ((count || 0) > 0) {
        alert('Action restricted: Stack is currently in use.');
        return;
      }

      await supabase.from('cart_stacks').delete().eq('stack_id', id);
      await supabase.from('sub_stacks').delete().eq('stack_id', id);
      const { error } = await supabase.from('stacks').delete().eq('id', id);

      if (error) throw error;

      setStacks(prev => prev.filter(t => t.id !== id));
      setSubStacks(prev => prev.filter(s => s.stack_id !== id));
    } catch (error) {
      console.error('Delete operation failed');
    }
  };

  useEffect(() => {
    loadStacks();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-600 p-4 md:p-8">
      
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="px-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Product Stacks</h1>
          <p className="text-sm text-slate-500">Drag and drop components to build your architecture</p>
        </header>

        {/* PROJECT CANVAS SECTION - The "Hero" container */}
        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="relative w-full h-[75vh] min-h-[600px] bg-slate-100/50">
            <CanvasContainer
              stacks={stacks}
              subStacks={subStacks}
            />
          </div>
        </section>

        {/* STACK LIBRARY SECTION - Container removed for a modern, flat look */}
        <section className="px-1">
         

          {/* No wrapper div with borders/bg here - content flows on the page */}
          <DnDProvider>
            <PreMadeStacks
              stacks={stacks}
              onDelete={handleDeleteStack}
            />
          </DnDProvider>
        </section>

      </div>

   

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        /* Essential to make the canvas truly fill the 75vh box */
        .canvas-container-root {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </main>
  );
}