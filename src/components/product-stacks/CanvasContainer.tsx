'use client';

import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { DnDProvider, Stack, SubStack } from '@/src/modules/product_stacks';

interface CanvasContainerProps {
  stacks: Stack[];
  subStacks: SubStack[];
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  stacks,
  subStacks: _subStacks,
}) => {

  void _subStacks;

  return (
    // Container: Soft Light Gray (#F7FAFC)
    <div className="bg-[#F7FAFC] border border-gray-200 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">

      {/* Top Bar: White or Light Gray to keep it airy */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between">

        <div className="flex items-center gap-3">
          {/* Status Dot: Forest Green (#38A169) */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#38A169] animate-pulse shadow-[0_0_8px_rgba(56,161,105,0.4)]" />
        </div>

        {/* Updated Action Button: Deep Navy (#1A365D) with Teal Hover (#319795) */}
        <button className="text-[11px] font-bold bg-[#1A365D] text-white px-4 py-2 rounded-lg uppercase tracking-wider hover:bg-[#319795] transition-all duration-200 shadow-md active:scale-95">
          + ADD NEW STACKS
        </button>

      </div>

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden relative">

        <DnDProvider>

          {/* Sidebar: White background with subtle border */}
          <div className="border-r border-gray-200 bg-white">
            <Sidebar stacks={stacks} />
          </div>

          {/* Canvas: Light gray surface (#F1F5F9) to provide depth */}
          <div className="flex-1 bg-[#F1F5F9]">
            <Canvas />
          </div>

        </DnDProvider>

      </div>

    </div>
  );
};