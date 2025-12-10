import { createClient } from "@/utils/supabase/server"
import { verifyAdminSession } from "../actions"
import { redirect } from "next/navigation"
import { OrdersTooltip } from "./orders-tooltip"

interface UserWithOrderStats {
  user_id: string
  name: string | null
  email: string | null
  orders_count: number
  total_amount: number | null
  last_order_at: string | null
}

export default async function AdminUsersPage() {
  const { isValid } = await verifyAdminSession()

  if (!isValid) {
    redirect("/admin/login")
  }

  const supabase = await createClient()

  // Call the secure database function we just created
  const { data: users, error } = await supabase.rpc("get_users_with_order_stats")

  const totalUsers = users?.length || 0

  const glassmorphismClass =
    "bg-teal-500/10 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200/20"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-neutral-50">
          User Management
        </h1>
        <p className="text-neutral-400">
          Users with orders and their activity ({totalUsers} customers)
        </p>
      </div>

      {/* Users Table */}
      <div className={`${glassmorphismClass} overflow-hidden`}>
        {users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-teal-200/20">
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">
                    User / Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">
                    User ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-400">
                    Last Order
                  </th>
                </tr>
              </thead>
              <tbody>
                {(users as UserWithOrderStats[]).map((row: UserWithOrderStats, index: number) => {
                  return (
                    <tr
                      key={row.user_id}
                      className={`border-b border-teal-200/10 hover:bg-teal-500/5 transition ${
                        index % 2 === 0 ? "bg-teal-500/5" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-neutral-50">
                        <div className="flex flex-col">
                            <span className="font-medium text-neutral-50">
                                {row.name || "Unknown Name"}
                            </span>
                            <span className="text-xs text-neutral-400">
                                {row.email || "No Email"}
                            </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-neutral-400">
                        {row.user_id.split('-')[0]}...
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-300">
                        {row.orders_count > 0 ? (
                          <OrdersTooltip userId={row.user_id} ordersCount={row.orders_count}>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-teal-500/20 text-teal-400 cursor-pointer hover:bg-teal-500/30 transition-colors">
                              {row.orders_count} orders
                            </span>
                          </OrdersTooltip>
                        ) : (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-neutral-500/20 text-neutral-400">
                            {row.orders_count} orders
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-300">
                        ₹{row.total_amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">
                        {row.last_order_at 
                            ? new Date(row.last_order_at).toLocaleDateString() 
                            : "-"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-neutral-400">No users found</p>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-sm text-red-300">
          Error loading users: {error.message}
        </div>
      )}
    </div>
  )
}