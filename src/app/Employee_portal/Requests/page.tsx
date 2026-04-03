"use client"

import React, { useState } from 'react';
import { Send, Terminal, ShieldAlert, Cpu, HardDrive, Globe } from 'lucide-react';

interface RequestOptionProps { title: string; icon: React.ElementType; selected: boolean; onClick: () => void; }
const RequestOption = ({ title, icon: Icon, selected, onClick }: RequestOptionProps) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 border transition-all duration-200 text-left
      ${selected 
        ? 'border-teal-500 bg-teal-500/5 text-white' 
        : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'}`}
  >
    <Icon size={18} className={selected ? 'text-teal-500' : 'text-neutral-400'} />
    <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
  </button>
);

export default function RequestPage() {
  const [requestType, setRequestType] = useState('compute');

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-2">
          <Terminal size={14} className="text-teal-500" />
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">
            System_Communication_Link
          </span>
        </div>
        <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase italic">
          Submit_Request
        </h1>
      </header>

      {/* Main Request Form */}
      <div className="bg-white dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden">
        <div className="p-8 space-y-8">
          
          {/* Section 1: Type Selection */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-teal-500 uppercase tracking-widest">01. Resource_Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <RequestOption 
                title="Compute_Power" 
                icon={Cpu} 
                selected={requestType === 'compute'} 
                onClick={() => setRequestType('compute')} 
              />
              <RequestOption 
                title="Storage_Node" 
                icon={HardDrive} 
                selected={requestType === 'storage'} 
                onClick={() => setRequestType('storage')} 
              />
              <RequestOption 
                title="Network_Access" 
                icon={Globe} 
                selected={requestType === 'network'} 
                onClick={() => setRequestType('network')} 
              />
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-teal-500 uppercase tracking-widest">02. Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-neutral-400 uppercase mb-2 tracking-widest">Request_Subject</label>
                <input 
                  type="text" 
                  placeholder="E.G. OVERRIDE_PROX_SERVER"
                  className="w-full bg-zinc-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-xs font-mono focus:border-teal-500 outline-none transition-colors dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-neutral-400 uppercase mb-2 tracking-widest">Justification_Log</label>
                <textarea 
                  rows={4} 
                  placeholder="DESCRIBE_REASON_FOR_RESOURCE_ALLOCATION..."
                  className="w-full bg-zinc-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-xs font-mono focus:border-teal-500 outline-none transition-colors dark:text-white resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Priority */}
          <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <ShieldAlert size={18} className="text-red-500" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Emergency_Override</span>
            </div>
            <input type="checkbox" className="accent-red-500 h-4 w-4" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-zinc-50 dark:bg-black/40 p-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <button className="flex items-center gap-3 bg-teal-500 hover:bg-teal-400 text-black px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all">
            Execute_Request <Send size={14} />
          </button>
        </div>
      </div>

      {/* Footer Meta */}
      <footer className="flex justify-between items-center opacity-40">
        <p className="text-[9px] font-mono tracking-tighter">PROTO_UUID: 992-X1-A</p>
        <p className="text-[9px] font-mono tracking-tighter">EST_APPROVAL: 24_HOURS</p>
      </footer>
    </div>
  );
}