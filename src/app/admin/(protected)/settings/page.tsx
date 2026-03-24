"use client";

import React, { useState, useEffect } from 'react';
import {
    User, Shield, Mail, Save,
    RefreshCcw, CheckCircle, AlertTriangle, Terminal, Clock, Key
} from 'lucide-react';
import { getAdminProfile, updateAdminProfile } from '@/src/modules/admin/actions';

interface AdminProfile {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    last_login_at: string;
}

export default function AdminSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [profile, setProfile] = useState<AdminProfile>({
        id: '',
        name: '',
        email: '',
        is_active: false,
        last_login_at: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        setLoading(true);
        const result = await getAdminProfile();

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
            setLoading(false);
            return;
        }

        if (result.profile) {
            setProfile({
                id: result.profile.id,
                name: result.profile.name || '',
                email: result.profile.email || '',
                is_active: result.profile.is_active,
                last_login_at: result.profile.last_login_at || 'Never'
            });
        }
        setLoading(false);
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const result = await updateAdminProfile(profile.name);

        if (result.error) {
            setMessage({ type: 'error', text: 'Update Failed: ' + result.error });
        } else {
            setMessage({ type: 'success', text: 'Superuser Profile Synchronized' });
            setTimeout(() => setMessage(null), 3000);
        }
        setSaving(false);
    }

    const formatTime = (isoString: string) => {
        if (!isoString || isoString === 'Never') return 'NO_RECORD';
        const date = new Date(isoString);
        return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    };

    return (
        <div className="dark min-h-screen bg-[#020202] text-neutral-400 font-sans selection:bg-teal-500/30 py-8">

            {loading ? (
                <div className="p-12 max-w-4xl mx-auto animate-pulse space-y-8">
                    <div className="h-12 w-64 bg-neutral-900 rounded" />
                    <div className="h-48 w-full bg-neutral-900 rounded-3xl" />
                    <div className="h-64 w-full bg-neutral-900 rounded-3xl" />
                </div>
            ) : (
                <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">

                    {/* Header */}
                    <header>
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal size={14} className="text-teal-500" />
                            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">System_Administration</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Superuser_Config</h1>
                    </header>

                    <form onSubmit={handleUpdate} className="space-y-6">

                        {/* Status Card */}
                        <div className="bg-neutral-900/40 border border-neutral-800 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">

                            {/* Background Accent */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                            <div className="flex items-center gap-4 z-10">
                                <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.6)] ${profile.is_active ? 'bg-teal-500 animate-pulse' : 'bg-red-500'}`} />
                                <div>
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Clearance_Status</p>
                                    <p className="text-sm font-bold text-white uppercase">{profile.is_active ? 'Level_Zero_Active' : 'Revoked'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 z-10">
                                <div className="hidden sm:block text-right">
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center justify-end gap-1 mb-0.5">
                                        <Clock size={10} /> Last_Access
                                    </p>
                                    <p className="text-[10px] font-mono text-neutral-300 uppercase">{formatTime(profile.last_login_at)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center justify-end gap-1 mb-0.5">
                                        <Shield size={10} /> Admin_ID
                                    </p>
                                    <p className="text-[10px] font-mono text-teal-400 uppercase">{profile.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                    <User size={12} className="text-neutral-400" /> Display_Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full bg-black border border-neutral-800 p-4 text-xs font-bold uppercase outline-none focus:border-teal-500/50 focus:bg-neutral-900/50 transition-all text-white placeholder-neutral-700 rounded-xl"
                                    placeholder="ENTER_ADMIN_ALIAS"
                                />
                            </div>

                            <div className="space-y-2 opacity-60">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                    <Mail size={12} className="text-neutral-400" /> Root_Email (Read Only)
                                </label>
                                <input
                                    type="email"
                                    disabled
                                    value={profile.email}
                                    className="w-full bg-neutral-900 border border-neutral-800 p-4 text-xs font-bold lowercase cursor-not-allowed text-neutral-500 rounded-xl"
                                />
                            </div>

                        </div>

                        {/* Security Warning Block */}
                        <div className="mt-8 p-5 border border-amber-500/20 bg-amber-500/5 rounded-2xl flex items-start gap-4">
                            <Key className="text-amber-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-widest mb-1">Authentication Keys</h4>
                                <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                                    Password hashes and secret keys are managed through the centralized security module. Modifying authorization parameters requires primary root access.
                                </p>
                            </div>
                        </div>

                        {/* Feedback Messages */}
                        {message && (
                            <div className={`p-4 flex items-center gap-3 border rounded-xl animate-in slide-in-from-bottom-2 ${message.type === 'success'
                                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                                }`}>
                                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                                <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center justify-center gap-3 w-full md:w-auto bg-white text-black px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-teal-500 hover:text-black hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-none"
                            >
                                {saving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                                {saving ? 'Commiting_Changes...' : 'Update_Admin_Registry'}
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </div>
    );
}