"use client"

import React, { useEffect, useState, Suspense } from "react"
import { createClient } from "@/utils/supabase/client"
import { logout } from "@/src/app/logout/actions"

// Icons
import {
  Home, Settings, Code, LucideShoppingCart, CircuitBoardIcon,
  CreditCardIcon, LogOut, Bell, Search
} from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { cn } from "@/src/lib/utils"

// Imported Page Views
import ClientDashbordPage from "../ClientDashbord/page"
import StacksPage from "../product_stacks/page"
import StacksCartPage from "../Stacks_Cart/page"
import StackboardPage from "../Stackboard/page"

/* ---------------- STYLING CONSTANTS ---------------- */
const NAV_ITEM = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
const ACTIVE_NAV = "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]"
const INACTIVE_NAV = "text-neutral-400 hover:bg-white/5 hover:text-white"

/* ---------------- PRIVATE PANEL ---------------- */
function PrivatePanelContent() {
  const [userEmail, setUserEmail] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login"
      } else {
        setUserEmail(data.user.email || "")
      }
    })
  }, [])

  const navLinks = [
    { id: "overview", icon: Home, label: "Overview" },
    { id: "stacks", icon: Code, label: "Browse Stacks" },
    { id: "stacks_cart", icon: LucideShoppingCart, label: "My Cart" },
    { id: "stackboard", icon: CircuitBoardIcon, label: "Stack Board" },
    { id: "subscription", icon: CreditCardIcon, label: "Billing" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  // Centralized Content Switcher
  const renderMainContent = () => {
    switch (activeTab) {
      case "overview":
        return <ClientDashbordPage />
      case "stacks":
        return <StacksPage />
      case "stacks_cart":
        return <StacksCartPage />
      case "stackboard":
        return <StackboardPage />
      case "subscription":
        return <div className="text-neutral-400 p-10 italic">Billing & Subscription settings coming soon.</div>
      case "settings":
        return <div className="text-neutral-400 p-10 italic">Account settings and preferences.</div>
      default:
        return <ClientDashbordPage />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-neutral-100 selection:bg-teal-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-72 border-r border-white/5 bg-[#080808] flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <CircuitBoardIcon className="text-black" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter italic text-white">STACK.AI</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={cn(NAV_ITEM, activeTab === link.id ? ACTIVE_NAV : INACTIVE_NAV)}
            >
              <link.icon size={20} className={activeTab === link.id ? "text-teal-400" : ""} />
              <span className="font-medium">{link.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile & Logout Section */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-bold text-black text-xs">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userEmail.split('@')[0] || "Loading..."}</p>
              <p className="text-[10px] text-neutral-500 truncate">{userEmail}</p>
            </div>
          </div>
          <form action={logout}>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-neutral-400 hover:text-red-400 hover:bg-red-400/10 gap-3 px-4 rounded-xl transition-all"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col">
        {/* Global Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#050505]/50 backdrop-blur-md sticky top-0 z-50">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-teal-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search components or stacks..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-neutral-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal-500 rounded-full border border-[#050505]"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
            <Button className="bg-teal-500 hover:bg-teal-600 text-black font-bold rounded-full px-6 shadow-lg shadow-teal-500/10">
              Deploy New
            </Button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="max-w-[1600px] mx-auto p-10">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function PrivatePanel() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] gap-4">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
        <div className="text-teal-500/50 font-mono text-xs tracking-widest uppercase">Initializing Interface</div>
      </div>
    }>
      <PrivatePanelContent />
    </Suspense>
  )
}