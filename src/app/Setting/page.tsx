'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { getUserOrganization, updateOrganization, createOrganization, Organization } from '@/src/modules/organization/actions';
import { getBillingAddress, saveBillingAddress } from '@/src/modules/billing';
import {
  Upload,
  ChevronDown,
  ShieldCheck,
  Check,
  Info,
  Building,
  Globe,
  MapPin,
  Phone,
  Loader2
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

/* --- LOADING COMPONENT --- */
const LoadingPage = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <Loader2 size={32} className="animate-spin text-[#2B6CB0]" />
  </div>
);

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
  'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'
];

const INDUSTRIES = ['Technology', 'Retail', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Media', 'Other'];
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Singapore'];

interface FormData {
  // From organizations table
  org_name: string;
  industry_type: string;
  // From billing_addresses table
  country: string;
  street_address: string;
  city: string;
  zip_code: string;
  state: string;
  phone: string;
}

export default function ClassicSaaSProfile() {
  const { user, loading: authLoading } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [org, setOrg] = useState<Organization | null>(null);

  const [formData, setFormData] = useState<FormData>({
    org_name: '',
    industry_type: 'Technology',
    country: 'India',
    street_address: '',
    city: '',
    zip_code: '',
    state: '',
    phone: '',
  });

  // Snapshot of last saved data for Discard
  const [savedData, setSavedData] = useState<FormData>(formData);

  const colors = {
    navy: '#1A365D',
    blue: '#2B6CB0',
    bg: '#F7FAFC',
    success: '#38A169',
    error: '#E53E3E',
    border: '#E2E8F0'
  };

  // Load organization + billing address data from backend
  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return;
      if (!user) { setInitialLoading(false); return; }

      try {
        // Fetch org data and billing address in parallel
        const [orgData, addressData] = await Promise.all([
          getUserOrganization(),
          getBillingAddress(user.id, 'headquarters'),
        ]);

        const loaded: FormData = {
          // Org fields
          org_name: orgData?.org_name || '',
          industry_type: orgData?.industry_type || 'Technology',
          // Address fields from billing_addresses
          country: addressData?.country || 'India',
          street_address: addressData?.street_address || '',
          city: addressData?.city || '',
          zip_code: addressData?.zip_code || '',
          state: addressData?.state || '',
          phone: addressData?.phone || '',
        };

        if (orgData) setOrg(orgData);
        setFormData(loaded);
        setSavedData(loaded);
      } catch (e) {
        console.error('Error loading settings:', e);
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
  }, [user, authLoading]);

  //logos uploader handler 
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !org) return;

    const supabase = createClient();
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    //upload to supabase storage logos
    const { error: uploadError } = await supabase.storage.from('logos').upload(filePath, file, { upsert: true })

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message); return
    }

    //Get the public URL
    const { data: publicUrl } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    // Update the organization's company_logo
    await updateOrganization(org.id, org.org_name, org.org_slug, publicUrl.publicUrl, org.industry_type);
    // Update local state
    setOrg(prev => prev ? { ...prev, company_logo: publicUrl.publicUrl } : null);

  }

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      if (org) {
        // Update existing org
        await updateOrganization(
          org.id,
          formData.org_name,
          org.org_slug,
          org.company_logo,
          formData.industry_type
        );
      } else {
        // Create new org (first time saving)
        const slug = formData.org_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const newOrg = await createOrganization(
          formData.org_name,
          slug,
          null,
          formData.industry_type
        );
        setOrg(newOrg);
      }

      // Save address fields to billing_addresses table
      await saveBillingAddress(user.id, {
        company_name: formData.org_name,
        phone: formData.phone,
        country: formData.country,
        state: formData.state,
        street_address: formData.street_address,
        city: formData.city,
        zip_code: formData.zip_code,
      }, 'headquarters');

      setSavedData(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Error saving:', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setFormData(savedData);
    setIsSaved(false);
  };

  if (initialLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <p className="text-slate-500">Please sign in to access settings.</p>
      </div>
    );
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
            <p className="text-slate-500 text-sm mt-1">Manage your company&apos;s public identity and contact details.</p>
          </div>
          {org && (
            <span className="text-[11px] font-mono font-bold bg-white border border-slate-200 px-3 py-1 rounded text-slate-400">
              ORG_ID: {org.id.slice(0, 8).toUpperCase()}
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Section 1: Logo */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-6 text-slate-400">Company Branding</h2>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <label className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-md flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group shrink-0 overflow-hidden">
                {org?.company_logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={org.company_logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Upload size={20} className="text-slate-400 group-hover:text-blue-600" />
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-sm font-semibold text-slate-700">Organization Logo</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  240x240px recommended. JPG or PNG. <br />
                  Click the box to upload. This logo will appear on invoices and portals.
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
                    value={formData.org_name}
                    onChange={(e) => handleChange('org_name', e.target.value)}
                    className="w-full border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" style={{ color: colors.navy }}>Industry</label>
                  <div className="relative">
                    <select
                      value={formData.industry_type}
                      onChange={(e) => handleChange('industry_type', e.target.value)}
                      className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm appearance-none bg-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" style={{ color: colors.navy }}>Location</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <select
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="w-full border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm appearance-none bg-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                  value={formData.street_address}
                  onChange={(e) => handleChange('street_address', e.target.value)}
                  className="w-full border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
                <input
                  placeholder="Postal Code"
                  value={formData.zip_code}
                  onChange={(e) => handleChange('zip_code', e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm appearance-none bg-white outline-none"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full border border-slate-200 rounded-md pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500"
                  />
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
                onClick={handleDiscard}
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