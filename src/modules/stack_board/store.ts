import { create } from 'zustand';
import { StackboardSidebarItem } from './types';

interface StackboardState {
  sidebarItems: StackboardSidebarItem[];
  isFetched: boolean;
  setSidebarItems: (items: StackboardSidebarItem[] | ((prev: StackboardSidebarItem[]) => StackboardSidebarItem[])) => void;
  reset: () => void;
}

export const useStackboardStore = create<StackboardState>((set) => ({
  sidebarItems: [],
  isFetched: false,
  setSidebarItems: (itemsOrUpdater) => set((state) => ({ 
    sidebarItems: typeof itemsOrUpdater === 'function' ? itemsOrUpdater(state.sidebarItems) : itemsOrUpdater,
    isFetched: true 
  })),
  reset: () => set({ sidebarItems: [], isFetched: false }),
}));
