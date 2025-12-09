"use client"

import { useState } from "react"
import { UserPlus, X, CheckCircle2, Clock, User } from "lucide-react"
import {
  assignEmployeeToOrderItem,
  unassignEmployeeFromOrderItem,
  getEmployees,
  getEmployeeAssignments,
} from "../actions"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Employee {
  id: string
  name: string
  email: string
  role: string
  specialization: string | null
  is_active: boolean
}

interface Assignment {
  id: string
  employee_id: string
  order_item_id: string
  assigned_at: string
  status: string
  notes: string | null
  employees: Employee
  order_items: {
    id: string
    order_id: string
    user_id: string
    stack_id: number
    status: string
    progress_percent: number
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

interface UnassignedItem {
  id: string
  order_id: string
  user_id: string
  stack_id: number
  status: string
  progress_percent: number
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

interface EmployeesManagementProps {
  employees: Employee[]
  assignments: Assignment[]
  unassignedItems: UnassignedItem[]
}

export function EmployeesManagement({
  employees: initialEmployees,
  assignments: initialAssignments,
  unassignedItems: initialUnassignedItems,
}: EmployeesManagementProps) {
  const [employees] = useState<Employee[]>(initialEmployees)
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [unassignedItems, setUnassignedItems] = useState<UnassignedItem[]>(initialUnassignedItems)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [selectedOrderItem, setSelectedOrderItem] = useState<string | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)
  const [isUnassigning, setIsUnassigning] = useState<string | null>(null)

  const glassmorphismClass =
    "bg-teal-500/10 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200/20"

  const handleAssign = async () => {
    if (!selectedEmployee || !selectedOrderItem) return

    setIsAssigning(true)
    try {
      const result = await assignEmployeeToOrderItem(
        selectedEmployee,
        selectedOrderItem
      )

      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        // Refresh data
        window.location.reload()
      }
    } catch (error) {
      alert("Failed to assign employee")
    } finally {
      setIsAssigning(false)
      setSelectedEmployee(null)
      setSelectedOrderItem(null)
    }
  }

  const handleUnassign = async (assignmentId: string) => {
    setIsUnassigning(assignmentId)
    try {
      const result = await unassignEmployeeFromOrderItem(assignmentId)

      if (result.error) {
        alert(`Error: ${result.error}`)
      } else {
        // Refresh data
        window.location.reload()
      }
    } catch (error) {
      alert("Failed to unassign employee")
    } finally {
      setIsUnassigning(null)
    }
  }

  const getEmployeeAssignments = (employeeId: string) => {
    return assignments.filter((a) => a.employee_id === employeeId)
  }

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

  return (
    <div className="space-y-6">
      {/* Employees List */}
      <div className={glassmorphismClass}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-neutral-50 mb-4">
            Employees ({employees.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((employee) => {
              const employeeAssignments = getEmployeeAssignments(employee.id)
              return (
                <div
                  key={employee.id}
                  className="p-4 rounded-lg bg-teal-500/5 border border-teal-200/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-neutral-50">
                        {employee.name}
                      </h3>
                      <p className="text-xs text-neutral-400">{employee.email}</p>
                    </div>
                    <User className="h-5 w-5 text-teal-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-neutral-400">Role: </span>
                    <span className="text-xs text-teal-400 font-medium">
                      {employee.role}
                    </span>
                  </div>
                  {employee.specialization && (
                    <div className="mt-1">
                      <span className="text-xs text-neutral-400">
                        Specialization:{" "}
                      </span>
                      <span className="text-xs text-neutral-300">
                        {employee.specialization}
                      </span>
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-teal-200/10">
                    <span className="text-xs text-neutral-400">
                      Active Assignments:{" "}
                    </span>
                    <span className="text-xs font-semibold text-teal-400">
                      {employeeAssignments.length}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Assignments Section */}
      <div className={glassmorphismClass}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-neutral-50 mb-4">
            Current Assignments ({assignments.length})
          </h2>
          {assignments.length === 0 ? (
            <div className="text-center py-8 text-neutral-400">
              No assignments yet
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const employee = assignment.employees
                const orderItem = assignment.order_items
                const stack = orderItem.stacks
                const user = orderItem.profiles

                return (
                  <div
                    key={assignment.id}
                    className="p-4 rounded-lg bg-teal-500/5 border border-teal-200/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-teal-400" />
                            <span className="font-medium text-neutral-50">
                              {employee.name}
                            </span>
                            <span className="text-xs text-neutral-400">
                              ({employee.role})
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${getStatusColor(
                              assignment.status
                            )}`}
                          >
                            {assignment.status}
                          </span>
                        </div>
                        <div className="ml-6 space-y-1 text-sm">
                          <div>
                            <span className="text-neutral-400">Stack: </span>
                            <span className="text-neutral-50">
                              {stack?.name || "Unknown"}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-400">User: </span>
                            <span className="text-neutral-50">
                              {user?.name || user?.email || "Unknown"}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-400">Progress: </span>
                            <span className="text-teal-400">
                              {orderItem.progress_percent}%
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-400">Assigned: </span>
                            <span className="text-neutral-300 text-xs">
                              {formatDate(assignment.assigned_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnassign(assignment.id)}
                        disabled={isUnassigning === assignment.id}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Unassign"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Unassigned Items Section */}
      <div className={glassmorphismClass}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-neutral-50 mb-4">
            Unassigned Order Items ({unassignedItems.length})
          </h2>
          {unassignedItems.length === 0 ? (
            <div className="text-center py-8 text-neutral-400">
              All order items are assigned
            </div>
          ) : (
            <div className="space-y-4">
              {unassignedItems.map((item) => {
                const stack = item.stacks
                const user = item.profiles

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-teal-500/5 border border-teal-200/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium text-neutral-50 mb-1">
                          {stack?.name || "Unknown Stack"}
                        </div>
                        <div className="text-sm text-neutral-400">
                          User: {user?.name || user?.email || "Unknown"}
                        </div>
                        <div className="text-sm text-neutral-400">
                          Status: {item.status} | Progress: {item.progress_percent}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedEmployee || ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedEmployee(e.target.value)
                            setSelectedOrderItem(item.id)
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-neutral-900/50 border border-teal-200/20 text-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                      >
                        <option value="">Select employee...</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.role})
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={handleAssign}
                        disabled={
                          isAssigning ||
                          selectedOrderItem !== item.id ||
                          !selectedEmployee
                        }
                        className="bg-teal-500 hover:bg-teal-600 text-neutral-950"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
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

