"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { createPortal } from "react-dom"
import { 
  Home, Layers3, Users, UserCircle2, Settings, 
  ShoppingCart, LogOut, Loader2, Command, 
  RefreshCcw, Globe, ShieldCheck
} from "lucide-react"

import { cn } from "@/src/lib/utils"
import { adminLogout } from "@/src/app/admin/actions"

const links = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Home },
  { label: "Stacks", href: "/admin/stacks", icon: Layers3 },
  { label: "Employees", href: "/admin/employees", icon: Users },
  { label: "Users", href: "/admin/users", icon: UserCircle2 },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startLogoutTransition] = useTransition()
  
  // Navigation State Management
  const [navTarget, setNavTarget] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Robust reset when navigation completes
  useEffect(() => {
    if (isNavigating && navTarget && (pathname === navTarget || pathname?.startsWith(navTarget))) {
      const timeout = setTimeout(() => {
        setIsNavigating(false)
        setNavTarget(null)
      }, 300) // Small buffer for visual smoothness
      return () => clearTimeout(timeout)
    }
  }, [pathname, isNavigating, navTarget])

  const handleLogout = () => {
    startLogoutTransition(async () => {
      await adminLogout()
    })
  }

  const handleNavigate = (href: string) => {
    if (pathname === href) return
    setNavTarget(href)
    setIsNavigating(true)
    router.push(href)
  }

  return (
    <aside className="hidden h-screen w-64 flex-col bg-[#050505] border-r border-neutral-900 md:flex select-none">
      
      {/* 1. TOP PROGRESS BAR (Robust Navigation Indicator) */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-teal-500/10">
          <div className="h-full bg-teal-500 shadow-[0_0_10px_#14b8a6] animate-[progress_2s_ease-in-out_infinite]" 
               style={{ width: '40%', animationName: 'progress-shuttle' }} />
        </div>
      )}

      {/* 2. BRANDING */}
      <div className="h-20 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
            <Command className="h-5 w-5 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-sm font-bold text-white tracking-tight leading-none uppercase">Flux.Admin</span>
            <span className="text-[9px] font-bold text-teal-500 tracking-[0.2em] uppercase mt-1 flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-teal-500 animate-pulse" /> Live System
            </span>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION GRID */}
      <nav className="flex-1 px-3 mt-4 space-y-1">
        {links.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          const isLoadingThis = navTarget === item.href

          return (
            <button
              key={item.href}
              disabled={isNavigating}
              onClick={() => handleNavigate(item.href)}
              className={cn(
                "group relative w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-neutral-900 text-white shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.02]",
                isNavigating && !isLoadingThis && "opacity-50 grayscale"
              )}
            >
              <div className="flex items-center justify-center w-5">
                {isLoadingThis ? (
                  <RefreshCcw className="h-4 w-4 text-teal-500 animate-spin" strokeWidth={3} />
                ) : (
                  <item.icon className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    isActive ? "text-teal-500" : "group-hover:text-neutral-300"
                  )} strokeWidth={isActive ? 2.5 : 2} />
                )}
              </div>
              
              <span className="flex-1 text-left tracking-tight">{item.label}</span>

              {isActive && !isLoadingThis && (
                <div className="h-1 w-1 rounded-full bg-teal-500 shadow-[0_0_8px_#14b8a6]" />
              )}
            </button>
          )
        })}
      </nav>

      {/* 4. ROBUST STATUS MODULE */}
      <div className="p-4 mt-auto border-t border-neutral-900 bg-[#080808]">
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-black text-neutral-600 uppercase tracking-widest">
            <span>Security Layer</span>
            <ShieldCheck size={12} className="text-teal-500/50" />
          </div>
          <div className="flex items-center gap-3 py-2 px-3 bg-black rounded-lg border border-neutral-800/50">
            <Globe size={14} className="text-neutral-600" />
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-300 font-bold">Encrypted Connection</span>
              <span className="text-[9px] text-neutral-600 font-mono">TLS 1.3 / AES-256</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold uppercase tracking-widest text-neutral-500 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all border border-transparent hover:border-red-500/10"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <LogOut className="h-3 w-3" />
          )}
          {isPending ? "Terminating" : "End Session"}
        </button>
      </div>

      {/* Keyframe for top loader */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress-shuttle {
          0% { left: -40%; width: 40%; }
          50% { width: 60%; }
          100% { left: 100%; width: 40%; }
        }
      `}} />
    </aside>
  )
}