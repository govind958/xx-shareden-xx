'use client'

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  ChevronDown, 
  ShieldCheck, 
  Check, 
  Info,
  Building,
  Globe,
  MapPin,
  Phone
} from 'lucide-react';

/* --- LOADING COMPONENT --- */
// Matches the provided screenshot with centered gray dots
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

export default function ClassicSaaSProfile() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Color Palette
  const colors = {
    navy: '#1A365D',
    blue: '#2B6CB0',
    bg: '#F7FAFC',
    success: '#38A169',
    error: '#E53E3E',
    border: '#E2E8F0'
  };

  // Simulate initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500); // Shows loading for 1.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  if (initialLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.navy }}>
              Organization Profile
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage your company's public identity and contact details.</p>
          </div>
          <span className="text-[11px] font-mono font-bold bg-white border border-slate-200 px-3 py-1 rounded text-slate-400">
            ORG_ID: 60066289066
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: Logo */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-6 text-slate-400">Company Branding</h2>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-md flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group shrink-0">
                <Upload size={20} className="text-slate-400 group-hover:text-blue-600" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-sm font-semibold text-slate-700">Organization Logo</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  240x240px recommended. JPG or PNG. <br />
                  This logo will appear on invoices and portals.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-400">General Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-1.5">
                <label className="text-sm font-semibold flex items-center gap-1" style={{ color: colors.navy }}>
                  Organization Name <span style={{ color: colors.error }}>*</span>
                </label>
                <div className="relative">
                  <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="text" 
                    defaultValue="quicloop"
                    className="w-full border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" style={{ color: colors.navy }}>Industry</label>
                  <div className="relative">
                    <select className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm appearance-none bg-white outline-none focus:border-blue-500 cursor-pointer">
                      <option>Technology</option>
                      <option>Retail</option>
                      <option>Finance</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" style={{ color: colors.navy }}>Location</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <select className="w-full border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm appearance-none bg-white outline-none focus:border-blue-500 cursor-pointer">
                      <option>India</option>
                      <option>United States</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Address */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-400">Headquarters Address</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-slate-300" />
                <textarea 
                  placeholder="Street Address Line 1"
                  rows={2}
                  className="w-full border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input placeholder="City" className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm outline-none focus:border-blue-500" />
                <input placeholder="Postal Code" className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm appearance-none bg-white outline-none">
                    <option>Delhi</option>
                    <option>Maharashtra</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input placeholder="Phone" className="w-full border border-slate-200 rounded-md pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={16} style={{ color: colors.blue }} />
              <span className="text-xs font-medium">Auto-syncing to secure cloud</span>
            </div>
            
            <div className="flex w-full sm:w-auto gap-3">
              <button 
                type="button"
                className="flex-1 sm:flex-none px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Discard
              </button>
              <button 
                type="submit"
                disabled={isSaving}
                className="flex-1 sm:flex-none px-10 py-2.5 rounded text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                style={{ backgroundColor: isSaved ? colors.success : colors.blue }}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : isSaved ? (
                  <><Check size={18} /> Saved</>
                ) : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="text-slate-400 text-xs flex items-center justify-center gap-1.5">
            <Info size={12} /> Need help? Contact organization support.
          </p>
        </div>

      </div>
    </div>
  );
}