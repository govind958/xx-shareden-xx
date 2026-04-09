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