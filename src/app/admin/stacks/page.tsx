"use client"

import React, { useState } from "react"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Check, 
  Layers, 
  DollarSign, 
  Activity 
} from "lucide-react"

// --- Types & Mock Data ---
type Stack = {
  id: string
  name: string
  type: string
  description: string
  base_price: number
  active: boolean
  created_at: string
}

const MOCK_STACKS: Stack[] = [
  { id: "1", name: "Full Stack Web", type: "Development", description: "Next.js, Tailwind, Supabase", base_price: 2500, active: true, created_at: "2023-10-01" },
  { id: "2", name: "Mobile App", type: "Mobile", description: "React Native & Expo", base_price: 3200, active: true, created_at: "2023-11-15" },
  { id: "3", name: "UI/UX Design", type: "Design", description: "Figma prototyping & Branding", base_price: 1200, active: false, created_at: "2024-01-20" },
]

export default function AdminStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>(MOCK_STACKS)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingStack, setEditingStack] = useState<Stack | null>(null)

  const glassClass = "bg-neutral-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl"

  const openDrawer = (stack: Stack | null = null) => {
    setEditingStack(stack)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditingStack(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 p-8 font-sans">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <Layers className="text-teal-400" /> Stacks
          </h1>
          <p className="text-neutral-400 mt-2 text-lg">Manage your service infrastructure and pricing tiers.</p>
        </div>
        <button 
          onClick={() => openDrawer()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-500/20"
        >
          <Plus size={20} /> Add New Stack
        </button>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Stacks", val: stacks.length, icon: Layers, color: "text-teal-400" },
          { label: "Active Services", val: stacks.filter(s => s.active).length, icon: Activity, color: "text-emerald-400" },
          { label: "Avg. Base Price", val: "$1,950", icon: DollarSign, color: "text-blue-400" },
        ].map((stat, i) => (
          <div key={i} className={`${glassClass} p-6 flex items-center gap-5`}>
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-400 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className={`max-w-7xl mx-auto ${glassClass} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-neutral-500">Stack Details</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-neutral-500">Type</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-neutral-500">Base Price</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-neutral-500">Status</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stacks.map((stack) => (
                <tr key={stack.id} className="group transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-semibold text-white group-hover:text-teal-300 transition-colors">{stack.name}</div>
                    <div className="text-sm text-neutral-500 line-clamp-1">{stack.description}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-neutral-300 px-2 py-1 bg-white/5 rounded-md border border-white/5">{stack.type}</span>
                  </td>
                  <td className="px-6 py-5 font-mono text-teal-400 font-semibold text-lg">
                    ${stack.base_price.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      stack.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${stack.active ? "bg-emerald-400" : "bg-neutral-500"}`} />
                      {stack.active ? "Live" : "Draft"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {/* Action Buttons - Now Permanently Visible & Stylized */}
                    <div className="flex justify-end items-center gap-3">
                      <button 
                        onClick={() => openDrawer(stack)} 
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-teal-500/20 rounded-lg text-neutral-300 hover:text-teal-400 border border-white/10 transition-all active:scale-95"
                        title="Edit Stack"
                      >
                        <Pencil size={16} />
                        <span className="text-xs font-semibold">Edit</span>
                      </button>
                      <button 
                        className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-neutral-300 hover:text-red-400 border border-white/10 transition-all active:scale-95"
                        title="Delete Stack"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Panel (Drawer) */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={closeDrawer} />
          
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#0f0f0f] border-l border-white/10 z-50 shadow-2xl p-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-white">{editingStack ? "Update Stack" : "New Service Stack"}</h2>
                <p className="text-sm text-neutral-500 mt-1">Configure your stack parameters below.</p>
              </div>
              <button onClick={closeDrawer} className="p-2 hover:bg-white/10 rounded-full text-neutral-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); closeDrawer(); }}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Stack Name</label>
                <input 
                  autoFocus
                  defaultValue={editingStack?.name}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all" 
                  placeholder="e.g. Enterprise Cloud Bundle" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Category</label>
                  <input 
                    defaultValue={editingStack?.type}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-teal-500" 
                    placeholder="Web" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Price (USD)</label>
                  <input 
                    type="number"
                    defaultValue={editingStack?.base_price}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-teal-500 font-mono" 
                    placeholder="0.00" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Description</label>
                <textarea 
                  rows={4}
                  defaultValue={editingStack?.description}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-teal-500 resize-none" 
                  placeholder="What is included?"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Active Status</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wide">Visible to users</p>
                </div>
                <button 
                  type="button"
                  className={`w-12 h-6 rounded-full transition-colors relative ${editingStack?.active !== false ? 'bg-teal-500' : 'bg-neutral-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingStack?.active !== false ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={closeDrawer}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl transition-all shadow-xl shadow-teal-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}