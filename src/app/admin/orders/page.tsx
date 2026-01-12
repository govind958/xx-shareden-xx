import { createClient } from "@/utils/supabase/server"
import { verifyAdminSession } from "@/src/modules/admin/actions"
import { redirect } from "next/navigation"
import { OrdersManagement } from "./orders-management"
import { Order, Profile } from "@/src/types/admin"

export default async function AdminOrdersPage() {
  const { isValid } = await verifyAdminSession()

  if (!isValid) {
    redirect("/admin/login")
  }

  const supabase = await createClient()

  // Fetch all orders with details (without profiles first)
  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
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
    .order("created_at", { ascending: false })

  // Fetch profiles separately and merge
  let ordersWithProfiles: Order[] = (ordersData || []) as unknown as Order[]
  
  if (ordersWithProfiles.length > 0) {
    const userIds = [...new Set(
      ordersWithProfiles.map((o) => o.user_id).filter(Boolean)
    )]
    
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name, email")
        .in("user_id", userIds)

      // Create a map of user_id to profile
      const profileMap = new Map(
        (profiles || []).map((p: Profile) => [p.user_id, p])
      )

      // Merge profiles into orders
      ordersWithProfiles = ordersWithProfiles.map((order) => ({
        ...order,
        profiles: order.user_id ? profileMap.get(order.user_id) || null : null,
      }))
    }
  }

  const glassmorphismClass =
    "bg-teal-500/10 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200/20"

  // Calculate statistics
  const totalOrders = (ordersWithProfiles?.length || 0) as number
  const totalOrderItems = (ordersWithProfiles as Array<{ order_items?: unknown[] }>)?.reduce((sum: number, order) => {
    const items = Array.isArray(order.order_items) ? order.order_items : []
    return sum + items.length
  }, 0) || 0
  const unassignedItems = (ordersWithProfiles as Array<{ order_items?: Array<{ assigned_to?: string | null }> }>)?.reduce((sum: number, order) => {
    const items = Array.isArray(order.order_items) ? order.order_items : []
    const unassigned = items.filter((item) => !item.assigned_to)
    return sum + unassigned.length
  }, 0) || 0
  const assignedItems = (totalOrderItems as number) - (unassignedItems as number)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-neutral-50">
          Orders Management
        </h1>
        <p className="text-neutral-400">
          View and manage all orders and assignments
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={glassmorphismClass}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-400">Total Orders</h3>
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <span className="text-teal-400 text-xl">📦</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-50">{totalOrders}</p>
          </div>
        </div>

        <div className={glassmorphismClass}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-400">Total Items</h3>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-xl">📋</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-50">{totalOrderItems}</p>
          </div>
        </div>

        <div className={glassmorphismClass}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-400">Assigned</h3>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400 text-xl">✅</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-50">{assignedItems}</p>
          </div>
        </div>

        <div className={glassmorphismClass}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-400">Pending</h3>
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 text-xl">⏳</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-50">{unassignedItems}</p>
          </div>
        </div>
      </div>

      {/* Error state */}
      {ordersError && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-sm text-red-300">
          Error loading orders: {ordersError.message}
        </div>
      )}

      {/* Orders Management Component */}
      <OrdersManagement 
        orders={((ordersWithProfiles || []) as unknown[]) as Parameters<typeof OrdersManagement>[0]['orders']} 
      />
    </div>
  )
}

