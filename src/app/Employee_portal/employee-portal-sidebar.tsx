'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  LayoutDashboard, Users, FolderTree, Settings,
  LogOut, ChevronLeft, ChevronRight, Sun, Moon, LucideIcon,
  User as UserIcon,
  BugIcon
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
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  return (
    <aside className={`h-screen bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 flex flex-col sticky top-0 transition-all duration-300 shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className={`p-6 border-b border-neutral-100 dark:border-neutral-900 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && <h2 className="text-lg font-black text-black dark:text-white tracking-tighter italic">INFRA_SYS</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl text-neutral-500 transition-colors">
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/Employee_portal/Dashboard" isCollapsed={isCollapsed} />
        <SidebarItem icon={Users} label="Requests" to="/Employee_portal/Requests" isCollapsed={isCollapsed} />
        <SidebarItem icon={FolderTree} label="Projects" to="/Employee_portal/Project" isCollapsed={isCollapsed} />
        <SidebarItem icon={BugIcon} label="Task" to="/Employee_portal/Task" isCollapsed={isCollapsed} />
        <SidebarItem icon={Moon} label="Employee_Task" to="/Employee_portal/Task_Working_Space" isCollapsed={isCollapsed} />
        <SidebarItem icon={Settings} label="Employee_Settings" to="/Employee_portal/Setting" isCollapsed={isCollapsed} />
      </nav>

      {/* Footer Section: User Profile & Controls */}
      <div className="p-4 border-t border-neutral-100 dark:border-neutral-900 space-y-2">

        {/* Current User Display */}
        {user && (
          <div className={`flex items-center mb-4 p-2 rounded-xl bg-zinc-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800/50 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0">
              <UserIcon size={16} />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-tight text-black dark:text-white truncate">
                  {user.user_metadata?.name || 'Agent_Active'}
                </p>
                <p className="text-[8px] font-bold text-neutral-500 uppercase truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Appearance Toggle */}
        <button onClick={() => setDarkMode(!darkMode)} className={`flex items-center w-full py-4 text-neutral-500 hover:text-teal-500 transition-colors ${isCollapsed ? 'justify-center' : 'px-4 gap-4'}`}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && (
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Appearance</p>
              <p className="text-[8px] font-bold uppercase opacity-60 mt-1">{darkMode ? 'Light' : 'Dark'} Mode</p>
            </div>
          )}
        </button>

        {/* Logout */}
        <button className={`flex items-center text-red-500 hover:bg-red-500/10 rounded-xl transition-all w-full py-4 ${isCollapsed ? 'justify-center' : 'px-4 gap-4'}`}>
          <LogOut size={20} />
          {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminate</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;