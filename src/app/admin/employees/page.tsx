"use client"

import React from "react"
import { 
  Users, Briefcase, AlertCircle, UserCheck, 
  Activity, Layers, Search, Bell, Filter, 
  ChevronRight, Laptop 
} from "lucide-react"
import { EmployeesManagement } from "./employees-management"
import { Assignment, Employee, UnassignedItem } from "../../../types/admin"

interface AdminEmployeesPageProps {
  employees: Employee[]
  assignments: Assignment[]
  unassignedItems: UnassignedItem[]
  error?: any
}

export default function AdminEmployeesPage({ 
  employees = [], 
  assignments = [], 
  unassignedItems = [], 
  error 
}: AdminEmployeesPageProps) {
  
  const stats = [
    { label: "Pending Allocation", val: unassignedItems.length, icon: Briefcase, status: "Priority" },
    { label: "Active Deployments", val: assignments.length, icon: UserCheck, status: "Live" },
    { label: "Staff Bandwidth", val: `${employees.length} Units`, icon: Users, status: "Optimal" },
  ]

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      
      {/* 1. TOP GLOBAL NAVIGATION */}
      <nav className="h-20 border-b border-neutral-900 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-black">
                <Laptop size={18} />
             </div>
             <span className="text-white font-bold tracking-tighter text-xl">CloudConsole</span>
          </div>
          <div className="h-6 w-px bg-neutral-800 hidden md:block" />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button className="hover:text-neutral-200 transition py-7 text-neutral-500">Dashboard</button>
            <button className="text-teal-400 border-b-2 border-teal-500 py-7">Workforce</button>
            <button className="hover:text-neutral-200 transition py-7 text-neutral-500">Fleet Management</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 px-3 py-1.5 rounded-xl mr-2">
            <Search size={14} className="text-neutral-600" />
            <input type="text" placeholder="Search staff..." className="bg-transparent border-none outline-none text-xs w-32" />
          </div>
          <button className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 transition">
            <Bell size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-[10px] font-black text-teal-500 uppercase tracking-widest">Resource Allocation</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Workforce <span className="text-neutral-600">Infrastructure</span></h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2">
              <Activity size={14} className="text-teal-500" /> Currently monitoring <span className="text-neutral-200 font-medium">{employees.length} active human resources</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-neutral-800 transition">
              <Filter size={14} /> Refine View
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-black font-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-teal-500 transition shadow-lg shadow-teal-500/10">
              Onboard Personnel
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-[11px] font-bold uppercase tracking-widest text-red-500">
            <AlertCircle size={16} />
            <span>Telemetry Error: {error.message}</span>
          </div>
        )}

        {/* Technical Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item, i) => (
            <div key={i} className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] relative overflow-hidden group hover:border-teal-500/30 transition-all duration-500">
              <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <item.icon size={48} className="text-teal-500" />
              </div>
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em] mb-3">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-white">{item.val}</h3>
                <span className="text-[10px] font-black text-teal-500 flex items-center gap-1 uppercase">
                    <ChevronRight size={10} /> {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area - Management Terminal */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="px-8 py-5 bg-neutral-900/30 border-b border-neutral-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Layers size={14} className="text-teal-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Deployment Matrix</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-neutral-500 uppercase">System Ready</span>
                </div>
            </div>
          </div>

          <div className="p-2">
            {/* The EmployeesManagement component should handle the internal table rendering */}
            <EmployeesManagement
                employees={employees}
                assignments={assignments}
                unassignedItems={unassignedItems}
            />
          </div>

          {/* Table Footer / Status Bar */}
          <div className="px-8 py-4 bg-black/40 border-t border-neutral-900 flex justify-between items-center">
            <p className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest">
              Last Workforce Sync: {new Date().toLocaleTimeString()}
            </p>
            <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}