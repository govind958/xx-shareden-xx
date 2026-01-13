'use client';

import { useState, useEffect } from 'react';
import { getStacks } from '@/src/modules/product_stacks/actions';
import { Stack } from '@/src/types/product_stack';
import { TopNav } from './components/TopNav';
import { PageHeader } from './components/PageHeader';
import { CanvasContainer } from './components/CanvasContainer';
import { Footer } from './components/Footer';

export default function ProductStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadStacks() {
      try {
        const data = await getStacks();
        setStacks(data || []);
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

      <main className="max-w-[1600px] mx-auto p-8 space-y-8">
        <PageHeader />
        <CanvasContainer stacks={stacks} />
        <Footer />
      </main>

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes dash {
          to { stroke-dashoffset: -10; }
        }
      `}</style>
    </div>
  );
}