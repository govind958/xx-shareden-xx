'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'crypto'
import { Order, Profile } from '@/src/types/admin'
import { sendStatusNotificationEmail, type OrderStatus } from '@/src/modules/email/send-status-notification'

// Helper to hash values (secret key, password, etc.)
function hashValue(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

// Helper to generate session token
function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

// Admin login with email, password and secret key
export async function adminLogin(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const secretKey = formData.get('secretKey') as string

  if (!email || !password || !secretKey) {
    redirect('/admin/login?error=missing_fields')
  }

  // Query admin_users table
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, name, secret_key_hash, password_hash, is_active')
    .eq('email', email.toLowerCase().trim())
    .eq('is_active', true)
    .single()

  if (adminError || !adminUser) {
    redirect('/admin/login?error=invalid_credentials')
  }

  // Verify password
  const providedPasswordHash = hashValue(password)
  if (!adminUser.password_hash || adminUser.password_hash !== providedPasswordHash) {
    redirect('/admin/login?error=invalid_credentials')
  }

  // Verify secret key
  const providedSecretHash = hashValue(secretKey)
  if (adminUser.secret_key_hash !== providedSecretHash) {
    redirect('/admin/login?error=invalid_credentials')
  }

  // Generate session token
  const sessionToken = generateSessionToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

  // Create session
  const { error: sessionError } = await supabase
    .from('admin_sessions')
    .insert({
      admin_user_id: adminUser.id,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    })

  if (sessionError) {
    redirect('/admin/login?error=session_error')
  }

  // Update last login
  await supabase
    .from('admin_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', adminUser.id)

  // Set admin session cookie
  const cookieStore = await cookies()
  console.log('Setting admin_session_token cookie, token length:', sessionToken.length)
  cookieStore.set('admin_session_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  // Verify the cookie was set
  const verifyToken = cookieStore.get('admin_session_token')
  console.log('Cookie verification after set:', !!verifyToken?.value)

  revalidatePath('/admin', 'layout')
  redirect('/admin/dashboard')
}

// Admin logout
export async function adminLogout() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('admin_session_token')?.value

  if (sessionToken) {
    const supabase = await createClient()
    // Delete session from database
    await supabase
      .from('admin_sessions')
      .delete()
      .eq('session_token', sessionToken)
  }

  // Clear cookie
  cookieStore.delete('admin_session_token')

  revalidatePath('/admin', 'layout')
  redirect('/admin/login')
}

// Verify admin session (server-side)
export async function verifyAdminSession(): Promise<{
  isValid: boolean
  adminUser?: { id: string; email: string; name: string | null }
}> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('admin_session_token')?.value

  console.log('verifyAdminSession - sessionToken exists:', !!sessionToken)

  if (!sessionToken) {
    console.log('verifyAdminSession - No session token found')
    return { isValid: false }
  }

  const supabase = await createClient()

  // Check session validity
  const { data: session, error: sessionError } = await supabase
    .from('admin_sessions')
    .select('admin_user_id, expires_at')
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (sessionError || !session) {
    return { isValid: false }
  }

  // Get admin user details
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, name, is_active')
    .eq('id', session.admin_user_id)
    .eq('is_active', true)
    .single()

  if (adminError || !adminUser) {
    return { isValid: false }
  }

  return {
    isValid: true,
    adminUser: {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
    },
  }
}

// Get orders for a user (for tooltip display)
export async function getUserOrders(userId: string) {
  const { isValid } = await verifyAdminSession()

  if (!isValid) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()

  // Fetch orders with order items
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      created_at,
      order_items (
        id,
        stack_id,
        status,
        created_at,
        stacks (
          id,
          name,
          type
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (ordersError) {
    return { error: ordersError.message }
  }

  return { orders: orders || [] }
}

// ======================
// EMPLOYEE MANAGEMENT
// ======================

// Get all employees
export async function getEmployees() {
  const { isValid } = await verifyAdminSession()

  if (!isValid) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()

  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    return { error: error.message }
  }

  return { employees: employees || [] }
}

// Get employee assignments with details
export async function getEmployeeAssignments() {
  const { isValid } = await verifyAdminSession()

  if (!isValid) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()

  const { data: assignments, error } = await supabase
    .from('employee_assignments')
    .select(`
      id,
      employee_id,
      order_item_id,
      assigned_at,
      status,
      notes,
      employees (
        id,
        name,
        email,
        role,
        specialization
      ),
      order_items (
        id,
        order_id,
        user_id,
        stack_id,
        status,
        progress_percent,
        stacks (
          id,
          name,
          type
        ),
        profiles:user_id (
          user_id,
          name,
          email
        )
      )
    `)
    .order('assigned_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { assignments: assignments || [] }
}

// Assign employee to order item
export async function assignEmployeeToOrderItem(
  employeeId: string,
  orderItemId: string,
  notes?: string
) {
  const { isValid, adminUser } = await verifyAdminSession()

  if (!isValid || !adminUser) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()
  const adminClient = createAdminClient()

  // Check if assignment already exists
  const { data: existing } = await supabase
    .from('employee_assignments')
    .select('id')
    .eq('employee_id', employeeId)
    .eq('order_item_id', orderItemId)
    .single()

  if (existing) {
    return { error: 'Employee is already assigned to this order item' }
  }

  // Fetch order item details for notification
  const { data: orderItem } = await supabase
    .from('order_items')
    .select(`
      id,
      user_id,
      status,
      stacks:stack_id (name)
    `)
    .eq('id', orderItemId)
    .single()

  // Get employee details
  const { data: employee } = await supabase
    .from('employees')
    .select('name')
    .eq('id', employeeId)
    .single()

  // Create assignment
  const { data: assignment, error } = await supabase
    .from('employee_assignments')
    .insert({
      employee_id: employeeId,
      order_item_id: orderItemId,
      assigned_by: adminUser.id,
      status: 'assigned',
      notes: notes || null,
    })
    .select()
    .single()

  if (error) {
    console.log('Assignment creation error:', error.message)
    return { error: error.message }
  }

  console.log('Assignment created successfully:', assignment?.id)

  // Update order_item assigned_to field
  await supabase
    .from('order_items')
    .update({ assigned_to: employeeId })
    .eq('id', orderItemId)

  // Send email notification to customer about assignment
  console.log('=== EMAIL NOTIFICATION START ===')
  console.log('orderItem:', orderItem)
  console.log('orderItem.user_id:', orderItem?.user_id)

  if (orderItem?.user_id) {
    try {
      console.log('Fetching user data for user_id:', orderItem.user_id)
      const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(orderItem.user_id)

      if (userError) {
        console.error('Failed to get user data:', userError)
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', orderItem.user_id)
        .single()

      if (userData?.user?.email) {
        const stackName = (orderItem.stacks as { name: string } | null)?.name || 'Your Stack'

        const emailResult = await sendStatusNotificationEmail({
          customerEmail: userData.user.email,
          customerName: profile?.name || 'Valued Customer',
          orderItemId: orderItemId,
          stackName: stackName,
          newStatus: 'processing' as OrderStatus,
          previousStatus: orderItem.status as OrderStatus,
          employeeName: employee?.name,
          adminNote: notes,
        })

        if (!emailResult.success) {
          console.error('Email send failed:', emailResult.error)
        } else {
          console.log('Assignment notification email sent successfully to:', userData.user.email)
        }
      } else {
        console.error('No email found for user:', orderItem.user_id)
      }
    } catch (emailError) {
      console.error('Failed to send assignment notification email:', emailError)
    }
  } else {
    console.error('No user_id found on order item:', orderItemId)
  }

  return { assignment }
}

// Assign employee to order item and send notification (for client-side use without admin session)
export async function assignEmployeeAndNotify(
  employeeId: string,
  orderItemId: string,
  notes?: string
) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  // Check if assignment already exists
  const { data: existing } = await supabase
    .from('employee_assignments')
    .select('id')
    .eq('employee_id', employeeId)
    .eq('order_item_id', orderItemId)
    .single()

  if (existing) {
    return { error: 'Employee is already assigned to this order item' }
  }

  // Fetch order item details for notification
  const { data: orderItem } = await supabase
    .from('order_items')
    .select(`
      id,
      user_id,
      status,
      stacks:stack_id (name)
    `)
    .eq('id', orderItemId)
    .single()

  // Get employee details
  const { data: employee } = await supabase
    .from('employees')
    .select('name')
    .eq('id', employeeId)
    .single()

  // Update order_item assigned_to field and status
  const { error: updateError } = await supabase
    .from('order_items')
    .update({ assigned_to: employeeId, status: 'processing' })
    .eq('id', orderItemId)

  if (updateError) {
    return { error: updateError.message }
  }

  // Create assignment using upsert
  const { error: assignError } = await supabase
    .from('employee_assignments')
    .upsert({
      employee_id: employeeId,
      order_item_id: orderItemId,
      status: 'assigned',
      notes: notes || null,
    }, { onConflict: 'employee_id,order_item_id' })

  if (assignError) {
    console.log('Assignment creation error:', assignError.message)
    return { error: assignError.message }
  }

  console.log('Assignment created successfully for order item:', orderItemId)

  // Send email notification to customer about assignment
  console.log('=== EMAIL NOTIFICATION START ===')
  console.log('orderItem:', orderItem)
  console.log('orderItem.user_id:', orderItem?.user_id)

  if (orderItem?.user_id) {
    try {
      console.log('Fetching user data for user_id:', orderItem.user_id)
      const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(orderItem.user_id)

      if (userError) {
        console.error('Failed to get user data:', userError)
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', orderItem.user_id)
        .single()

      if (userData?.user?.email) {
        const stackName = (orderItem.stacks as { name: string } | null)?.name || 'Your Stack'

        const emailResult = await sendStatusNotificationEmail({
          customerEmail: userData.user.email,
          customerName: profile?.name || 'Valued Customer',
          orderItemId: orderItemId,
          stackName: stackName,
          newStatus: 'processing' as OrderStatus,
          previousStatus: orderItem.status as OrderStatus,
          employeeName: employee?.name,
          adminNote: notes,
        })

        if (!emailResult.success) {
          console.error('Email send failed:', emailResult.error)
        } else {
          console.log('Assignment notification email sent successfully to:', userData.user.email)
        }
      } else {
        console.error('No email found for user:', orderItem.user_id)
      }
    } catch (emailError) {
      console.error('Failed to send assignment notification email:', emailError)
    }
  } else {
    console.error('No user_id found on order item:', orderItemId)
  }

  return { success: true }
}

// Unassign employee from order item
export async function unassignEmployeeFromOrderItem(assignmentId: string) {
  const { isValid } = await verifyAdminSession()

  if (!isValid) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()

  // Get assignment to find order_item_id
  const { data: assignment } = await supabase
    .from('employee_assignments')
    .select('order_item_id')
    .eq('id', assignmentId)
    .single()

  if (assignment) {
    // Clear assigned_to in order_items
    await supabase
      .from('order_items')
      .update({ assigned_to: null })
      .eq('id', assignment.order_item_id)
  }

  // Delete assignment
  const { error } = await supabase
    .from('employee_assignments')
    .delete()
    .eq('id', assignmentId)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// Get unassigned order items
export async function getUnassignedOrderItems() {
  const { isValid } = await verifyAdminSession()

  if (!isValid) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()

  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select(`
      id,
      order_id,
      user_id,
      stack_id,
      status,
      progress_percent,
      assigned_to,
      stacks (
        id,
        name,
        type
      ),
      profiles:user_id (
        user_id,
        name,
        email
      )
    `)
    .is('assigned_to', null)
    .in('status', ['initiated', 'in_progress'])
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { orderItems: orderItems || [] }
}

// Get all orders with details
export async function getAllOrders() {
  const { isValid } = await verifyAdminSession()

  if (!isValid) {
    return { error: 'Unauthorized' }
  }

  const supabase = await createClient()

  const { data: ordersData, error } = await supabase
    .from('orders')
    .select(`
      id,
      user_id,
      total_amount,
      created_at,
      updated_at,
      order_items (
        id,
        stack_id,
        status,
        progress_percent,
        assigned_to,
        created_at,
        stacks (
          id,
          name,
          type
        ),
        employee_assignments (
          id,
          employee_id,
          status,
          employees (
            id,
            name,
            email,
            role
          )
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  // Fetch profiles separately and merge
  const orders = (ordersData || []) as unknown as Order[]
  let ordersWithProfiles = orders
  if (orders.length > 0) {
    const userIds = [...new Set(
      orders
        .map((o) => o.user_id)
        .filter((id): id is string => Boolean(id))
    )]

    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, name, email')
        .in('user_id', userIds)

      const profiles = (profilesData || []) as Profile[]

      // Create a map of user_id to profile
      const profileMap = new Map(
        profiles.map((p) => [p.user_id, p])
      )

      // Merge profiles into orders
      ordersWithProfiles = orders.map((order) => ({
        ...order,
        profiles: order.user_id ? profileMap.get(order.user_id) || null : null,
      }))
    }
  }

  return { orders: ordersWithProfiles }
}

// Update order item status (admin action with email notification)
export async function updateOrderItemStatusAdmin(
  orderItemId: string,
  newStatus: OrderStatus,
  adminNote?: string
): Promise<{ success: boolean; error?: string }> {
  const { isValid, adminUser } = await verifyAdminSession()

  if (!isValid || !adminUser) {
    return { success: false, error: 'Unauthorized - Admin session required' }
  }

  const supabase = await createClient()
  const adminClient = createAdminClient()

  // Fetch order item with user and stack details
  const { data: orderItem, error: fetchError } = await supabase
    .from('order_items')
    .select(`
      id,
      status,
      user_id,
      assigned_to,
      progress_percent,
      stacks:stack_id (name),
      employees:assigned_to (name)
    `)
    .eq('id', orderItemId)
    .single()

  if (fetchError || !orderItem) {
    return { success: false, error: 'Order item not found' }
  }

  const previousStatus = orderItem.status as OrderStatus

  // Determine progress based on status
  let progressPercent = orderItem.progress_percent
  switch (newStatus) {
    case 'processing':
      progressPercent = 10
      break
    case 'in_progress':
      progressPercent = 25
      break
    case 'completed':
      progressPercent = 100
      break
    case 'cancelled':
      progressPercent = 0
      break
  }

  // Update order_items table
  const { error: updateError } = await supabase
    .from('order_items')
    .update({
      status: newStatus,
      progress_percent: progressPercent,
      admin_note: adminNote || null,
    })
    .eq('id', orderItemId)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  // Update employee_assignments status if assigned
  if (orderItem.assigned_to) {
    const assignmentStatus = newStatus === 'completed' ? 'completed' :
      newStatus === 'in_progress' ? 'in_progress' :
        newStatus === 'cancelled' ? 'cancelled' : 'assigned'

    await supabase
      .from('employee_assignments')
      .update({ status: assignmentStatus })
      .eq('order_item_id', orderItemId)
  }

  // Send email notification to customer if status changed
  if (previousStatus !== newStatus && orderItem.user_id) {
    try {
      const { data: userData } = await adminClient.auth.admin.getUserById(orderItem.user_id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', orderItem.user_id)
        .single()

      if (userData?.user?.email) {
        const stackName = (orderItem.stacks as { name: string } | null)?.name || 'Your Stack'
        const employeeName = (orderItem.employees as { name: string } | null)?.name

        await sendStatusNotificationEmail({
          customerEmail: userData.user.email,
          customerName: profile?.name || 'Valued Customer',
          orderItemId: orderItemId,
          stackName: stackName,
          newStatus: newStatus,
          previousStatus: previousStatus,
          progressPercent: progressPercent ?? undefined,
          employeeName: employeeName,
          adminNote: adminNote,
        })
      }
    } catch (emailError) {
      console.error('Failed to send status notification email:', emailError)
    }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/admin/employees')

  return { success: true }
}
