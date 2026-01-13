'use client';

import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { DnDProvider } from '../DnDContext';
import { Stack } from '@/src/types/product_stack';

interface CanvasContainerProps {
  stacks: Stack[];
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ stacks }) => {
  return (
    <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden flex flex-col h-[750px] shadow-2xl">
      <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
            Visual Deployment Logic
          </span>
        </div>
        <button className="text-[10px] font-bold bg-teal-600 text-black px-4 py-1.5 rounded-lg uppercase tracking-widest hover:bg-teal-400 transition">
          Finalize Build
        </button>
      </div>

      <div className="flex flex-grow overflow-hidden relative">
        <DnDProvider>
          <Sidebar stacks={stacks} />
          <Canvas />
        </DnDProvider>
      </div>
    </div>
  );
};

