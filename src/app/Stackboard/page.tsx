"use client";

import React, { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Paperclip,
  Send,
  FileArchive,
  Download,
  ExternalLink,
  CheckCheck,
  Pin,
  Smile,
  Mic,
  Info,
} from "lucide-react";

// --- Mock Data ---
const MOCK_STACKS = [
  {
    id: "STK-9921",
    name: "Next.js Enterprise Stack",
    description: "Advanced architecture with multi-tenant auth.",
    progress: 75,
    status: "In Progress",
    updated_at: "10:42 AM",
  },
  {
    id: "STK-4402",
    name: "AI Microservice Integration",
    description: "Python FastAPI + LangGraph workflow.",
    progress: 100,
    status: "Completed",
    updated_at: "Yesterday",
  },
  {
    id: "STK-1108",
    name: "Stripe Billing Engine",
    description: "Custom subscription logic & webhooks.",
    progress: 15,
    status: "Initiated",
    updated_at: "9:15 AM",
  },
];

const FileCard = ({
  fileName,
  size,
}: {
  fileName: string;
  size: string;
}) => (
  <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg max-w-[280px] my-2 hover:border-[#2B6CB0] transition-colors">
    <div className="bg-[#F7FAFC] p-2 rounded-md text-[#2B6CB0]">
      <FileArchive size={22} strokeWidth={1.5} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold truncate text-[#1A365D]">
        {fileName}
      </p>
      <p className="text-xs text-slate-400 uppercase tracking-wide">
        {size}
      </p>
    </div>
    <div className="flex flex-col gap-1 items-end">
      <button className="text-xs font-semibold text-[#2B6CB0] hover:text-[#1A365D] flex items-center gap-1">
        Open <ExternalLink size={12} />
      </button>
      <button className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
        Save <Download size={12} />
      </button>
    </div>
  </div>
);

export default function EnterpriseMessagingUI() {
  const [selectedStack, setSelectedStack] = useState(MOCK_STACKS[0]);

  return (
    <div className="flex h-screen w-full text-slate-800 overflow-hidden bg-[#F7FAFC]">
      
      {/* Sidebar */}
      <aside className="w-[30%] min-w-[320px] max-w-[400px] bg-white border-r border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-[#1A365D]">
              Messages
            </h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
              Stack Communications
            </p>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <Search size={18} />
          </button>
        </div>

        {/* Stack List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {MOCK_STACKS.map((stack) => (
            <div
              key={stack.id}
              onClick={() => setSelectedStack(stack)}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-4 cursor-pointer transition-all rounded-lg",
                selectedStack.id === stack.id
                  ? "bg-[#F7FAFC] border-l-4 border-[#2B6CB0]"
                  : "hover:bg-slate-50"
              )}
            >
              <div className="w-11 h-11 rounded-full bg-slate-100 border flex items-center justify-center text-[#1A365D] font-semibold text-sm">
                {stack.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold truncate text-[#1A365D]">
                    {stack.name}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {stack.updated_at}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  {stack.progress}% • {stack.status}
                </p>
              </div>

              <Pin
                size={14}
                className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col bg-white">
        
        {/* Chat Header */}
        <header className="h-20 border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md bg-[#1A365D] text-white flex items-center justify-center font-semibold">
              {selectedStack.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1A365D]">
                {selectedStack.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-[#38A169]" />
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                  Expert Assigned
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 text-slate-400">
            <button className="p-2 hover:bg-slate-100 hover:text-[#2B6CB0] rounded-lg transition">
              <Info size={18} />
            </button>
            <button className="p-2 hover:bg-slate-100 hover:text-[#2B6CB0] rounded-lg transition">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F7FAFC]">
          
          {/* Incoming */}
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-white border border-slate-200 px-5 py-4 rounded-xl shadow-sm">
              <p className="text-sm leading-relaxed">
                The core modules for{" "}
                <strong>{selectedStack.name}</strong> have been deployed.
                I've attached the latest architectural manifest.
              </p>
              <FileCard
                fileName="architecture_v2_final.zip"
                size="2.8 MB"
              />
              <span className="text-xs text-slate-400 mt-2 block">
                11:20 AM
              </span>
            </div>
          </div>

          {/* Outgoing */}
          <div className="flex justify-end">
            <div className="max-w-[70%] bg-[#319795] text-white px-5 py-4 rounded-xl shadow-sm">
              <p className="text-sm leading-relaxed">
                Manifest received. Checking configuration now.
              </p>
              <div className="flex items-center justify-end gap-1 mt-2 text-xs opacity-90">
                11:24 AM <CheckCheck size={14} />
              </div>
            </div>
          </div>

          {/* System Badge */}
          <div className="flex justify-center">
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-500 shadow-sm">
              Status updated to{" "}
              <span className="text-[#2B6CB0] font-bold">
                {selectedStack.status}
              </span>
            </div>
          </div>
        </div>

        {/* Input */}
        <footer className="h-20 bg-white border-t border-slate-200 px-6 flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-[#2B6CB0] hover:bg-slate-100 rounded-lg transition">
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            placeholder="Communicate with your stack expert..."
            className="flex-1 bg-slate-100 rounded-lg px-5 py-3 text-sm outline-none border border-transparent focus:ring-2 focus:ring-[#2B6CB0] focus:border-[#2B6CB0]"
          />

          <button className="p-2 text-slate-400 hover:text-[#2B6CB0] hover:bg-slate-100 rounded-lg transition">
            <Smile size={20} />
          </button>

          <button className="bg-[#1A365D] hover:bg-[#2B6CB0] text-white p-3 rounded-lg transition active:scale-95">
            <Send size={18} />
          </button>
        </footer>
      </main>
    </div>
  );
}

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");