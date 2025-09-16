"use client"

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Settings, FileText, CreditCard, LogOut } from "lucide-react"

export function AppSidebar() {
  const navItems = [
    { title: "Dashboard", url: "/private", icon: Home },
    { title: "Forms", url: "/startuponbordingform", icon: FileText },
    { title: "Billing", url: "/private/billing", icon: CreditCard },
    { title: "Settings", url: "/private/settings", icon: Settings },
  ]

  return (
    <Sidebar>
      {/* Header / Logo */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold text-lg">
            S
          </div>
          <span className="font-semibold text-lg">SaaS Panel</span>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer / Logout */}
      <SidebarFooter>
        <form action="/logout" method="post" className="w-full">
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
