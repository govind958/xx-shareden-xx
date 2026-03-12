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

    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">

      <div className="w-full space-y-10">

        {/* PROJECT CANVAS */}

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">

            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Project Canvas
            </h2>

          </div>

          {/* FULL WIDTH CANVAS */}

          <div className="p-4">

            <div className="w-full h-[70vh] bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">

              <CanvasContainer
                stacks={stacks}
                subStacks={subStacks}
              />

            </div>

          </div>

        </section>


        {/* STACK LIBRARY */}

        <section className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">

            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Stack Library
            </h2>

          </div>

          <div className="p-6">

            <DnDProvider>

              <PreMadeStacks
                stacks={stacks}
                onDelete={handleDeleteStack}
              />

            </DnDProvider>

          </div>

        </section>

      </div>

      <style jsx global>{`

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }

      `}</style>

    </main>
  );
}