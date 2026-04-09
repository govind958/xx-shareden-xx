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

  /* -------------------------
     CLICK ADD CLUSTER
  ------------------------- */

  const addClusterToCanvas = () => {
    window.dispatchEvent(
      new CustomEvent('add-cluster', {
        detail: { name: 'Cluster Group' },
      }),
    );
  };

  /* -------------------------
     CLUSTER ITEM
  ------------------------- */

  const clusterGroup: Stack = {
    id: 'cluster-group',
    name: 'Cluster Group',
    type: 'group',
    description: 'Logical container for nodes',
    base_price: 0,
    active: true,
    created_at: new Date().toISOString(),
  };

  /* -------------------------
     BUILD CATEGORIES
  ------------------------- */

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
    <aside className="w-80 border-r border-slate-800 bg-[#020617] overflow-y-auto z-20 relative select-none flex flex-col h-full">

      {/* HEADER */}

      <div className="p-6 pb-2 flex-shrink-0">

        <div className="text-[10px] font-black text-teal-500 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Terminal size={12} />
          Library
        </div>

        {/* CLUSTER TOOL */}

        <div
          draggable
          onDragStart={(e) => onDragStart(e, clusterGroup)}
          onClick={addClusterToCanvas}
          className="p-4 border rounded-xl cursor-grab active:cursor-grabbing transition-all group relative overflow-hidden bg-slate-900 border-dashed border-slate-700 hover:border-teal-500/50 hover:bg-slate-800"
        >
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <LayoutGrid
              size={14}
              className="group-hover:text-teal-400 text-slate-400 transition-colors"
            />
            <span className="text-xs font-bold text-white uppercase">
              Cluster Group
            </span>
          </div>

          <p className="text-[10px] text-slate-500 leading-tight">
            Drag or click to create a container
          </p>
        </div>
      </div>

      <div className="h-px bg-slate-800 mx-6 mb-4 flex-shrink-0" />

      {/* CATEGORY LIST */}

      <div className="flex-grow overflow-y-auto px-6 pb-6 space-y-6 custom-scrollbar min-h-[200px]">

        {categories.map((category) => {
          const CatIcon = category.icon;
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <div key={category.id}>

              {/* CATEGORY HEADER */}

              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between mb-2 text-slate-400 hover:text-white group transition-colors py-1"
              >
                <div className="flex items-center gap-2">
                  <CatIcon
                    size={14}
                    className={isExpanded ? 'text-teal-400' : ''}
                  />
                  <h3
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isExpanded ? 'text-white' : ''
                    }`}
                  >
                    {category.title}
                  </h3>
                </div>

                <div className="p-1 rounded hover:bg-slate-800 text-slate-600 group-hover:text-teal-400 transition-colors">
                  {isExpanded ? <Minus size={12} /> : <Plus size={12} />}
                </div>
              </button>

              {/* STACK MODULES */}

              {isExpanded && (
                <div className="space-y-3 pl-2 border-l border-slate-800 ml-1.5 animate-in slide-in-from-top-1 fade-in duration-200">

                  {category.modules.map((stack) => {
                    const Icon = getIconForType(stack.type);

                    return (
                      <div
                        key={stack.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, stack)}
                        className="p-3 border rounded-lg cursor-grab active:cursor-grabbing transition-all group relative overflow-hidden bg-slate-900 border-slate-800 hover:border-teal-500/50 hover:translate-x-1"
                      >
                        <div className="flex items-center gap-3 mb-1.5 relative z-10">
                          <Icon
                            size={14}
                            className="group-hover:text-teal-400 text-slate-500 transition-colors"
                          />
                          <span className="text-[11px] font-bold text-slate-200 uppercase">
                            {stack.name}
                          </span>
                        </div>

                        <p className="text-[9px] text-slate-500 leading-tight mb-1">
                          {stack.description || 'Drag to deploy to infrastructure'}
                        </p>

                        {/* {stack.base_price > 0 && (
                          <p className="text-[9px] text-teal-400 font-mono">
                            ₹{stack.base_price.toLocaleString()}
                          </p>
                        )} */}

                        {/* SUB STACKS */}

                        {stack.sub_stacks && stack.sub_stacks.length > 0 && (

                          <div className="mt-2 space-y-1 border-t border-slate-800 pt-2">

                            {stack.sub_stacks.map((sub) => (

                              <div
                                key={sub.id}
                                draggable
                                onDragStart={(e) => {
                                  e.stopPropagation();

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
                                onMouseDown={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-teal-500/50 cursor-grab active:cursor-grabbing transition-all group/sub text-[10px] flex items-center justify-start gap-2"
                              >
                                <span className="text-slate-300 truncate group-hover/sub:text-white transition-colors">
                                  {sub.name}
                                </span>

                                {/* <span className="text-teal-400 font-mono group-hover/sub:text-teal-300 transition-colors">
                                  {sub.is_free
                                    ? 'FREE'
                                    : `₹${sub.price.toLocaleString()}`}
                                </span> */}

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