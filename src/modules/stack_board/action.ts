"use server";

import { createClient } from "@/utils/supabase/server";
import type { SubstackAssignment, StackboardSidebarItem } from "@/src/types/stack_board";

interface AssignedEmployee {
    name: string;
    role: string;
    specialization: string;
    assigned_at: string | null;
}
export const getPurchasedStacks = async (userId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("order_items")
        .select(`
            id,
            stack_id,
            status,
            sub_stack_ids,
            progress_percent,
            created_at,
            stacks (
                id,
                name,
                base_price,
                type
            )
        `)
        .eq("user_id", userId)
        .eq("is_active", true);

    if (error) {
        console.error("Error fetching order_items:", error);
        return [];
    }

    if (!data || data.length === 0) {
        console.log("No order items found for user:", userId);
        return [];
    }

    return data?.map(item => {
        // stacks is a single object (many-to-one relation)
        const stack = item.stacks as { name?: string; type?: string; base_price?: number } | null;
        return {
            id: item.id,
            stack_id: item.stack_id,
            name: stack?.name || 'Unknown Stack',
            type: stack?.type || 'Unknown Type',
            price: stack?.base_price || 0,
            status: item.status?.toUpperCase() || 'INITIATED',
            progress_percent: item.progress_percent || 0,
        };
    }) || [];
};

// Get substacks for a specific order item by its ID
export const getPurchasedSubStacks = async (orderItemId: string) => {
    const supabase = await createClient();

    // Get the order item with sub_stack_ids
    const { data: orderItem, error: orderError } = await supabase
        .from("order_items")
        .select(`
            id,
            sub_stack_ids,
            status,
            progress_percent,
            step
        `)
        .eq("id", orderItemId)
        .single();

    if (orderError || !orderItem) {
        console.log("Error fetching order_item:", orderError);
        return [];
    }

    // If no sub_stack_ids, return empty array
    if (!orderItem.sub_stack_ids || orderItem.sub_stack_ids.length === 0) {
        console.log("No sub_stack_ids found");
        return [];
    }

    // Fetch the actual sub_stacks using the IDs
    const { data: subStacks, error: subStacksError } = await supabase
        .from("sub_stacks")
        .select("id, name, price, is_free")
        .in("id", orderItem.sub_stack_ids);

    if (subStacksError || !subStacks) {
        console.log("Error fetching sub_stacks:", subStacksError);
        return [];
    }

    const currentStep = orderItem.step || 1;

    // Transform to PURCHASED_SUBSTACKS format for progress timeline
    return subStacks.map((subStack, index) => {
        let status: 'completed' | 'current' | 'pending' = 'pending';

        // Determine status based on step/indexn
        if (index + 1 < currentStep) {
            status = 'completed';
        } else if (index + 1 === currentStep) {
            status = 'current';
        }

        return {
            label: subStack.name || 'Unknown Step',
            status: status,
        };
    });
};

export const getAssignedEmployee = async(orderItemId: string) => {

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("employee_assignments")
        .select(`employee_id, assigned_at, employees (name, role, specialization)`)
        .eq("order_item_id", orderItemId)
        .order("assigned_at", { ascending: false })
        .limit(1)
        .maybeSingle();



    if (error || !data?.employee_id) {
        return null;
    }

    const emp = Array.isArray(data.employees) ? data.employees[0] : data.employees;

    const result: AssignedEmployee = {
        name: emp?.name || 'Unknown Employee',
        role: emp?.role || 'Unknown Role',
        specialization: emp?.specialization || 'Unknown Specialization',
        assigned_at: data.assigned_at ?? null,
    };

    return result;
}

// Get substack assignments for a specific order item (for client view)
export const getSubstackAssignmentsForClient = async (orderItemId: string, parentStackName: string): Promise<SubstackAssignment[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("substack_assignments")
        .select(`
            id,
            status,
            sub_stack_id,
            order_item_id,
            employee_id,
            sub_stacks:sub_stack_id (id, name),
            employees:employee_id (id, name, role)
        `)
        .eq("order_item_id", orderItemId);

    if (error) {
        console.error("Error fetching substack assignments:", error);
        return [];
    }

    if (!data || data.length === 0) {
        return [];
    }

    return data.map((assignment) => {
        const subStack = Array.isArray(assignment.sub_stacks) 
            ? assignment.sub_stacks[0] 
            : assignment.sub_stacks;
        const employee = Array.isArray(assignment.employees) 
            ? assignment.employees[0] 
            : assignment.employees;

        return {
            id: assignment.id,
            orderItemId: assignment.order_item_id,
            subStackId: assignment.sub_stack_id,
            subStackName: (subStack as { name?: string })?.name || 'Module',
            parentStackName: parentStackName,
            status: assignment.status || 'assigned',
            employeeId: assignment.employee_id,
            employeeName: (employee as { name?: string })?.name || null,
            employeeRole: (employee as { role?: string })?.role || null,
        };
    });
};

// Get all sidebar items (stacks + substacks) for a user
export const getStackboardSidebarItems = async (userId: string): Promise<StackboardSidebarItem[]> => {
    const supabase = await createClient();

    // First, get all order_items (stacks) for the user
    const { data: orderItems, error: orderError } = await supabase
        .from("order_items")
        .select(`
            id,
            stack_id,
            status,
            progress_percent,
            assigned_to,
            stacks (id, name, type)
        `)
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (orderError) {
        console.error("Error fetching order_items:", orderError);
        return [];
    }

    if (!orderItems || orderItems.length === 0) {
        return [];
    }

    const sidebarItems: StackboardSidebarItem[] = [];

    // Get all order item IDs for batch fetching
    const orderItemIds = orderItems.map(item => item.id);

    // Get assigned employee IDs from order_items for batch fetching
    const assignedToIds = orderItems
        .map(item => item.assigned_to)
        .filter((id): id is string => !!id);

    // Fetch employees for stack-level assignments
    const employeesMap = new Map<string, { id: string; name: string; role: string }>();
    if (assignedToIds.length > 0) {
        const { data: employees } = await supabase
            .from("employees")
            .select("id, name, role")
            .in("id", assignedToIds);
        
        if (employees) {
            for (const emp of employees) {
                employeesMap.set(emp.id, emp);
            }
        }
    }

    // Fetch all substack assignments for these order items
    const { data: allSubstackAssignments, error: substackError } = await supabase
        .from("substack_assignments")
        .select(`
            id,
            status,
            sub_stack_id,
            order_item_id,
            employee_id,
            sub_stacks:sub_stack_id (id, name),
            employees:employee_id (id, name, role)
        `)
        .in("order_item_id", orderItemIds);

    if (substackError) {
        console.error("Error fetching substack assignments:", substackError);
    }

    // Group substack assignments by order_item_id
    const substacksByOrderItem = new Map<string, typeof allSubstackAssignments>();
    if (allSubstackAssignments) {
        for (const assignment of allSubstackAssignments) {
            const existing = substacksByOrderItem.get(assignment.order_item_id) || [];
            existing.push(assignment);
            substacksByOrderItem.set(assignment.order_item_id, existing);
        }
    }

    // Build sidebar items
    for (const item of orderItems) {
        const stack = Array.isArray(item.stacks) ? item.stacks[0] : item.stacks;
        const stackName = (stack as { name?: string })?.name || 'Unknown Stack';
        const assignedEmployee = item.assigned_to ? employeesMap.get(item.assigned_to) : null;

        // Add the stack itself as a sidebar item (for general communication)
        sidebarItems.push({
            id: item.id,
            orderItemId: item.id,
            subStackId: null,
            name: stackName,
            itemType: 'stack',
            status: item.status?.toUpperCase() || 'INITIATED',
            progress_percent: item.progress_percent || 0,
            assignedEmployee: assignedEmployee ? {
                id: assignedEmployee.id,
                name: assignedEmployee.name || 'Unknown',
                role: assignedEmployee.role || 'Unknown',
            } : null,
        });

        // Add substacks for this order item
        const substacks = substacksByOrderItem.get(item.id) || [];
        for (const subAssignment of substacks) {
            const subStack = Array.isArray(subAssignment.sub_stacks) 
                ? subAssignment.sub_stacks[0] 
                : subAssignment.sub_stacks;
            const subEmployee = Array.isArray(subAssignment.employees) 
                ? subAssignment.employees[0] 
                : subAssignment.employees;

            sidebarItems.push({
                id: subAssignment.id,
                orderItemId: subAssignment.order_item_id,
                subStackId: subAssignment.sub_stack_id,
                name: (subStack as { name?: string })?.name || 'Module',
                itemType: 'substack',
                parentStackName: stackName,
                status: subAssignment.status?.toUpperCase() || 'ASSIGNED',
                progress_percent: item.progress_percent || 0, // Use parent's progress
                assignedEmployee: subEmployee ? {
                    id: (subEmployee as { id: string }).id,
                    name: (subEmployee as { name?: string }).name || 'Unknown',
                    role: (subEmployee as { role?: string }).role || 'Unknown',
                } : null,
            });
        }
    }

    return sidebarItems;
};

// Get assigned employee for a specific substack
export const getAssignedEmployeeForSubstack = async (orderItemId: string, subStackId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("substack_assignments")
        .select(`
            employee_id,
            created_at,
            employees:employee_id (name, role, specialization)
        `)
        .eq("order_item_id", orderItemId)
        .eq("sub_stack_id", subStackId)
        .maybeSingle();

    if (error || !data?.employee_id) {
        return null;
    }

    const emp = Array.isArray(data.employees) ? data.employees[0] : data.employees;

    return {
        name: (emp as { name?: string })?.name || 'Unknown Employee',
        role: (emp as { role?: string })?.role || 'Unknown Role',
        specialization: (emp as { specialization?: string })?.specialization || '',
        assigned_at: data.created_at ?? null,
    };
}
