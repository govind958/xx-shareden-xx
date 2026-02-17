"use client"

import { useState } from 'react'
import { Bell, MessageSquare, UserCheck, Info, CheckCheck } from 'lucide-react'
import { useNotificationStore, Notification, NotificationType } from '@/src/store/notification-store'
import { formatDistanceToNow } from 'date-fns'

const iconMap: Record<NotificationType, React.ReactNode> = {
  message: <MessageSquare size={16} className="text-blue-400" />,
  assignment: <UserCheck size={16} className="text-teal-400" />,
  status_update: <Info size={16} className="text-amber-400" />,
  info: <Info size={16} className="text-neutral-400" />,
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotificationStore()

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 transition"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-teal-500 hover:text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-neutral-600">
                  <Bell size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification: Notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 border-b border-neutral-900 hover:bg-neutral-900/50 cursor-pointer transition ${
                      !notification.read ? 'bg-teal-500/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                        {iconMap[notification.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-white truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-neutral-600 mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-neutral-800">
                <button
                  onClick={clearAll}
                  className="w-full py-2 text-xs text-neutral-500 hover:text-white transition"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}