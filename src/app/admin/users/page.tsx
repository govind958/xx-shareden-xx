"use client";

import React, { useState } from "react";
import { 
  Search, Filter, Clock, CheckCircle2, 
  User, MessageSquare, UserPlus, X, Download, 
  CreditCard, Activity, MoreVertical, ShieldCheck,
  ArrowUpRight, Calendar, Layers, Hash
} from "lucide-react";

// --- Types & Configuration ---
const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending Review", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  processing: { label: "Processing", color: "text-teal-400", bg: "bg-teal-400/10 border-teal-400/20" },
  completed: { label: "Delivered", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  cancelled: { label: "Cancelled", color: "text-neutral-500", bg: "bg-neutral-800 border-neutral-700" },
};

export default function OrderCommandCenter() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const orders = [
    { id: "ORD-9928", customer: "Anuj Pal", email: "anuj@gmail.com", stack: "FullStack Pro", amount: 15048, status: "processing", date: "Dec 23, 2025" },
    { id: "ORD-9927", customer: "Govind Anand", email: "govind@gmail.com", stack: "SaaS Starter", amount: 2029, status: "completed", date: "Dec 22, 2025" },
    { id: "ORD-9925", customer: "Ashok Singh", email: "ashok@gmail.com", stack: "AI Module", amount: 8500, status: "pending", date: "Dec 21, 2025" },
  ];

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      
      {/* 1. TOP GLOBAL NAVIGATION */}
      <nav className="h-20 border-b border-neutral-900 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            
            
          </div>
          <div className="h-6 w-px bg-neutral-800 hidden md:block" />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button className="text-teal-400 border-b-2 border-teal-500 py-7">Orders</button>
            <button className="hover:text-neutral-200 transition py-7">Customers</button>
            <button className="hover:text-neutral-200 transition py-7">Analytics</button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-teal-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search ID, email, or stack..." 
              className="bg-neutral-900/50 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm w-72 focus:ring-1 ring-teal-500 outline-none transition-all"
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 transition">
            <Activity size={18} />
          </button>
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Order Management</h1>
            <p className="text-neutral-500 mt-2 flex items-center gap-2">
              <Clock size={14} /> Active monitoring for <span className="text-neutral-200 font-medium">{orders.length} deployments</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-bold hover:bg-neutral-800 transition">
              <Filter size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-black font-bold rounded-xl text-sm hover:bg-teal-500 transition shadow-lg shadow-teal-500/10">
              <Download size={16} /> Export Report
            </button>
          </div>
        </div>

        {/* High-Level Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Revenue", value: "₹24,850", icon: CreditCard, change: "+14%" },
            { label: "Pending", value: "08", icon: Clock, change: "Low" },
            { label: "Deployed", value: "1,240", icon: CheckCircle2, change: "99%" },
            { label: "Stack Health", value: "Perfect", icon: ShieldCheck, change: "Active" },
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

        {/* Main Orders Table */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-900/30 border-b border-neutral-900">
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none"><div className="flex items-center gap-2"><Hash size={12}/> Order ID</div></th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none"><div className="flex items-center gap-2"><User size={12}/> Customer</div></th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none"><div className="flex items-center gap-2"><Layers size={12}/> Stack</div></th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none"><div className="flex items-center gap-2"><CreditCard size={12}/> Amount</div></th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrderId(order.id)}
                    className="group hover:bg-teal-500/[0.03] transition-all cursor-pointer"
                  >
                    <td className="px-8 py-7">
                      <p className="text-white font-mono font-bold text-sm">{order.id}</p>
                      <p className="text-[11px] text-neutral-600 mt-1 flex items-center gap-1"><Calendar size={10}/> {order.date}</p>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-neutral-800 flex items-center justify-center text-xs font-bold text-teal-500 group-hover:border-teal-500/50 transition-colors">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-200">{order.customer}</p>
                          <p className="text-xs text-neutral-500 lowercase">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-[11px] font-bold text-neutral-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        {order.stack}
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <p className="text-sm font-bold text-white font-mono tracking-tight">₹{order.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-7">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${statusConfig[order.status].bg} ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-8 py-7 text-right">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-teal-500 transition-all group-hover:text-black">
                        <ArrowUpRight size={14} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 3. ORDER DETAIL DRAWER */}
      {selectedOrderId && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setSelectedOrderId(null)} />
          <aside className="relative w-full max-w-xl bg-[#080808] border-l border-neutral-900 h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
            
            <div className="p-8 border-b border-neutral-900 flex justify-between items-center bg-[#0a0a0a]">
              <div>
                <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">Deployment Profile</span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedOrder.id}</h3>
              </div>
              <button onClick={() => setSelectedOrderId(null)} className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              
              {/* Timeline Progress */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Provisioning Status</h5>
                  <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-1 rounded font-bold">75% Complete</span>
                </div>
                <div className="h-2 w-full bg-neutral-900 rounded-full mb-8 overflow-hidden">
                  <div className="h-full bg-teal-500 w-3/4 shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
                </div>
                <div className="space-y-6">
                  {[
                    { label: "Payment Verification", status: "Success", time: "10:02 AM" },
                    { label: "Infrastructure Build", status: "Success", time: "10:15 AM" },
                    { label: "SSL & Domain Mapping", status: "Running", time: "In Progress" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        {step.status === "Success" ? <CheckCircle2 size={16} className="text-teal-500" /> : <div className="w-4 h-4 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />}
                        <span className={step.status === "Success" ? "text-neutral-300" : "text-white font-bold"}>{step.label}</span>
                      </div>
                      <span className="text-xs text-neutral-600 font-mono">{step.time}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Order Breakdown */}
              <section className="bg-neutral-900/30 border border-neutral-800 rounded-[28px] p-8 space-y-6">
                <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Invoice Breakdown</h5>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">{selectedOrder.stack}</span>
                    <span className="text-white font-mono">₹12,000.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Add-on: AI Engine</span>
                    <span className="text-white font-mono">₹3,048.00</span>
                  </div>
                  <div className="pt-6 border-t border-neutral-800 flex justify-between items-center">
                    <span className="text-white font-bold">Total Disbursed</span>
                    <span className="text-3xl font-bold text-teal-400 font-mono tracking-tighter">₹{selectedOrder.amount.toLocaleString()}</span>
                  </div>
                </div>
              </section>

              {/* Admin Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition">
                  <UserPlus size={16} /> Assign Team
                </button>
                <button className="flex items-center justify-center gap-2 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition">
                  <MoreVertical size={16} /> Order Actions
                </button>
              </div>

              {/* Internal Messaging */}
              <section className="space-y-4">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={14} /> Internal Communication
                </label>
                <div className="relative group">
                  <textarea 
                    placeholder="Type a message to the customer or internal team..." 
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 text-sm outline-none focus:ring-1 ring-teal-500 min-h-[120px] transition-all"
                  />
                  <button className="absolute bottom-4 right-4 px-4 py-2 bg-teal-600 text-black font-bold rounded-xl text-xs hover:bg-teal-500 transition">
                    Send Update
                  </button>
                </div>
              </section>

            </div>
          </aside>
        </div>
      )}
    </div>
  );
}