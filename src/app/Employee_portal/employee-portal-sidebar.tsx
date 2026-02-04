'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, FolderTree, Settings, 
  LogOut, ChevronLeft, ChevronRight, Sun, Moon, LucideIcon 
} from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, isCollapsed, to }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link 
      href={to}
      className={`w-full flex items-center transition-all duration-200 group relative
        ${isCollapsed ? 'justify-center px-0 py-4' : 'px-4 py-4 gap-4'}
        ${isActive 
          ? 'bg-teal-500 text-black' 
          : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'}`}
    >
      <Icon size={20} className={isActive ? 'text-black' : 'group-hover:text-teal-500'} />
      {!isCollapsed && (
        <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
          {label}
        </span>
      )}
    </Link>
  );
};

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, setDarkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`h-screen bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 flex flex-col sticky top-0 transition-all duration-300 shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-6 border-b border-neutral-100 dark:border-neutral-900 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <h2 className="text-lg font-black text-black dark:text-white tracking-tighter italic">INFRA_SYS</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl text-neutral-500">
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 mt-6">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/Employee_portal/Dashboard" isCollapsed={isCollapsed} />
        <SidebarItem icon={Users} label="Requests" to="/Employee_portal/Requests" isCollapsed={isCollapsed} />
        <SidebarItem icon={FolderTree} label="Projects" to="/Employee_portal/Project" isCollapsed={isCollapsed} />
        <SidebarItem icon={Settings} label="Task" to="/Employee_portal/Task" isCollapsed={isCollapsed} />
         <SidebarItem icon={Moon} label="Employee_Task" to="/Employee_portal/Task_Working_Space" isCollapsed={isCollapsed} />
      </nav>

      <div className="p-4 border-t border-neutral-100 dark:border-neutral-900 space-y-2">
        <button onClick={() => setDarkMode(!darkMode)} className={`flex items-center w-full py-4 text-neutral-500 hover:text-teal-500 transition-colors ${isCollapsed ? 'justify-center' : 'px-4 gap-4'}`}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && (
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Appearance</p>
              <p className="text-[8px] font-bold uppercase opacity-60 mt-1">{darkMode ? 'Light' : 'Dark'} Mode</p>
            </div>
          )}
        </button>
        <button className={`flex items-center text-red-500 hover:bg-red-500/10 rounded-xl transition-all w-full py-4 ${isCollapsed ? 'justify-center' : 'px-4 gap-4'}`}>
          <LogOut size={20} />
          {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminate</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;