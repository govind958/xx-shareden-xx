import { createClient } from "@/utils/supabase/server"
import { verifyAdminSession } from "../actions"
import { redirect } from "next/navigation"
import { EmployeesManagement } from "./employees-management"

export default async function AdminEmployeesPage() {
  const { isValid } = await verifyAdminSession()

  if (!isValid) {
    redirect("/admin/login")
  }

  const supabase = await createClient()

  // Fetch employees
  const { data: employees, error: employeesError } = await supabase
    .from("employees")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  // Fetch assignments with related data
  const { data: assignments, error: assignmentsError } = await supabase
    .from("employee_assignments")
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
    .order("assigned_at", { ascending: false })

  // Fetch unassigned order items
  const { data: unassignedItems, error: unassignedError } = await supabase
    .from("order_items")
    .select(`
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
    `)
    .is("assigned_to", null)
    .in("status", ["initiated", "in_progress"])
    .order("created_at", { ascending: false })

  const glassmorphismClass =
    "bg-teal-500/10 backdrop-blur-md rounded-2xl shadow-lg border border-teal-200/20"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-neutral-50">
          Employee Management
        </h1>
        <p className="text-neutral-400">
          Manage employees and assign them to stacks
        </p>
      </div>

      {/* Error states */}
      {employeesError && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-sm text-red-300">
          Error loading employees: {employeesError.message}
        </div>
      )}

      {/* Employees Management Component */}
      <EmployeesManagement
        employees={employees || []}
        assignments={assignments || []}
        unassignedItems={unassignedItems || []}
      />
    </div>
  )
}

