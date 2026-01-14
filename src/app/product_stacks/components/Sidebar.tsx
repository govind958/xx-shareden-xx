'use client';

import { Terminal, LayoutGrid } from 'lucide-react';
import { Stack } from '@/src/types/product_stack';
import { useDnD } from '../DnDContext';
import { ClusterGroupCard } from '../ClusterGroupCard';

import { getIconForType } from '../utils/iconMapper';

interface SidebarProps {
  stacks: Stack[];
}

export const Sidebar: React.FC<SidebarProps> = ({ stacks }) => {
  const [, setDragItem] = useDnD();

  const onDragStart = (event: React.DragEvent, stack: Stack) => {
    setDragItem(stack);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Cluster Group item for dragging
  const clusterGroup: Stack = {
    id: 'cluster-group',
    name: 'Cluster Group',
    type: 'group',
    description: 'Logical container for nodes',
    base_price: 0,
    active: true,
    created_at: new Date().toISOString(),
  };

  return (
    <aside className="w-72 border-r border-neutral-900 bg-[#080808] p-6 overflow-y-auto z-20 relative">
      <div className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Terminal size={12} />
        Available Modules
      </div>
      <div className="space-y-4">
        {/* Cluster Group Box */}
  <ClusterGroupCard
  clusterGroup={clusterGroup}
  onDragStart={onDragStart}
  onBuy={() => {
    console.log('Cluster group bought');
    // later: add to cart / mark purchased
  }}
  purchased={false}
/>

  {/* Regular Stacks */}
        {stacks.map((stack) => {
          const Icon = getIconForType(stack.type);

          return (
            <div
              key={stack.id}
              draggable
              onDragStart={(e) => onDragStart(e, stack)}
              className="p-4 border rounded-xl cursor-grab transition-all group relative overflow-hidden bg-neutral-900 border-neutral-800 hover:border-teal-500/50"
            >
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <Icon size={14} className="group-hover:text-teal-500 text-neutral-500" />
                <span className="text-xs font-bold text-white uppercase">{stack.name}</span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-tight">
                {stack.description || 'Drag to deploy to infrastructure'}
              </p>
              {stack.base_price > 0 && (
                <p className="text-[10px] text-teal-500 mt-1 font-mono">₹{stack.base_price.toLocaleString()}</p>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

