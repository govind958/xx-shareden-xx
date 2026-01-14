'use client';

import React, { useState } from 'react';
import { LayoutGrid, ShoppingCart, CheckCircle2, DollarSign } from 'lucide-react';

/* ==========================================================
   1. TYPES & INTERFACES
   ========================================================== */
interface CustomNodeProps {
  id: string;
  label: string;
  type?: 'group' | 'stack';
  isSelected: boolean;
  price: number;
  purchased?: boolean;
  onBuy?: (id: string) => void;
}

/* ==========================================================
   2. THE COMPONENT
   ========================================================== */
export const CustomNode: React.FC<CustomNodeProps> = ({
  id,
  label,
  type,
  isSelected,
  price,
  purchased = false,
  onBuy,
}) => {
  
  if (type === 'group') {
    return (
      <div className={`
          w-[380px] h-[200px] rounded-2xl border-2 transition-all relative
          ${isSelected ? 'border-teal-500 bg-teal-500/5' : 'border-neutral-800 bg-neutral-900'}
        `}
      >
        {/* HEADER: Label Left, Price/Buy Right */}
        <div className="absolute -top-3.5 left-0 right-0 px-4 flex justify-between items-center w-full">
          {/* Label */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300">
            <LayoutGrid size={12} />
            <span className="text-[10px] font-bold uppercase">{label}</span>
          </div>

          {/* Buy Action (Right Side) */}
          <div className="flex items-center gap-2">
            {!purchased ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onBuy) onBuy(id);
                }}
                className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold bg-white text-black rounded-full hover:bg-teal-400 transition-colors shadow-lg"
              >
                <ShoppingCart size={10} />
                Buy ${price}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/50 rounded-full text-teal-400">
                <CheckCircle2 size={10} />
                <span className="text-[10px] font-bold uppercase">Licensed</span>
              </div>
            )}
          </div>
        </div>

        {/* Workspace Area */}
        <div className="absolute inset-4 border border-dashed border-neutral-800 rounded-xl flex items-center justify-center opacity-30">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">Node Content</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-4 py-3 rounded-xl border bg-neutral-900 min-w-[160px] ${isSelected ? 'border-teal-500' : 'border-neutral-800'}`}>
      <span className="text-[11px] font-semibold text-neutral-200 uppercase">{label}</span>
    </div>
  );
};

/* ==========================================================
   3. PARENT (With Total Price Logic)
   ========================================================== */
export default function Canvas() {
  const [nodes, setNodes] = useState([
    { id: '1', label: 'Compute Cluster', type: 'group', price: 49, purchased: false, isSelected: true },
    { id: '2', label: 'Storage Unit', type: 'group', price: 25, purchased: false, isSelected: false }
  ]);

  const handleBuy = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, purchased: true } : n));
  };

  // Calculate total of all purchased nodes
  const totalPrice = nodes
    .filter(n => n.purchased)
    .reduce((sum, n) => sum + n.price, 0);

  return (
    <div className="p-20 bg-black min-h-screen text-white">
      {/* TOTAL PRICE DASHBOARD */}
      <div className="fixed top-8 right-8 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex items-center gap-4 shadow-2xl z-50">
        <div className="bg-teal-500/20 p-2 rounded-lg text-teal-400">
          <DollarSign size={20} />
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-neutral-500 leading-none">Total Investment</p>
          <p className="text-2xl font-mono font-bold text-white">${totalPrice}</p>
        </div>
      </div>

      <div className="space-y-16">
        {nodes.map((node) => (
          <CustomNode
            key={node.id}
            {...node}
            type={node.type as 'group' | 'stack'}
            onBuy={handleBuy}
          />
        ))}
      </div>
    </div>
  );
}