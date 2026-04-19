"use client"

import React, { useEffect, useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/src/context/AuthContext"
import { logout } from "@/src/modules/logout/actions"
import { useNotifications } from "@/src/hooks/use-notifications"

import { Loader2 } from "lucide-react"
import { ClientSidebar } from "@/src/components/client-sidebar"
import { TopNav } from "@/src/components/top-nav-clientside"

/** Fills the main pane (flex-1 chain) so the spinner stays vertically centered like full-page loaders. */
function TabFallback() {
  return (
    <div
      className="flex flex-1 flex-col min-h-0 w-full items-center justify-center py-12"
      role="status"
      aria-label="Loading"
    >
      <Loader2 size={32} className="animate-spin text-[#2B6CB0]" aria-hidden />
    </div>
  )
}

const ClientDashbordPage = dynamic(() => import("../ClientDashbord/page"), {
  loading: TabFallback,
})
const StacksPage = dynamic(() => import("../product_stacks/page"), {
  loading: TabFallback,
})
const StackboardPage = dynamic(() => import("../Stackboard/page"), {
  loading: () => <TabFallback />,
  ssr: true
})
const Price = dynamic(() => import("../Price/page"), {
  loading: () => <TabFallback />,
  ssr: true
})
const BillingPage = dynamic(() => import("../Billing/page"), {
  loading: () => <TabFallback />,
  ssr: true
})
const OrganizationSettingsPage = dynamic(() => import("../Setting/page"), {
  loading: () => <TabFallback />,
  ssr: true
})

function PrivateShellFallback() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F9FAFB]" role="status" aria-label="Loading">
      <Loader2 size={32} className="animate-spin text-[#2B6CB0]" aria-hidden />
    </div>
  )
}

function PrivatePanelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState("overview")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [sidebarTheme, setSidebarTheme] = useState<'light' | 'dark'>('light')

  useNotifications(user?.id)

  useEffect(() => {
    if (!authLoading && !user) window.location.href = "/login"
  }, [user, authLoading])

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab) setActiveTab(tab)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [searchParams])

  const handleTabChange = (id: string) => {
    if (id === activeTab) return
    setActiveTab(id)
    window.history.pushState(null, '', `/private?tab=${id}`)
    if (window.innerWidth < 768) setIsSidebarOpen(false)
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "overview": return <ClientDashbordPage />
      case "stacks": return <StacksPage />
      case "client_price": return <Price />
      case "stackboard": return <StackboardPage />
      case "billing": return <BillingPage />
      case "settings": return <OrganizationSettingsPage />
      default: return <ClientDashbordPage />
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#F9FAFB] overflow-hidden transition-colors duration-500">
      <TopNav />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <ClientSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          logoutAction={logout}
          isOpen={isSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          sidebarTheme={sidebarTheme}
          setSidebarTheme={setSidebarTheme}
        />

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        )}

        <main className="flex flex-1 flex-col min-h-0 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1600px] mx-auto w-full flex flex-1 flex-col min-h-0 min-w-0">
            <Suspense fallback={<TabFallback />}>
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 flex flex-1 flex-col min-h-0 min-w-0">
                {renderMainContent()}
              </div>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function PrivatePanelPage() {
  return (
    <Suspense fallback={<PrivateShellFallback />}>
      <PrivatePanelContent />
    </Suspense>
  )
}
