import { CheckCircle2, LayoutGrid, Lock, Pencil, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CustomNodeProps {
  id: string;
  label: string;
  type?: string;
  isSelected: boolean;
  width?: number;
  height?: number;
  isSaved?: boolean;
  price?: number;
  onResizeStart?: (e: React.MouseEvent) => void;
  onConnectStart: (e: React.MouseEvent, id: string) => void;
  onBuy: (id: string) => void;
  onRename: (id: string, name: string) => void;
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
  onResizeStart,
  onConnectStart,
  onBuy,
  onRename,
}) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [draftLabel, setDraftLabel] = useState(label);

  useEffect(() => {
    setDraftLabel(label);
  }, [label]);

  const commitLabel = () => {
    const trimmed = draftLabel.trim();
    if (trimmed && trimmed !== label) {
      onRename(id, trimmed);
    } else {
      setDraftLabel(label);
    }
    setIsEditingLabel(false);
  };

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
          {isSaved ? (
            <span className="text-[10px] font-mono uppercase tracking-widest text-green-500 font-bold">
              Purchased Stack
            </span>
          ) : isEditingLabel ? (
            <input
              value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitLabel();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setDraftLabel(label);
                  setIsEditingLabel(false);
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-40 bg-transparent text-[10px] font-mono uppercase tracking-widest text-neutral-200 outline-none border-b border-neutral-700 focus:border-teal-500"
              autoFocus
            />
          ) : (
            <>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                {label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingLabel(true);
                }}
                className="text-neutral-500 hover:text-teal-400 transition-colors"
                title="Rename cluster"
              >
                <Pencil size={10} />
              </button>
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-grow" />

        {/* Purchase Footer */}
        <div className="px-4 py-3 border-t border-neutral-800/50 flex items-center justify-between bg-[#050505]/50 rounded-b-xl">
          <div>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">
              Total Estimate
            </p>
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
              ${
                isSaved
                  ? 'bg-green-500/10 text-green-500 cursor-default border border-green-500/20'
                  : 'bg-teal-600 text-black hover:bg-teal-500 hover:shadow-[0_0_15px_rgba(20,184,166,0.4)]'
              }
            `}
          >
            {isSaved ? (
              <>
                Purchased <CheckCircle2 size={12} />
              </>
            ) : (
              <>
                Buy Stack <ShoppingCart size={12} />
              </>
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

