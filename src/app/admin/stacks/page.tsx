"use client"

import React, { useState } from "react"
import { 
  Plus, Pencil, Trash2, X, Check, Layers, 
  DollarSign, Activity, Hash, ArrowUpRight, Filter,
  PlusCircle, MinusCircle, LayoutGrid, IndianRupee
} from "lucide-react"

// --- Types ---
type Substack = {
  id: string
  label: string
  price: number
}

type Stack = {
  id: string
  name: string
  type: string
  description: string
  base_price: number
  active: boolean
  created_at: string
  substacks?: Substack[]
}

const MOCK_STACKS: Stack[] = [
  { 
    id: "1", 
    name: "Full Stack Web", 
    type: "Development", 
    description: "Next.js, Tailwind, Supabase", 
    base_price: 25000, 
    active: true, 
    created_at: "2023-10-01", 
    substacks: [
      { id: "s1", label: "Auth Module", price: 5000 }, 
      { id: "s2", label: "DB Schema", price: 3000 }
    ] 
  },
  { id: "2", name: "Mobile App", type: "Mobile", description: "React Native & Expo", base_price: 32000, active: true, created_at: "2023-11-15", substacks: [] },
  { id: "3", name: "UI/UX Design", type: "Design", description: "Figma prototyping & Branding", base_price: 12000, active: false, created_at: "2024-01-20", substacks: [] },
]

export default function AdminStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>(MOCK_STACKS)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingStack, setEditingStack] = useState<Stack | null>(null)
  
  // Local state for substacks while editing
  const [localSubstacks, setLocalSubstacks] = useState<Substack[]>([])

  const openDrawer = (stack: Stack | null = null) => {
    setEditingStack(stack)
    setLocalSubstacks(stack?.substacks || [])
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditingStack(null)
    setLocalSubstacks([])
  }

  const addSubstack = () => {
    setLocalSubstacks([...localSubstacks, { id: Date.now().toString(), label: "", price: 0 }])
  }

  const removeSubstack = (id: string) => {
    setLocalSubstacks(localSubstacks.filter(s => s.id !== id))
  }

  const updateSubstack = (id: string, field: keyof Substack, value: string | number) => {
    setLocalSubstacks(localSubstacks.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      
     

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Service Infrastructure</h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2">
              <Activity size={14} /> Monitoring <span className="text-neutral-200 font-medium">{stacks.length} architectural tiers</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-bold hover:bg-neutral-800 transition">
              <Filter size={16} /> Filters
            </button>
            <button 
              onClick={() => openDrawer()}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-black font-bold rounded-xl text-sm hover:bg-teal-500 transition shadow-lg shadow-teal-500/10"
            >
              <Plus size={16} /> Add New Stack
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Stacks", value: stacks.length, icon: Layers, change: "Catalog" },
            { label: "Active Live", value: stacks.filter(s => s.active).length, icon: Activity, change: "Running" },
            { label: "Avg. Base Price", value: "₹1,95,000", icon: DollarSign, change: "+4.1%" },
          ].map((item, i) => (
            <div key={i} className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] relative overflow-hidden group hover:border-teal-500/30 transition-all duration-500">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <item.icon size={48} className="text-teal-500" />
              </div>
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em] mb-3">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-white">{item.value}</h3>
                <span className="text-[10px] font-bold text-teal-500">{item.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-900/30 border-b border-neutral-900">
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">
                    <div className="flex items-center gap-2"><Hash size={12}/> Stack Details</div>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Stacks Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Base Price</th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {stacks.map((stack) => (
                  <tr 
                    key={stack.id} 
                    className="group hover:bg-teal-500/[0.03] transition-all cursor-pointer"
                  >
                    <td className="px-8 py-7" onClick={() => openDrawer(stack)}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-neutral-800 flex items-center justify-center text-xs font-bold text-teal-500 group-hover:border-teal-500/50 transition-colors">
                          {stack.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{stack.name}</p>
                          <p className="text-[11px] text-neutral-600 mt-1 line-clamp-1">{stack.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7" onClick={() => openDrawer(stack)}>
                      <span className="inline-flex items-center px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-[11px] font-bold text-neutral-400 uppercase tracking-tight">
                        {stack.type}
                      </span>
                    </td>
                    <td className="px-8 py-7 font-mono text-white font-bold text-sm" onClick={() => openDrawer(stack)}>
                      ₹{stack.base_price.toLocaleString()}
                    </td>
                    <td className="px-8 py-7" onClick={() => openDrawer(stack)}>
                      {stack.active ? (
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm text-emerald-400 bg-emerald-400/10 border-emerald-400/20 flex items-center gap-2 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm text-neutral-500 bg-neutral-800 border-neutral-700">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-7 text-right">
                      <div className="flex justify-end gap-3 items-center">
                        <button onClick={(e) => { e.stopPropagation(); openDrawer(stack); }} className="p-2 text-neutral-600 hover:text-teal-400 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); }} className="p-2 text-neutral-600 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-teal-500 transition-all group-hover:text-black">
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Side Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={closeDrawer} />
          <aside className="relative w-full max-w-xl bg-[#080808] border-l border-neutral-900 h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
            
            <div className="p-8 border-b border-neutral-900 flex justify-between items-center bg-[#0a0a0a]">
              <div>
                <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">Infrastructure Config</span>
                <h3 className="text-2xl font-bold text-white mt-1">{editingStack ? editingStack.name : "Create New Stack"}</h3>
              </div>
              <button onClick={closeDrawer} className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 pb-32">
              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); closeDrawer(); }}>
                
                {/* Core Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Stack Label</label>
                    <input defaultValue={editingStack?.name} className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:ring-1 ring-teal-500 outline-none transition-all" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Stacks Name</label>
                      <input defaultValue={editingStack?.type} className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:ring-1 ring-teal-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Base Cost (₹)</label>
                      <input type="number" defaultValue={editingStack?.base_price} className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4 text-white font-mono focus:ring-1 ring-teal-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                {/* Architectural Substacks Section with Price */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid size={12} /> Architectural Substacks
                    </label>
                    <button 
                      type="button" 
                      onClick={addSubstack}
                      className="text-[10px] font-black text-teal-500 uppercase tracking-widest flex items-center gap-1 hover:text-teal-400 transition"
                    >
                      <PlusCircle size={14} /> Add Node
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {localSubstacks.map((sub) => (
                      <div key={sub.id} className="flex gap-2 group animate-in fade-in zoom-in-95 duration-200">
                        <div className="relative flex-[2]">
                          <input 
                            value={sub.label}
                            onChange={(e) => updateSubstack(sub.id, "label", e.target.value)}
                            className="w-full bg-neutral-900/30 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:ring-1 ring-teal-500 outline-none"
                            placeholder="Node Name (e.g. Auth)"
                          />
                        </div>
                        <div className="relative flex-1">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600">
                             <span className="text-xs font-bold">₹</span>
                          </div>
                          <input 
                            type="number"
                            value={sub.price}
                            onChange={(e) => updateSubstack(sub.id, "price", parseInt(e.target.value) || 0)}
                            className="w-full bg-neutral-900/30 border border-neutral-800 rounded-xl pl-7 pr-4 py-3 text-sm text-neutral-200 font-mono focus:ring-1 ring-teal-500 outline-none"
                            placeholder="0"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeSubstack(sub.id)}
                          className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-600 hover:text-red-400 hover:border-red-400/50 transition-all"
                        >
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    ))}
                    
                    {localSubstacks.length === 0 && (
                      <div className="py-8 border border-dashed border-neutral-800 rounded-[28px] flex flex-col items-center justify-center text-neutral-600">
                        <LayoutGrid size={24} className="mb-2 opacity-20" />
                        <p className="text-xs font-medium">No substacks defined</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="p-6 rounded-[28px] bg-neutral-900/30 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Public Live Status</p>
                    <p className="text-xs text-neutral-600">Visible for customer checkout</p>
                  </div>
                  <button type="button" className={`w-12 h-6 rounded-full transition-colors relative ${editingStack?.active !== false ? 'bg-teal-500' : 'bg-neutral-800'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${editingStack?.active !== false ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={closeDrawer} className="flex-1 py-4 bg-neutral-900 border border-neutral-800 text-white font-bold rounded-2xl text-xs hover:bg-neutral-800 transition">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-teal-600 text-black font-bold rounded-2xl text-xs hover:bg-teal-500 transition shadow-xl shadow-teal-500/20">Save Configuration</button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}