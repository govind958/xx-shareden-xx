"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/src/context/AuthContext"
import { logout } from "@/src/modules/logout/actions"
import { useNotifications } from "@/src/hooks/use-notifications"

// Fetched Components
import { ClientSidebar } from "@/src/components/client-sidebar"
import { TopNav } from "@/src/components/top-nav-clientside"
import { Button } from "@/src/components/ui/button"

// Page Views
import ClientDashbordPage from "../ClientDashbord/page"
import StacksPage from "../product_stacks/page"
import StacksCartPage from "../Stacks_Cart/page"
import StackboardPage from "../Stackboard/page"
import Price from "../Price/page"
import BillingPage from "../Billing/page"
import OrganizationSettingsPage from "../Setting/page"

function PrivatePanelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  
  const [activeTab, setActiveTab] = useState("overview")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // For mobile
  const [isCollapsed, setIsCollapsed] = useState(false)   // For desktop
  const [sidebarTheme, setSidebarTheme] = useState<'light' | 'dark'>('light')

  useNotifications(user?.id)

  useEffect(() => {
    if (!authLoading && !user) window.location.href = "/login"
  }, [user, authLoading])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [searchParams])

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    router.push(`/private?tab=${id}`, { scroll: false })
    if (window.innerWidth < 768) setIsSidebarOpen(false)
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "overview": return <ClientDashbordPage />
      case "stacks": return <StacksPage />
      case "stacks_cart": return <StacksCartPage />
       case "client_price": return <Price/>
      case "stackboard": return <StackboardPage />
      case "billing": return <BillingPage />
      case "settings": return <OrganizationSettingsPage />
      default: return <ClientDashbordPage />
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#F9FAFB] overflow-hidden transition-colors duration-500">
      
      {/* TopNav no longer needs collapse props as the button moved to Sidebar */}
      <TopNav />

      <div className="flex flex-1 overflow-hidden relative">
        <ClientSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          logoutAction={logout}
          isOpen={isSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed} // Passed here to be used in Sidebar
          sidebarTheme={sidebarTheme}
          setSidebarTheme={setSidebarTheme}
        />

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            
            
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
              {renderMainContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function PrivatePanelPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white">Loading Workspace...</div>}>
      <PrivatePanelContent />
    </Suspense>
  )
}
