"use client"
import React, { useState, useEffect, useCallback } from "react"
import {
  Activity, Download, Search, AlertCircle, 
  CheckCircle2, Filter, X, Loader2, CreditCard, 
  DollarSign, XCircle, Clock, RefreshCw, FileText,
  ArrowRightLeft
} from "lucide-react"
import { toast } from "sonner"
import {
  getAdminPayments,
  adminRefundPayment,
  type AdminPaymentRecord,
  type PaymentStatus,
} from "@/src/modules/admin/payments/action"

export default function PaymentsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'canceled'>('all');
  const [payments, setPayments] = useState<AdminPaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Loading & Action states
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminPayments();
      if ("error" in res) {
        setError(res.error);
        setPayments([]);
      } else {
        setPayments(res.payments);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) fetchData();
  }, [mounted, fetchData]);

  // ─── Handlers ───────────────────────────────────────────────
  const handleRefund = async (id: string) => {
    if (!confirm("Are you sure you want to initiate a refund for this transaction?")) return;
    setActionId(id);
    const res = await adminRefundPayment(id);
    setActionId(null);
    if ("error" in res) {
      toast.error(res.error);
      return;
    }
    toast.success("Refund completed");
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "refunded" as const } : p))
    );
  };

  const handleDownloadInvoice = (orderId: string) => {
    const p = payments.find((x) => x.id === orderId);
    toast.success(
      p
        ? `Invoice: order ${orderId.slice(0, 8)}… · ${p.transactionId}`
        : `Order ${orderId.slice(0, 8)}…`
    );
  };

  // ─── Derived Data ───────────────────────────────────────────
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && payment.status === activeTab;
  });

  const handleExportCsv = () => {
    const rows = filteredPayments;
    if (rows.length === 0) {
      toast.message("No rows to export for the current filters.");
      return;
    }
    const esc = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
    const header = [
      "order_id",
      "transaction_id",
      "customer_name",
      "customer_email",
      "amount",
      "method",
      "status",
      "created_at",
    ];
    const lines = [
      header.join(","),
      ...rows.map((p) =>
        [
          p.id,
          esc(p.transactionId),
          esc(p.customerName),
          esc(p.customerEmail),
          p.amount,
          esc(p.method),
          p.status,
          esc(p.date),
        ].join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV");
  };

  // Calculate stats
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const completedCount = payments.filter(p => p.status === 'completed').length;
  const canceledCount = payments.filter(p => p.status === 'canceled').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;

  const stats = [
    { label: "Total Revenue", val: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, trend: "+12.5% this month", status: "Healthy" },
    { label: "Successful Payments", val: completedCount, icon: CheckCircle2, trend: "98% success rate", status: "Healthy" },
    { label: "Canceled/Failed", val: canceledCount, icon: XCircle, trend: "-2% from yesterday", status: "Critical" },
    { label: "Pending Processing", val: pendingCount, icon: Clock, trend: "Awaiting gateway", status: "Neutral" },
  ];

  // Helper for status styling
  const getStatusStyles = (status: PaymentStatus) => {
    switch(status) {
      case 'completed': return "bg-emerald-500/10 border-emerald-500/30 text-emerald-500";
      case 'canceled': return "bg-rose-500/10 border-rose-500/30 text-rose-500";
      case 'pending': return "bg-amber-500/10 border-amber-500/30 text-amber-500";
      case 'refunded': return "bg-neutral-500/10 border-neutral-500/30 text-neutral-400";
      default: return "bg-neutral-800 border-neutral-700 text-neutral-400";
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />;

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
              <CreditCard className="text-teal-500" size={36} />
              Payment Operations
            </h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2">
              <Activity size={14} className="text-teal-500" />
              Monitoring transactions, settlements, and order payments
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-bold hover:bg-neutral-800 transition text-white disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Refresh
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={loading || filteredPayments.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-bold hover:bg-neutral-800 transition text-white disabled:opacity-50"
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
            <div key={i} className="bg-neutral-900/30 border border-neutral-800/60 p-6 rounded-[24px] relative overflow-hidden group hover:border-neutral-700 transition-colors">
              <div className="absolute top-6 right-6 text-neutral-800 group-hover:text-neutral-700 transition-colors">
                <item.icon size={32} />
              </div>
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">
                {item.label}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-4xl font-bold text-white tracking-tighter">
                  {loading ? (
                    <span className="inline-block w-20 h-8 bg-neutral-800 animate-pulse rounded" />
                  ) : (
                    item.val
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
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 pb-1 border-b-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'all'
                    ? 'border-teal-500 text-teal-500'
                    : 'border-transparent text-neutral-600 hover:text-neutral-400'
                  }`}
              >
                <ArrowRightLeft size={14} /> All Transactions
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex items-center gap-2 pb-1 border-b-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'completed'
                    ? 'border-emerald-500 text-emerald-500'
                    : 'border-transparent text-neutral-600 hover:text-neutral-400'
                  }`}
              >
                <CheckCircle2 size={14} /> Completed
                {completedCount > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] ${activeTab === 'completed' ? 'bg-emerald-500/20' : 'bg-neutral-800'}`}>
                    {completedCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('canceled')}
                className={`flex items-center gap-2 pb-1 border-b-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'canceled'
                    ? 'border-rose-500 text-rose-500'
                    : 'border-transparent text-neutral-600 hover:text-neutral-400'
                  }`}
              >
                <XCircle size={14} /> Canceled
                {canceledCount > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] ${activeTab === 'canceled' ? 'bg-rose-500/20' : 'bg-neutral-800'}`}>
                    {canceledCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search order ID, email..."
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
            <table className="w-full text-left border-collapse table-fixed min-w-[1100px]">
              <thead>
                <tr className="border-b border-neutral-900 text-[9px] uppercase tracking-[0.2em] text-neutral-600 bg-black/20">
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[180px]">Transaction ID</th>
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[240px]">Customer</th>
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[140px]">Amount</th>
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[140px]">Method</th>
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[120px]">Status</th>
                  <th className="px-8 py-4 font-black border-r border-neutral-900/50 w-[160px]">Date</th>
                  <th className="px-8 py-4 font-black w-[100px] text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="text-xs">
                {loading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-neutral-900/50">
                      <td colSpan={7} className="px-8 py-5">
                        <div className="h-4 bg-neutral-900/50 rounded animate-pulse w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-16 text-center text-neutral-500 font-sans">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={32} className="text-neutral-800" />
                        <p>No transactions found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-neutral-900/50 hover:bg-white/[0.02] transition-colors group font-mono">
                      {/* Transaction / Order ID */}
                      <td className="px-8 py-4 border-r border-neutral-900/30">
                        <div className="flex flex-col">
                          <span className="text-white text-xs">{payment.transactionId}</span>
                          <span className="text-[10px] text-neutral-600 mt-0.5">{payment.id}</span>
                        </div>
                      </td>
                      
                      {/* Customer Info */}
                      <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-300 font-sans font-medium">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 shrink-0 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] text-teal-500 font-bold">
                            {payment.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="truncate text-xs text-white" title={payment.customerName}>{payment.customerName}</span>
                            <span className="truncate text-[10px] text-neutral-500 font-mono" title={payment.customerEmail}>{payment.customerEmail}</span>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-8 py-4 border-r border-neutral-900/30">
                        <span className="text-white font-medium">
                          ₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-400 font-sans">
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-neutral-600" />
                          {payment.method}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-4 border-r border-neutral-900/30">
                        <span className={`px-2.5 py-1 rounded border text-[9px] font-bold uppercase tracking-wider ${getStatusStyles(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-8 py-4 border-r border-neutral-900/30 text-neutral-500">
                        <div className="flex flex-col">
                          <span>{new Date(payment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <span className="text-[9px] text-neutral-600 mt-0.5">
                            {new Date(payment.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDownloadInvoice(payment.id)}
                            className="text-neutral-500 hover:text-white transition-colors p-1"
                            title="Download Invoice"
                          >
                            <FileText size={16} />
                          </button>
                          
                          {payment.status === 'completed' && (
                            <button
                              onClick={() => handleRefund(payment.id)}
                              disabled={actionId === payment.id}
                              className="text-neutral-500 hover:text-amber-500 transition-colors p-1 disabled:opacity-40"
                              title="Issue Refund"
                            >
                              {actionId === payment.id ? (
                                <Loader2 size={16} className="animate-spin text-amber-500" />
                              ) : (
                                <RefreshCw size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}