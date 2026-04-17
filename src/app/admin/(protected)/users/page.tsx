"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from '@/utils/supabase/client';
import {
  assignEmployeeAndNotify,
  assignEmployeeToSubstack,
  assignEmployeeToWholeStack,
  unassignEmployeeFromSubstack,
} from "@/src/modules/admin/actions";
import {
  Search, Filter, Clock, CheckCircle2,
  User, UserPlus, X, Download,
  CreditCard, Activity,
  ArrowUpRight, Calendar, Layers, Hash, Check, Box
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending Review", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  initiated: { label: "Pending Review", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  processing: { label: "Processing", color: "text-teal-400", bg: "bg-teal-400/10 border-teal-400/20" },
  in_progress: { label: "In Progress", color: "text-teal-400", bg: "bg-teal-400/10 border-teal-400/20" },
  completed: { label: "Delivered", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  cancelled: { label: "Cancelled", color: "text-neutral-500", bg: "bg-neutral-800 border-neutral-700" },
};

interface SubstackAssignmentRow {
  id: string;
  order_item_id: string;
  sub_stack_id: string;
  employee_id: string;
  status: string;
}

interface OrderItem {
  id: string;
  stack_id: string;
  status: string;
  progress_percent: number;
  assigned_to: string | null;
  sub_stack_ids: string[] | null;
  stack_name?: string | null;
  _substack_names?: { id: string; name: string }[];
  _substack_assignments?: SubstackAssignmentRow[];
}

interface Order {
  id: string;
  total_amount?: number;
  created_at: string;
  user_id: string;
  order_items?: OrderItem[];
  profile?: { user_id: string; name?: string } | null;
}

interface Employee { id: string; name?: string; email?: string; role?: string; specialization?: string; }

export default function OrderCommandCenter() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [assigningTarget, setAssigningTarget] = useState<{
    orderItemId: string;
    subStackId: string;
  } | null>(null);
  const [assigningLegacyItemId, setAssigningLegacyItemId] = useState<string | null>(null);
  const [assigningWholeStackItemId, setAssigningWholeStackItemId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          id, total_amount, created_at, user_id,
          order_items (
            id, stack_id, status, progress_percent, assigned_to, sub_stack_ids
          )
        `)
        .order('created_at', { ascending: false });

      if (orderError) {
        console.error('Error fetching orders:', orderError);
      }

      if (orderData && orderData.length > 0) {
        const userIds = [...new Set(orderData.map(o => o.user_id))];

        const stackIds = [...new Set(
          orderData.flatMap(o =>
            o.order_items?.map((item: { stack_id: string }) => item.stack_id) || []
          ).filter(Boolean)
        )] as string[];

        const orderItemIds = orderData.flatMap(o =>
          o.order_items?.map((item: { id: string }) => item.id) || []
        );

        const allSubStackIds = [...new Set(
          orderData.flatMap(o =>
            (o.order_items || []).flatMap(
              (item: { sub_stack_ids?: string[] | null }) => item.sub_stack_ids || []
            )
          ).filter(Boolean)
        )] as string[];

        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, name')
          .in('user_id', userIds);

        const { data: stacksData } = await supabase
          .from('stacks')
          .select('id, name')
          .in('id', stackIds);

        const stacksMap = new Map(stacksData?.map(s => [s.id, s.name]) || []);

        let subStacksMap = new Map<string, string>();
        if (allSubStackIds.length > 0) {
          const { data: subStacksData } = await supabase
            .from('sub_stacks')
            .select('id, name')
            .in('id', allSubStackIds);
          subStacksMap = new Map(subStacksData?.map(s => [s.id, s.name]) || []);
        }

        let subAssignments: SubstackAssignmentRow[] = [];
        if (orderItemIds.length > 0) {
          const { data: sa } = await supabase
            .from('substack_assignments')
            .select('id, order_item_id, sub_stack_id, employee_id, status')
            .in('order_item_id', orderItemIds);
          subAssignments = (sa || []) as SubstackAssignmentRow[];
        }

        const ordersWithData = orderData.map(order => ({
          ...order,
          profile: profilesData?.find(p => p.user_id === order.user_id) || null,
          order_items: order.order_items?.map((item: OrderItem) => {
            const mine = subAssignments.filter(a => a.order_item_id === item.id);
            return {
              ...item,
              stack_name: stacksMap.get(item.stack_id) || null,
              _substack_names: (item.sub_stack_ids || []).map(sid => ({
                id: sid,
                name: subStacksMap.get(sid) || 'Module',
              })),
              _substack_assignments: mine,
            };
          }) || []
        }));

        setOrders(ordersWithData as Order[]);
      } else {
        setOrders(orderData || []);
      }

      const { data: empData } = await supabase
        .from('employees')
        .select('id, name, role');

      if (empData) setEmployees(empData);
      setLoading(false);
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAssignLegacy = async (itemId: string, employeeId: string) => {
    const result = await assignEmployeeAndNotify(employeeId, itemId);
    if (result.error) {
      alert(`Error: ${result.error}`);
      return;
    }
    setOrders(prev => prev.map(order => ({
      ...order,
      order_items: order.order_items?.map((item: OrderItem) =>
        item.id === itemId ? { ...item, assigned_to: employeeId, status: 'processing' } : item
      ) ?? []
    })));
    setAssigningLegacyItemId(null);
  };

  const handleAssignSubstack = async (
    orderItemId: string,
    subStackId: string,
    employeeId: string
  ) => {
    const result = await assignEmployeeToSubstack(employeeId, orderItemId, subStackId);
    if ('error' in result && result.error) {
      alert(`Error: ${result.error}`);
      return;
    }
    const row =
      'assignment' in result && result.assignment
        ? (result.assignment as SubstackAssignmentRow)
        : null;
    if (!row) {
      setAssigningTarget(null);
      return;
    }

    setOrders(prev => prev.map(order => ({
      ...order,
      order_items: order.order_items?.map((item: OrderItem) => {
        if (item.id !== orderItemId) return item;
        const next = [...(item._substack_assignments || [])];
        const idx = next.findIndex(a => a.sub_stack_id === subStackId);
        if (idx >= 0) next[idx] = row;
        else next.push(row);
        return {
          ...item,
          status: item.status === 'initiated' ? 'processing' : item.status,
          _substack_assignments: next,
        };
      }) ?? []
    })));

    setAssigningTarget(null);
  };

  const handleUnassignSubstack = async (assignmentId: string) => {
    const result = await unassignEmployeeFromSubstack(assignmentId);
    if (result.error) {
      alert(`Error: ${result.error}`);
      return;
    }
    setOrders(prev => prev.map(order => ({
      ...order,
      order_items: order.order_items?.map((item: OrderItem) => ({
        ...item,
        _substack_assignments: (item._substack_assignments || []).filter(a => a.id !== assignmentId),
      })) ?? []
    })));
  };

  const handleAssignWholeStack = async (orderItemId: string, employeeId: string) => {
    const result = await assignEmployeeToWholeStack(employeeId, orderItemId);
    if ('error' in result && result.error) {
      alert(`Error: ${result.error}`);
      return;
    }
    const rows = ('assignments' in result ? result.assignments : []) as SubstackAssignmentRow[];
    setOrders(prev => prev.map(order => ({
      ...order,
      order_items: order.order_items?.map((item: OrderItem) => {
        if (item.id !== orderItemId) return item;
        const next = [...(item._substack_assignments || [])];
        for (const row of rows) {
          const idx = next.findIndex(a => a.sub_stack_id === row.sub_stack_id);
          if (idx >= 0) next[idx] = row;
          else next.push(row);
        }
        return {
          ...item,
          status: item.status === 'initiated' ? 'processing' : item.status,
          _substack_assignments: next,
        };
      }) ?? []
    })));
    setAssigningWholeStackItemId(null);
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const drawerProgress = useMemo(() => {
    if (!selectedOrder?.order_items?.length) return 0;
    const sum = selectedOrder.order_items.reduce((acc, i) => acc + (i.progress_percent || 0), 0);
    return Math.round(sum / selectedOrder.order_items.length);
  }, [selectedOrder]);

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">

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

      <main className="max-w-[1600px] mx-auto p-8 lg:p-12 space-y-10">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Revenue", value: `₹${orders.reduce((acc, curr) => acc + (curr.total_amount ?? 0), 0).toLocaleString()}`, icon: CreditCard, change: "Live" },
            { label: "Active Orders", value: orders.length.toString(), icon: Clock, change: "Current" },
            { label: "Processing Orders", value: orders.reduce((acc, o) => acc + ((o.order_items?.filter((i: OrderItem) => i.status === 'processing' || i.status === 'in_progress').length) || 0), 0).toString(), icon: Clock, change: "Active" },
            { label: "Completed Orders", value: orders.reduce((acc, o) => acc + ((o.order_items?.filter((i: OrderItem) => i.status === 'completed').length) || 0), 0).toString(), icon: CheckCircle2, change: "Done" },
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
                        <td className="px-8 py-7"><p className="text-sm font-bold text-white font-mono tracking-tight">₹{(order.total_amount ?? 0).toLocaleString()}</p></td>
                        <td className="px-8 py-7">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${statusConfig[statusKey]?.bg || statusConfig.pending.bg} ${statusConfig[statusKey]?.color || statusConfig.pending.color}`}>
                            {statusConfig[statusKey]?.label || statusKey}
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

      {selectedOrderId && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => { setSelectedOrderId(null); setAssigningTarget(null); setAssigningLegacyItemId(null); setAssigningWholeStackItemId(null); }} />
          <aside className="relative w-full max-w-xl bg-[#080808] border-l border-neutral-900 h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">

            <div className="p-8 border-b border-neutral-900 flex justify-between items-center bg-[#0a0a0a]">
              <div>
                <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.3em]">Deployment Profile</span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedOrder.id.slice(0, 8)}</h3>
              </div>
              <button onClick={() => { setSelectedOrderId(null); setAssigningTarget(null); setAssigningLegacyItemId(null); setAssigningWholeStackItemId(null); }} className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 transition">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Live Status</h5>
                  <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-1 rounded font-bold">{drawerProgress}% Complete</span>
                </div>
                <div className="h-2 w-full bg-neutral-900 rounded-full mb-2 overflow-hidden">
                  <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${drawerProgress}%` }} />
                </div>
              </section>

              <section className="space-y-4">
                <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Resource allocation — modules</h5>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Assign each module (substack) to a team member. Different departments can own different modules on the same order line.
                </p>

                {selectedOrder.order_items?.map((item) => {
                  const modules = item._substack_names || [];
                  const hasModules = modules.length > 0;

                  return (
                    <div key={item.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <Layers size={16} className="text-teal-500" />
                        {item.stack_name || 'Stack'}
                        <span className="text-[10px] font-mono text-neutral-500 ml-auto">{item.id.slice(0, 8)}</span>
                      </div>

                      {!hasModules ? (
                        <div className="space-y-2">
                          <p className="text-[11px] text-neutral-500">No module breakdown on this line — assign the whole line item.</p>
                          {assigningLegacyItemId === item.id ? (
                            <div className="grid gap-2 max-h-40 overflow-y-auto">
                              {employees.map((emp) => (
                                <button
                                  key={emp.id}
                                  type="button"
                                  onClick={() => handleAssignLegacy(item.id, emp.id)}
                                  className="flex items-center justify-between p-3 bg-black border border-neutral-800 rounded-xl hover:border-teal-500 text-left"
                                >
                                  <span className="text-sm text-white">{emp.name}</span>
                                  <Check size={14} className="text-teal-500" />
                                </button>
                              ))}
                              <button type="button" onClick={() => setAssigningLegacyItemId(null)} className="text-[10px] text-neutral-500 uppercase">Cancel</button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setAssigningLegacyItemId(item.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold text-white hover:bg-neutral-800"
                            >
                              <UserPlus size={14} />
                              {item.assigned_to ? 'Change assignee' : 'Assign line item'}
                            </button>
                          )}
                          {item.assigned_to && (
                            <p className="text-xs text-teal-400">
                              {employees.find(e => e.id === item.assigned_to)?.name || 'Assigned'}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Assign All button for whole stack */}
                          <div className="mb-3">
                            {assigningWholeStackItemId === item.id ? (
                              <div className="grid gap-2 max-h-40 overflow-y-auto p-2 rounded-xl border border-teal-500/30 bg-teal-500/5">
                                <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest px-1">Select employee for all modules</p>
                                {employees.map((emp) => (
                                  <button
                                    key={emp.id}
                                    type="button"
                                    onClick={() => handleAssignWholeStack(item.id, emp.id)}
                                    className="flex items-center justify-between p-2.5 bg-black border border-neutral-800 rounded-xl hover:border-teal-500 text-left transition-colors"
                                  >
                                    <span className="text-sm text-white">{emp.name}</span>
                                    <Check size={14} className="text-teal-500" />
                                  </button>
                                ))}
                                <button type="button" onClick={() => setAssigningWholeStackItemId(null)} className="text-[10px] text-neutral-500 uppercase mt-1">
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAssigningWholeStackItemId(item.id)}
                                className="flex items-center gap-2 w-full px-3 py-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-xs font-bold text-teal-400 hover:bg-teal-500/20 transition-colors"
                              >
                                <UserPlus size={14} />
                                Assign All Modules to One Employee
                              </button>
                            )}
                          </div>
                          {modules.map((mod) => {
                            const assignRow = (item._substack_assignments || []).find(
                              a => a.sub_stack_id === mod.id
                            );
                            const picking =
                              assigningTarget?.orderItemId === item.id &&
                              assigningTarget?.subStackId === mod.id;

                            return (
                              <div
                                key={mod.id}
                                className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl bg-black/60 border border-neutral-800/80"
                              >
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                  <Box size={14} className="text-neutral-500 mt-0.5 shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-neutral-100 truncate">{mod.name}</p>
                                    {assignRow && (
                                      <p className="text-[11px] text-teal-500/90 mt-0.5">
                                        {employees.find(e => e.id === assignRow.employee_id)?.name || 'Assigned'}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {picking ? (
                                    <div className="flex flex-col gap-1 w-full sm:w-48 max-h-36 overflow-y-auto">
                                      {employees.map((emp) => (
                                        <button
                                          key={emp.id}
                                          type="button"
                                          onClick={() => handleAssignSubstack(item.id, mod.id, emp.id)}
                                          className="text-left px-2 py-1.5 rounded-lg text-xs bg-neutral-900 border border-neutral-800 hover:border-teal-500 text-white"
                                        >
                                          {emp.name}
                                        </button>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => setAssigningTarget(null)}
                                        className="text-[10px] text-neutral-500 uppercase"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setAssigningTarget({ orderItemId: item.id, subStackId: mod.id })
                                        }
                                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-neutral-800 text-white hover:bg-neutral-700"
                                      >
                                        {assignRow ? 'Change' : 'Assign'}
                                      </button>
                                      {assignRow && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (assignRow.id.startsWith('temp-')) return;
                                            void handleUnassignSubstack(assignRow.id);
                                          }}
                                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-red-400/90 hover:bg-red-950/40"
                                        >
                                          Clear
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>

              <section className="bg-neutral-900/30 border border-neutral-800 rounded-[28px] p-8 space-y-6">
                <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Billing Details</h5>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Order Reference</span>
                    <span className="text-white font-mono text-xs break-all">{selectedOrder.id}</span>
                  </div>
                  <div className="pt-6 border-t border-neutral-900 flex justify-between items-center">
                    <span className="text-white font-bold">Total Amount</span>
                    <span className="text-3xl font-bold text-teal-400 font-mono tracking-tighter">₹{(selectedOrder.total_amount ?? 0).toLocaleString()}</span>
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
