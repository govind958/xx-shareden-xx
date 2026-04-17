import { create } from 'zustand'

export type NotificationType = 'message' | 'assignment' | 'status_update' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  created_at: string
  order_item_id?: string
  link?: string
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'created_at'>) => void
  markAsRead: (id: string) => void
  markOrderMessagesAsRead: (orderItemId: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      read: false,
      created_at: new Date().toISOString(),
    }
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
      unreadCount: state.unreadCount + 1,
    }))
  },
  
  markAsRead: (id) => {
    set((state) => {
      const target = state.notifications.find((n) => n.id === id);
      if (!target) return state;

      const remaining = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: remaining,
        unreadCount: Math.max(0, state.unreadCount - (target.read ? 0 : 1)),
      };
    });
  },

  markOrderMessagesAsRead: (orderItemId) => {
    set((state) => {
      const remainingNotifications = state.notifications.filter(
        (n) => !(n.order_item_id === orderItemId && n.type === 'message')
      );
      
      const removedUnreadCount = state.notifications.filter(
        (n) => !n.read && n.order_item_id === orderItemId && n.type === 'message'
      ).length;

      if (remainingNotifications.length === state.notifications.length) return state;

      return {
        notifications: remainingNotifications,
        unreadCount: Math.max(0, state.unreadCount - removedUnreadCount),
      };
    });
  },
  
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },
  
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}))