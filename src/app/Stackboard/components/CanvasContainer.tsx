'use client';

import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { DnDProvider } from '../DnDContext';
import { Stack, SubStack } from '@/src/types/product_stack';
import { SavedStack } from '../types/canvas';
import { createClient } from '@/utils/supabase/client';

interface CanvasContainerProps {
  stacks: Stack[];
  subStacks: SubStack[];
}

const STORAGE_KEY_SAVED_STACKS = 'product_stacks_saved_deployments';

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ stacks, subStacks }) => {
  const deleteClusterRef = useRef<((clusterNodeId: string) => void) | null>(null);
  const [userName, setUserName] = useState<string>('User');

  // Load current user profile (name/email) once
  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        if (user) {
          const fullName =
            (user.user_metadata && (user.user_metadata.full_name as string | undefined)) || '';
          const email = user.email || '';
          setUserName(fullName || email || 'User');
        }
      } catch (e) {
        // fail silently, keep default 'User'
      }
    };
    loadUser();
  }, []);

  // Load saved stacks from localStorage on mount
  const [savedStacks, setSavedStacks] = useState<SavedStack[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED_STACKS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever savedStacks changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SAVED_STACKS, JSON.stringify(savedStacks));
    }
  }, [savedStacks]);

  const handleCreateStack = (newStack: SavedStack) => {
    setSavedStacks((prev) => [newStack, ...prev]);
  };

  const handleDeleteStack = (stackId: string) => {
    // Find the stack being deleted to get its cluster node ID
    const stackToDelete = savedStacks.find((stack) => stack.id === stackId);
    
    // Delete from saved stacks
    setSavedStacks((prev) => prev.filter((stack) => stack.id !== stackId));
    
    // Also delete the corresponding cluster node from canvas if it exists
    if (stackToDelete?.clusterNodeId && deleteClusterRef.current) {
      deleteClusterRef.current(stackToDelete.clusterNodeId);
    }
  };

  return (
    <div className="bg-[#080808] border border-neutral-900 rounded-[24px] overflow-hidden flex flex-col h-[750px] shadow-2xl">
      <div className="px-8 py-5 border-b border-neutral-900 bg-neutral-900/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
            Visual Deployment Logic
          </span>
        </div>
        <button className="text-[10px] font-bold bg-teal-600 text-black px-4 py-1.5 rounded-lg uppercase tracking-widest hover:bg-teal-400 transition">
          Finalize Build
        </button>
      </div>

      <div className="flex flex-grow overflow-hidden relative">
        <DnDProvider>
          <Sidebar stacks={stacks} savedStacks={savedStacks} onDeleteStack={handleDeleteStack} />
          <Canvas
            onStackCreate={handleCreateStack}
            onDeleteClusterRef={deleteClusterRef}
            userName={userName}
          />
        </DnDProvider>
      </div>
    </div>
  );
};

