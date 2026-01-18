'use client';

import { useState, useEffect } from 'react';
import { getStacks } from '@/src/modules/product_stacks/actions';
import { Stack, SubStack } from '@/src/types/product_stack';
import { TopNav } from './components/TopNav';
import { PageHeader } from './components/PageHeader';
import { CanvasContainer } from './components/CanvasContainer';
import { Footer } from './components/Footer';
// 1. Import the new component
import { PreMadeStacks } from './components/PreMadeStacks'; 

export default function ProductStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [subStacks, setSubStacks] = useState<SubStack[]>([]);
  const [mounted, setMounted] = useState(false);


  const handleDeleteStack = (id: string) => {
    setStacks(prev => prev.filter(t => t.id !== id));
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