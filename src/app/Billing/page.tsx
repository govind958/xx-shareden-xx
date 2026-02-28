"use client";

import React, { FC, useState, useEffect } from "react";
import { 
  FileText, 
  Download,
  Clock,
  CreditCard,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";

/* --- LOADING COMPONENT --- */
const LoadingPage = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="flex gap-2">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
      <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse delay-75" />
      <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse delay-150" />
      <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse delay-300" />
      <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse delay-500" />
    </div>
  </div>
);

// --- Sample Data ---
const MOCK_STACKS = [
  { id: "INV-8K2L9S1", stack_name: "Enterprise Pro Plan", status: "active", base_price: 149.00, billing_date: "Mar 24, 2026", days_left: 24 },
  { id: "INV-4M1P0X2", stack_name: "Developer API Access", status: "active", base_price: 49.00, billing_date: "Apr 02, 2026", days_left: 32 },
  { id: "INV-9T5R2W8", stack_name: "Storage Add-on (5TB)", status: "pending", base_price: 20.00, billing_date: "Mar 15, 2026", days_left: 15 },
];

const BillingPage: FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [purchasedStacks, setPurchasedStacks] = useState(MOCK_STACKS);
  const [selectedStack, setSelectedStack] = useState<any>(null);

  // Simulate initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  const handleCancel = (id: string) => {
    setPurchasedStacks(prev => prev.filter(s => s.id !== id));
    setSelectedStack(null);
  };

  if (initialLoading) {
    return <LoadingPage />;
  }

  return (
    <main className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 p-4 md:p-12 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A365D]">Billing & Subscriptions</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your workspace plans and payment history.</p>
          </div>
          <button className="px-5 py-2.5 text-sm font-bold text-white bg-[#2B6CB0] rounded shadow-md hover:bg-[#1A365D] transition-all active:scale-95">
            Upgrade Plan
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Current Balance", value: "$149.00", icon: CreditCard, color: "text-blue-600" },
            { label: "Active Subscriptions", value: purchasedStacks.length, icon: FileText, color: "text-emerald-600" },
            { label: "Days Until Renewal", value: "24 Days", icon: Clock, color: "text-amber-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
               <div className="flex justify-between items-start">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
               </div>
               <h3 className="text-2xl font-bold mt-2 text-[#1A365D]">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Plan Details</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Billing Cycle</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Amount</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchasedStacks.map((stack) => (
                  <tr 
                    key={stack.id} 
                    onClick={() => setSelectedStack(stack)}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{stack.stack_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-tighter uppercase">{stack.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100 uppercase tracking-tighter">
                        Active
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-600 font-medium">{stack.billing_date}</span>
                        <span className="text-[11px] text-blue-500 font-semibold">{stack.days_left} days remaining</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-800">
                      ${stack.base_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 text-slate-300 hover:text-blue-600 transition-all">
                        <Download size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Showing {purchasedStacks.length} active plans</span>
            <div className="flex gap-1">
              <button disabled className="p-1.5 rounded border border-slate-200 bg-white opacity-50 cursor-not-allowed"><ChevronLeft size={16}/></button>
              <button disabled className="p-1.5 rounded border border-slate-200 bg-white opacity-50 cursor-not-allowed"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-xs flex items-center justify-center gap-1.5">
            <Info size={12} /> Need a custom invoice? Contact billing support.
          </p>
        </div>
      </div>

      {/* --- CANCELLATION POPUP --- */}
      {selectedStack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedStack(null)} />
          
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <button onClick={() => setSelectedStack(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-[#1A365D]">Cancel Subscription</h3>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                You are cancelling <span className="font-bold text-slate-800">{selectedStack.stack_name}</span>. 
                Your premium features will remain active until the end of your cycle on 
                <span className="font-bold text-slate-800"> {selectedStack.billing_date}</span>.
              </p>

              <div className="mt-6 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reason for cancellation</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-blue-500 transition-all">
                  <option>Select a reason...</option>
                  <option>Pricing is too high</option>
                  <option>Found a better alternative</option>
                  <option>Project completed</option>
                  <option>Technical issues</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
              <button 
                onClick={() => handleCancel(selectedStack.id)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded shadow-md transition-all active:scale-[0.98]"
              >
                Confirm Cancellation
              </button>
              <button 
                onClick={() => setSelectedStack(null)}
                className="w-full py-3 bg-white border border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-widest rounded hover:bg-slate-100 transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BillingPage;