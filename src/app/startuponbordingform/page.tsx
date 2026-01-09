"use client"

import { useEffect, useState, useMemo } from "react"
import toast, { Toaster } from "react-hot-toast"
import { 
  Plus, Calendar, Hash, ArrowUpRight, Clock, 
  LayoutGrid, X, Rocket, Zap, Users, Shield, Terminal, Search
} from "lucide-react"
import { insertForm } from "@/src/modules/stack_upon_boarding_form/actions"
import { createClient } from "@/utils/supabase/client"
import { FormEntry } from "@/src/types/stack_on_boarding_form"


export default function StartupOnboardingPage() {
  const [forms, setForms] = useState<FormEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const supabase = createClient()

  const fetchForms = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setForms(data || [])
    } catch (err: any) {
      toast.error("Failed to sync with ShareDen nodes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [])

  const filteredForms = useMemo(() => {
    return forms.filter(f => 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [forms, searchQuery])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const formElement = e.currentTarget

    try {
      await insertForm(formData)
      toast.success("Broadcast Successful")
      await fetchForms()
      formElement.reset()
      setIsDrawerOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Execution Error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper for date formatting
  const formatNodeDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      <Toaster 
        toastOptions={{
          style: { background: '#0a0a0a', color: '#fff', border: '1px solid #262626', fontSize: '12px' }
        }} 
      />

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <header>
            <h1 className="text-4xl font-bold text-white tracking-tight">ShareDen Meetup Ledger</h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2">
              <Terminal size={14} className="text-teal-500" /> 
              Founder Registry: <span className="text-neutral-200 font-medium">{forms.length} Nodes Indexed</span>
            </p>
          </header>
          
          <div className="flex gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-teal-500 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search founder or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-1 ring-teal-500/50 w-72 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-black font-bold rounded-xl text-sm hover:bg-teal-500 transition shadow-lg shadow-teal-500/10"
            >
              <Plus size={16} /> New Entry
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Founders", value: forms.length, icon: Users, info: "Verified" },
            { label: "Active Meetup", value: "Bangalore #04", icon: Rocket, info: "Live" },
            { label: "Community Signal", value: "Strong", icon: Zap, info: "99.2% Sync" },
          ].map((item, i) => (
            <div key={i} className="bg-neutral-900/20 border border-neutral-800/60 p-6 rounded-[24px] relative overflow-hidden group hover:border-teal-500/30 transition-all duration-500">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <item.icon size={48} className="text-teal-500" />
              </div>
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em] mb-3">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-white">{item.value}</h3>
                <span className="text-[10px] font-bold text-teal-500 uppercase">{item.info}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Improved Infrastructure Table */}
        <section className="bg-[#080808] border border-neutral-900 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-900/30 border-b border-neutral-900">
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">
                    <div className="flex items-center gap-2"><Hash size={12}/> Founder & Mission</div>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Challenges & Wins</th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Knowledge Tags</th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Timestamp</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="px-8 py-7"><div className="h-12 bg-neutral-900 rounded-xl w-full"></div></td>
                      <td className="px-8 py-7"><div className="h-6 bg-neutral-900 rounded-lg w-full"></div></td>
                      <td className="px-8 py-7"><div className="h-6 bg-neutral-900 rounded-lg w-20"></div></td>
                      <td className="px-8 py-7"><div className="h-6 bg-neutral-900 rounded-lg w-32"></div></td>
                      <td className="px-8 py-7"></td>
                    </tr>
                  ))
                ) : filteredForms.length > 0 ? (
                  filteredForms.map((form) => {
                    const { day, time } = formatNodeDate(form.created_at);
                    return (
                      <tr key={form.id} className="group hover:bg-teal-500/[0.02] transition-all">
                        {/* Column 1: Founder & Mission */}
                        <td className="px-8 py-7">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-teal-500 group-hover:border-teal-500/50 transition-colors">
                              <Zap size={16} />
                            </div>
                            <div className="max-w-xs">
                              <p className="text-white font-bold text-sm truncate">{form.title}</p>
                              <p className="text-[10px] text-neutral-500 uppercase tracking-wide mt-0.5">Primary Node</p>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: The Description (Challenges/Wins) */}
                        <td className="px-8 py-7">
                          <p className="text-[11px] text-neutral-400 leading-relaxed max-w-sm">
                            {form.description}
                          </p>
                        </td>

                        {/* Column 3: Label Tags */}
                        <td className="px-8 py-7">
                          <span className="inline-flex items-center px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-[9px] font-black text-teal-500/80 uppercase tracking-wider">
                            {form.label || "General"}
                          </span>
                        </td>

                        {/* Column 4: Date & Time */}
                        <td className="px-8 py-7">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-white font-mono text-[11px]">
                              <Calendar size={10} className="text-neutral-600" /> {day}
                            </div>
                            <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-[10px]">
                              <Clock size={10} className="text-neutral-600" /> {time}
                            </div>
                          </div>
                        </td>

                        {/* Column 5: Action Icon */}
                        <td className="px-8 py-7 text-right">
                          <div className="w-8 h-8 ml-auto rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-teal-500 transition-all group-hover:text-black">
                            <ArrowUpRight size={14} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <LayoutGrid size={32} className="mx-auto mb-4 opacity-10" />
                      <p className="text-sm font-medium">No founder nodes found matching your query.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Deployment Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setIsDrawerOpen(false)} />
          <aside className="relative w-full max-w-xl bg-[#080808] border-l border-neutral-900 h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
            
            <div className="p-8 border-b border-neutral-900 flex justify-between items-center bg-[#0a0a0a]">
              <div>
                <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">ShareDen Entry</span>
                <h3 className="text-2xl font-bold text-white mt-1">Register Node</h3>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 pb-32">
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Identity (Name & Build)</label>
                    <input name="title" required placeholder="Ex: Rahul @ Stealth AI" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:ring-1 ring-teal-500 outline-none transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Context (Challenges & Success)</label>
                    <textarea name="description" required rows={4} placeholder="What's the current pulse of your startup?" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:ring-1 ring-teal-500 outline-none transition-all resize-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Give & Take Tag</label>
                    <input name="label" placeholder="Ex: Growth Hacking / Hiring" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:ring-1 ring-teal-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="p-6 rounded-[28px] bg-neutral-900/30 border border-neutral-800 flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <Shield size={20} className="text-emerald-500" />
                    <div>
                      <p className="text-sm font-bold text-white">Broadcast Protocol</p>
                      <p className="text-xs text-neutral-600">Your data will be visible to all attendees</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 py-4 bg-neutral-900 border border-neutral-800 text-white font-bold rounded-2xl text-xs">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-teal-600 text-black font-bold rounded-2xl text-xs hover:bg-teal-500 transition shadow-xl shadow-teal-500/20 disabled:opacity-50">
                    {isSubmitting ? "Syncing..." : "Publish to Ledger"}
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