"use client"

import React, { useState, useEffect } from "react"
import {
  ClipboardList,
  AlertCircle,
  Flag,
  Search,
  Layers,
  ChevronRight,
  HelpCircle,
  Loader2
} from "lucide-react"
import { useAuth } from '@/src/context/AuthContext';
import { getPurchasedStacks } from '@/src/modules/stack_board/action';
import { PURCHASED_STACKS } from '@/src/modules/stack_board/types';
import SupportModal from '@/src/components/SupportModal';
import { getSupportTicketCounts } from '@/src/modules/support/action';
import { getSupportTickets } from '@/src/modules/support/action';
import { SUPPORT_TICKETS } from "@/src/types/support";
import { useRouter } from 'next/navigation';

/* ---------------- STYLE HELPERS ---------------- */
const STAT_CARD =
  "group bg-white border border-[#1A365D]/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"

const SECTION_CARD =
  "bg-white border border-[#1A365D]/10 rounded-3xl p-6 min-h-[350px] flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"

/* --- LOADING COMPONENT --- */
const LoadingPage = () => (
  <div className="flex w-full flex-1 min-h-[calc(100dvh-6rem)] bg-white items-center justify-center">
    <Loader2 size={32} className="animate-spin text-[#2B6CB0]" />
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [stacks, setStacks] = useState<PURCHASED_STACKS[]>([]);
  const [openIssues, setOpenIssues] = useState(0);
  const [closedIssues, setClosedIssues] = useState(0);  
  const [tickets, setTickets] = useState<SUPPORT_TICKETS[]>([]);
  // Simulate initial data fetch
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setInitialLoading(false);
      return;
    }
    const fetchData = async () => {
      try{
        const [data, ticketCounts, tickets] = await Promise.all([
          getPurchasedStacks(user.id),
          getSupportTicketCounts(user.id),
          getSupportTickets(user.id),
        ]);
        setStacks(data);
        setOpenIssues(ticketCounts.open);
        setClosedIssues(ticketCounts.closed);
        setTickets(tickets);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchData();

  }, [user, authLoading]);

  const openTasks = stacks.filter(s =>
    ['initiated', 'processing', 'in_progress'].includes(s.status.toLowerCase())
  ).length;
  const closedTasks = stacks.filter(s =>
    s.status.toLowerCase() === 'completed'
  ).length;

  if (initialLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F7FAFC] text-[#1A365D] font-sans selection:bg-[#2B6CB0]/20">

      {/* ---------------- MAIN ---------------- */}
      <main className="px-10 py-12 space-y-12 max-w-[1600px] w-full mx-auto">

        {/* KPI SECTION */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Key Performance Indicators
            </h2>

            <button className="text-xs font-bold text-[#2B6CB0] flex items-center gap-1 hover:underline" 
            onClick={() => router.push('/private?tab=stackboard')}>
              View Detailed Analytics <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
            <StatCard label="Open Tasks" count={openTasks} color="blue" icon={<ClipboardList size={20} />} />
            <StatCard label="Closed Tasks" count={closedTasks} color="blue" icon={<ClipboardList size={20} />} />
            <StatCard label="Open Issues" count={openIssues} color="red" icon={<AlertCircle size={20} />} />
            <StatCard label="Closed Issues" count={closedIssues} color="red" icon={<AlertCircle size={20} />} />
            <StatCard label="Open Phases" count={0} color="teal" icon={<Flag size={20} />} />
            <StatCard label="Closed Phases" count={0} color="teal" icon={<Flag size={20} />} />
          </div>
        </section>

        {/* WORKSPACE GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* <EmptyStateSection title="My Tasks" highlight="#2B6CB0" /> */}
          {stacks.length > 0 ? (
            <div className={SECTION_CARD}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full bg-[#2B6CB0]" />
                  <h3 className="font-bold tracking-tight text-[#1A365D]">My Tasks</h3>
                </div>
                <span className="text-xs font-bold text-slate-400">{stacks.length} total</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {stacks.map(stack => {
                  const status = stack.status.toLowerCase();
                  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
                    initiated: { label: 'Queued', bg: 'bg-slate-100', text: 'text-slate-600' },
                    processing: { label: 'Assigned', bg: 'bg-blue-50', text: 'text-blue-700' },
                    in_progress: { label: 'In Progress', bg: 'bg-amber-50', text: 'text-amber-700' },
                    completed: { label: 'Completed', bg: 'bg-green-50', text: 'text-green-700' },
                  };
                  const cfg = statusConfig[status] || statusConfig.initiated;
                  return (
                    <div key={stack.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F7FAFC] transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-[#2B6CB0]/10 text-[#2B6CB0] flex items-center justify-center font-bold text-sm shrink-0">
                        {stack.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A365D] truncate">{stack.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2B6CB0] rounded-full transition-all duration-500"
                              style={{ width: `${stack.progress_percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 shrink-0">{stack.progress_percent}%</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shrink-0 ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyStateSection title="My Tasks" highlight="#2B6CB0" />
          )}

          {/* MY ISSUES SECTION (Updated) */}
          {tickets.length > 0 ? (
            <div className={SECTION_CARD}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 rounded-full bg-[#E53E3E]" />
                  <h3 className="font-bold tracking-tight text-[#1A365D]">My Issues</h3>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                     <span className="w-2 h-2 rounded-full bg-red-500"></span> Open ({openIssues})
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                     <span className="w-2 h-2 rounded-full bg-slate-300"></span> Closed ({closedIssues})
                   </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {tickets.map(ticket => {
                  const isOpen = ticket.status === 'open';
                  return (
                    <div key={ticket.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F7FAFC] border border-transparent hover:border-[#1A365D]/5 transition-all group cursor-pointer">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-red-50 text-red-500 group-hover:bg-red-100' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                        <AlertCircle size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isOpen ? 'text-[#1A365D]' : 'text-slate-500'}`}>
                          {ticket.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Last updated: {ticket.date}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shrink-0 ${isOpen ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                        {ticket.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
             <EmptyStateSection title="My Issues" highlight="#E53E3E" />
          )}

          <EmptyStateSection title="Due Today" highlight="#319795" />
          <EmptyStateSection title="Overdue" highlight="#E53E3E" />
        </section>
      </main>

      {/* FLOATING SUPPORT */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setShowSupportModal(true)}
          className="bg-[#1A365D] text-white px-5 py-2.5 rounded-xl shadow-xl flex items-center gap-2 font-medium hover:bg-[#2B6CB0] transition-all text-sm"
        >
          <HelpCircle size={18} />
          Support
        </button>
      </div>

      {/* SUPPORT MODAL */}
      {showSupportModal && user && (
        <SupportModal
          userId={user.id}
          onClose={async () => {
            setShowSupportModal(false);
            const counts = await getSupportTicketCounts(user.id);
            setOpenIssues(counts.open);
            setClosedIssues(counts.closed);
          }}
        />
      )}
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({
  label,
  count,
  color,
  icon
}: {
  label: string
  count: number
  color: "blue" | "red" | "teal"
  icon: React.ReactNode
}) {

  const themes = {
    blue: "text-[#2B6CB0] bg-[#2B6CB0]/10",
    red: "text-[#E53E3E] bg-[#E53E3E]/10",
    teal: "text-[#319795] bg-[#319795]/10"
  }

  const accent = {
    blue: "bg-[#2B6CB0]",
    red: "bg-[#E53E3E]",
    teal: "bg-[#319795]"
  }

  return (
    <div className={STAT_CARD}>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <h3 className="text-3xl font-black text-[#1A365D] tracking-tight">
          {count}
        </h3>
      </div>

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${themes[color]}`}>
        {icon}
      </div>

      <div className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500 ${accent[color]}`} />
    </div>
  )
}

function EmptyStateSection({
  title,
  highlight
}: {
  title: string
  highlight: string
}) {
  return (
    <div className={SECTION_CARD}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div
            className="w-1.5 h-6 rounded-full"
            style={{ backgroundColor: highlight }}
          />
          <h3 className="font-bold tracking-tight text-[#1A365D]">
            {title}
          </h3>
        </div>

        <button className="p-1.5 hover:bg-[#F7FAFC] rounded-lg text-slate-400 transition-colors">
          <Layers size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-[#F7FAFC] rounded-3xl flex items-center justify-center border border-dashed border-[#1A365D]/10">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Search size={20} className="text-slate-300" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center">
            <AlertCircle size={16} className="text-amber-400" />
          </div>
        </div>

        <h4 className="font-semibold mb-1 text-[#1A365D]">
          All caught up!
        </h4>

        <p className="text-slate-400 text-sm max-w-[220px] leading-relaxed">
          No {title.toLowerCase()} were found in your current workspace.
        </p>
      </div>
    </div>
  )
}

