'use client';

import { useState, useEffect } from 'react';
import { Stack } from '@/src/types/product_stacks';
import { 
  ArrowRight, Search, Trash2, User, X, Clock, Clock3, Users, 
  BarChart3, LayoutGrid, Globe, Layers, Box, Database, 
  Shield, Zap, Server, Mail, Target, LucideIcon 
} from 'lucide-react'; 
import { createClient } from '@/utils/supabase/client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';

interface PreMadeStacksProps {
  stacks: Stack[];
  onDelete: (id: string) => void;
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

export function PreMadeStacks({ stacks, onDelete }: PreMadeStacksProps) {

  const router = useRouter();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewingStack, setViewingStack] = useState<Stack | null>(null);
  const [loadingStackId, setLoadingStackId] = useState<string | null>(null);
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});

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

  const handleLoadTemplate = async (stack: Stack) => {

    if (loadingStackId === stack.id || !user) {

      if (!user) alert('Please sign in to continue.');
      return;
    }

    setLoadingStackId(stack.id);

    try {

      const supabase = createClient();

      const subStackIds = stack.sub_stacks?.map(s => s.id) || [];

      const totalPrice =
        stack.sub_stacks?.reduce((sum, sub) => sum + (sub.price || 0), 0) ||
        stack.base_price ||
        0;

      const { error } = await supabase.from('cart_stacks').insert({
        user_id: user.id,
        stack_id: stack.id,
        sub_stack_ids: subStackIds,
        total_price: totalPrice,
        status: 'active',
      });

      if (error) throw error;

      router.push('/private?tab=stacks_cart');

    } catch (err) {

      alert('Error adding to cart.');

    } finally {

      setLoadingStackId(null);

    }
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

              <div className="border-t pt-4 mt-auto">

                <div className="flex justify-between items-center mb-4">

                  <span className="text-sm text-slate-500">Price</span>

                  <span className="text-xl font-bold text-slate-900">
                    ₹{stack.base_price?.toLocaleString()}
                  </span>

                </div>

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

          <div className="flex justify-between items-center mb-4">

            <span className="text-slate-500">Total</span>

            <span className="text-2xl font-bold">
              ₹{stack.base_price?.toLocaleString()}
            </span>

          </div>

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