import { LayoutGrid } from 'lucide-react';
import React from 'react';

interface CustomNodeProps {
  label: string;
  type?: string;
  isSelected: boolean;
  width?: number;
  height?: number;
  onResizeStart?: (e: React.MouseEvent) => void;
}

export const CustomNode: React.FC<CustomNodeProps> = ({
  label,
  type,
  isSelected,
  width,
  height,
  onResizeStart,
}) => {
  // GROUP NODE RENDERING (Resizeable Box)
  if (type === 'group') {
    return (
      <div
        style={{ width: width || 380, height: height || 240 }}
        className={`
          rounded-xl border-2 border-dashed transition-colors relative
          ${isSelected
            ? 'border-teal-500 bg-teal-500/5'
            : 'border-neutral-700 bg-neutral-900/30 hover:border-neutral-600'
          }
        `}
      >
        <div className="absolute -top-3 left-4 px-2 bg-[#080808] flex items-center gap-2">
          <LayoutGrid size={12} className="text-neutral-500" />
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{label}</span>
        </div>

        {/* Resize Handle */}
        <div
          className="absolute bottom-1 right-1 w-6 h-6 flex items-end justify-end cursor-nwse-resize p-1 z-30 group/handle"
          onMouseDown={(e) => {
            e.stopPropagation();
            if (onResizeStart) onResizeStart(e);
          }}
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-neutral-600 group-hover/handle:border-teal-500 transition-colors" />
        </div>
      </div>
    );
  }

  // STANDARD NODE RENDERING
  return (
    <div className={`
      px-4 py-3 shadow-xl rounded-lg bg-[#0a0a0a] border min-w-[150px] group transition-all relative
      ${isSelected ? 'border-teal-500 ring-1 ring-teal-500/50' : 'border-neutral-800 hover:border-teal-500/50'}
    `}>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)] animate-pulse" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{label}</span>
      </div>

      {/* Visual Connection Points */}
      <div className="absolute top-1/2 -left-1 w-2 h-2 bg-neutral-600 rounded-full -translate-y-1/2" />
      <div className="absolute top-1/2 -right-1 w-2 h-2 bg-neutral-600 rounded-full -translate-y-1/2" />
    </div>
  );
};

