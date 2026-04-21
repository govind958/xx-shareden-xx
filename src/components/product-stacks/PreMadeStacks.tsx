'use client';

import { useState, useEffect, useCallback } from 'react';
import { Stack } from '@/src/types/product_stacks';
import { 
  ArrowRight, Search, Trash2, X, Clock3, Users, 
  BarChart3, LayoutGrid, Globe, Layers, Box, Database, 
  Shield, Zap, Server, Mail, Target, LucideIcon, AlertTriangle 
} from 'lucide-react'; 
import { createClient } from '@/utils/supabase/client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import {
  createDeployOrderForPreMadeStack,
} from '@/src/modules/orders/createDeployOrder';

type DialogState = {
  open: boolean;
  title: string;
  message: string;
  showUpgrade?: boolean;
  confirmLabel?: string;
  onConfirm?: () => void;
};

const LimitDialog = ({
  dialog,
  onClose,
  onUpgrade,
}: {
  dialog: DialogState;
  onClose: () => void;
  onUpgrade: () => void;
}) => {
  if (!dialog.open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900">{dialog.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{dialog.message}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            {dialog.onConfirm ? 'Cancel' : 'Got it'}
          </button>
          {dialog.onConfirm && (
            <button
              onClick={() => { onClose(); dialog.onConfirm?.(); }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              {dialog.confirmLabel || 'Continue'}
            </button>
          )}
          {dialog.showUpgrade && !dialog.onConfirm && (
            <button
              onClick={onUpgrade}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition"
            >
              Upgrade to Pro
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface PreMadeStacksProps {
  stacks: Stack[];
  onDelete: (id: string) => void;
  isPaid: boolean;
  maxSubStacks: number;
}

const getIconForType = (type?: string) => {
  const typeMap: Record<string, LucideIcon> = {
    database: Database,
    auth: Shield,
    compute: Zap,
    storage: Box,
    cache: Layers,
    network: Globe,
    server: Server,
    group: LayoutGrid,
    analytics: BarChart3,
    crm: Users,
    mail: Mail,
    tracking: Target,
  };

  return typeMap[type?.toLowerCase() || ''] || Database;
};

export function PreMadeStacks({ stacks, onDelete, isPaid, maxSubStacks }: PreMadeStacksProps) {

  const router = useRouter();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewingStack, setViewingStack] = useState<Stack | null>(null);
  const [loadingStackId, setLoadingStackId] = useState<string | null>(null);
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});
  const [dialog, setDialog] = useState<DialogState>({ open: false, title: '', message: '' });

  const closeDialog = useCallback(() => setDialog(prev => ({ ...prev, open: false })), []);
  const handleUpgrade = useCallback(() => {
    closeDialog();
    router.push('/private?tab=client_price');
  }, [closeDialog, router]);

  useEffect(() => {
    const fetchUserCounts = async () => {

      if (stacks.length === 0) return;

      const supabase = createClient();

      const { data } = await supabase
        .from('order_items')
        .select('stack_id, user_id')
        .in('stack_id', stacks.map((s) => s.id));

      const counts: Record<string, Set<string>> = {};

      data?.forEach((item) => {
        if (!counts[item.stack_id]) counts[item.stack_id] = new Set();
        counts[item.stack_id].add(item.user_id);
      });

      setUserCounts(
        Object.fromEntries(
          Object.entries(counts).map(([id, users]) => [id, users.size])
        )
      );
    };

    fetchUserCounts();

  }, [stacks]);

  const filteredStacks = stacks.filter((stack) =>
    stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stack.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deployStack = useCallback(async (stack: Stack, subStackIds: string[]) => {
    setLoadingStackId(stack.id);
    try {
      const result = await createDeployOrderForPreMadeStack({
        stackId: stack.id,
        subStackIds,
        totalAmount: 0,
      });

      if (!result.success) {
        setDialog({
          open: true,
          title: result.redirectToPricing ? 'Upgrade required' : 'Deployment failed',
          message: result.error || 'Could not start deployment.',
          showUpgrade: result.redirectToPricing,
        });
        return;
      }

      router.push('/private?tab=stackboard');
    } catch {
      setDialog({ open: true, title: 'Deployment failed', message: 'Could not start deployment. Please try again.' });
    } finally {
      setLoadingStackId(null);
    }
  }, [router]);

  const handleLoadTemplate = async (stack: Stack) => {

    if (loadingStackId === stack.id || !user) {
      if (!user) {
        setDialog({ open: true, title: 'Sign in required', message: 'Please sign in to deploy a stack.' });
      }
      return;
    }

    const allSubStackIds = stack.sub_stacks?.map(s => s.id) || [];
    const subStackIds = isPaid
      ? allSubStackIds
      : allSubStackIds.slice(0, maxSubStacks);

    if (!isPaid && allSubStackIds.length > maxSubStacks) {
      setDialog({
        open: true,
        title: 'Module limit',
        message: `Starter plan deploys only the first ${maxSubStacks} modules out of ${allSubStackIds.length}. Upgrade to Pro for all modules.`,
        showUpgrade: false,
        confirmLabel: `Deploy with ${maxSubStacks} modules`,
        onConfirm: () => deployStack(stack, subStackIds),
      });
      return;
    }

    deployStack(stack, subStackIds);
  };

  return (

    <section className="w-full py-16 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-14">

          <div>
            <h2 className="text-4xl font-bold text-slate-900">
              Stack Templates
            </h2>

            <p className="text-slate-500 mt-2">
              Deploy pre-configured architectures instantly
            </p>
          </div>

          {/* SEARCH */}

          <div className="relative w-full md:w-96">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

            <input
              type="text"
              placeholder="Search stacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* GRID */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {filteredStacks.map((stack) => (

            <div
              key={stack.id}
              className="group bg-white border border-slate-200 rounded-xl p-6 flex flex-col hover:shadow-lg transition"
            >

              {/* TOP */}

              <div className="flex justify-between items-start mb-6">

                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <LayoutGrid size={20} />
                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => setViewingStack(stack)}
                    className="p-2 text-slate-400 hover:text-blue-600"
                  >
                    <Clock3 size={18} />
                  </button>

                  {stack.author_id === user?.id && (

                    <button
                      onClick={() => onDelete(stack.id)}
                      className="p-2 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>

                  )}

                </div>

              </div>

              {/* BODY */}

              <div className="flex-1 flex flex-col">

                <div className="mb-4">

                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                    {userCounts[stack.id] || 0} deployments
                  </span>

                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {stack.name}
                </h3>

                <p className="text-sm text-slate-500 mb-6 line-clamp-3">
                  {stack.description ||
                    "Production ready architecture template"}
                </p>

                {/* MODULES */}

                <div className="space-y-2 mb-6">

                  {stack.sub_stacks?.slice(0, 3).map((s) => {

                    const SubIcon = getIconForType(s.type);

                    return (

                      <div
                        key={s.id}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >

                        <SubIcon size={14} className="text-blue-500" />

                        {s.name}

                      </div>

                    );

                  })}

                  {(stack.sub_stacks?.length ?? 0) > 3 && (

                    <p className="text-xs text-slate-400">
                      +{(stack.sub_stacks?.length ?? 0) - 3} more modules
                    </p>

                  )}

                </div>

              </div>

              {/* FOOTER */}

              <div className="pt-4 mt-auto">

                {/* <div className="flex justify-between items-center mb-4">

                  <span className="text-sm text-slate-500">Price</span>

                  <span className="text-xl font-bold text-slate-900">
                    ₹{stack.base_price?.toLocaleString()}
                  </span>

                </div> */}

                <button
                  onClick={() => handleLoadTemplate(stack)}
                  disabled={loadingStackId === stack.id}
                  className="w-full py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                  {loadingStackId === stack.id ? 'Processing' : 'Deploy'}
                  <ArrowRight size={16} />
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      <TemplateDetailsPanel
        stack={viewingStack}
        onClose={() => setViewingStack(null)}
        onLoad={handleLoadTemplate}
        isLoading={loadingStackId === viewingStack?.id}
      />

      <LimitDialog dialog={dialog} onClose={closeDialog} onUpgrade={handleUpgrade} />

    </section>
  );
}

const TemplateDetailsPanel = ({
  stack,
  onClose,
  onLoad,
  isLoading,
}: {
  stack: Stack | null;
  onClose: () => void;
  onLoad: (stack: Stack) => void;
  isLoading: boolean;
}) => {

  if (!stack) return null;

  return (

    <div className="fixed inset-0 z-[999] flex justify-end">

      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white h-full flex flex-col shadow-2xl">

        <div className="p-6 border-b flex justify-between items-center">

          <h2 className="text-xl font-semibold text-slate-900">
            {stack.name}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={22} />
          </button>

        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          <p className="text-slate-600">
            {stack.description}
          </p>

          <div className="space-y-3">

            {stack.sub_stacks?.map((sub, i) => {

              const Icon = getIconForType(sub.type);

              return (

                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >

                  <Icon size={20} className="text-blue-600" />

                  <div>

                    <p className="font-medium text-slate-800">
                      {sub.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {sub.type || 'Module'}
                    </p>

                  </div>

                </div>

              );

            })}

          </div>

        </div>

        <div className="p-6 border-t">

          {/* <div className="flex justify-between items-center mb-4">

            <span className="text-slate-500">Total</span>

            <span className="text-2xl font-bold">
              ₹{stack.base_price?.toLocaleString()}
            </span>

          </div> */}

          <button
            onClick={() => onLoad(stack)}
            disabled={isLoading}
            className="w-full py-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing' : 'Deploy Stack'}
            <ArrowRight size={18} />
          </button>

        </div>

      </div>

    </div>
  );
};