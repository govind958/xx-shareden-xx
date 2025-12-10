"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { createPortal } from "react-dom"
import { Home, Layers3, Users, UserCircle2, Settings, ShoppingCart, LogOut, Loader2 } from "lucide-react"

import { cn } from "@/src/lib/utils"
import { adminLogout } from "@/src/app/admin/actions"

const links = [
  {
    label: "Home",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    label: "Stacks",
    href: "/admin/stacks",
    icon: Layers3,
  },
  {
    label: "Employees",
    href: "/admin/employees",
    icon: Users,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: UserCircle2,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [navTarget, setNavTarget] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isNavigating && navTarget && pathname?.startsWith(navTarget)) {
      setIsNavigating(false)
      setNavTarget(null)
    }
  }, [pathname, isNavigating, navTarget])

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout()
    })
  }

  const handleNavigate = (href: string) => {
    if (pathname?.startsWith(href)) return
    setNavTarget(href)
    setIsNavigating(true)
    router.push(href)
  }

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-teal-500/10 bg-neutral-950/20 p-4 text-neutral-50 shadow-2xl backdrop-blur-xl md:flex">
      <div className="mb-6 border-b border-teal-500/10 pb-4">
        <span className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-2xl font-bold text-transparent">
          Admin
        </span>
        <p className="mt-1 text-xs text-neutral-500">Admin controls & overview</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((item) => {
          const isActive = pathname?.startsWith(item.href)

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => handleNavigate(item.href)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200",
                isActive
                  ? "bg-teal-500/15 text-teal-400 shadow-inner shadow-teal-500/10 border border-teal-500/30"
                  : "text-neutral-400 hover:bg-teal-500/10 hover:text-teal-400"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"
        disabled={isPending}
      >
        <LogOut className="h-4 w-4" />
        <span>{isPending ? "Logging out..." : "Logout"}</span>
      </button>
      {mounted && isNavigating &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm text-teal-200">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3 text-sm">
              Loading {navTarget ? navTarget.replace("/admin/", "") : "section"}...
            </span>
          </div>,
          document.body
        )}
    </aside>
  )
}


