"use client";

import React, { FC, useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import Footer from "@/src/components/Footer";
import {
  CreditCard,
  Download,
  Mail,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  Activity,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import mixpanel from "mixpanel-browser";
import { OrderWithStacks, PurchasedStack } from "@/src/types/billing";
import { 
  formatSubscriptionCycle,
  cancelSubscription,
  getOrdersWithStacks 
} from "@/src/modules/billing";
import { useAuth } from "@/src/context/AuthContext";
// ────────────────────────────────────────────
// MIXPANEL INITIALIZATION
// ────────────────────────────────────────────
if (typeof window !== "undefined") {
  mixpanel.init("YOUR_MIXPANEL_TOKEN", {
    debug: false,
    track_pageview: false,
    persistence: "localStorage",
  });
}

const BillingPage: FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [purchasedOrders, setPurchasedOrders] = useState<OrderWithStacks[]>([]);
  const [purchasedStacks, setPurchasedStacks] = useState<PurchasedStack[]>([]);
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<string>('');
  const [cancelOption, setCancelOption] = useState<'cancel' | 'transfer'>('cancel');
  const [isCancelling, setIsCancelling] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user) {
        setLoading(authLoading);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch Orders and Stacks using module
        const { orders, stacks } = await getOrdersWithStacks(user.id);
        
        setPurchasedOrders(orders);
        setPurchasedStacks(stacks);
        // Set first stack as selected by default
        if (orders.length > 0 && !selectedOrderToCancel) {
          setSelectedOrderToCancel(orders[0].id);
        }

      } catch (error) {
        console.error("Error fetching billing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    mixpanel.track("Page Viewed", { page_name: "billing-settings" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);


  const handleAction = (actionName: string) => {
    mixpanel.track("Billing Action", { action: actionName });
  };

  const getStatusStyles = (status: string) => {
    // Map your DB statuses to colors
    const s = status.toLowerCase();
    if (s === "successful" || s === "assigned" || s === "completed" || s === "done") return "text-teal-500 border-teal-500/30 bg-teal-500/5";
    if (s === "failed" || s === "cancelled") return "text-red-400 border-red-400/30 bg-red-400/5";
    if (s === "in_progress") return "text-blue-400 border-blue-400/30 bg-blue-400/5";
    if (s === "under_review") return "text-purple-400 border-purple-400/30 bg-purple-400/5";
    return "text-zinc-500 border-zinc-500/30 bg-zinc-500/5"; // pending, initiated, etc.
  };

  const formatStackStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      initiated: 'Initiated',
      in_progress: 'In Progress',
      under_review: 'Under Review',
      completed: 'Completed',
      done: 'Done',
      assigned: 'Assigned',
      pending: 'Pending',
    };
    return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Handle cancel subscription
  const handleCancelSubscription = async () => {
    if (!user) {
      alert('Please sign in to cancel subscription');
      return;
    }
    if (!selectedOrderToCancel) {
      alert('Please select a order from the table');
      return;
    }

    if (isCancelling) return;
    
    // Confirm before cancelling
    if (!confirm('Are you sure you want to cancel this subscription? The order will be archived.')) {
      return;
    }
    
    setIsCancelling(true);

    try {
      // Use the module to cancel subscription
      const result = await cancelSubscription(selectedOrderToCancel, user.id);

      if (result.success) {
        alert(result.message);
        
        // Refresh data
        const { orders, stacks } = await getOrdersWithStacks(user.id);
        setPurchasedOrders(orders);
        setPurchasedStacks(stacks);
        
        // Reset selection
        if (stacks.length > 0) {
          setSelectedOrderToCancel(orders[0].id);
        } else {
          setSelectedOrderToCancel('');
        }
      } else {
        alert(result.message + (result.error ? `: ${result.error}` : ''));
      }

    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen bg-[#020202] items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#020202] text-zinc-400 font-sans selection:bg-teal-500/30">
      
      <div className="container mx-auto px-6 py-16 max-w-6xl flex-grow">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-teal-500/80">System Node: Active</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase italic">Billing <span className="text-zinc-600">/</span> Control</h1>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-500">Last updated: 23 JAN 2026</p>
        </header>

        {/* 1. Primary Subscription Card */}
        <section className="relative overflow-hidden bg-zinc-900/20 border border-white/5 rounded-[32px] p-8 md:p-12 mb-8 backdrop-blur-sm">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12">
            <div>
              <label className="text-[10px] uppercase tracking-[0.4em] text-teal-500 font-bold mb-4 block">Active Plan</label>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter">PREMIUM PRO+ TRIAL</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  <span>Up to 60 encrypted user slots</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Activity className="w-4 h-4 text-teal-500" />
                  <span>60GB localized data architecture</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-end justify-center">
              <div className="font-mono text-5xl font-light text-white mb-2 tracking-tighter">
                <span className="text-teal-500 text-2xl tracking-normal">$</span>648.00
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-6">Cycle Reset: 24 SEPT 2024</p>
              <Button variant="outline" className="border-teal-500/20 text-teal-500 hover:bg-teal-500/10 hover:border-teal-500 rounded-none h-12 px-8 uppercase tracking-[0.2em] text-[10px] transition-all duration-300">
                Upgrade Infrastructure
              </Button>
            </div>
          </div>

          <hr className="my-10 border-white/5" />

          {/* Payment Method Sub-card */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-black/40 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-10 bg-zinc-900 border border-white/10 rounded flex items-center justify-center relative overflow-hidden group">
                <CreditCard className="text-white w-6 h-6 relative z-10" />
                <div className="absolute inset-0 bg-teal-500/10 translate-y-10 group-hover:translate-y-0 transition-transform" />
              </div>
              <div>
                <p className="font-mono text-white tracking-widest">VISA •••• 2378</p>
                <div className="flex items-center gap-4 mt-1">
                   <span className="text-[10px] uppercase tracking-widest text-zinc-500">EXP: 10/24</span>
                   <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-zinc-500">
                     <Mail className="w-3 h-3" /> daniel@example.com
                   </span>
                </div>
              </div>
            </div>
            <Button onClick={() => handleAction('Edit Payment')} className="bg-white text-black hover:bg-teal-500 hover:text-white rounded-none px-10 uppercase tracking-widest text-[10px] font-bold h-10 transition-all">
              Modify
            </Button>
          </div>
        </section>

        
       {/* ──────────────────────────────────────────── */}
        {/* SUBSCRIPTION MANAGEMENT / CANCEL SECTION */}
        {/* ──────────────────────────────────────────── */}
        <section className="bg-zinc-900/10 border border-white/5 rounded-[32px] p-8 md:p-12 mb-8 backdrop-blur-sm relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-zinc-500 text-xs uppercase tracking-[0.3em]">Subscriptions & Payments</span>
            <ChevronRight className="w-4 h-4 text-zinc-700" />
            <span className="text-white text-xs uppercase tracking-[0.3em] font-bold">Manage Subscriptions</span>
          </div>

          <div className="space-y-6 max-w-4xl">
            {/* Option 1: Full Cancellation */}
            <label className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-white/5 bg-black/20 cursor-pointer hover:bg-zinc-800/20 transition-all group">
              <input 
                type="radio" 
                name="cancel-logic" 
                value="cancel"
                checked={cancelOption === 'cancel'}
                onChange={() => {
                  setCancelOption('cancel');
                  // Clear selection when switching to cancel option
                  if (purchasedStacks.length > 0) {
                    setSelectedOrderToCancel(purchasedOrders[0].id);
                  }
                }}
                className="mt-1 w-5 h-5 accent-teal-500" 
              />
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">Cancel with loss of remaining period</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  The publication will be hidden from users and placed in the archive as soon as the action is confirmed. 
                  The remaining period of the publication&apos;s existence will be canceled.
                </p>
              </div>
            </label>

            {/* Option 2: Transfer Credit (The Layout from image) */}
            <div className="p-1 rounded-2xl bg-gradient-to-b from-teal-500/20 to-transparent">
              <div className="flex flex-col gap-6 p-6 rounded-2xl border border-teal-500/30 bg-black/40">
                <label className="flex gap-6 cursor-pointer">
                  <input 
                    type="radio" 
                    name="cancel-logic" 
                    value="transfer"
                    checked={cancelOption === 'transfer'}
                    onChange={() => {
                      setCancelOption('transfer');
                      // Set first stack as selected when switching to transfer option
                      if (purchasedOrders.length > 0 && !selectedOrderToCancel) {
                        setSelectedOrderToCancel(purchasedOrders[0].id);
                      }
                    }}
                    className="mt-1 w-5 h-5 accent-teal-500" 
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-2">Apply remaining period to another publication</h3>
                    <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                      The publication will be hidden from users and placed in the archive as soon as the action is confirmed.
                      The remaining period of the publication&apos;s existence will be applied to the publication you selected.
                    </p>
                  </div>
                </label>

                {/* Sub-table for Orders */}
                <div className="overflow-x-auto rounded-xl border border-white/5 bg-zinc-900/40">
                  <table className="w-full text-left min-w-[600px]">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-zinc-600 border-b border-white/5">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Total Amount</th>
                        <th className="px-6 py-4">Stacks Count</th>
                        <th className="px-6 py-4">Auto-renewal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {purchasedOrders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-zinc-900/40 border border-white/5 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-zinc-700" />
                              </div>
                              <p className="text-sm text-zinc-600">No orders yet</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        purchasedOrders.map((order) => {
                          const isExpanded = expandedOrders.has(order.id);
                          const toggleExpand = () => {
                            setExpandedOrders(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(order.id)) {
                                newSet.delete(order.id);
                              } else {
                                newSet.add(order.id);
                              }
                              return newSet;
                            });
                          };

                          return (
                            <React.Fragment key={order.id}>
                              <tr className="group hover:bg-white/[0.02]">
                                <td className="px-6 py-5">
                                  <div className="flex items-start gap-4">
                                    <input 
                                      type="radio" 
                                      name="pub-select" 
                                      value={order.id}
                                      checked={selectedOrderToCancel === order.id}
                                      onChange={(e) => setSelectedOrderToCancel(e.target.value)}
                                      disabled={cancelOption !== 'transfer'}
                                      className="mt-1 accent-teal-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                          <div className="text-sm font-bold text-white">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                                          <div className="text-[10px] text-zinc-600 font-mono">ID: {order.id}</div>
                                        </div>
                                        <button
                                          onClick={toggleExpand}
                                          className="p-1 hover:bg-white/5 rounded transition-colors"
                                          aria-label={isExpanded ? "Collapse" : "Expand"}
                                        >
                                          {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-zinc-400" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="text-sm text-white font-mono">${order.total_amount.toFixed(2)}</div>
                                  <div className="text-[10px] text-zinc-500">
                                    {order.stacks.length > 0 && order.stacks[0].subscription_duration 
                                      ? `Every ${formatSubscriptionCycle(order.stacks[0].subscription_duration)}` 
                                      : 'N/A'}
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="text-sm text-white">{order.stacks.length}</div>
                                  <div className="text-[10px] text-zinc-500">
                                    {order.stacks.length === 1 ? 'stack' : 'stacks'}
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="w-10 h-5 rounded-full relative transition-colors cursor-pointer bg-zinc-700">
                                    <div className="absolute top-1 w-3 h-3 bg-white rounded-full transition-all left-1" />
                                  </div>
                                  <span className="text-[10px] uppercase ml-2 text-zinc-500">Off</span>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr>
                                  <td colSpan={4} className="px-6 py-4 bg-zinc-900/20">
                                    <div className="space-y-3">
                                      <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">Stacks in this order:</div>
                                      <div className="space-y-2">
                                        {order.stacks.map((stack) => (
                                          <div 
                                            key={stack.id} 
                                            className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-white/5"
                                          >
                                            <div className="flex-1">
                                              <div className="text-sm font-medium text-white">{stack.stack_name}</div>
                                              <div className="text-[10px] text-zinc-500 font-mono mt-1">
                                                Stack ID: {stack.stack_id.slice(0, 11).toUpperCase()}
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-sm text-white font-mono">${stack.base_price.toFixed(2)}</div>
                                              <div className="text-[10px] text-zinc-500">
                                                {stack.subscription_duration 
                                                  ? formatSubscriptionCycle(stack.subscription_duration) 
                                                  : 'N/A'}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
              <Button 
                onClick={handleCancelSubscription}
                disabled={isCancelling || !selectedOrderToCancel}
                className="bg-red-500 hover:bg-red-400 text-white font-bold uppercase tracking-widest text-[10px] px-10 h-12 rounded-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Cancel Subscription'
                )}
              </Button>
             
            </div>
          </div>
        </section>

        {/* 2. Transaction Logs - Purchased Stacks */}
        <section className="bg-zinc-900/20 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xs uppercase tracking-[0.5em] font-bold text-white">Transaction Logs</h2>
            <Button 
              variant="ghost"
              onClick={() => handleAction('Download All')}
              className="text-zinc-500 hover:text-teal-500 hover:bg-transparent flex items-center gap-2 uppercase tracking-widest text-[10px]"
            >
              <Download className="w-4 h-4" /> Batch Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            {purchasedOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-900/40 border border-white/5 flex items-center justify-center mb-4">
                  <Download className="w-8 h-8 text-zinc-700" />
                </div>
                <h3 className="text-lg font-bold text-zinc-400 mb-2">No Transactions Yet</h3>
                <p className="text-sm text-zinc-600">Your purchase history will appear here</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5">
                    <th className="px-8 py-6 font-bold">Order ID</th>
                    <th className="px-8 py-6 font-bold">Stack Name</th>
                    <th className="px-8 py-6 font-bold">Type</th>
                    <th className="px-8 py-6 font-bold text-right">Amount</th>
                    <th className="px-8 py-6 font-bold">Date</th>
                    <th className="px-8 py-6 font-bold text-center">Progress</th>
                    <th className="px-8 py-6 font-bold text-center">Status</th>
                    <th className="px-8 py-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {purchasedOrders.map((order) =>
                    order.stacks.map((stack, index) => (
                      <tr key={`${order.id}-${stack.id}`} className="hover:bg-teal-500/[0.02] transition-colors group">
                        <td className="px-8 py-6 font-mono text-xs text-zinc-600">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-white tracking-tight">{stack.stack_name}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-500" />
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                            {stack.stack_type || 'N/A'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-xs text-white font-mono text-right">
                          {index === 0 ? `$${order.total_amount.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-8 py-6 text-[10px] uppercase tracking-tighter text-zinc-500">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }).toUpperCase()}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-500 transition-all duration-500"
                                style={{ width: `${stack.progress_percent}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 w-8 text-right">{stack.progress_percent}%</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-3 py-1 text-[9px] font-bold border uppercase tracking-widest transition-all ${getStatusStyles(stack.status)}`}>
                            {formatStackStatus(stack.status)}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-white transition-colors">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
};

export default BillingPage;