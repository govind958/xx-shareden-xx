"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  User, Shield, Mail, Save, Fingerprint, 
  RefreshCcw, CheckCircle, AlertTriangle,
  Phone, Building, Bell, Key
} from 'lucide-react';

export default function EmployeeSettings() {

  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    notifications: true,
    last_login: '',
    two_factor_enabled: false,
    is_active: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {

      const { data } = await supabase
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
          department: data.specialization || '',
          phone: data.phone || '',
          emergency_contact_name: data.emergency_contact_name || 'govind anand',
          emergency_contact_phone: data.emergency_contact_phone || '+917739018221',
          notifications: data.notifications ?? true,
          last_login: data.last_login || '',
          two_factor_enabled: data.two_factor_enabled || false,
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
        specialization: profile.department,
        phone: profile.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (error) {

      setMessage({
        type: 'error',
        text: 'Update Failed: System Refused Change'
      });

    } else {

      setMessage({
        type: 'success',
        text: 'Profile Synchronized Successfully'
      });

      setTimeout(() => setMessage(null), 3000);
    }

    setSaving(false);
  }

  if (loading) return (

    <div className="p-12 flex items-center justify-center">

      <div className="flex items-center gap-3 text-neutral-500">

        <RefreshCcw size={18} className="animate-spin text-teal-500" />

        <span className="text-xs font-black uppercase tracking-widest">
          Loading Employee Profile
        </span>

      </div>

    </div>

  );

  return (

    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">

      {/* Header */}

      <header>

        <div className="flex items-center gap-2 mb-2">
          <Fingerprint size={14} className="text-teal-500" />
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">
            Identity_Management
          </span>
        </div>

        <h1 className="text-5xl font-black text-black dark:text-white tracking-tighter uppercase italic">
          Personnel_Settings
        </h1>

      </header>

      <form onSubmit={handleUpdate} className="space-y-6">

        {/* Status Card */}

        <div className="bg-zinc-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className={`w-3 h-3 rounded-full ${profile.is_active ? 'bg-teal-500 animate-pulse' : 'bg-red-500'}`} />

            <div>

              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                System_Status
              </p>

              <p className="text-sm font-bold text-black dark:text-white uppercase">
                {profile.is_active ? 'Active_Duty' : 'Inactive'}
              </p>

            </div>

          </div>

          <div className="text-right">

            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
              Employee_ID
            </p>

            <p className="text-[10px] font-mono text-neutral-400 uppercase">
              {profile.id}
            </p>

          </div>

        </div>

        {/* Profile Fields */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <User size={12} /> Full_Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-xs font-bold uppercase outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <Shield size={12} /> Operational_Role
            </label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-xs font-bold uppercase outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <Building size={12} /> Department
            </label>
            <input
              type="text"
              value={profile.department}
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-xs font-bold uppercase outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
              <Phone size={12} /> Phone
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 text-xs font-bold outline-none focus:border-teal-500"
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

        {/* Emergency Contact */}

        <div className="bg-zinc-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl space-y-4">

          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">
            Emergency_Contact
          </p>

          <input
            value={profile.emergency_contact_name}
            disabled
            className="w-full p-4 border border-neutral-200 dark:border-neutral-800 bg-zinc-100 dark:bg-neutral-900 text-xs font-bold cursor-not-allowed text-neutral-500"
          />

          <input
            value={profile.emergency_contact_phone}
            disabled
            className="w-full p-4 border border-neutral-200 dark:border-neutral-800 bg-zinc-100 dark:bg-neutral-900 text-xs font-bold cursor-not-allowed text-neutral-500"
          />

        </div>

        {/* Security */}

        <div className="bg-zinc-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl space-y-4">

          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">
            Security_Module
          </p>

          <div className="flex justify-between">
            <span className="text-xs font-bold uppercase">Two_Factor_Authentication</span>
            <span className={`${profile.two_factor_enabled ? 'text-teal-500' : 'text-red-500'} text-xs font-bold`}>
              {profile.two_factor_enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 text-xs font-black uppercase text-teal-500"
          >
            <Key size={14} /> Reset_Password
          </button>

        </div>

        {/* Notifications */}

        <div className="flex items-center gap-3">

          <Bell size={14} />

          <label className="text-xs font-bold uppercase">
            Enable System Notifications
          </label>

          <input
            type="checkbox"
            checked={profile.notifications}
            onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
          />

        </div>

        {/* Last Login */}

        <div className="text-xs font-bold text-neutral-500 uppercase">
          Last_Login : {profile.last_login || "Unknown"}
        </div>

        {/* Feedback */}

        {message && (

          <div className={`p-4 flex items-center gap-3 border ${message.type === 'success'
            ? 'bg-teal-500/10 border-teal-500/50 text-teal-500'
            : 'bg-red-500/10 border-red-500/50 text-red-500'
          }`}>

            {message.type === 'success'
              ? <CheckCircle size={16} />
              : <AlertTriangle size={16} />}

            <span className="text-[10px] font-black uppercase tracking-widest">
              {message.text}
            </span>

          </div>

        )}

        {/* Save */}

        <div className="pt-6">

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-teal-500 hover:text-black transition-all disabled:opacity-50"
          >

            {saving
              ? <RefreshCcw size={16} className="animate-spin" />
              : <Save size={16} />}

            {saving ? 'Synchronizing...' : 'Save_Registry_Changes'}

          </button>

        </div>

      </form>

    </div>

  );

}