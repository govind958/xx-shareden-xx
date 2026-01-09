"use client"

import { useState } from "react"
import { User, Package, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Order, OrderItem, Profile } from "@/src/types/admin"

interface OrdersManagementProps {
  orders: Order[]
}

export function OrdersManagement({ orders: initialOrders }: OrdersManagementProps) {
  const [orders] = useState<Order[]>(initialOrders)
  const [filter, setFilter] = useState<"all" | "pending" | "assigned">("all")

  const glassmorphismClass =
    "bg-teal-500/10 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200/20"

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "initiated":
        return "bg-neutral-500/20 text-neutral-400"
      case "in_progress":
        return "bg-cyan-500/20 text-cyan-400"
      case "under_review":
        return "bg-amber-500/20 text-amber-400"
      case "completed":
      case "done":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-neutral-500/20 text-neutral-400"
    }
  }

  const getFilteredOrders = () => {
    if (filter === "all") return orders

    return orders
      .map((order) => {
        const items = order.order_items || []
        const filteredItems = items.filter((item: OrderItem) => {
          if (filter === "pending") {
            return !item.assigned_to
          }
          if (filter === "assigned") {
            return !!item.assigned_to
          }
          return true
        })

        return {
          ...order,
          order_items: filteredItems,
        }
      })
      .filter((order) => order.order_items.length > 0)
  }

  const filteredOrders = getFilteredOrders()

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
              : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800/70"
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "pending"
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800/70"
          }`}
        >
          Pending Assignments
        </button>
        <button
          onClick={() => setFilter("assigned")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "assigned"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800/70"
          }`}
        >
          Assigned
        </button>
      </div>

      {/* Orders List */}
      <div className={glassmorphismClass}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-neutral-50 mb-4">
            Orders ({filteredOrders.length})
          </h2>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const user = order.profiles as Profile | null
                const items: OrderItem[] = order.order_items || []
                const hasUnassigned = items.some((item) => !item.assigned_to)

                return (
                  <div
                    key={order.id}
                    className={`p-5 rounded-lg border ${
                      hasUnassigned && filter === "all"
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-teal-500/5 border-teal-200/10"
                    }`}
                  >
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-50">
                            Order #{order.id.split("-")[0].toUpperCase()}
                          </h3>
                          {hasUnassigned && filter === "all" && (
                            <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Pending Assignment
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-400">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>
                              {user?.name || user?.email || "Unknown User"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                          <div className="text-teal-400 font-semibold">
                            {formatCurrency(order.total_amount)}
                          </div>
                        </div>
                      </div>
                        <div className="text-right">
                        <div className="text-xs text-neutral-400 mb-1">
                          {items.length} item
                          {items.length !== 1 ? "s" : ""}
                        </div>
                        <Link
                          href={`/admin/employees`}
                          className="text-xs text-teal-400 hover:text-teal-300 underline"
                        >
                          Manage Assignments
                        </Link>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mt-4 pt-4 border-t border-teal-200/10">
                      {items.map((item) => {
                        const stack = item.stacks
                        const assignment = item.employee_assignments?.[0]
                        const isAssigned = !!item.assigned_to

                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-lg ${
                              isAssigned
                                ? "bg-green-500/5 border border-green-500/20"
                                : "bg-amber-500/5 border border-amber-500/20"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Package className="h-4 w-4 text-teal-400" />
                                  <span className="font-medium text-neutral-50">
                                    {stack?.name || "Unknown Stack"}
                                  </span>
                                  <span className="text-xs text-neutral-400">
                                    ({stack?.type || "N/A"})
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-neutral-400 ml-6">
                                  <span
                                    className={`px-2 py-0.5 rounded ${getStatusColor(
                                      item.status
                                    )}`}
                                  >
                                    {item.status}
                                  </span>
                                  <span>Progress: {item.progress_percent}%</span>
                                </div>

                                {/* Assigned Employee Info */}
                                {isAssigned && assignment?.employees ? (
                                  <div className="mt-3 ml-6 flex items-center gap-2 p-2 rounded bg-green-500/10 border border-green-500/20">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <div className="flex-1">
                                      <div className="text-xs text-neutral-400">
                                        Assigned to:
                                      </div>
                                      <div className="text-sm font-medium text-green-400">
                                        {assignment.employees.name}
                                      </div>
                                      <div className="text-xs text-neutral-500">
                                        {assignment.employees.role} •{" "}
                                        {assignment.employees.email}
                                      </div>
                                    </div>
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs ${getStatusColor(
                                        assignment.status
                                      )}`}
                                    >
                                      {assignment.status}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mt-3 ml-6 flex items-center gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                                    <AlertCircle className="h-4 w-4 text-amber-400" />
                                    <div className="flex-1">
                                      <div className="text-xs text-amber-400 font-medium">
                                        Not assigned to any employee
                                      </div>
                                      <Link
                                        href="/admin/employees"
                                        className="text-xs text-teal-400 hover:text-teal-300 underline mt-1 inline-block"
                                      >
                                        Assign employee →
                                      </Link>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

