'use client';

import {
  CheckCircle2,
  LayoutGrid,
  Lock,
  ShoppingCart
} from "lucide-react";

import React, { useState, useEffect, useRef } from "react";

interface CustomNodeProps {
  id: string;
  label: string;
  type?: string;
  isSelected: boolean;
  width?: number;
  height?: number;
  isSaved?: boolean;
  price?: number;
  childrenCount?: number;
  onResizeStart?: (e: React.MouseEvent) => void;
  onConnectStart: (e: React.MouseEvent, id: string) => void;
  onBuy: (id: string) => void;
  onRename?: (id: string, name: string) => void;
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
  childrenCount = 0,
  onResizeStart,
  onConnectStart,
  onBuy,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  const saveRename = () => {
    const value = editValue.trim();
    if (value && onRename) onRename(id, value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();

    if (e.key === "Enter") saveRename();
    if (e.key === "Escape") setIsEditing(false);
  };

  /* =====================================================
     GROUP NODE (STACK CONTAINER)
  ===================================================== */

  if (type === "group") {
    return (

      <div
        style={{ width: width || 420, height: height || 260 }}
        className={`
        rounded-xl border flex flex-col relative bg-[#020617]
        ${isSelected
          ? "border-[#18C7C1] shadow-[0_0_20px_rgba(24,199,193,0.35)]"
          : isSaved
          ? "border-green-500"
          : "border-[#1E293B]"
        }
        `}
      >

        {/* HEADER */}

        <div className="absolute -top-3 left-4 px-3 bg-[#020617] flex items-center gap-2">

          <LayoutGrid size={12} className="text-slate-400" />

          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveRename}
              onKeyDown={handleKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-[10px] uppercase tracking-wider bg-[#020617] border border-[#18C7C1] rounded px-2 py-0.5 text-white"
            />
          ) : (
            <span
              className="text-[10px] uppercase tracking-wider text-slate-300 cursor-text hover:text-[#18C7C1]"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {label || 'Build Stack'}
            </span>
          )}

        </div>

        {/* EMPTY STATE */}

        {childrenCount === 0 && (
          <div className="flex flex-col items-center justify-center flex-grow text-center">

            <p className="text-[11px] text-slate-500">
              Add modules to build your stack
            </p>

          </div>
        )}

        <div className="flex-grow" />

        {/* FOOTER */}

        <div className="px-5 py-4 border-t border-[#1E293B] flex items-center justify-between bg-[#010409] rounded-b-xl">

          <div>

            {childrenCount > 0 && (
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">
                Modules {childrenCount}
              </p>
            )}

            <p className="text-[9px] text-slate-500 uppercase tracking-wider">
              Total Estimate
            </p>

            <p className={`text-lg font-mono ${isSaved ? "text-green-500" : "text-[#18C7C1]"}`}>
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
            flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider
            ${isSaved
              ? "bg-green-500/10 text-green-500 border border-green-500/30"
              : "bg-[#18C7C1] text-black hover:bg-[#22E2DC] shadow-[0_0_15px_rgba(24,199,193,0.4)]"
            }
            `}
          >
            {isSaved ? (
              <>
                Purchased <CheckCircle2 size={14} />
              </>
            ) : (
              <>
                Buy Stack <ShoppingCart size={14} />
              </>
            )}
          </button>

        </div>

        {/* RESIZE HANDLE */}

        {!isSaved && (
          <div
            className="absolute bottom-1 right-1 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-1"
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart?.(e);
            }}
          >
            <div className="w-2 h-2 border-r-2 border-b-2 border-slate-500" />
          </div>
        )}

      </div>
    );
  }

  /* =====================================================
     MODULE NODE
  ===================================================== */

  return (

    <div
      className={`
      px-5 py-4 rounded-xl bg-[#020617] border min-w-[260px] relative
      ${isSelected
        ? "border-[#18C7C1] shadow-[0_0_12px_rgba(24,199,193,0.25)]"
        : "border-[#1E293B]"
      }
      `}
    >

      <div className="flex items-center gap-3">

        <div className="w-2 h-2 rounded-full bg-[#18C7C1] shadow-[0_0_8px_rgba(24,199,193,0.8)]" />

        <div className="flex flex-col">

          <span className="text-[11px] font-semibold text-white tracking-wide">
            {label}
          </span>

          <span className="text-[9px] text-slate-500 uppercase">
            service module
          </span>

        </div>

      </div>

      {price !== undefined && (

        <div className="absolute right-4 top-4 text-[11px] font-mono text-slate-300 bg-[#020617] border border-[#1E293B] px-2 py-1 rounded-lg">
          ₹{price.toLocaleString()}
        </div>

      )}

      {/* CONNECTION POINTS */}

      <div
        onMouseDown={(e) => onConnectStart(e, id)}
        className="absolute top-1/2 -left-1.5 w-3 h-3 bg-slate-600 hover:bg-[#18C7C1] rounded-full -translate-y-1/2 cursor-crosshair border border-[#020617]"
      />

      <div
        onMouseDown={(e) => onConnectStart(e, id)}
        className="absolute top-1/2 -right-1.5 w-3 h-3 bg-slate-600 hover:bg-[#18C7C1] rounded-full -translate-y-1/2 cursor-crosshair border border-[#020617]"
      />

    </div>

  );

};