'use client';

import { useState, useEffect } from 'react';
import { getStacks } from '@/src/modules/product_stacks/actions';
import { createClient } from '@/utils/supabase/client';
import { Stack, SubStack } from '@/src/types/product_stack';
import { TopNav } from './components/TopNav';
import { PageHeader } from './components/PageHeader';
import { CanvasContainer } from './components/CanvasContainer';
import { Footer } from './components/Footer';
// 1. Import the new component
import { PreMadeStacks } from './components/PreMadeStacks'; 
import { DnDProvider } from './DnDContext';

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

      const { error: cartError } = await supabase.from('cart_stacks').delete().eq('stack_id', id);
      if (cartError) throw cartError;

      const { error: subStacksError } = await supabase.from('sub_stacks').delete().eq('stack_id', id);
      if (subStacksError) throw subStacksError;

      const { error } = await supabase.from('stacks').delete().eq('id', id);
      if (error) throw error;

      setStacks(prev => prev.filter(t => t.id !== id));
      setSubStacks(prev => prev.filter(s => s.stack_id !== id));
    } catch (error) {
      console.error('Error deleting stack:', error);
      alert('Unable to delete this stack right now.');
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
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans">
      <TopNav />

      <main className="max-w-[1600px] mx-auto p-8 space-y-12"> {/* Increased space-y */}
        <PageHeader />
        
        <CanvasContainer stacks={stacks} subStacks={subStacks} />

        {/* 2. Inserted the new section here */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden flex flex-col shadow-2xl">
          <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Template Library</span>
            </div>
          </div>
          <div className="flex flex-grow overflow-hidden relative min-h-[520px]">
            <DnDProvider>
              {/* <Sidebar stacks={stacks} /> */}
              <div className="flex-grow overflow-y-auto">
                <PreMadeStacks stacks={stacks} onDelete={handleDeleteStack} />
              </div>
            </DnDProvider>
          </div>
        </div>

        <Footer />
      </main>

      <style jsx global>{`
        @keyframes dash {
          to { stroke-dashoffset: -10; }
        }
      `}</style>
    </div>
  );
}