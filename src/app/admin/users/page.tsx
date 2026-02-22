"use client";

import React, { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import {
  Search, Filter, Clock, CheckCircle2,
  User, MessageSquare, UserPlus, X, Download,
  CreditCard, Activity, MoreVertical, ShieldCheck,
  ArrowUpRight, Calendar, Layers, Hash, Check
} from "lucide-react";

// --- Configuration ---
const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending Review", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  processing: { label: "Processing", color: "text-teal-400", bg: "bg-teal-400/10 border-teal-400/20" },
  completed: { label: "Delivered", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  cancelled: { label: "Cancelled", color: "text-neutral-500", bg: "bg-neutral-800 border-neutral-700" },
};

export default function OrderCommandCenter() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]); // New: To store staff list
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false); // New: UI toggle for assignment list

  // --- Real Database Fetch ---
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch Orders with order_items
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          id, total_amount, created_at, user_id,
          order_items (
            id, stack_id, status, progress_percent, assigned_to
          )
        `)
        .order('created_at', { ascending: false });

      if (orderError) {
        console.error('Error fetching orders:', orderError);
      }

      if (orderData && orderData.length > 0) {
        // Get unique user IDs for profiles
        const userIds = [...new Set(orderData.map(o => o.user_id))];
        
        // Get unique stack IDs for stack names
        const stackIds = [...new Set(
          orderData.flatMap(o => 
            o.order_items?.map((item: { stack_id: string }) => item.stack_id) || []
          ).filter(Boolean)
        )];

        // Fetch profiles
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, name')
          .in('user_id', userIds);

        // Fetch stacks
        const { data: stacksData } = await supabase
          .from('stacks')
          .select('id, name')
          .in('id', stackIds);

        // Create a map for quick lookup
        const stacksMap = new Map(stacksData?.map(s => [s.id, s.name]) || []);

        // Merge profiles and stack names into orders
        const ordersWithData = orderData.map(order => ({
          ...order,
          profile: profilesData?.find(p => p.user_id === order.user_id) || null,
          order_items: order.order_items?.map((item: { stack_id: string; id: string; status: string; progress_percent: number; assigned_to: string }) => ({
            ...item,
            stack_name: stacksMap.get(item.stack_id) || null
          })) || []
        }));

        setOrders(ordersWithData);
      } else {
        setOrders(orderData || []);
      }

      // Fetch Employees for assignment
      const { data: empData } = await supabase
        .from('employees')
        .select('id, name, role');

      if (empData) setEmployees(empData);
      setLoading(false);
    }

    fetchData();
  }, []);

  // --- Logic: Assign Employee ---
  const handleAssign = async (itemId: string, employeeId: string) => {
    // 1. Update order_items.assigned_to
    const { error } = await supabase
      .from('order_items')
      .update({ assigned_to: employeeId, status: 'processing' })
      .eq('id', itemId);

    if (!error) {
      // 2. Also insert into employee_assignments to keep both tables in sync
      await supabase
        .from('employee_assignments')
        .upsert({
          employee_id: employeeId,
          order_item_id: itemId,
          status: 'assigned',
        }, { onConflict: 'employee_id,order_item_id' });

      // Update local state without refreshing the whole page
      setOrders(prev => prev.map(order => ({
        ...order,
        order_items: order.order_items.map((item: any) =>
          item.id === itemId ? { ...item, assigned_to: employeeId, status: 'processing' } : item
        )
      })));
      setIsAssigning(false);
    }
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">

      {/* 1. TOP GLOBAL NAVIGATION (UNTOUCHED) */}
      <nav className="h-20 border-b border-neutral-900 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
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
              placeholder="Search ID or Customer..."
              className="bg-neutral-900/50 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm w-72 focus:ring-1 ring-teal-500 outline-none transition-all"
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 transition">
            <Activity size={18} />
          </button>
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA (UNTOUCHED) */}
      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">User Management</h1>
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

        {/* Overview Cards (UNTOUCHED) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Revenue", value: `₹${orders.reduce((acc, curr) => acc + curr.total_amount, 0).toLocaleString()}`, icon: CreditCard, change: "Live" },
            { label: "Active Orders", value: orders.length.toString(), icon: Clock, change: "Current" },
            { label: "Deployed", value: "99%", icon: CheckCircle2, change: "Health" },
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

        {/* Main Orders Table (UNTOUCHED Logic) */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-900/30 border-b border-neutral-900">
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none"><div className="flex items-center gap-2"><Hash size={12} /> Order ID</div></th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none"><div className="flex items-center gap-2"><User size={12} /> Customer</div></th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none"><div className="flex items-center gap-2"><Layers size={12} /> Stack</div></th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none"><div className="flex items-center gap-2"><CreditCard size={12} /> Amount</div></th>
                  <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {loading ? (
                  <tr><td colSpan={6} className="p-20 text-center animate-pulse">Loading secure data...</td></tr>
                ) : (
                  orders.map((order) => {
                    const firstItem = order.order_items?.[0];
                    const statusKey = firstItem?.status || 'pending';
                    const userName = order.profile?.name || 'Unknown User';
                    const stackName = firstItem?.stack_name || 'Custom Stack';
                    const stackCount = order.order_items?.length || 0;
                    
                    return (
                      <tr key={order.id} onClick={() => setSelectedOrderId(order.id)} className="group hover:bg-teal-500/[0.03] transition-all cursor-pointer">
                        <td className="px-8 py-7">
                          <p className="text-white font-mono font-bold text-sm">{order.id.slice(0, 8)}</p>
                          <p className="text-[11px] text-neutral-600 mt-1 flex items-center gap-1"><Calendar size={10} /> {new Date(order.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-8 py-7">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-neutral-800 flex items-center justify-center text-xs font-bold text-teal-500 uppercase">
                              {userName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-neutral-200">{userName}</p>
                              <p className="text-xs text-neutral-500 font-mono">{order.user_id?.slice(0, 12)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-7">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-[11px] font-bold text-neutral-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            {stackName}
                          </div>
                          {stackCount > 1 && (
                            <p className="text-[10px] text-neutral-600 mt-1">+{stackCount - 1} more stacks</p>
                          )}
                        </td>
                        <td className="px-8 py-7"><p className="text-sm font-bold text-white font-mono tracking-tight">₹{order.total_amount.toLocaleString()}</p></td>
                        <td className="px-8 py-7">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${statusConfig[statusKey]?.bg} ${statusConfig[statusKey]?.color}`}>
                            {statusConfig[statusKey]?.label}
                          </span>
                        </td>
                        <td className="px-8 py-7 text-right">
                          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-teal-500 transition-all group-hover:text-black">
                            <ArrowUpRight size={14} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 3. ORDER DETAIL DRAWER (MODIFIED FOR ASSIGNMENT) */}
      {selectedOrderId && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => { setSelectedOrderId(null); setIsAssigning(false); }} />
          <aside className="relative w-full max-w-xl bg-[#080808] border-l border-neutral-900 h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">

            <div className="p-8 border-b border-neutral-900 flex justify-between items-center bg-[#0a0a0a]">
              <div>
                <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">Deployment Profile</span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedOrder.id.slice(0, 8)}</h3>
              </div>
              <button onClick={() => { setSelectedOrderId(null); setIsAssigning(false); }} className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Live Status</h5>
                  <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-1 rounded font-bold">{selectedOrder.order_items?.[0]?.progress_percent || 0}% Complete</span>
                </div>
                <div className="h-2 w-full bg-neutral-900 rounded-full mb-8 overflow-hidden">
                  <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${selectedOrder.order_items?.[0]?.progress_percent || 0}%` }} />
                </div>
              </section>

              {/* EMPLOYEE ASSIGNMENT SECTION (Embedded in your Grid) */}
              <section className="space-y-4">
                <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Resource Allocation</h5>

                {isAssigning ? (
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 space-y-2 animate-in fade-in zoom-in duration-300">
                    <p className="text-[10px] font-black text-neutral-600 uppercase mb-4 tracking-widest">Select Personnel</p>
                    <div className="grid gap-2 max-h-48 overflow-y-auto pr-2">
                      {employees.map((emp) => (
                        <button
                          key={emp.id}
                          onClick={() => handleAssign(selectedOrder.order_items[0].id, emp.id)}
                          className="flex items-center justify-between p-4 bg-black border border-neutral-800 rounded-xl hover:border-teal-500 group transition-all"
                        >
                          <div className="text-left">
                            <p className="text-sm font-bold text-white group-hover:text-teal-400">{emp.name}</p>
                            <p className="text-[10px] text-neutral-500">{emp.role}</p>
                          </div>
                          <Check size={16} className="text-neutral-800 group-hover:text-teal-500" />
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setIsAssigning(false)} className="w-full mt-2 py-2 text-[10px] font-bold text-neutral-600 hover:text-white uppercase">Cancel</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setIsAssigning(true)}
                      className="flex items-center justify-center gap-2 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition"
                    >
                      <UserPlus size={16} />
                      {selectedOrder.order_items?.[0]?.assigned_to ? "Change Team" : "Assign Team"}
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition">
                      <MoreVertical size={16} /> Order Actions
                    </button>
                  </div>
                )}

                {/* Show current assignee info if exists */}
                {selectedOrder.order_items?.[0]?.assigned_to && !isAssigning && (
                  <div className="flex items-center gap-3 p-4 bg-teal-500/5 border border-teal-500/20 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-500"><User size={14} /></div>
                    <div>
                      <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest leading-none">Assigned To</p>
                      <p className="text-sm font-bold text-white mt-1">
                        {employees.find(e => e.id === selectedOrder.order_items[0].assigned_to)?.name || "External Agent"}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-neutral-900/30 border border-neutral-800 rounded-[28px] p-8 space-y-6">
                <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Billing Details</h5>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Order Reference</span>
                    <span className="text-white font-mono">{selectedOrder.id}</span>
                  </div>
                  <div className="pt-6 border-t border-neutral-900 flex justify-between items-center">
                    <span className="text-white font-bold">Total Amount</span>
                    <span className="text-3xl font-bold text-teal-400 font-mono tracking-tighter">₹{selectedOrder.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}