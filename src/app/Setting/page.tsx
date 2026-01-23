'use client'

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Bell, 
  Settings, 
  Building, 
  Upload, 
  Globe2, 
  AlertCircle, 
  Target, 
  CheckCircle2, 
  Save,
  User,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

/* ---------------- TYPES ---------------- */

interface Organization {
  id: string;
  org_name: string;
  org_slug: string;
  company_logo: string | null;
  industry_type: string;
  created_at: string;
}

/* ---------------- SETTINGS PAGE ---------------- */
export default function OrganizationSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock Data State
  const [formData, setFormData] = useState<Organization>({
    id: '',
    org_name: '',
    org_slug: '',
    company_logo: null,
    industry_type: '',
    created_at: ''
  } as Organization);

  useEffect(() => {
    setMounted(true);
    const loadOrganization = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('organizations')
          .select('id, org_name, org_slug, company_logo, industry_type, created_at')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setFormData({
            id: data.id,
            org_name: data.org_name || '',
            org_slug: data.org_slug || '',
            company_logo: data.company_logo || null,
            industry_type: data.industry_type || '',
            created_at: data.created_at || '',
          });
        }
      } catch (error) {
        console.error('Error loading organization:', error);
      }
    };
    loadOrganization();
  }, []);

  const handleChange = (field: keyof Organization, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const supabase = createClient();
      if (formData.id) {
        const { error } = await supabase
          .from('organizations')
          .update({
            org_name: formData.org_name,
            org_slug: formData.org_slug,
            company_logo: formData.company_logo,
            industry_type: formData.industry_type,
          })
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('organizations')
          .insert({
            org_name: formData.org_name,
            org_slug: formData.org_slug,
            company_logo: formData.company_logo,
            industry_type: formData.industry_type,
          })
          .select('id, created_at')
          .single();
        if (error) throw error;
        if (data) {
          setFormData((prev) => ({
            ...prev,
            id: data.id,
            created_at: data.created_at,
          }));
        }
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving organization:', error);
      alert('Unable to save settings right now.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />;

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30">
      {/* NAVIGATION */}
     

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                Organization <span className="text-neutral-500">Settings</span>
            </h1>
            <p className="text-neutral-500 flex items-center gap-2 font-mono text-sm">
               <Building size={14} className="text-teal-500" /> Manage company details and identification
            </p>
          </div>
          <div className="flex gap-3">
             
          </div>
        </div>

        {/* SETTINGS CARD */}
        <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden shadow-2xl relative">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500/50 via-teal-500 to-teal-500/50 opacity-20" />
           
           <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Public Profile Configuration</span>
              </div>
              <Settings size={14} className="text-neutral-700" />
           </div>
           
           <form onSubmit={handleSave} className="p-8 space-y-8">
              {/* Top Row: Name & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3 group">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-teal-500 transition-colors">
                       <Building size={12} /> Organization Name
                    </label>
                    <input 
                       type="text" 
                       value={formData.org_name}
                       onChange={(e) => handleChange('org_name', e.target.value)}
                       className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 focus:outline-none focus:border-teal-500/50 focus:bg-neutral-900 focus:shadow-[0_0_20px_-5px_rgba(20,184,166,0.1)] transition-all"
                       placeholder="e.g. Acme Corp"
                       required
                    />
                 </div>
                 
                 <div className="space-y-3 group">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-teal-500 transition-colors">
                       <Globe2 size={12} /> Organization Slug
                    </label>
                   <div className="flex items-center rounded-xl border border-neutral-800 bg-[#0a0a0a] focus-within:border-teal-500/50 focus-within:bg-neutral-900 focus-within:shadow-[0_0_20px_-5px_rgba(20,184,166,0.1)] transition-all">
                      <span className="px-3 py-3 text-neutral-600 text-sm font-mono border-r border-neutral-800 bg-neutral-900/40 rounded-l-xl">
                        app.nodeos.com/
                      </span>
                      <input 
                         type="text" 
                         value={formData.org_slug}
                         onChange={(e) => handleChange('org_slug', e.target.value)}
                         className="w-full bg-transparent px-3 py-3 text-neutral-200 font-mono text-sm focus:outline-none rounded-r-xl"
                         placeholder="acme-corp"
                         required
                      />
                   </div>
                 </div>
              </div>

              {/* Middle Row: Industry & Logo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3 group">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-teal-500 transition-colors">
                       <Target size={12} /> Industry Type
                    </label>
                    <div className="relative">
                      <select 
                         value={formData.industry_type}
                         onChange={(e) => handleChange('industry_type', e.target.value)}
                         className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 focus:outline-none focus:border-teal-500/50 focus:bg-neutral-900 transition-all appearance-none cursor-pointer"
                      >
                         <option value="Technology">Technology & SaaS</option>
                         <option value="Finance">Fintech & Banking</option>
                         <option value="Healthcare">Healthcare & Biotech</option>
                         <option value="Retail">Retail & E-commerce</option>
                         <option value="Manufacturing">Manufacturing & Industrial</option>
                         <option value="Education">Education & EdTech</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-600">
                        <ArrowDownIcon />
                      </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                       <Upload size={12} /> Company Logo
                    </label>
                    <div className="flex items-start gap-5">
                       <div className="w-20 h-20 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/50 flex items-center justify-center text-neutral-600 overflow-hidden relative group">
                          {formData.company_logo ? (
                             <>
                              <Image
                                src={formData.company_logo}
                                alt="Logo"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover transition-opacity group-hover:opacity-50"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload size={16} className="text-white" />
                              </div>
                             </>
                          ) : (
                             <Building size={20} />
                          )}
                       </div>
                       <div className="flex-grow space-y-3">
                          <input 
                             type="text"
                             value={formData.company_logo || ''}
                             onChange={(e) => handleChange('company_logo', e.target.value)}
                             placeholder="Paste image URL..."
                             className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-teal-500/50 transition-colors"
                          />
                          <p className="text-[11px] text-neutral-500 leading-relaxed">
                            Recommended size: 400x400px. Supports JPG, PNG, or SVG.<br/>
                            <span className="text-neutral-600">Currently hosting externally via URL.</span>
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Read-only ID Section */}
              <div className="p-5 rounded-2xl bg-neutral-900/20 border border-neutral-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex items-start gap-3">
                   <div className="p-2 bg-neutral-800/50 rounded-lg text-teal-500/80 mt-0.5">
                     <AlertCircle size={16} />
                   </div>
                   <div>
                      <p className="text-xs text-neutral-200 font-bold mb-1">System Identification (UUID)</p>
                      <p className="text-[11px] text-neutral-500 leading-tight max-w-md">
                        This ID is immutable and used for all database relationships within the public schema.
                      </p>
                   </div>
                 </div>
                 <div className="bg-black/40 border border-neutral-800 rounded-lg px-4 py-2 font-mono text-[11px] text-teal-500/80 tracking-wide select-all">
                    {formData.id}
                 </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-neutral-900 flex justify-end gap-4">
                 <button 
                    type="button"
                    className="px-6 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 hover:text-white transition-colors"
                 >
                    Discard Changes
                 </button>
                 <button 
                    type="submit"
                    disabled={isSaving}
                    className={`
                       px-8 py-2.5 rounded-xl text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2
                       ${isSaving ? 'bg-neutral-800 text-neutral-500 cursor-wait' : 'bg-teal-600 hover:bg-teal-500 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]'}
                    `}
                 >
                    {isSaving ? (
                       <>Syncing...</>
                    ) : showSuccess ? (
                       <>Saved <CheckCircle2 size={14} /></>
                    ) : (
                       <>Save Configuration <Save size={14} /></>
                    )}
                 </button>
              </div>
           </form>
        </div>
      </main>
      
      {/* Footer / Status Bar */}
     
    </div>
  );
}

// Helper for select arrow
const ArrowDownIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);