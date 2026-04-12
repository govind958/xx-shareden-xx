// Shared admin dashboard types

export type Profile = {
  user_id: string
  name: string | null
  email: string | null
}

export type StackSummary = {
  id: string
  name: string
  type: string
}

export type Employee = {
  id: string
  name: string
  email: string
  role: string
  specialization: string | null
  is_active: boolean
}

export type OrderEmployeeAssignment = {
  id: string
  employee_id: string
  status: string
  employees?: Employee | null
}

export type SubstackAssignment = {
  id: string
  order_item_id: string
  sub_stack_id: string
  employee_id: string
  status: string
  notes?: string | null
  assigned_at?: string
}

export type OrderSubstackRow = {
  id: string
  name: string
}

export type OrderItem = {
  id: string
  order_id?: string
  user_id?: string
  stack_id: string
  status: string
  progress_percent: number | null
  assigned_to?: string | null
  sub_stack_ids?: string[] | null
  created_at: string
  stacks?: StackSummary | null
  employee_assignments?: OrderEmployeeAssignment[]
  substacks?: OrderSubstackRow[]
  substack_assignments?: SubstackAssignment[]
  profiles?: Profile | null
}

export type Order = {
  id: string
  user_id: string | null
  total_amount: number
  created_at: string
  updated_at: string
  order_items: OrderItem[]
  profiles?: Profile | null
}

export type Assignment = {
  id: string
  employee_id: string
  order_item_id: string
  assigned_at: string
  status: string
  notes: string | null
  employees: Employee
  order_items: OrderItem
}

export type UnassignedItem = OrderItem

export type OrdersTooltipOrder = {
  id: string
  total_amount: number
  created_at: string
  order_items: Array<
    Pick<OrderItem, "id" | "stack_id" | "status" | "created_at" | "stacks">
  >
}


export interface AdminDashboardProps {
  adminUser?: { name?: string; email?: string };
  counts: {
    totalRevenue: number;
    todayRevenue: number;
    pendingAssignments: number;
    totalPendingTasks: number;
  };
}

export interface SpreadsheetRow {
  id: number;
  segment: string;
  metric: string;
  w1: string;
  w2: string;
  target: string;
  health: string;
}

export interface EmployeesManagementProps {
  employees: Employee[]
  assignments: Assignment[]
  unassignedItems: UnassignedItem[]
}

export interface AdminEmployeesPageProps {
  employees: Employee[]
  assignments: Assignment[]
  unassignedItems: UnassignedItem[]
  error?: Error
}

export type Substack = {
  id: string
  label: string
  price: number
}

export type Stack = {
  id: string
  name: string
  type: string
  description: string
  base_price: number
  active: boolean
  created_at: string
  substacks?: Substack[]
}


export interface OrdersTooltipProps {
  userId: string
  ordersCount: number
  children: React.ReactNode
}

export interface StackFormData {
  name: string
  type: string
  description: string
  base_price: number
  active: string
  substacks: Substack[]
}

export interface OrdersManagementProps {
  orders: Order[]
}
