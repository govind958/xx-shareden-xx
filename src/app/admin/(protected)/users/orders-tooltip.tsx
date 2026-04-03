"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip"
import { getUserOrders } from "@/src/modules/admin/actions"
import { OrdersTooltipOrder, OrdersTooltipProps } from "@/src/types/admin"


export function OrdersTooltip({ userId, ordersCount, children }: OrdersTooltipProps) {
  const [orders, setOrders] = useState<OrdersTooltipOrder[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    if (orders !== null) return // Already fetched
    
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await getUserOrders(userId)
      if (result.error) {
        setError(result.error)
      } else {
        // Transform the response to match our Order type
        const transformedOrders: OrdersTooltipOrder[] = ((result.orders || []) as unknown[]).map((order) => {
          const o = order as {
            id: unknown
            total_amount: unknown
            created_at: unknown
            order_items: Array<{
              id: unknown
              stack_id: unknown
              status: unknown
              created_at: unknown
              stacks: {
                id: unknown
                name: unknown
                type: unknown
              } | null | Array<{
                id: unknown
                name: unknown
                type: unknown
              }>
            }>
          }
          
          return {
            id: String(o.id),
            total_amount: Number(o.total_amount),
            created_at: String(o.created_at),
            order_items: o.order_items.map((item: {
              id: unknown
              stack_id: unknown
              status: unknown
              created_at: unknown
              stacks: {
                id: unknown
                name: unknown
                type: unknown
              } | null | Array<{
                id: unknown
                name: unknown
                type: unknown
              }>
            }) => {
              // Handle both single object and array cases for stacks
              const stackData = Array.isArray(item.stacks) ? item.stacks[0] : item.stacks
              return {
                id: String(item.id),
                stack_id: String(item.stack_id),
                status: String(item.status),
                created_at: String(item.created_at),
                stacks: stackData
                  ? {
                      id: String(stackData.id),
                      name: String(stackData.name),
                      type: String(stackData.type),
                    }
                  : null,
              }
            }),
          }
        })
        setOrders(transformedOrders)
      }
    } catch {
      setError("Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      initiated: "Not Started",
      in_progress: "In Progress",
      under_review: "Under Review",
      completed: "Done",
      done: "Done",
    }
    return statusMap[status.toLowerCase()] || status
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild onMouseEnter={fetchOrders}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="max-w-md p-0 bg-neutral-900 border border-teal-200/20 rounded-lg shadow-xl"
        >
          <div className="p-4">
            <div className="mb-3 pb-2 border-b border-teal-200/10">
              <h4 className="text-sm font-semibold text-neutral-50">
                Orders ({ordersCount})
              </h4>
            </div>
            
            {isLoading && (
              <div className="py-4 text-center text-sm text-neutral-400">
                Loading orders...
              </div>
            )}
            
            {error && (
              <div className="py-4 text-center text-sm text-red-400">
                {error}
              </div>
            )}
            
            {!isLoading && !error && orders && (
              <div className="max-h-96 overflow-y-auto space-y-3">
                {orders.length === 0 ? (
                  <div className="py-4 text-center text-sm text-neutral-400">
                    No orders found
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3 rounded-lg bg-teal-500/5 border border-teal-200/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-neutral-400">
                          {order.id.split("-")[0]}...
                        </span>
                        <span className="text-sm font-semibold text-teal-400">
                          ₹{order.total_amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 mb-2">
                        {formatDate(order.created_at)}
                      </div>
                      <div className="space-y-1">
                        {order.order_items.map((item: OrdersTooltipOrder["order_items"][number]) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-neutral-300">
                              {item.stacks?.name || `Stack #${item.stack_id}`}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                item.status === "completed" || item.status === "done"
                                  ? "bg-teal-500/20 text-teal-400"
                                  : item.status === "in_progress"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-neutral-500/20 text-neutral-400"
                              }`}
                            >
                              {formatStatus(item.status)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

