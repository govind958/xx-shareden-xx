"use client"

import React, { useEffect, useState, Suspense } from "react"
import { createClient } from "@/utils/supabase/client"
import { logout } from "@/src/app/logout/actions"

// Icons
import {
  Home, Settings, Code, LucideShoppingCart, CircuitBoardIcon,
  CreditCardIcon, LogOut, Bell, Search, Command, 
  ShieldCheck, Globe, RefreshCcw
} from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { cn } from "@/src/lib/utils"

// Imported Page Views
import ClientDashbordPage from "../ClientDashbord/page"
import StacksPage from "../product_stacks/page"
import StacksCartPage from "../Stacks_Cart/page"
import StackboardPage from "../Stackboard/page"

/* ---------------- SIDEBAR CONTENT COMPONENT ---------------- */
function PrivatePanelContent() {
  const [userEmail, setUserEmail] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [isNavigating, setIsNavigating] = useState(false)

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
    { id: "overview", icon: Home, label: "Dashboard" },
    { id: "stacks", icon: Code, label: "Stacks" },
    { id: "stacks_cart", icon: LucideShoppingCart, label: "Cart" },
    { id: "stackboard", icon: CircuitBoardIcon, label: "Stackboard" },
    { id: "subscription", icon: CreditCardIcon, label: "Billing" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  const handleTabChange = (id: string) => {
    if (id === activeTab) return
    setIsNavigating(true)
    setActiveTab(id)
    // Visual buffer for the "system loading" feel
    setTimeout(() => setIsNavigating(false), 500)
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "overview": return <ClientDashbordPage />
      case "stacks": return <StacksPage />
      case "stacks_cart": return <StacksCartPage />
      case "stackboard": return <StackboardPage />
      case "subscription": return <div className="text-neutral-500 p-10 font-mono text-xs italic tracking-widest">// BILLING_MODULE_OFFLINE</div>
      case "settings": return <div className="text-neutral-500 p-10 font-mono text-xs italic tracking-widest">// SETTINGS_READ_ONLY</div>
      default: return <ClientDashbordPage />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-neutral-100 selection:bg-teal-500/30">
      
      {/* --- FLUX STYLE SIDEBAR --- */}
      <aside className="hidden h-screen w-64 flex-col bg-[#050505] border-r border-neutral-900 md:flex select-none sticky top-0">
        
        {/* BRANDING */}
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
              <Command className="h-5 w-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <span className="block text-sm font-bold text-white tracking-tight leading-none uppercase">Stack.AI</span>
              <span className="text-[9px] font-bold text-teal-500 tracking-[0.2em] uppercase mt-1 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-teal-500 animate-pulse" /> Live System
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "group relative w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-neutral-900 text-white shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.02]"
                )}
              >
                <div className="flex items-center justify-center w-5">
                  {(isActive && isNavigating) ? (
                    <RefreshCcw className="h-4 w-4 text-teal-500 animate-spin" strokeWidth={3} />
                  ) : (
                    <item.icon className={cn(
                      "h-4 w-4 transition-transform group-hover:scale-110",
                      isActive ? "text-teal-400" : "group-hover:text-neutral-300"
                    )} strokeWidth={isActive ? 2.5 : 2} />
                  )}
                </div>
                
                <span className="flex-1 text-left tracking-tight">{item.label}</span>

                {isActive && !isNavigating && (
                  <div className="h-1 w-1 rounded-full bg-teal-500 shadow-[0_0_8px_#14b8a6]" />
                )}
              </button>
            )
          })}
        </nav>

        {/* SECURITY & PROFILE MODULE */}
        <div className="p-4 mt-auto border-t border-neutral-900 bg-[#080808]">
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">
              <span>Security Layer</span>
              <ShieldCheck size={12} className="text-teal-500/50" />
            </div>
            <div className="flex items-center gap-3 py-2 px-3 bg-black rounded-lg border border-neutral-800/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-bold text-black text-[10px]">
                {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-neutral-300 font-bold truncate">
                  {userEmail.split('@')[0] || "User"}
                </span>
                <span className="text-[9px] text-neutral-600 font-mono truncate uppercase tracking-tighter">TLS 1.3 / AES-256</span>
              </div>
            </div>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold uppercase tracking-widest text-neutral-500 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all border border-transparent hover:border-red-500/10"
            >
              <LogOut className="h-3 w-3" />
              End Session
            </button>
          </form>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col">
        {/* TOP HEADER */}
        <header className="h-20 border-b border-neutral-900 flex items-center justify-between px-10 bg-[#050505]/50 backdrop-blur-md sticky top-0 z-50">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-teal-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH_CORE_DATA..." 
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-[11px] font-mono tracking-wider focus:outline-none focus:border-teal-500/50 transition-all placeholder:text-neutral-700 text-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-neutral-500 hover:text-white transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal-500 rounded-full border border-[#050505]"></span>
            </button>
            <div className="h-4 w-[1px] bg-neutral-800 mx-2"></div>
            <Button className="bg-teal-500 hover:bg-teal-600 text-black font-bold text-xs uppercase tracking-tighter rounded-lg px-6 h-9">
              Deploy Stack
            </Button>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-10">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              {renderMainContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ---------------- FINAL DEFAULT EXPORT ---------------- */
export default function PrivatePanelPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] gap-4">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
        <div className="text-teal-500/50 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">
          Establishing Secure Link...
        </div>
      </div>
    }>
      <PrivatePanelContent />
    </Suspense>
  )
}