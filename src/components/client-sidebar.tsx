"use client"

import React from "react"
import { cn } from "@/src/lib/utils"
import { 
  Home, Package, ShoppingCart, LayoutDashboard, 
  Settings, LogOut, PanelLeftClose, PanelLeftOpen 
} from "lucide-react"
import ThemeToggle from "./toggle them on-off-client"

interface SidebarProps {
  activeTab: string
  onTabChange: (id: string) => void
  logoutAction: () => void
  isOpen: boolean
  isCollapsed: boolean
  setIsCollapsed: (val: boolean) => void
  sidebarTheme: 'light' | 'dark'
  setSidebarTheme: (theme: 'light' | 'dark') => void
}

export function ClientSidebar({ 
  activeTab, onTabChange, logoutAction, isOpen,
  isCollapsed, setIsCollapsed, sidebarTheme, setSidebarTheme 
}: SidebarProps) {
  
  const isDark = sidebarTheme === 'dark'
  const navLinks = [
    { id: "overview", icon: Home, label: "Dashboard" },
    { id: "stacks", icon: Package, label: "Products" },
    { id: "stacks_cart", icon: ShoppingCart, label: "Cart" },
    { id: "stackboard", icon: LayoutDashboard, label: "Stackboard" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  return (
    <aside className={cn(
      "h-full transition-all duration-300 ease-in-out border-r flex flex-col z-50",
      isCollapsed ? "w-[70px]" : "w-64",
      "absolute inset-y-0 left-0 md:relative",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      isDark ? "bg-[#1A365D] border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
    )}>
      
      {/* COLLAPSE TRIGGER BUTTON */}
      <div className={cn("h-14 flex items-center px-4", isCollapsed ? "justify-center" : "justify-between px-6")}>
        {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Menu</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            isDark ? "hover:bg-white/10 text-slate-300" : "hover:bg-slate-100 text-slate-500"
          )}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navLinks.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "group w-full flex items-center rounded-lg transition-all py-2.5",
                isCollapsed ? "justify-center" : "px-3 gap-3",
                isActive 
                  ? (isDark ? "bg-[#2B6CB0] text-white shadow-md" : "bg-[#F3F4F6] text-slate-900")
                  : (isDark ? "text-slate-300 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50")
              )}
            >
              <item.icon size={18} />
              {!isCollapsed && <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className={cn("mt-auto p-2 border-t space-y-1", isDark ? "border-white/10" : "border-slate-100")}>
        <ThemeToggle sidebarTheme={sidebarTheme} setSidebarTheme={setSidebarTheme} isCollapsed={isCollapsed} />
        
        <form action={logoutAction} className="w-full">
          <button type="submit" className={cn(
            "w-full flex items-center rounded-lg py-3",
            isCollapsed ? "justify-center" : "px-4 gap-3",
            isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-red-600 hover:bg-red-50"
          )}>
            <LogOut size={16} />
            {!isCollapsed && <span className="text-[12px] font-semibold uppercase tracking-wider">Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  )
}