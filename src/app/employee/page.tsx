"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Clock, User } from "lucide-react"

interface Assignment {
  id: string
  employee_id: string
  order_item_id: string
  assigned_at: string
  status: string
  notes: string | null
  order_items: {
    id: string
    order_id: string
    user_id: string
    stack_id: number
    status: string
    progress_percent: number
    step: number
    stacks: {
      id: number
      name: string
      type: string
    } | null
    profiles: {
      user_id: string
      name: string | null
      email: string | null
    } | null
  }
}

export default function EmployeePage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [employeeEmail, setEmployeeEmail] = useState<string>("")

  const glassmorphismClass =
    "bg-teal-500/10 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200/20"

  useEffect(() => {
    async function loadAssignments() {
      try {
        setIsLoading(true)
        const supabase = createClient()

        // Get current user (employee)
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          console.error("Error getting user:", authError)
          setAssignments([])
          setIsLoading(false)
          return
        }

        setEmployeeEmail(user.email || "")

        // Find employee by email
        const { data: employee } = await supabase
          .from("employees")
          .select("id")
          .eq("email", user.email)
          .eq("is_active", true)
          .single()

        if (!employee) {
          setAssignments([])
          setIsLoading(false)
          return
        }

        // Fetch assignments for this employee
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from("employee_assignments")
          .select(`
            id,
            employee_id,
            order_item_id,
            assigned_at,
            status,
            notes,
            order_items (
              id,
              order_id,
              user_id,
              stack_id,
              status,
              progress_percent,
              step,
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
          .eq("employee_id", employee.id)
          .order("assigned_at", { ascending: false })

        if (assignmentsError) {
          console.error("Error fetching assignments:", assignmentsError)
          setAssignments([])
        } else {
          setAssignments((assignmentsData || []) as unknown as Assignment[])
        }
      } catch (error) {
        console.error("Error loading assignments:", error)
        setAssignments([])
      } finally {
        setIsLoading(false)
      }
    }

    loadAssignments()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "assigned":
        return "bg-blue-500/20 text-blue-400"
      case "in_progress":
        return "bg-cyan-500/20 text-cyan-400"
      case "completed":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-neutral-500/20 text-neutral-400"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-pulse text-neutral-400">Loading assignments...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-neutral-50">
            My Assignments
          </h1>
          <p className="text-neutral-400">
            View progress on your assigned stacks
          </p>
          {employeeEmail && (
            <p className="text-sm text-neutral-500 mt-1">{employeeEmail}</p>
          )}
        </div>

        {/* Assignments List */}
        {assignments.length === 0 ? (
          <div className={glassmorphismClass}>
            <div className="p-8 text-center">
              <User className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-400">
                No assignments found. Please contact admin to get assigned to a stack.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {assignments.map((assignment) => {
              const orderItem = assignment.order_items
              const stack = orderItem.stacks
              const user = orderItem.profiles

              return (
                <div key={assignment.id} className={glassmorphismClass}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-neutral-50 mb-1">
                          {stack?.name || "Unknown Stack"}
                        </h2>
                        <p className="text-sm text-neutral-400">
                          Client: {user?.name || user?.email || "Unknown"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          assignment.status
                        )}`}
                      >
                        {assignment.status}
                      </span>
                    </div>

                    {/* Progress Bar Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-400">Progress</span>
                        <span className="text-sm font-semibold text-teal-400">
                          {orderItem.progress_percent}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-teal-400 transition-all duration-500"
                          style={{ width: `${orderItem.progress_percent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Metadata Info */}
                    <div className="pt-4 border-t border-teal-200/10 space-y-2 text-xs text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        Assigned: {formatDate(assignment.assigned_at)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Status: {orderItem.status}</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded">Step {orderItem.step}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}