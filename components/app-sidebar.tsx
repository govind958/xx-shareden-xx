"use client"

import * as React from "react"
import { 
  Home, 
  Settings, 
  Code, 
  CreditCard, 
  LucideShoppingCart, 
  CircuitBoard,
  LogOut
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { logout } from "@/src/app/logout/actions"
import { cn } from "@/src/lib/utils"

const items = [
  { id: "dashboard", title: "Dashboard", icon: Home },
  { id: "stacks", title: "Stacks", icon: Code },
  { id: "stacks_cart", title: "Cart", icon: LucideShoppingCart },
  { id: "stackboard", title: "Stackboard", icon: CircuitBoard },
  { id: "subscription", title: "Subscription", icon: CreditCard },
  { id: "settings", title: "Settings", icon: Settings },
]

interface AppSidebarProps {
  activeTab: string
  setActiveTab: (id: string) => void
  userEmail: string
}

export function AppSidebar({ activeTab, setActiveTab, userEmail }: AppSidebarProps) {
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "U"

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-teal-500/10 bg-neutral-950">
      <SidebarHeader className="p-4 bg-neutral-950">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-neutral-950 shrink-0 shadow-[0_0_15px_rgba(20,184,166,0.4)]">
            <CircuitBoard size={18} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent group-data-[collapsible=icon]:hidden truncate">
            ShareDen
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-neutral-950 custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-neutral-500 px-4">Navigation</SidebarGroupLabel>
          <SidebarMenu className="px-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => setActiveTab(item.id)}
                  isActive={activeTab === item.id}
                  tooltip={item.title}
                  className={cn(
                    "transition-all duration-200 my-1 rounded-md",
                    activeTab === item.id 
                      ? "bg-teal-500/15 text-teal-400 border border-teal-500/20" 
                      : "text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", activeTab === item.id && "text-teal-400")} />
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-teal-500/10 bg-neutral-950">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
             <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-lg bg-white/5">
                <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-teal-400 border border-teal-500/20 shrink-0">
                  {userInitial}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-medium text-neutral-200 truncate">{userEmail}</span>
                  <span className="text-[10px] text-teal-500/70 uppercase tracking-tighter">Pro Member</span>
                </div>
             </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={logout} className="w-full">
              <SidebarMenuButton 
                type="submit"
                className="w-full text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}