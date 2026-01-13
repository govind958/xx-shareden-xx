// Sidebar.tsx
import React from 'react';
import { useDnD } from './DnDContext';

export default function Sidebar() {
  const [, setType] = useDnD();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r border-neutral-900 bg-[#080808] p-4 flex flex-col gap-4">
      <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">
        Nodes Library
      </div>
      
      <div 
        className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl cursor-grab hover:border-teal-500/50 transition-all text-xs font-bold text-white uppercase"
        onDragStart={(event) => onDragStart(event, 'input')} 
        draggable
      >
        Input Node
      </div>

      <div 
        className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl cursor-grab hover:border-teal-500/50 transition-all text-xs font-bold text-white uppercase"
        onDragStart={(event) => onDragStart(event, 'default')} 
        draggable
      >
        Default Node
      </div>

      <div 
        className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl cursor-grab hover:border-teal-500/50 transition-all text-xs font-bold text-white uppercase"
        onDragStart={(event) => onDragStart(event, 'output')} 
        draggable
      >
        Output Node
      </div>
    </aside>
  );
};