"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  User, Shield, Mail, Save, Fingerprint, 
  RefreshCcw, CheckCircle, AlertTriangle 
} from 'lucide-react';

export default function EmployeeSettings() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    is_active: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          id: data.id,
          name: data.name || '',
          email: user.email || '',
          role: data.role || '',
          is_active: data.is_active
        });
      }
    }
    setLoading(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from('employees')
      .update({
        name: profile.name,
        role: profile.role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (error) {
      setMessage({ type: 'error', text: 'Update Failed: System Refused Change' });
    } else {
      setMessage({ type: 'success', text: 'Profile Synchronized Successfully' });
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
    setSaving(false);
  }

  if (loading) return (
    <div className="p-12 animate-pulse space-y-8">
      <div className="h-12 w-64 bg-neutral-900 rounded" />
      <div className="h-96 w-full bg-neutral-900 rounded-3xl" />
    </div>
  );

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-2">
          <Fingerprint size={14} className="text-teal-500" />
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Identity_Management</span>
        </div>
        <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase italic">Personnel_Settings</h1>
      </header>

      <form onSubmit={handleUpdate} className="space-y-6">
        
        {/* Status Card */}
        <div className="bg-zinc-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${profile.is_active ? 'bg-teal-500 animate-pulse' : 'bg-red-500'}`} />
            <div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">System_Status</p>
              <p className="text-sm font-bold text-black dark:text-white uppercase">{profile.is_active ? 'Active_Duty' : 'Inactive'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Employee_ID</p>
            <p className="text-[10px] font-mono text-neutral-400 uppercase">{profile.id}</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <User size={12} /> Full_Name
            </label>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-xs font-bold uppercase outline-none focus:border-teal-500 transition-all text-black dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <Shield size={12} /> Operational_Role
            </label>
            <input 
              type="text" 
              value={profile.role}
              onChange={(e) => setProfile({...profile, role: e.target.value})}
              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-xs font-bold uppercase outline-none focus:border-teal-500 transition-all text-black dark:text-white"
            />
          </div>

          <div className="space-y-2 md:col-span-2 opacity-60">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <Mail size={12} /> Communication_Channel (Read Only)
            </label>
            <input 
              type="email" 
              disabled
              value={profile.email}
              className="w-full bg-zinc-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 text-xs font-bold lowercase cursor-not-allowed text-neutral-500"
            />
          </div>

        </div>

        {/* Feedback Messages */}
        {message && (
          <div className={`p-4 flex items-center gap-3 border ${message.type === 'success' ? 'bg-teal-500/10 border-teal-500/50 text-teal-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-6">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-teal-500 dark:hover:bg-teal-500 hover:text-black transition-all disabled:opacity-50"
          >
            {saving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Synchronizing...' : 'Save_Registry_Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}