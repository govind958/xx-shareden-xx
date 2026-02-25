 'use client';

import { useState } from 'react';
import { Terminal, LayoutGrid, Plus, Minus } from 'lucide-react';
import { Stack, useDnD, getIconForType } from '@/src/modules/product_stacks';

interface SidebarProps {
  stacks: Stack[];
}

interface StackCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  modules: Stack[];
}

export const Sidebar: React.FC<SidebarProps> = ({ stacks }) => {
  const [, setDragItem] = useDnD();

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const onDragStart = (event: React.DragEvent, stack: Stack) => {
    setDragItem(stack);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Cluster Group item for dragging
  const clusterGroup: Stack = {
    id: 'cluster-group',
    name: 'Custom Stack_' + crypto.randomUUID().substring(0, 8),
    type: 'group',
    description: 'Logical container for nodes',
    base_price: 0,
    active: true,
    created_at: new Date().toISOString(),
  };

  // Build categories dynamically from stack types
  const categoryMap = new Map<string, StackCategory>();
  stacks.forEach((stack) => {
    const key = stack.type || 'other';
    if (!categoryMap.has(key)) {
      const Icon = getIconForType(stack.type);
      const title =
        stack.type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ||
        'Other Modules';
      categoryMap.set(key, {
        id: key,
        title,
        icon: Icon,
        modules: [],
      });
    }
    const category = categoryMap.get(key)!;
    category.modules.push(stack);
  });
  const categories: StackCategory[] = Array.from(categoryMap.values());

  return (
    <aside className="w-80 border-r border-neutral-900 bg-[#080808] overflow-y-auto z-20 relative select-none flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-6 pb-2 flex-shrink-0">
        <div className="text-[10px] font-black text-teal-500 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Terminal size={12} />
          Library
        </div>

        {/* Cluster Group Tool */}
        <div
          draggable
          onDragStart={(e) => onDragStart(e, clusterGroup)}
          className="p-4 border rounded-xl cursor-grab active:cursor-grabbing transition-all group relative overflow-hidden bg-neutral-900/80 border-dashed border-neutral-700 hover:border-teal-500/50 hover:bg-neutral-800/50"
        >
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <LayoutGrid size={14} className="group-hover:text-teal-500 text-neutral-400 transition-colors" />
            <span className="text-xs font-bold text-white uppercase">Cluster Group</span>
          </div>
          <p className="text-[10px] text-neutral-500 leading-tight">
            Drag this first to create a container
          </p>
        </div>
      </div>

      <div className="h-px bg-neutral-900 mx-6 mb-4 flex-shrink-0" />

      {/* Categories */}
      <div className="flex-grow overflow-y-auto px-6 pb-6 space-y-6 custom-scrollbar min-h-[200px]">
        {categories.map((category) => {
          const CatIcon = category.icon;
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <div key={category.id} className="select-none">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between mb-2 text-neutral-400 hover:text-white group transition-colors py-1"
              >
                <div className="flex items-center gap-2">
                  <CatIcon size={14} className={isExpanded ? 'text-teal-500' : ''} />
                  <h3
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isExpanded ? 'text-white' : ''
                    }`}
                  >
                    {category.title}
                  </h3>
                </div>
                <div className="p-1 rounded hover:bg-neutral-800 text-neutral-600 group-hover:text-teal-500 transition-colors">
                  {isExpanded ? <Minus size={12} /> : <Plus size={12} />}
                </div>
              </button>

              {isExpanded && (
                <div className="space-y-3 pl-2 border-l border-neutral-800 ml-1.5 animate-in slide-in-from-top-1 fade-in duration-200">
                  {category.modules.map((stack) => {
                    const Icon = getIconForType(stack.type);

                    return (
                      <div
                        key={stack.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, stack)}
                        className="p-3 border rounded-lg cursor-grab active:cursor-grabbing transition-all group relative overflow-hidden bg-[#0c0c0c] border-neutral-800 hover:border-teal-500/50 hover:translate-x-1"
                      >
                        <div className="flex items-center gap-3 mb-1.5 relative z-10">
                          <Icon size={14} className="group-hover:text-teal-500 text-neutral-600 transition-colors" />
                          <span className="text-[11px] font-bold text-neutral-200 uppercase">
                            {stack.name}
                          </span>
                        </div>
                        <p className="text-[9px] text-neutral-500 leading-tight mb-1">
                          {stack.description || 'Drag to deploy to infrastructure'}
                        </p>
                        {stack.base_price > 0 && (
                          <p className="text-[9px] text-teal-600 font-mono">
                            ₹{stack.base_price.toLocaleString()}
                          </p>
                        )}

                        {/* Sub-stacks list */}
                        {stack.sub_stacks && stack.sub_stacks.length > 0 && (
                          <div className="mt-2 space-y-1 border-t border-neutral-800 pt-2">
                            {stack.sub_stacks.map((sub) => (
                              <div
                                key={sub.id}
                                draggable
                                onDragStart={(e) => {
                                  e.stopPropagation(); // Prevent parent stack drag
                                  onDragStart(e, {
                                    id: `${stack.id}::${sub.id}`,
                                    name: sub.name,
                                    description: stack.description || sub.name,
                                    type: stack.type,
                                    base_price: sub.price,
                                    active: stack.active,
                                    created_at: sub.created_at,
                                    sub_stacks: [],
                                  });
                                }}
                                onMouseDown={(e) => e.stopPropagation()} // Prevent parent drag on mousedown
                                className="px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-teal-500/50 cursor-grab active:cursor-grabbing transition-all group/sub relative overflow-hidden text-[10px] flex items-center justify-between"
                              >
                                <span className="text-neutral-300 truncate group-hover/sub:text-white transition-colors">
                                  {sub.name}
                                </span>
                                <span className="text-teal-500 font-mono group-hover/sub:text-teal-400 transition-colors">
                                  {sub.is_free ? 'FREE' : `₹${sub.price.toLocaleString()}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </aside>
  );
};

