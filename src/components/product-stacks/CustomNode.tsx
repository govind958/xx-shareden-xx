'use client';

import {
  Box,
  Pencil
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface CustomNodeProps {
  id: string;
  label: string;
  isSelected: boolean;
  isSaved?: boolean;
  onRename?: (id: string, name: string) => void;
}

export const CustomNode: React.FC<CustomNodeProps> = ({
  id,
  label,
  isSelected,
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

  return (
    <div
      className={`
        px-7 py-6 rounded-[2rem] bg-white border-2 min-w-[300px] relative
        transition-all duration-500 ease-[cubic-bezier(0.2, 0.8, 0.2, 1)]
        ${isSelected
          ? "border-blue-500 shadow-[0_20px_40px_rgba(37,99,235,0.1)] scale-[1.05] z-20"
          : "border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md hover:-translate-y-1"
        }
      `}
    >
      <div className="flex items-center gap-5">
        {/* Icon Container */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700
          ${isSelected ? "bg-blue-600 text-white rotate-6 scale-110 shadow-lg shadow-blue-100" : "bg-slate-50 text-slate-400"}`}>
          <Box size={28} />
        </div>
        
        {/* Text Content */}
        <div className="flex flex-col">
          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveRename}
              onKeyDown={handleKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-lg font-black bg-white border-b-2 border-blue-500 outline-none text-slate-800"
            />
          ) : (
            <span 
              className="text-lg font-black text-slate-800 leading-tight tracking-tight flex items-center gap-2 cursor-pointer group/text"
              onDoubleClick={() => setIsEditing(true)}
            >
              {label}
              <Pencil size={12} className="text-slate-300 opacity-0 group-hover/text:opacity-100 transition-opacity" />
            </span>
          )}
          
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Live Module
            </span>
          </div>
        </div>
      </div>

      {/* Subtle selection pulse effect */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500/20 rounded-[2rem] animate-pulse pointer-events-none" />
      )}
    </div>
  );
};