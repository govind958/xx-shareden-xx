"use server";

import { createClient } from "@/utils/supabase/server";

// -------------------------
// TYPES
// -------------------------
export interface OrderItemRow {
  id: string;
  order_id: string;
  user_id: string;
  stack_id: string;
  sub_stack_ids: string[] | null;
  status: string;
  step: number;
  progress_percent: number;
  eta: string | null;
  user_note: string | null;
  admin_note: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface StackRow {
  id: string;
  name: string;
  type: string;
  description: string | null;
  base_price: number;
  active: boolean;
}

export interface StackProgress {
  id: string;
  order_item_id: string;
  order_id: string;
  name: string;
  type: string;
  description: string;
  progress: number;
  status: string;
  statusDisplay: string;
  step: number;
  eta: string | null;
  created_at: string;
  updated_at: string;
  assigned_employee?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

// -------------------------
// MAIN FUNCTION
// -------------------------
export async function getOrderItemsWithProgress(userId: string): Promise<StackProgress[]> {
  const supabase = await createClient();

  // 1️⃣ Fetch order items for the user with employee assignments
  const { data: orderItems, error: orderItemsErr } = await supabase
    .from("order_items")
    .select(`
      *,
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
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (orderItemsErr) {
    console.error("Error fetching order_items:", orderItemsErr);
    return [];
  }

  if (!orderItems || orderItems.length === 0) return [];

  const typedOrderItems = orderItems as OrderItemRow[];

  // 2️⃣ Extract stack IDs uniquely
  const stackIds = [...new Set(typedOrderItems.map((oi) => oi.stack_id))];

  // 3️⃣ Fetch stacks
  const { data: stacks, error: stackErr } = await supabase
    .from("stacks")
    .select("id, name, type, description, base_price, active")
    .in("id", stackIds);

  if (stackErr || !stacks) {
    console.error("Error fetching stacks:", stackErr);
    return [];
  }

  const typedStacks = stacks as StackRow[];

  // 4️⃣ Map status to display format
  const mapStatusToDisplay = (status: string): string => {
    const statusMap: Record<string, string> = {
      'initiated': 'Not Started',
      'in_progress': 'In Progress',
      'under_review': 'Under Review',
      'completed': 'Done',
      'done': 'Done',
    };
    return statusMap[status.toLowerCase()] || status;
  };

  // 5️⃣ Final merged output
  const final: StackProgress[] = typedOrderItems.map((item) => {
    const stack = typedStacks.find((s) => s.id === item.stack_id);
    
    // Get assigned employee from employee_assignments
    const itemWithAssignments = item as OrderItemRow & {
      employee_assignments?: Array<{
        id: string
        employee_id: string
        status: string
        employees?: {
          id: string
          name: string
          email: string
          role: string
        }
      }>
    }
    const assignment = itemWithAssignments.employee_assignments?.[0];
    const assignedEmployee = assignment?.employees
      ? {
          id: assignment.employees.id,
          name: assignment.employees.name,
          email: assignment.employees.email,
          role: assignment.employees.role,
        }
      : null;

    return {
      id: item.stack_id,
      order_item_id: item.id,
      order_id: item.order_id,
      name: stack?.name || 'Unknown Stack',
      type: stack?.type || 'General',
      description: stack?.description || 'No description available',
      progress: item.progress_percent,
      status: item.status,
      statusDisplay: mapStatusToDisplay(item.status),
      step: item.step,
      eta: item.eta,
      created_at: item.created_at,
      updated_at: item.updated_at,
      assigned_employee: assignedEmployee,
    };
  });

  return final;
}
