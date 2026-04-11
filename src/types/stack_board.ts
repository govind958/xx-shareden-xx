
export interface PURCHASED_STACKS {
  id: string;
  stack_id: string;
  name: string;
  type: string;
  price: number;
  status: string;
  progress_percent: number;
  icon?: React.ElementType; // Optional icon component
}

export interface PURCHASED_SUBSTACKS {
  label: string;
  status: 'completed' | 'current' | 'pending';
}

// Unified sidebar item type for both stacks and substacks
export interface StackboardSidebarItem {
  id: string; // For stacks: order_item_id, For substacks: substack_assignment_id
  orderItemId: string; // The order_item_id (always present)
  subStackId: string | null; // The sub_stack_id (null for stack-level items)
  name: string;
  itemType: 'stack' | 'substack';
  parentStackName?: string; // For substacks, the parent stack name
  status: string;
  progress_percent: number;
  assignedEmployee?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

export interface SubstackAssignment {
  id: string;
  orderItemId: string;
  subStackId: string;
  subStackName: string;
  parentStackName: string;
  status: string;
  employeeId: string | null;
  employeeName: string | null;
  employeeRole: string | null;
}
