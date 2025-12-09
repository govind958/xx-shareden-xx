"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Layers3, Users, UserCircle2, Settings, ShoppingCart } from "lucide-react"

import { cn } from "@/src/lib/utils"

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
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
                isActive
                  ? "bg-teal-500/15 text-teal-400 shadow-inner shadow-teal-500/10 border border-teal-500/30"
                  : "text-neutral-400 hover:bg-teal-500/10 hover:text-teal-400"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}


