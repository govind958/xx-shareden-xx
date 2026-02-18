"use server";

import { createClient } from "@/utils/supabase/server";

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
            stacks (
                id,
                name,
                base_price,
                type
            )
        `)
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching order_items:", error);
        return [];
    }

    console.log("Fetched order_items:", data);

    if (!data || data.length === 0) {
        console.log("No order items found for user:", userId);
        return [];
    }

    return data?.map(item => {
        // stacks is a single object (many-to-one relation)
        const stack = item.stacks as any;
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

        // Determine status based on step/index
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
