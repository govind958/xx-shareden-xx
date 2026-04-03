"use client"

import React, { useState, useEffect } from "react"
import { 
  Plus, Pencil, Trash2, X, Layers, 
  DollarSign, Activity, Hash, ArrowUpRight, Filter,
  PlusCircle, MinusCircle, LayoutGrid, Loader2
} from "lucide-react"
import { saveStack, deleteStack, getStacksWithSubstacks } from "@/src/modules/admin/stacks/actions"

// Type Definitions
export type Substack = {
  id: string
  label: string
  price: number
}

export type Stack = {
  id: string
  name: string
  type: string
  description: string
  base_price: number
  active: boolean
  created_at: string
  substacks: Substack[]
}

// Form state type
interface FormState {
  name: string
  type: string
  description: string
  base_price: number
  active: boolean
  substacks: Substack[]
}

const initialFormState: FormState = {
  name: "",
  type: "",
  description: "",
  base_price: 0,
  active: true,
  substacks: [],
}

export default function AdminStacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingStack, setEditingStack] = useState<Stack | null>(null)
  
  // Form state as single object
  const [form, setForm] = useState<FormState>(initialFormState)

  // Helper to update form fields
  const updateForm = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Fetch stacks on mount
  useEffect(() => {
    fetchStacks()
  }, [])

  const fetchStacks = async () => {
    try {
      setIsLoading(true)
      const data = await getStacksWithSubstacks()
      setStacks(data)
    } catch (error) {
      console.error("Failed to fetch stacks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openDrawer = (stack: Stack | null = null) => {
    setEditingStack(stack)
    if (stack) {
      setForm({
        name: stack.name,
        type: stack.type,
        description: stack.description || "",
        base_price: stack.base_price,
        active: stack.active,
        substacks: stack.substacks || [],
      })
    } else {
      setForm(initialFormState)
    }
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditingStack(null)
    setForm(initialFormState)
  }

  const addSubstack = () => {
    updateForm("substacks", [...form.substacks, { id: `temp-${Date.now()}`, label: "", price: 0 }])
  }

  const removeSubstack = (id: string) => {
    updateForm("substacks", form.substacks.filter(s => s.id !== id))
  }

  const updateSubstack = (id: string, field: keyof Substack, value: string | number) => {
    updateForm("substacks", form.substacks.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSaving(true)
      
      const formData = {
        name: form.name,
        type: form.type,
        description: form.description,
        base_price: form.base_price,
        active: form.active ? "true" : "false",
        substacks: form.substacks.filter(s => s.label.trim() !== ""), // Filter out empty substacks
      }

      await saveStack(formData, editingStack?.id)
      await fetchStacks() // Refresh the list
      closeDrawer()
    } catch (error) {
      console.error("Failed to save stack:", error)
      alert("Failed to save stack. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stack? This action cannot be undone.")) {
      return
    }

    try {
      setIsDeleting(id)
      await deleteStack(id)
      await fetchStacks() // Refresh the list
    } catch (error) {
      console.error("Failed to delete stack:", error)
      alert("Failed to delete stack. Please try again.")
    } finally {
      setIsDeleting(null)
    }
  }

  // Calculate stats
  const totalStacks = stacks.length
  const activeStacks = stacks.filter(s => s.active).length
  const avgPrice = stacks.length > 0 
    ? Math.round(stacks.reduce((sum, s) => sum + s.base_price, 0) / stacks.length)
    : 0

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      
      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Service Infrastructure</h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2">
              <Activity size={14} /> Monitoring <span className="text-neutral-200 font-medium">{totalStacks} architectural tiers</span>
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
            { label: "Total Stacks", value: totalStacks, icon: Layers, change: "Catalog" },
            { label: "Active Live", value: activeStacks, icon: Activity, change: "Running" },
            { label: "Avg. Base Price", value: `₹${avgPrice.toLocaleString()}`, icon: DollarSign, change: "+4.1%" },
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              <span className="ml-3 text-neutral-500">Loading stacks...</span>
            </div>
          ) : stacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
              <Layers size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">No stacks found</p>
              <p className="text-sm mt-1">Create your first stack to get started</p>
              <button 
                onClick={() => openDrawer()}
                className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-black font-bold rounded-xl text-sm hover:bg-teal-500 transition"
              >
                <Plus size={16} /> Add New Stack
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-900/30 border-b border-neutral-900">
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">
                      <div className="flex items-center gap-2"><Hash size={12}/> Stack Details</div>
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Substacks</th>
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
                            <p className="text-[11px] text-neutral-600 mt-1 line-clamp-1">{stack.description || "No description"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-7" onClick={() => openDrawer(stack)}>
                        <span className="inline-flex items-center px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-[11px] font-bold text-neutral-400 uppercase tracking-tight">
                          {stack.type || "General"}
                        </span>
                      </td>
                      <td className="px-8 py-7" onClick={() => openDrawer(stack)}>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm">{stack.substacks?.length || 0}</span>
                          <span className="text-neutral-600 text-xs">nodes</span>
                        </div>
                        {stack.substacks && stack.substacks.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {stack.substacks.slice(0, 3).map((sub, i) => (
                              <span key={i} className="text-[9px] px-2 py-0.5 bg-neutral-900 rounded text-neutral-500">
                                {sub.label}
                              </span>
                            ))}
                            {stack.substacks.length > 3 && (
                              <span className="text-[9px] px-2 py-0.5 bg-neutral-900 rounded text-teal-500">
                                +{stack.substacks.length - 3}
                              </span>
                            )}
                          </div>
                        )}
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
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(stack.id); }} 
                            className="p-2 text-neutral-600 hover:text-red-400 transition-colors"
                            disabled={isDeleting === stack.id}
                          >
                            {isDeleting === stack.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
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
          )}
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
                <h3 className="text-2xl font-bold text-white mt-1">{editingStack ? "Edit Stack" : "Create New Stack"}</h3>
              </div>
              <button onClick={closeDrawer} className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 pb-32">
              <form className="space-y-8" onSubmit={handleSave}>
                
                {/* Core Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Stack Label</label>
                    <input 
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      required
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:ring-1 ring-teal-500 outline-none transition-all" 
                      placeholder="e.g. Full Stack Web"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      value={form.description}
                      onChange={(e) => updateForm("description", e.target.value)}
                      rows={3}
                      className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:ring-1 ring-teal-500 outline-none transition-all resize-none" 
                      placeholder="Brief description of the stack..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Stack Type</label>
                      <input 
                        value={form.type}
                        onChange={(e) => updateForm("type", e.target.value)}
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:ring-1 ring-teal-500 outline-none transition-all" 
                        placeholder="e.g. Development"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Base Cost (₹)</label>
                      <input 
                        type="number" 
                        value={form.base_price}
                        onChange={(e) => updateForm("base_price", parseInt(e.target.value) || 0)}
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4 text-white font-mono focus:ring-1 ring-teal-500 outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>

                {/* Architectural Substacks Section */}
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
                    {form.substacks.map((sub) => (
                      <div key={sub.id} className="flex gap-2 group animate-in fade-in zoom-in-95 duration-200">
                        <div className="relative flex-[2]">
                          <input 
                            value={sub.label}
                            onChange={(e) => updateSubstack(sub.id, "label", e.target.value)}
                            className="w-full bg-neutral-900/30 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:ring-1 ring-teal-500 outline-none transition-all"
                            placeholder="Node Name (e.g. Auth Module)"
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
                            className="w-full bg-neutral-900/30 border border-neutral-800 rounded-xl pl-7 pr-4 py-3 text-sm text-neutral-200 font-mono focus:ring-1 ring-teal-500 outline-none transition-all"
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
                    
                    {form.substacks.length === 0 && (
                      <div className="py-8 border border-dashed border-neutral-800 rounded-[28px] flex flex-col items-center justify-center text-neutral-600">
                        <LayoutGrid size={24} className="mb-2 opacity-20" />
                        <p className="text-xs font-medium">No substacks defined</p>
                        <p className="text-[10px] mt-1 text-neutral-700">Click &quot;Add Node&quot; to create substacks</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Substacks Total */}
                  {form.substacks.length > 0 && (
                    <div className="flex justify-between items-center px-4 py-3 bg-neutral-900/30 rounded-xl border border-neutral-800">
                      <span className="text-xs text-neutral-500">Substacks Total</span>
                      <span className="font-mono text-sm text-teal-500 font-bold">
                        ₹{form.substacks.reduce((sum, s) => sum + s.price, 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Main Status Toggle */}
                <div className="p-6 rounded-[28px] bg-neutral-900/30 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Public Live Status</p>
                    <p className="text-xs text-neutral-600">Visible for customer checkout</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => updateForm("active", !form.active)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form.active ? 'bg-teal-500' : 'bg-neutral-800'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${form.active ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 flex gap-4">
                  <button 
                    type="button" 
                    onClick={closeDrawer} 
                    className="flex-1 py-4 bg-neutral-900 border border-neutral-800 text-white font-bold rounded-2xl text-xs hover:bg-neutral-800 transition"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-teal-600 text-black font-bold rounded-2xl text-xs hover:bg-teal-500 transition shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Configuration"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
