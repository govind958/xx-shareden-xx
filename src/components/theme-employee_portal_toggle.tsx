import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isCollapsed?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, setDarkMode, isCollapsed }) => {
  return (
    <button 
      onClick={() => setDarkMode(!darkMode)}
      className={`flex items-center transition-all duration-300 group
        ${isCollapsed ? 'justify-center w-full py-4' : 'gap-4 px-4 py-4 w-full'}
        text-neutral-500 hover:text-teal-500`}
    >
      <div className="relative flex items-center justify-center">
        {darkMode ? (
          <Moon size={20} className="transition-transform group-hover:rotate-12" />
        ) : (
          <Sun size={20} className="transition-transform group-hover:scale-110" />
        )}
      </div>

      {!isCollapsed && (
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {darkMode ? 'Midnight Mode' : 'Blueprint Mode'}
          </span>
          <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest">
            Toggle Visual Interface
          </span>
        </div>
      )}
    </button>
  );
};

export default ThemeToggle;