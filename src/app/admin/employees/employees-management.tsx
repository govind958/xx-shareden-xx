"use client"

import { useState } from "react"
import {
  assignEmployeeToOrderItem,
  unassignEmployeeFromOrderItem
} from "@/src/modules/admin/actions"
import { Assignment, Employee, UnassignedItem, EmployeesManagementProps } from "@/src/types/admin"



export function EmployeesManagement({
  employees: initialEmployees,
  assignments: initialAssignments,
  unassignedItems: initialUnassignedItems,
}: EmployeesManagementProps) {
  const [employees] = useState<Employee[]>(initialEmployees)
  const [assignments] = useState<Assignment[]>(initialAssignments)
  const [unassignedItems] = useState<UnassignedItem[]>(initialUnassignedItems)
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
    } catch {
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
    } catch {
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
     

      {/* Assignments Section */}
     

      {/* Unassigned Items Section */}
    

    </div>
  )
}

