'use client';

import { useState, useEffect } from 'react';
import { getStacks, Stack, SubStack } from '@/src/modules/product_stacks';
import { createClient } from '@/utils/supabase/client';
import { TopNav, PageHeader, CanvasContainer, Footer, PreMadeStacks } from '@/src/components/product-stacks'; 

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
        <PreMadeStacks stacks={stacks} onDelete={handleDeleteStack} />

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