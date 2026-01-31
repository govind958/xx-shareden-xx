import { CheckCircle2, LayoutGrid, Lock, ShoppingCart, ChevronDown } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { SubscriptionLimit } from '@/src/types/product_stacks';
import { SUBSCRIPTION_LIMITS, formatSubscriptionLimit, DEFAULT_SUBSCRIPTION_LIMIT } from '@/src/modules/product_stacks';

interface CustomNodeProps {
  id: string;
  label: string;
  type?: string;
  isSelected: boolean;
  width?: number;
  height?: number;
  isSaved?: boolean;
  price?: number;
  subscriptionLimit?: SubscriptionLimit;
  onResizeStart?: (e: React.MouseEvent) => void;
  onConnectStart: (e: React.MouseEvent, id: string) => void;
  onBuy: (id: string) => void;
  onSubscriptionChange?: (id: string, limit: SubscriptionLimit) => void;
}

export const CustomNode: React.FC<CustomNodeProps> = ({
  id,
  label,
  type,
  isSelected,
  width,
  height,
  isSaved,
  price,
  subscriptionLimit = DEFAULT_SUBSCRIPTION_LIMIT,
  onResizeStart,
  onConnectStart,
  onBuy,
  onSubscriptionChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // GROUP NODE RENDERING (Resizeable Box)
  if (type === 'group') {
    return (
      <div
        style={{ width: width || 380, height: height || 240 }}
        className={`
          rounded-xl border-2 border-dashed transition-all relative flex flex-col
          ${
            isSelected
              ? 'border-teal-500 bg-teal-500/5 shadow-[0_0_20px_rgba(20,184,166,0.1)]'
              : isSaved
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-neutral-700 bg-neutral-900/30 hover:border-neutral-600'
          }
        `}
      >
        <div className="absolute -top-3 left-4 px-2 bg-[#080808] flex items-center gap-2">
          {isSaved ? (
            <Lock size={12} className="text-green-500" />
          ) : (
            <LayoutGrid size={12} className="text-neutral-500" />
          )}
          <span
            className={`text-[10px] font-mono uppercase tracking-widest ${
              isSaved ? 'text-green-500 font-bold' : 'text-neutral-400'
            }`}
          >
            {isSaved ? 'Purchased Stack' : label}
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-grow" />

        {/* Purchase Footer */}
        {/* Buy Footer */}
        <div className="px-4 py-3 border-t border-neutral-800/50 flex items-center justify-between bg-[#050505]/50 rounded-b-xl">
           <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Total Estimate</p>
                
                {/* Subscription Dropdown */}
                {!isSaved ? (
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      className="flex items-center gap-1 text-[8px] font-mono text-teal-600 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 hover:border-teal-500/50 transition-colors" 
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                    >
                      {formatSubscriptionLimit(subscriptionLimit)} <ChevronDown size={8} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-24 bg-[#111] border border-neutral-800 rounded-md shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {SUBSCRIPTION_LIMITS.map((opt) => (
                          <button 
                            key={opt}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSubscriptionChange) {
                                onSubscriptionChange(id, opt);
                              }
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 text-[9px] hover:bg-neutral-800 transition-colors ${subscriptionLimit === opt ? 'text-teal-500 font-bold' : 'text-neutral-400'}`}
                          >
                            {formatSubscriptionLimit(opt)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-[8px] font-mono text-neutral-600 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                    {formatSubscriptionLimit(subscriptionLimit)}
                  </span>
                )}
              </div>
              <p className={`text-sm font-mono ${isSaved ? 'text-green-500' : 'text-teal-500'}`}>
                ₹{(price || 0).toLocaleString()}
              </p>
           </div>
           
           <button 
             onClick={(e) => {
               e.stopPropagation();
               if (!isSaved) onBuy(id);
             }}
             disabled={isSaved}
             className={`
               flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
               ${isSaved 
                 ? 'bg-green-500/10 text-green-500 cursor-default border border-green-500/20' 
                 : 'bg-teal-600 text-black hover:bg-teal-500 hover:shadow-[0_0_15px_rgba(20,184,166,0.4)]'
               }
             `}
           >
             {isSaved ? (
               <>Purchased <CheckCircle2 size={12} /></>
             ) : (
               <>Buy Stack <ShoppingCart size={12} /></>
             )}
           </button>
        </div>

        {/* Resize Handle (Only if NOT saved) */}
        {!isSaved && (
          <div
            className="absolute bottom-1 right-1 w-6 h-6 flex items-end justify-end cursor-nwse-resize p-1 z-30 group/handle"
            onMouseDown={(e) => {
              e.stopPropagation();
              if (onResizeStart) onResizeStart(e);
            }}
          >
            <div className="w-2 h-2 border-r-2 border-b-2 border-neutral-600 group-hover/handle:border-teal-500 transition-colors" />
          </div>
        )}
      </div>
    );
  }

  // STANDARD NODE RENDERING
  return (
    <div className={`
      px-4 py-3 shadow-2xl rounded-lg bg-[#0a0a0a] border min-w-[150px] group transition-all relative
      ${
        isSelected
          ? 'border-teal-500 ring-1 ring-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
          : 'border-neutral-800 hover:border-teal-500/50'
      }
      ${isSaved ? 'cursor-not-allowed opacity-90' : 'cursor-move'}
    `}>
      <div className="flex items-center gap-3">
        <div
          className={`w-2 h-2 rounded-full ${
            isSelected ? 'bg-teal-400' : 'bg-teal-600'
          } shadow-[0_0_8px_rgba(20,184,166,0.8)] animate-pulse`}
        />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{label}</span>
      </div>

      {/* Price Tag for Node */}
      {price !== undefined && price > 0 && (
        <div className="absolute -bottom-3 right-2 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded text-[8px] font-mono text-neutral-400">
          ₹{price.toLocaleString()}
        </div>
      )}

      {/* Visual Connection Points (Interactive) */}
      <div
        onMouseDown={(e) => onConnectStart(e, id)}
        className="absolute top-1/2 -left-1.5 w-3 h-3 bg-neutral-600 hover:bg-teal-500 rounded-full -translate-y-1/2 cursor-crosshair transition-colors border border-[#0a0a0a] z-50"
      />
      <div
        onMouseDown={(e) => onConnectStart(e, id)}
        className="absolute top-1/2 -right-1.5 w-3 h-3 bg-neutral-600 hover:bg-teal-500 rounded-full -translate-y-1/2 cursor-crosshair transition-colors border border-[#0a0a0a] z-50"
      />
    </div>
  );
};

