'use server'

import Razorpay from 'razorpay'
import { verifyAdminSession } from '@/src/modules/admin/actions'
import { createAdminClient } from '@/utils/supabase/admin'

export type PaymentStatus = 'completed' | 'canceled' | 'pending' | 'refunded'

export type AdminPaymentRecord = {
  id: string
  transactionId: string
  customerName: string
  customerEmail: string
  amount: number
  method: string
  status: PaymentStatus
  date: string
}

type OrderPaymentRow = {
  id: string
  user_id: string
  total_amount: number
  created_at: string
  payment_id: string | null
  razorpay_order_id: string | null
  payment_method: string | null
  is_recurring: boolean | null
  subscription_status: string | null
}

function formatPaymentMethod(method: string | null): string {
  if (!method) return '—'
  const m = method.trim()
  if (!m) return '—'
  if (m.toLowerCase() === 'razorpay') return 'Razorpay'
  return m.charAt(0).toUpperCase() + m.slice(1)
}

function deriveStatus(row: OrderPaymentRow): PaymentStatus {
  const sub = row.subscription_status?.toLowerCase() ?? ''

  if (row.is_recurring) {
    if (['cancelled', 'canceled', 'halted', 'expired'].includes(sub)) {
      return 'canceled'
    }
    if (['created', 'authenticated', 'pending'].includes(sub)) {
      return 'pending'
    }
    if (sub === 'active' || sub === 'completed') {
      return 'completed'
    }
  }

  if (row.payment_id) return 'completed'

  return 'pending'
}

export async function getAdminPayments(): Promise<
  { payments: AdminPaymentRecord[] } | { error: string }
> {
  const { isValid } = await verifyAdminSession()
  if (!isValid) {
    return { error: 'Unauthorized' }
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      error:
        'SUPABASE_SERVICE_ROLE_KEY is not set. Admin payment listings require the service role key on the server.',
    }
  }

  const admin = createAdminClient()

  const { data: rows, error } = await admin
    .from('orders')
    .select(
      `
      id,
      user_id,
      total_amount,
      created_at,
      payment_id,
      razorpay_order_id,
      payment_method,
      is_recurring,
      subscription_status
    `
    )
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  const orders = (rows || []) as OrderPaymentRow[]
  if (orders.length === 0) {
    return { payments: [] }
  }

  const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))]

  const { data: profilesData } = await admin
    .from('profiles')
    .select('user_id, name')
    .in('user_id', userIds)

  const profiles = profilesData || []
  const nameByUser = new Map<string, string>(
    profiles.map((p: { user_id: string; name: string | null }) => [
      p.user_id,
      p.name?.trim() || '',
    ])
  )

  const emailByUser = new Map<string, string>()
  await Promise.all(
    userIds.map(async (uid) => {
      try {
        const { data, error: userErr } = await admin.auth.admin.getUserById(uid)
        if (!userErr && data.user?.email) {
          emailByUser.set(uid, data.user.email)
        }
      } catch {
        /* skip */
      }
    })
  )

  const payments: AdminPaymentRecord[] = orders.map((o) => {
    const name = nameByUser.get(o.user_id) || ''
    const email = emailByUser.get(o.user_id) || ''
    const transactionId =
      o.payment_id?.trim() || o.razorpay_order_id?.trim() || '—'

    return {
      id: o.id,
      transactionId,
      customerName: name || 'Customer',
      customerEmail: email || '—',
      amount: Number(o.total_amount),
      method: formatPaymentMethod(o.payment_method),
      status: deriveStatus(o),
      date: o.created_at,
    }
  })

  return { payments }
}

export async function adminRefundPayment(
  orderId: string
): Promise<{ success: true } | { error: string }> {
  const { isValid } = await verifyAdminSession()
  if (!isValid) {
    return { error: 'Unauthorized' }
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Server misconfiguration: missing SUPABASE_SERVICE_ROLE_KEY' }
  }

  if (!orderId?.trim()) {
    return { error: 'Invalid order' }
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return { error: 'Razorpay is not configured' }
  }

  const admin = createAdminClient()
  const { data: order, error: fetchErr } = await admin
    .from('orders')
    .select('id, payment_id')
    .eq('id', orderId)
    .single()

  if (fetchErr || !order) {
    return { error: fetchErr?.message || 'Order not found' }
  }

  const row = order as { id: string; payment_id: string | null }

  const paymentId = row.payment_id?.trim()
  if (!paymentId) {
    return { error: 'No Razorpay payment id on this order' }
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

  try {
    await razorpay.payments.refund(paymentId, {})
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Refund failed'
    return { error: message }
  }

  return { success: true }
}
