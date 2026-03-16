"use client"

import React, { useState, useEffect } from "react"
import { createClient } from '@/utils/supabase/client'
import { 
  Users, UserCheck, Filter, 
  ChevronRight, X, Mail, Trash2, Code2, 
  Terminal, Cpu, Globe, ExternalLink, Check, Clock
} from "lucide-react"

import { sendEmployeeInvite } from "@/src/modules/employee/actions";
import { approveEmployee, rejectEmployee } from "@/src/modules/admin/employee-actions";
import { toast } from "sonner";

// --- TYPES ---
type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  specialization: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminEmployeesPage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [pendingEmployees, setPendingEmployees] = useState<Employee[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    setLoading(true);
    const [empRes, pendingRes] = await Promise.all([
      supabase.from("employees").select("*").order("created_at", { ascending: false }),
      supabase.from("employees").select("*").eq("is_active", false).eq("approval_status", "pending").order("created_at", { ascending: false }),
    ]);
    if (!empRes.error) setEmployees(empRes.data || []);
    if (!pendingRes.error) setPendingEmployees(pendingRes.data || []);
    setLoading(false);
  }

  // --- ANALYTICS CALCULATIONS ---
  const activeCount = employees.filter(e => e.is_active).length;
  const inactiveCount = employees.length - activeCount;
  const loadFactor = employees.length > 0 ? ((activeCount / employees.length) * 100).toFixed(1) : "0";

  const stats = [
    { label: "Deployment Load", val: `${loadFactor}%`, icon: Cpu, status: "Active" },
    { label: "Active Deployments", val: activeCount, icon: UserCheck, status: "Live" },
    { label: "Staff Bandwidth", val: inactiveCount, icon: Users, status: "Standby" },
  ];

  // --- CORE ACTIONS ---
  const handleRemove = async (id: string) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (!error) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setInviteLoading(true);
    const result = await sendEmployeeInvite(email.trim());
    setInviteLoading(false);
    if (result.success) {
      toast.success("Invitation sent successfully");
      setIsPanelOpen(false);
      setEmail("");
      fetchEmployees();
    } else {
      toast.error(result.error || "Failed to send invitation");
    }
  };

  const handleApprove = async (id: string) => {
    const result = await approveEmployee(id);
    if (result.success) {
      toast.success("Employee approved");
      fetchEmployees();
    } else toast.error(result.error);
  };
  const handleReject = async (id: string) => {
    const result = await rejectEmployee(id);
    if (result.success) {
      toast.success("Employee rejected");
      fetchEmployees();
    } else toast.error(result.error);
  };
  
  return (
    <div className="relative min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* 1. SIDE PANEL (INVITE OVERLAY) */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-500 ${isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsPanelOpen(false)}
      />
      <aside className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#080808] border-l border-neutral-900 z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-10 h-full flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tighter uppercase italic">Induction <span className="text-teal-500">Node</span></h2>
              <div className="h-1 w-12 bg-teal-500 mt-2" />
            </div>
            <button onClick={() => setIsPanelOpen(false)} className="p-2 bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition"><X size={20}/></button>
          </div>

          <form onSubmit={handleSendInvite} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-neutral-600 tracking-[0.3em]">Communication Channel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input 
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="USER@NETWORK.PROTOCOL"
                  className="w-full bg-black border border-neutral-800 rounded-2xl py-5 pl-14 pr-4 text-white focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 outline-none transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={inviteLoading}
              className="w-full py-5 bg-teal-600 text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-teal-400 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-teal-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {inviteLoading ? "Sending..." : "Execute Invitation"}
            </button>
          </form>
        </div>
      </aside>

      <main className="max-w-[1600px] mx-auto p-8 lg:p-16 space-y-12">
        {/* Pending Approvals Section */}
{pendingEmployees.length > 0 && (
  <section className="bg-amber-500/5 border border-amber-500/20 rounded-[32px] p-8">
    <h2 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
      <Clock size={20} /> Pending Approvals ({pendingEmployees.length})
    </h2>
    <div className="space-y-4">
      {pendingEmployees.map((emp) => (
        <div
          key={emp.id}
          className="flex items-center justify-between bg-black/30 rounded-xl p-4 border border-amber-500/10"
        >
          <div>
            <p className="font-bold text-white">{emp.name}</p>
            <p className="text-sm text-neutral-500">{emp.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(emp.id)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-500"
            >
              <Check size={14} /> Approve
            </button>
            <button
              onClick={() => handleReject(emp.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/80 text-white rounded-lg text-sm font-bold hover:bg-red-500"
            >
              <X size={14} /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}
        
        {/* 2. HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em]">System Operational</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">WORKFORCE <span className="text-neutral-800">INFRA</span></h1>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-3 px-6 py-3 bg-neutral-900/50 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition">
              <Filter size={14} /> Filter Matrix
            </button>
            <button 
              onClick={() => window.location.href = '/Employee_portal/login'} 
              className="flex items-center gap-3 px-6 py-3 bg-neutral-900 border border-teal-500/30 text-teal-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-500/10 transition"
            >
              <ExternalLink size={14} /> Employee Portal
            </button>
            <button 
              onClick={() => setIsPanelOpen(true)} 
              className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition-colors"
            >
              Add Employee
            </button>
          </div>
        </header>

        {/* 3. ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((item, i) => (
            <div key={i} className="bg-neutral-900/20 border border-neutral-800/40 p-8 rounded-[32px] relative overflow-hidden group hover:border-teal-500/20 transition-all">
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <item.icon size={120} />
              </div>
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.3em] mb-4">{item.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-bold text-white tracking-tighter">{item.val}</h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-teal-500 border border-teal-500/20 px-3 py-1 rounded-full uppercase italic">
                  <ChevronRight size={12} /> {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. MANAGEMENT TERMINAL (THE TABLE) */}
        <section className="bg-black border border-neutral-900 rounded-[40px] overflow-hidden shadow-2xl">
          <div className="px-10 py-6 bg-neutral-900/20 border-b border-neutral-900 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-teal-500" />
              <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Personnel Stack Allocation</h2>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-teal-500 animate-bounce' : 'bg-neutral-800'}`} />)}
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-900/50">
                  <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600">Employee ID</th>
                  <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600">Role / Specialization</th>
                  <th className="px-10 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600">Status</th>
                  <th className="px-10 py-6 text-right text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/30">
                {!loading && employees.map((emp) => (
                  <tr key={emp.id} className="group hover:bg-teal-500/[0.02] transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-neutral-100 group-hover:text-teal-500 transition-colors">/ {emp.name}</span>
                        <span className="text-[10px] text-neutral-600 font-mono tracking-tighter">{emp.email}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{emp.role}</span>
                        <div className="flex flex-wrap gap-2">
                          {emp.specialization?.split(',').map((tech, idx) => (
                            <span key={idx} className="bg-neutral-900 border border-neutral-800 text-[9px] font-bold px-2 py-1 rounded text-neutral-400">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
                        emp.is_active ? "bg-teal-500/5 border-teal-500/20 text-teal-500" : "bg-neutral-500/5 border-neutral-500/20 text-neutral-500"
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${emp.is_active ? "bg-teal-500 animate-pulse" : "bg-neutral-800"}`} />
                        <span className="text-[9px] font-black uppercase">{emp.is_active ? "Assigned" : "Standby"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-[9px] font-bold uppercase text-teal-500 hover:bg-teal-500 hover:text-black transition-all">
                          <Code2 size={12} /> Update Stack
                        </button>
                        <button 
                          onClick={() => handleRemove(emp.id)}
                          className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-600 hover:text-red-500 hover:border-red-500/30 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && (
              <div className="flex items-center justify-center h-64 text-[10px] font-black uppercase tracking-[0.5em] text-neutral-700 animate-pulse">
                Synchronizing Database...
              </div>
            )}
          </div>

          <footer className="px-10 py-5 bg-black/50 border-t border-neutral-900 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <Globe size={14} className="text-neutral-800" />
                <p className="text-[9px] font-black text-neutral-700 uppercase tracking-[0.2em]">Regional Server: West-01 // Latency: 14ms</p>
             </div>
             <div className="text-[9px] font-black text-teal-900 uppercase">Ver 4.0.2-Alpha</div>
          </footer>
        </section>
      </main>
    </div>
  )
}