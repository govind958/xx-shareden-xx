"use client"

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from "@/src/lib/utils";

interface ThemeToggleProps {
  sidebarTheme: 'light' | 'dark';
  setSidebarTheme: (theme: 'light' | 'dark') => void;
  isCollapsed?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ sidebarTheme, setSidebarTheme, isCollapsed }) => {
  const isDark = sidebarTheme === 'dark';

  return (
    <button 
      onClick={() => setSidebarTheme(isDark ? 'light' : 'dark')}
      className={cn(
        "flex items-center transition-all duration-200 group w-full rounded-lg py-3",
        isCollapsed ? "justify-center px-0" : "gap-3 px-4",
        isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-[#2B6CB0] hover:bg-slate-50"
      )}
    >
      <div className="shrink-0">
        {isDark ? <Moon size={18} /> : <Sun size={18} className="text-[#2B6CB0]" />}
      </div>

      {!isCollapsed && (
        <div className="flex flex-col items-start text-left whitespace-nowrap overflow-hidden transition-all">
          <span className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-slate-200" : "text-slate-900")}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span className="text-[9px] font-medium opacity-50 uppercase tracking-widest leading-none mt-1">
            Appearance
          </span>
        </div>
      )}
    </button>
  );
};

export default ThemeToggle;