"use client";

import React, { FC, useEffect } from "react";
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
} from "lucide-react";
import mixpanel from "mixpanel-browser";

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

// ────────────────────────────────────────────
// MOCK DATA & TYPES
// ────────────────────────────────────────────
type BillingStatus = "Successful" | "Failed" | "Pending";

interface Invoice {
  id: string;
  name: string;
  amount: string;
  date: string;
  plan: string;
  status: BillingStatus;
}

const INVOICE_HISTORY: Invoice[] = [
  { id: "10", name: "INV-010_AUG_2023", amount: "648.00", date: "01 AUG 2023", plan: "PREMIUM PRO+", status: "Successful" },
  { id: "09", name: "INV-009_JUL_2023", amount: "648.00", date: "01 JUL 2023", plan: "PREMIUM PRO+", status: "Failed" },
  { id: "08", name: "INV-008_JUN_2023", amount: "648.00", date: "01 JUN 2023", plan: "PREMIUM PRO+", status: "Pending" },
  { id: "07", name: "INV-007_MAY_2023", amount: "648.00", date: "01 MAY 2023", plan: "PREMIUM PRO+", status: "Successful" },
  { id: "06", name: "INV-006_APR_2023", amount: "648.00", date: "01 APR 2023", plan: "PREMIUM PRO+", status: "Successful" },
];

const BillingPage: FC = () => {
  useEffect(() => {
    mixpanel.track("Page Viewed", { page_name: "billing-settings" });
  }, []);

  const handleAction = (actionName: string) => {
    mixpanel.track("Billing Action", { action: actionName });
  };

  const getStatusStyles = (status: BillingStatus) => {
    switch (status) {
      case "Successful": return "text-teal-500 border-teal-500/30 bg-teal-500/5";
      case "Failed": return "text-red-400 border-red-400/30 bg-red-400/5";
      case "Pending": return "text-zinc-500 border-zinc-500/30 bg-zinc-500/5";
    }
  };

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
          {/* Subtle Grid Background Overlay */}
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

        {/* 2. Billing History Table Section */}
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5">
                  <th className="px-8 py-6 font-bold">UID</th>
                  <th className="px-8 py-6 font-bold">Registry</th>
                  <th className="px-8 py-6 font-bold text-right">Credit</th>
                  <th className="px-8 py-6 font-bold">Timestamp</th>
                  <th className="px-8 py-6 font-bold text-center">Status</th>
                  <th className="px-8 py-6 font-bold text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {INVOICE_HISTORY.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-teal-500/[0.02] transition-colors group">
                    <td className="px-8 py-6 font-mono text-xs text-zinc-600">#{invoice.id}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-white tracking-tight">{invoice.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-500" />
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-white font-mono text-right">USD {invoice.amount}</td>
                    <td className="px-8 py-6 text-[10px] uppercase tracking-tighter text-zinc-500">{invoice.date}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 text-[9px] font-bold border uppercase tracking-widest transition-all ${getStatusStyles(invoice.status)}`}>
                        {invoice.status}
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
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
};

export default BillingPage;