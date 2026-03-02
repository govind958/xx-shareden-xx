"use client"

import { useState } from "react"
import { ClientSidebar } from "./client-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarTheme, setSidebarTheme] = useState<'light' | 'dark'>('light')
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const isDark = sidebarTheme === 'dark'

  return (
    <div className={isDark ? "dark" : ""}>
      {/* transition-colors ensures smooth fading between light/dark */}
      <div className="flex h-screen bg-white dark:bg-[#0F172A] transition-colors duration-300 overflow-hidden">
        <ClientSidebar 
          activeTab="settings"
          onTabChange={() => {}} 
          logoutAction={() => console.log("Logout")}
          isOpen={true}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          sidebarTheme={sidebarTheme}
          setSidebarTheme={setSidebarTheme}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0F172A] transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  )
}