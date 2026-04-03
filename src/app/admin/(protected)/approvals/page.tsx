"use client"
import React, { useState, useEffect, useCallback } from "react"
import {
  Activity, Download, Trash2,
  Search, ShieldCheck, AlertCircle,
  CheckCircle2, Filter, UserPlus, Mail, X, Loader2
} from "lucide-react"
import {
  getPendingEmployees,
  getPendingInvitations,
  approveEmployee,
  rejectEmployee,
  revokeInvitation,
} from "@/src/modules/admin/approvals/approval-actions"
import { PendingEmployee, PendingInvitation } from "@/src/types/approvals"
import { toast } from "sonner"


// const formatEnum = (val) => val.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState<PendingEmployee[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Loading & Action states
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [empRes, invRes] = await Promise.all([
      getPendingEmployees(),
      getPendingInvitations(),
    ])
    if (empRes.data) setEmployees(empRes.data)
    if (empRes.error) setError(empRes.error)
    if (invRes.data) setInvitations(invRes.data)
    if (invRes.error) setError(invRes.error)
    setLoading(false)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) fetchData()
  }, [mounted, fetchData])

  // ─── Handlers ───────────────────────────────────────────────
  const handleApproveEmployee = async (id: string) => {
    setActionId(id)
    const result = await approveEmployee(id)
    setActionId(null)
    if (result.success) {
      toast.success("Employee approved")
      fetchData()
    } else {
      toast.error(result.error)
    }
  }
  const handleRejectEmployee = async (id: string) => {
    if (!confirm("Are you sure?")) return
    setActionId(id)
    const result = await rejectEmployee(id)
    setActionId(null)
    if (result.success) {
      toast.success("Employee rejected")
      fetchData()
    } else {
      toast.error(result.error)
    }
  }

  const handleRevokeInvitation = async (id: string) => {
    if (!confirm("Are you sure?")) return
    setActionId(id)
    const result = await revokeInvitation(id)
    setActionId(null)
    if (result.success) {
      toast.success("Invitation revoked")
      fetchData()
    } else {
      toast.error(result.error)
    }
  }

  // ─── Derived Data ───────────────────────────────────────────
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvitations = invitations.filter(inv =>
    inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invited_by.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Pending", val: employees.length + invitations.length, icon: ShieldCheck, trend: "Requires Action", status: "Critical" },
    { label: "Employee Requests", val: employees.length, icon: UserPlus, trend: "Awaiting Approval", status: "Neutral" },
    { label: "Pending Invites", val: invitations.length, icon: Mail, trend: "Active Links", status: "Neutral" },
    { label: "Processed Today", val: 12, icon: CheckCircle2, trend: "+3 from yesterday", status: "Healthy" },
  ];

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
              <ShieldCheck className="text-teal-500" size={36} />
              Approval Operations
            </h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2">
              <Activity size={14} className="text-teal-500" />
              Monitoring employee accounts and pending invitations
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 800);
              }}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-bold hover:bg-neutral-800 transition text-white disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "↻"} Refresh
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-bold hover:bg-neutral-800 transition text-white">
              <Download size={16} /> Export Data
            </button>
          </div>
        </div>

        {/* ── Error Banner ───────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 px-5 py-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
            <AlertCircle size={16} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── Stats Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <div key={i} className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] relative overflow-hidden">
              <div className="absolute top-6 right-6 text-neutral-800">
                <item.icon size={32} />
              </div>
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">
                {item.label}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-4xl font-bold text-white tracking-tighter">
                  {loading ? (
                    <span className="inline-block w-10 h-8 bg-neutral-800 animate-pulse rounded" />
                  ) : (
                    item.val.toLocaleString()
                  )}
                </h3>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded
                  ${item.status === "Critical" ? "bg-rose-500/10 text-rose-500" :
                    item.status === "Healthy" ? "bg-emerald-500/10 text-emerald-500" :
                      item.status === "Neutral" ? "bg-amber-500/10 text-amber-500" :
                        "bg-neutral-800 text-neutral-400"}`}
                >
                  {item.status}
                </span>
                <span className="text-xs text-neutral-500 font-mono">{item.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Container ───────────────────────────────────────────────── */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden shadow-2xl">

          {/* Tabs & Toolbar */}
          <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            {/* Custom Dark Tabs */}
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('employees')}
                className={`flex items-center gap-2 pb-1 border-b-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'employees'
                    ? 'border-teal-500 text-teal-500'
                    : 'border-transparent text-neutral-600 hover:text-neutral-400'
                  }`}
              >
                <UserPlus size={14} /> Accounts Queue
                {employees.length > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] ${activeTab === 'employees' ? 'bg-teal-500/20' : 'bg-neutral-800'}`}>
                    {employees.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('invitations')}
                className={`flex items-center gap-2 pb-1 border-b-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'invitations'
                    ? 'border-teal-500 text-teal-500'
                    : 'border-transparent text-neutral-600 hover:text-neutral-400'
                  }`}
              >
                <Mail size={14} /> Invitations Queue
                {invitations.length > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] ${activeTab === 'invitations' ? 'bg-teal-500/20' : 'bg-neutral-800'}`}>
                    {invitations.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 transition-colors font-mono"
                />
              </div>
              <button className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest hover:text-white transition flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2">
                <Filter size={12} /> Filter
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
              {activeTab === 'employees' ? (
                // --- EMPLOYEES HEADERS ---
                <thead>
                  <tr className="border-b border-neutral-900 text-[9px] uppercase tracking-[0.2em] text-neutral-600 bg-black/20">
                    <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[120px]">User ID</th>
                    <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[240px]">Applicant</th>
                    <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-auto">Role & Specs</th>
                    <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[120px]">Status</th>
                    <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[140px]">Applied On</th>
                    <th className="px-8 py-4 font-black w-[100px] text-right">Actions</th>
                  </tr>
                </thead>
              ) : (
                // --- INVITATIONS HEADERS ---
                <thead>
                  <tr className="border-b border-neutral-900 text-[9px] uppercase tracking-[0.2em] text-neutral-600 bg-black/20">
                    <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[120px]">Invite ID</th>
                    <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[240px]">Email Address</th>
                    <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-auto">Invited By</th>
                    <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[120px]">Status</th>
                    <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[140px]">Expires On</th>
                    <th className="px-8 py-4 font-black w-[100px] text-right">Actions</th>
                  </tr>
                </thead>
              )}

              <tbody className="text-xs">
                {/* --- EMPLOYEES BODY --- */}
                {activeTab === 'employees' && (
                  filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-neutral-500 font-sans">
                        No pending employees found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="border-b border-neutral-900/50 hover:bg-white/[0.02] transition-colors group font-mono">
                        <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-500">
                          #{employee.id}
                        </td>
                        <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-300 font-sans font-medium">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-6 h-6 shrink-0 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] text-teal-500 font-bold">
                              {employee.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col truncate">
                              <span className="truncate text-xs text-white" title={employee.name}>{employee.name}</span>
                              <span className="truncate text-[10px] text-neutral-500 font-mono" title={employee.email}>{employee.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4 border-r border-neutral-900/30 text-white font-sans truncate">
                          <span className="capitalize">{employee.role}</span>
                          {employee.specialization && (
                            <span className="block text-[10px] text-neutral-500 font-mono mt-0.5">{employee.specialization}</span>
                          )}
                        </td>
                        <td className="px-8 py-4 border-r border-neutral-900/30">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] font-bold uppercase tracking-wider">
                            {employee.approval_status}
                          </span>
                        </td>
                        <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-500">
                          {new Date(employee.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleRejectEmployee(employee.id)}
                              disabled={actionId === employee.id}
                              className="text-neutral-600 hover:text-rose-500 transition-colors p-1 disabled:opacity-40"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                            <button
                              onClick={() => handleApproveEmployee(employee.id)}
                              disabled={actionId === employee.id}
                              className="text-neutral-600 hover:text-teal-500 transition-colors p-1 disabled:opacity-40"
                              title="Approve"
                            >
                              {actionId === employee.id ? (
                                <Loader2 size={16} className="animate-spin text-teal-500" />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                )}

                {/* --- INVITATIONS BODY --- */}
                {activeTab === 'invitations' && (
                  filteredInvitations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-neutral-500 font-sans">
                        No pending invitations found.
                      </td>
                    </tr>
                  ) : (
                    filteredInvitations.map((invite) => (
                      <tr key={invite.id} className="border-b border-neutral-900/50 hover:bg-white/[0.02] transition-colors group font-mono">
                        <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-500">
                          #{invite.id}
                        </td>
                        <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-300 font-sans font-medium">
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail size={14} className="text-neutral-500 shrink-0" />
                            <span className="truncate text-xs text-white" title={invite.email}>
                              {invite.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4 border-r border-neutral-900/30 text-white font-sans truncate">
                          <span className="bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-[10px] text-neutral-400 font-mono">
                            @{invite.invited_by}
                          </span>
                        </td>
                        <td className="px-8 py-4 border-r border-neutral-900/30">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] font-bold uppercase tracking-wider">
                            {invite.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-500">
                          {new Date(invite.expires_at).toLocaleDateString()}
                          <span className="block text-[9px] text-rose-500/70 mt-0.5">Expiring</span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleRevokeInvitation(invite.id)}
                              disabled={actionId === invite.id}
                              className="text-neutral-600 hover:text-rose-500 transition-colors p-1 disabled:opacity-40"
                              title="Revoke Invitation"
                            >
                              {actionId === invite.id ? (
                                <Loader2 size={16} className="animate-spin text-rose-500" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}