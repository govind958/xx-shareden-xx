"use client"
import React, { useState, useEffect, useCallback } from "react"
import {
  Activity, Download, Trash2,
  Search, LifeBuoy, AlertCircle, Clock,
  CheckCircle2, Filter, MessageSquare, X, Paperclip, Loader2
} from "lucide-react"
import { getTickets, updateTicketStatus, deleteTicket } from "@/src/modules/admin/support/action"
import { Ticket, TicketStatus } from "@/src/types/support-admin"

const formatEnum = (val: string) => val.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())

export default function SupportPanel() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])

  // Loading & error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // ─── Fetch tickets on mount ───────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTickets()
      setTickets(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load tickets")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchTickets()
  }, [fetchTickets])

  // ─── Derived stats ────────────────────────────────────────────────────────
  const totalTickets = tickets.length
  const openTickets = tickets.filter((t) => t.status === "open").length
  const inProgressTickets = tickets.filter((t) => t.status === "in_progress").length
  const resolvedTickets = tickets.filter(
    (t) => t.status === "resolved" || t.status === "closed"
  ).length

  const stats = [
    { label: "Total Tickets", val: totalTickets, icon: LifeBuoy, trend: "+12%", status: "All Time" },
    { label: "Open Issues", val: openTickets, icon: AlertCircle, trend: "Requires Action", status: "Critical" },
    { label: "In Progress", val: inProgressTickets, icon: Clock, trend: "Being Handled", status: "Neutral" },
    { label: "Resolved/Closed", val: resolvedTickets, icon: CheckCircle2, trend: "This Week", status: "Healthy" },
  ]

  // ─── Status update (persisted) ────────────────────────────────────────────
  const handleStatusChange = async (id: number, newStatus: TicketStatus) => {
    // Optimistic update
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t
      )
    )
    if (selectedTicket?.id === id) {
      setSelectedTicket((prev) => prev ? { ...prev, status: newStatus } : prev)
    }

    try {
      setUpdatingId(id)
      await updateTicketStatus(id, newStatus)
    } catch (err: unknown) {
      // Revert on failure
      setError(`Failed to update status: ${err instanceof Error ? err.message : 'Unknown error'}`)
      fetchTickets()
    } finally {
      setUpdatingId(null)
    }
  }

  // ─── Delete (persisted) ───────────────────────────────────────────────────
  const handleDeleteTicket = async (id: number) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return

    // Optimistic remove
    setTickets((prev) => prev.filter((t) => t.id !== id))
    if (selectedTicket?.id === id) setSelectedTicket(null)

    try {
      setDeletingId(id)
      await deleteTicket(id)
    } catch (err: unknown) {
      setError(`Failed to delete ticket: ${err instanceof Error ? err.message : 'Unknown error'}`)
      fetchTickets() // re-sync
    } finally {
      setDeletingId(null)
    }
  }

  // ─── CSV Export ───────────────────────────────────────────────────────────
  const exportToCSV = () => {
    const headers = ["Ticket ID", "Client Email", "Subject", "Category", "Status", "Priority", "Created At"]
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      tickets
        .map(
          (t) =>
            `${t.id},"${t.clientName}","${t.subject}",${t.category},${t.status},${t.priority},${t.created_at}`
        )
        .join("\n")

    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", "support_tickets.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ─── Filtered list ────────────────────────────────────────────────────────
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(ticket.id).includes(searchQuery)
  )

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
              <LifeBuoy className="text-teal-500" size={36} />
              Support Operations
            </h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2">
              <Activity size={14} className="text-teal-500" />
              Monitoring client issues and architectural requests
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchTickets}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-bold hover:bg-neutral-800 transition text-white disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "↻"} Refresh
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-bold hover:bg-neutral-800 transition text-white"
            >
              <Download size={16} /> Export CSV
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
            <div
              key={i}
              className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] relative overflow-hidden"
            >
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
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded
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

        {/* ── Ticket Table ───────────────────────────────────────────────── */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden shadow-2xl">

          {/* Toolbar */}
          <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Client Support Queue
              </span>
              <span className="text-[10px] font-mono text-neutral-600">
                {filteredTickets.length} tickets
              </span>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search tickets, clients..."
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="border-b border-neutral-900 text-[9px] uppercase tracking-[0.2em] text-neutral-600 bg-black/20">
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[100px]">Ticket ID</th>
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[220px]">Client</th>
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-auto">Subject</th>
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[120px]">Category</th>
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[150px]">Status</th>
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[120px]">Date</th>
                  <th className="px-8 py-4 font-black w-[80px]"></th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {loading ? (
                  // Skeleton rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-neutral-900/50">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-8 py-5 border-r border-neutral-900/30">
                          <div className="h-3 bg-neutral-800 rounded animate-pulse w-3/4" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-12 text-center text-neutral-500 font-sans">
                      No tickets found.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-neutral-900/50 hover:bg-white/[0.02] transition-colors group font-mono"
                    >
                      {/* ID */}
                      <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-500">
                        #{ticket.id}
                      </td>

                      {/* Client email */}
                      <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-300 font-sans font-medium">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-5 h-5 shrink-0 rounded-full bg-neutral-800 flex items-center justify-center text-[9px] text-teal-500">
                            {ticket.clientName.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate text-xs" title={ticket.clientName}>
                            {ticket.clientName}
                          </span>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-8 py-4 border-r border-neutral-900/30 text-white font-sans truncate">
                        {ticket.subject}
                      </td>

                      {/* Category */}
                      <td className="px-8 py-4 border-r border-neutral-900/30">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-[9px] font-bold uppercase tracking-wider">
                          {formatEnum(ticket.category)}
                        </span>
                      </td>

                      {/* Status dropdown */}
                      <td className="px-8 py-4 border-r border-neutral-900/30">
                        <div className="relative flex items-center gap-1">
                          {updatingId === ticket.id && (
                            <Loader2 size={10} className="animate-spin text-teal-500 shrink-0" />
                          )}
                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(Number(ticket.id), e.target.value as TicketStatus)}
                            disabled={updatingId === ticket.id}
                            className={`bg-transparent border-none outline-none font-bold text-[9px] uppercase tracking-widest cursor-pointer px-2 py-1 rounded w-full disabled:opacity-60
                              ${ticket.status === "resolved" ? "text-emerald-500 bg-emerald-500/10" :
                                ticket.status === "open" ? "text-rose-500 bg-rose-500/10" :
                                ticket.status === "in_progress" ? "text-amber-500 bg-amber-500/10" :
                                "text-neutral-400 bg-neutral-800"}`}
                          >
                            <option value="open" className="bg-[#080808] text-rose-500">OPEN</option>
                            <option value="in_progress" className="bg-[#080808] text-amber-500">IN PROGRESS</option>
                            <option value="resolved" className="bg-[#080808] text-emerald-500">RESOLVED</option>
                            <option value="closed" className="bg-[#080808] text-neutral-400">CLOSED</option>
                          </select>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-500">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="text-neutral-600 hover:text-teal-500 transition-colors p-1"
                            title="View Ticket"
                          >
                            <MessageSquare size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTicket(Number(ticket.id))}
                            disabled={deletingId === ticket.id}
                            className="text-neutral-600 hover:text-rose-500 transition-colors p-1 disabled:opacity-40"
                            title="Delete Ticket"
                          >
                            {deletingId === ticket.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Ticket Detail Modal ────────────────────────────────────────── */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#080808] border border-neutral-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">

              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/30">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-teal-500 font-mono text-sm font-bold shrink-0">
                    #{selectedTicket.id}
                  </span>
                  <h2 className="text-white font-bold text-lg truncate">{selectedTicket.subject}</h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-neutral-500 hover:text-white transition-colors p-1 bg-neutral-900 rounded-md border border-neutral-800 shrink-0 ml-4"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-900/20 border border-neutral-800/50">
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider block mb-1">Client</span>
                    <span className="text-xs text-neutral-200 font-mono break-all">{selectedTicket.clientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider block mb-1">Category</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                      {formatEnum(selectedTicket.category)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider block mb-1">Status</span>
                    <div className="flex items-center gap-1">
                      {updatingId === selectedTicket.id && (
                        <Loader2 size={10} className="animate-spin text-teal-500" />
                      )}
                      <select
                        value={selectedTicket.status}
                        onChange={(e) =>
                          handleStatusChange(Number(selectedTicket.id), e.target.value as TicketStatus)
                        }
                        disabled={updatingId === selectedTicket.id}
                        className={`bg-transparent border-none outline-none font-bold text-[10px] uppercase tracking-widest cursor-pointer px-2 py-1 -ml-2 rounded disabled:opacity-60
                          ${selectedTicket.status === "resolved" ? "text-emerald-500 hover:bg-emerald-500/10" :
                            selectedTicket.status === "open" ? "text-rose-500 hover:bg-rose-500/10" :
                            selectedTicket.status === "in_progress" ? "text-amber-500 hover:bg-amber-500/10" :
                            "text-neutral-400 hover:bg-neutral-800"}`}
                      >
                        <option value="open" className="bg-[#080808] text-rose-500">OPEN</option>
                        <option value="in_progress" className="bg-[#080808] text-amber-500">IN PROGRESS</option>
                        <option value="resolved" className="bg-[#080808] text-emerald-500">RESOLVED</option>
                        <option value="closed" className="bg-[#080808] text-neutral-400">CLOSED</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider block mb-1">Priority</span>
                    <span
                      className={`text-sm font-medium capitalize
                        ${selectedTicket.priority === "urgent" ? "text-purple-400 animate-pulse" :
                          selectedTicket.priority === "high" ? "text-rose-400" :
                          selectedTicket.priority === "medium" ? "text-amber-400" : "text-emerald-400"}`}
                    >
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Original Issue</h3>
                  <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-5 text-sm text-neutral-300 leading-relaxed font-sans">
                    {selectedTicket.description || "No description provided."}
                  </div>
                </div>

                {/* Attachment */}
                {selectedTicket.attachment_url && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Attachments</h3>
                    <a
                      href={selectedTicket.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-medium text-teal-400 hover:bg-neutral-800 transition-colors"
                    >
                      <Paperclip size={14} /> View Attachment
                    </a>
                  </div>
                )}

                {/* Reply area (UI only — extend when reply action is added) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Add Response</h3>
                  <textarea
                    placeholder="Type your reply to the client..."
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-teal-500/50 transition-colors min-h-[120px] resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/30 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Created: {new Date(selectedTicket.created_at).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-600 font-mono">
                    Updated: {new Date(selectedTicket.updated_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button className="px-5 py-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-lg text-xs font-bold hover:bg-teal-500/20 hover:text-teal-300 transition shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}