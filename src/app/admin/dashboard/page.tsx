"use client"

import React, { useState, useEffect } from "react"
import { 
  Users, FileText, ShieldCheck, Layers, 
  Activity, Zap, 
  Search, Bell, Plus, Trash2, Download
} from "lucide-react"

interface AdminDashboardProps {
  adminUser?: { name?: string; email?: string };
  counts: {
    users: number;
    forms: number;
    sessions: number;
    stacks: number;
  };
}

export default function AdminDashboard({ adminUser, counts }: AdminDashboardProps) {
  const [mounted, setMounted] = useState(false)

  // --- SPREADSHEET STATE ---
  const [columns, setColumns] = useState([
    { id: "segment", label: "Segment", width: "160px" },
    { id: "metric", label: "Metric Name", width: "auto" },
    { id: "w1", label: "Week 01", width: "120px" },
    { id: "w2", label: "Week 02", width: "120px" },
    { id: "target", label: "Target", width: "120px" },
    { id: "health", label: "Health", width: "160px" },
    { id: "actions", label: "", width: "80px" }, // For Delete Button
  ])

  const [rows, setRows] = useState([
    { id: 1, segment: "Aware", metric: "System Ad Spend (Global)", w1: "$6,515", w2: "$5,894", target: "$25,000", health: "Green" },
    { id: 2, segment: "Engage", metric: "Infrastructure Video Views", w1: "323", w2: "216", target: "1,000", health: "Critical" },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  // --- ACTIONS ---
  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      segment: "New Seg",
      metric: "New Metric Data",
      w1: "-",
      w2: "-",
      target: "-",
      health: "Neutral"
    }
    setRows([...rows, newRow])
  }

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id))
  }

  const handleStatusChange = (id: number, newStatus: string) => {
    setRows(rows.map(row => row.id === id ? { ...row, health: newStatus } : row))
  }

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + columns.map(c => c.label).join(",") + "\n"
      + rows.map(r => Object.values(r).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "system_spreadsheet.csv");
    document.body.appendChild(link);
    link.click();
  }

  const stats = [
    { label: "User Directory", val: counts?.users || 0, icon: Users, trend: "+12.5%", status: "Synced" },
    { label: "Documentation", val: counts?.forms || 0, icon: FileText, trend: "Stable", status: "Active" },
    { label: "Security Nodes", val: counts?.sessions || 0, icon: ShieldCheck, trend: "Secure", status: "Live" },
    { label: "Architecture", val: counts?.stacks || 0, icon: Layers, trend: "+2 New", status: "Global" },
  ]

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      
      {/* 1. TOP GLOBAL NAVIGATION */}
      <nav className="h-20 border-b border-neutral-900 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-black">
                <Zap size={18} fill="currentColor" />
             </div>
             <span className="text-white font-bold tracking-tighter text-xl">CloudConsole</span>
          </div>
          <div className="h-6 w-px bg-neutral-800 hidden md:block" />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button className="text-teal-400 border-b-2 border-teal-500 py-7">Overview</button>
            <button className="hover:text-neutral-200 transition py-7 text-neutral-500">Analytics</button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 px-3 py-1.5 rounded-xl mr-4">
            <Search size={14} className="text-neutral-600" />
            <input type="text" placeholder="Search system..." className="bg-transparent border-none outline-none text-xs w-32" />
          </div>
          <button className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center relative">
            <Bell size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
                Operator: <span className="text-neutral-400">{adminUser?.name || "Root"}</span>
            </h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2">
              <Activity size={14} className="text-teal-500" /> All architectural tiers reporting <span className="text-neutral-200 font-medium">100% uptime</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportToCSV} className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-bold hover:bg-neutral-800 transition">
              <Download size={16} /> Export CSV
            </button>
           
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <div key={i} className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px]">
                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">{item.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-white tracking-tighter">{item.val.toLocaleString()}</h3>
                </div>
            </div>
          ))}
        </div>

        {/* SYSTEM SPREADSHEET V1.0 */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden shadow-2xl">
          <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">System Spreadsheet v1.0</span>
             </div>
             <div className="flex gap-4">
                <button onClick={exportToCSV} className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest hover:text-white transition flex items-center gap-2">
                    <Download size={12} /> Export
                </button>
                <button onClick={handleAddRow} className="text-[9px] font-bold text-teal-500 uppercase tracking-widest hover:text-white transition">+ Add Row</button>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
              <thead>
                <tr className="border-b border-neutral-900 text-[9px] uppercase tracking-[0.2em] text-neutral-600 bg-black/20">
                  {columns.map((col) => (
                    <th key={col.id} style={{ width: col.width }} className="px-8 py-4 font-black border-r border-neutral-900/50 last:border-r-0">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs">
                {rows.map((row: any) => (
                  <tr key={row.id} className="border-b border-neutral-900/50 hover:bg-white/[0.02] transition-colors group font-mono">
                    {columns.map((col) => (
                       <td key={col.id} className="px-8 py-4 border-r border-neutral-900/30 text-neutral-400 group-hover:text-white last:border-r-0">
                         
                         {/* HEALTH DROPDOWN LOGIC */}
                         {col.id === 'health' ? (
                            <select 
                                value={row.health}
                                onChange={(e) => handleStatusChange(row.id, e.target.value)}
                                className={`bg-transparent border-none outline-none font-bold text-[9px] uppercase tracking-widest cursor-pointer px-2 py-1 rounded
                                ${row.health === 'Green' ? 'text-emerald-500 bg-emerald-500/10' : 
                                  row.health === 'Critical' ? 'text-rose-500 bg-rose-500/10' : 
                                  'text-amber-500 bg-amber-500/10'}`}
                            >
                                <option value="Green" className="bg-[#080808] text-emerald-500">Green</option>
                                <option value="Critical" className="bg-[#080808] text-rose-500">Critical</option>
                                <option value="Neutral" className="bg-[#080808] text-amber-500">Neutral</option>
                            </select>
                         ) : col.id === 'actions' ? (
                            <button 
                                onClick={() => handleDeleteRow(row.id)}
                                className="text-neutral-700 hover:text-rose-500 transition-colors p-1"
                            >
                                <Trash2 size={14} />
                            </button>
                         ) : col.id === 'segment' ? (
                            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-[9px] font-bold uppercase">
                                {row[col.id]}
                            </span>
                         ) : (
                            row[col.id]
                         )}

                       </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Logs View */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[32px] overflow-hidden">
          <div className="px-8 py-4 bg-black/40 flex justify-between items-center">
            <p className="text-[10px] font-medium text-neutral-700 font-mono tracking-tighter">
                LAST_SYNC: {mounted ? new Date().toISOString() : "CALIBRATING..."}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}