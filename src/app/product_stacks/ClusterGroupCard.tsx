'use client';

import { LayoutGrid, ShoppingCart } from 'lucide-react';
import { Stack } from '@/src/types/product_stack';

interface Props {
  clusterGroup: Stack;
  onDragStart: (e: React.DragEvent, stack: Stack) => void;
  onBuy?: () => void;
  purchased?: boolean;
}

export const ClusterGroupCard: React.FC<Props> = ({
  clusterGroup,
  onDragStart,
  onBuy,
  purchased,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, clusterGroup)}
      className="
        p-5 rounded-2xl cursor-grab
        bg-gradient-to-br from-teal-500/10 to-neutral-900
        border border-teal-500/30
        hover:border-teal-400
        transition-all
        relative overflow-hidden
        group
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <LayoutGrid size={16} className="text-teal-400" />
          <span className="text-xs font-black tracking-widest text-teal-400 uppercase">
            Cluster
          </span>
        </div>

        {!purchased && onBuy && (
          <button
            onMouseDown={(e) => e.stopPropagation()} // prevent drag
            onClick={(e) => {
              e.stopPropagation();
              onBuy();
            }}
            className="
              flex items-center gap-1
              px-3 py-1
              text-[10px] font-bold uppercase
              rounded-md
              bg-teal-500 text-black
              hover:bg-teal-400
              transition
            "
          >
            <ShoppingCart size={12} />
            Buy
          </button>
        )}

        {purchased && (
          <span className="text-[10px] font-bold uppercase text-teal-400">
            Purchased
          </span>
        )}
      </div>

      <p className="text-[11px] text-neutral-400 leading-tight relative z-10">
        Drop stacks inside to form logical groups
      </p>

      {/* Decorative glow */}
      <div className="absolute inset-0 bg-teal-500/5 blur-xl opacity-40 pointer-events-none" />
    </div>
  );
};
