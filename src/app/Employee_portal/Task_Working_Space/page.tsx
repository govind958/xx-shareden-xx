"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, Activity, Cpu, Shield, Zap, 
  Send, Paperclip, FileText, User, Hash, MoreHorizontal 
} from 'lucide-react';

export default function ProjectDetail() {
  const [message, setMessage] = useState("");

  // Sample data for the message feed
  const messages = [
    { id: 1, user: "SYSTEM", text: "Project_Matrix initialized. Secure channel open.", type: "system" },
    { id: 2, user: "OPERATOR_01", text: "I've uploaded the latest architecture specs for the Aegis node.", type: "user" },
    { id: 3, user: "DOC_ATTACHMENT", text: "Architecture_Final_v2.pdf", type: "file", size: "2.4MB" },
    { id: 4, user: "LEAD_ARCHITECT", text: "Reviewing now. Latency spikes detected in sector 7G.", type: "user" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-teal-500 selection:text-black">
      
      {/* Top Navigation */}
     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Core Info & Messaging */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          

          {/* Stats Bar */}
         

          {/* MESSAGE UI (Replaced Matrix Visualization) */}
          <div className="flex-1 border border-neutral-800 bg-neutral-950 flex flex-col min-h-[500px]">
            {/* Message Header */}
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <Hash size={16} className="text-teal-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global_Project_Comm_Link</span>
              </div>
              <MoreHorizontal size={16} className="text-neutral-600" />
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[400px]">
              {messages.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-tighter ${msg.type === 'system' ? 'text-teal-500' : 'text-neutral-400'}`}>
                      {msg.user}
                    </span>
                    <span className="text-[8px] text-neutral-700 font-mono">14:02:44</span>
                  </div>

                  {msg.type === 'file' ? (
                    <div className="inline-flex items-center gap-4 p-3 border border-neutral-800 bg-black hover:border-teal-500 transition-colors cursor-pointer">
                      <FileText size={20} className="text-teal-500" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">{msg.text}</p>
                        <p className="text-[8px] text-neutral-500">{msg.size}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-300 font-medium leading-relaxed max-w-2xl border-l-2 border-transparent group-hover:border-teal-500 pl-4 transition-all">
                      {msg.text}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-neutral-800 bg-black">
              <div className="flex items-center gap-4 bg-neutral-900/50 border border-neutral-800 p-2 focus-within:border-teal-500 transition-all">
                <button className="p-2 text-neutral-500 hover:text-white transition-colors">
                  <Paperclip size={18} />
                </button>
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="EXECUTE_MESSAGE_SEQUENCE..."
                  className="bg-transparent flex-1 text-[11px] font-bold uppercase tracking-widest outline-none"
                />
                <button className="bg-teal-500 p-2 text-black hover:bg-white transition-all">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Members & Logs */}
        <div className="space-y-6">
          <div className="border border-neutral-800 bg-neutral-950 p-6 flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-widest mb-6 border-b border-neutral-800 pb-4">Authorized_Personnel</h2>
            <div className="space-y-4">
              {['User_Alpha', 'User_Delta', 'System_Admin'].map((person) => (
                <div key={person} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-teal-500">
                    <User size={14} className="text-neutral-500 group-hover:text-teal-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 group-hover:text-white">
                    {person}
                  </span>
                  <div className="ml-auto w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-neutral-800 bg-neutral-950 p-6 flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-widest mb-6 border-b border-neutral-800 pb-4">Live_Neural_Logs</h2>
            <div className="space-y-4 font-mono text-[10px] text-neutral-500">
              <p><span className="text-teal-500">[OK]</span> Comm_Link established</p>
              <p><span className="text-teal-500">[OK]</span> Handshake verified</p>
              <p className="animate-pulse">_ Waiting for input...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}