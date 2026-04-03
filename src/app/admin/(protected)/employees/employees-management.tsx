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
  const [, setEmployeesState] = useState<Employee[]>(initialEmployees)
  const [, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [, setUnassignedItems] = useState<UnassignedItem[]>(initialUnassignedItems)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [selectedOrderItem, setSelectedOrderItem] = useState<string | null>(null)
  const [, setIsAssigning] = useState(false)
  const [, setIsUnassigning] = useState<string | null>(null)

  void setEmployeesState; void setAssignments; void setUnassignedItems;

  const handleAssign = async () => {
    if (!selectedEmployee || !selectedOrderItem) return
    setIsAssigning(true)
    try {
      const result = await assignEmployeeToOrderItem(selectedEmployee, selectedOrderItem)
      if (result.error) { alert(`Error: ${result.error}`) } else { window.location.reload() }
    } catch { alert("Failed to assign employee") } finally {
      setIsAssigning(false); setSelectedEmployee(null); setSelectedOrderItem(null)
    }
  }

  const handleUnassign = async (assignmentId: string) => {
    setIsUnassigning(assignmentId)
    try {
      const result = await unassignEmployeeFromOrderItem(assignmentId)
      if (result.error) { alert(`Error: ${result.error}`) } else { window.location.reload() }
    } catch { alert("Failed to unassign employee") } finally { setIsUnassigning(null) }
  }

  void handleAssign; void handleUnassign;

  return (
    <div className="space-y-6">
      {/* Employees List */}
     

      {/* Assignments Section */}
     

      {/* Unassigned Items Section */}
    

    </div>
  )
}

