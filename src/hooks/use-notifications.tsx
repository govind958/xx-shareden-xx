"use client"

import { useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useNotificationStore } from '@/src/store/notification-store'
import { toast } from 'sonner'

// Types for payload
interface ProjectMessage {
  id: string
  order_item_id: string
  sender_role: string  // 'employee' or 'client'
  sender_id: string
  content: string
  created_at: string
}

interface OrderItem {
  id: string
  order_id: string
  assigned_to: string | null
  status: string
}

export function useNotifications(userId: string | undefined) {
  const { addNotification } = useNotificationStore()
  const supabaseRef = useRef(createClient())

  useEffect(() => {
    if (!userId) {
      console.log('[Notifications] No userId, skipping subscription')
      return
    }

    console.log('[Notifications] Setting up subscriptions for user:', userId)
    const supabase = supabaseRef.current

    // Subscribe to new messages for user's order items
    const messagesChannel = supabase
      .channel('user-messages-' + userId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_messages',
        },
        async (payload) => {
          console.log('[Notifications] New message received:', JSON.stringify(payload, null, 2))
          const message = payload.new as ProjectMessage
          console.log('[Notifications] Message details - sender_role:', message.sender_role, ', order_item_id:', message.order_item_id)
          
          // Show notification for ALL messages first to test (remove employee check temporarily)
          // Then we can add the filter back
          
          if (!message.order_item_id) {
            console.log('[Notifications] No order_item_id in message, skipping')
            return
          }

          // Verify this order belongs to the user
          const { data: orderItem, error: orderItemError } = await supabase
            .from('order_items')
            .select('id, order_id')
            .eq('id', message.order_item_id)
            .single()

          console.log('[Notifications] Order item lookup:', orderItem, 'Error:', orderItemError)

          if (!orderItem) {
            console.log('[Notifications] Order item not found')
            return
          }

          // Get the order to check user_id
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('user_id')
            .eq('id', orderItem.order_id)
            .single()

          console.log('[Notifications] Order lookup:', order, 'Error:', orderError)

          const orderUserId = order?.user_id
          console.log('[Notifications] Comparing - Order user_id:', orderUserId, 'Current user:', userId, 'Match:', orderUserId === userId)
          
          if (orderUserId === userId) {
            // Only notify if message is from employee (not from self)
            if (message.sender_role === 'employee') {
              console.log('[Notifications] ✅ Adding notification for employee message')
              addNotification({
                type: 'message',
                title: 'New Message',
                message: message.content?.slice(0, 100) + (message.content?.length > 100 ? '...' : '') || 'New message',
                order_item_id: message.order_item_id,
                link: `/private?tab=stackboard&orderItemId=${message.order_item_id}`,
              })

              // Also show toast for immediate feedback
              toast.info('New message received', {
                description: message.content?.slice(0, 50) + '...' || 'You have a new message',
              })
            } else {
              console.log('[Notifications] Message is from client (self), not notifying. sender_role:', message.sender_role)
            }
          } else {
            console.log('[Notifications] Order does not belong to current user')
          }
        }
      )
      .subscribe((status) => {
        console.log('[Notifications] Messages channel status:', status)
      })

    // Subscribe to order item status changes (employee assignment)
    const assignmentChannel = supabase
      .channel('user-assignments-' + userId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order_items',
        },
        async (payload) => {
          console.log('[Notifications] Order item updated:', payload)
          const oldItem = payload.old as Partial<OrderItem>
          const newItem = payload.new as OrderItem

          // Check if assigned_to changed (new assignment)
          if (oldItem.assigned_to !== newItem.assigned_to && newItem.assigned_to) {
            console.log('[Notifications] Assignment changed, checking ownership...')
            // Verify this order belongs to the user
            const { data: order } = await supabase
              .from('orders')
              .select('user_id')
              .eq('id', newItem.order_id)
              .single()

            if (order?.user_id === userId) {
              // Get employee name
              const { data: employee } = await supabase
                .from('employees')
                .select('name')
                .eq('id', newItem.assigned_to)
                .single()

              console.log('[Notifications] Adding assignment notification')
              addNotification({
                type: 'assignment',
                title: 'Team Assigned',
                message: `${employee?.name || 'A team member'} has been assigned to your order`,
                order_item_id: newItem.id,
                link: `/private?tab=stackboard&orderItemId=${newItem.id}`,
              })

              toast.success('Team assigned to your order!', {
                description: `${employee?.name || 'A team member'} will be working on your stack`,
              })
            }
          }

          // Check if status changed
          if (oldItem.status !== newItem.status) {
            console.log('[Notifications] Status changed from', oldItem.status, 'to', newItem.status)
            const { data: order } = await supabase
              .from('orders')
              .select('user_id')
              .eq('id', newItem.order_id)
              .single()

            if (order?.user_id === userId) {
              const statusMessages: Record<string, string> = {
                processing: 'Your order is now being processed',
                completed: 'Your order has been completed! 🎉',
                cancelled: 'Your order has been cancelled',
              }

              if (statusMessages[newItem.status]) {
                console.log('[Notifications] Adding status notification')
                addNotification({
                  type: 'status_update',
                  title: 'Order Status Update',
                  message: statusMessages[newItem.status],
                  order_item_id: newItem.id,
                  link: `/private?tab=stackboard&orderItemId=${newItem.id}`,
                })

                toast(newItem.status === 'completed' ? '🎉 Order Completed!' : 'Status Update', {
                  description: statusMessages[newItem.status],
                })
              }
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('[Notifications] Assignments channel status:', status)
      })

    return () => {
      console.log('[Notifications] Cleaning up subscriptions')
      supabase.removeChannel(messagesChannel)
      supabase.removeChannel(assignmentChannel)
    }
  }, [userId, addNotification])
}