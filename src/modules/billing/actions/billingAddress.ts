"use server";

import { createClient } from "@/utils/supabase/server";
import { BillingAddress } from "@/src/types/billing";

export interface BillingAddressInput {
    company_name?: string;
    phone?: string;
    country?: string;
    state?: string;
    street_address?: string;
    city?: string;
    zip_code?: string;
}

/**
 * Fetch the billing address for a user
 */
export async function getBillingAddress(
    userId: string
): Promise<BillingAddress | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("billing_addresses")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error) {
        // PGRST116 = no rows found, which is normal for new users
        if (error.code === "PGRST116") return null;
        console.error("Error fetching billing address:", error);
        return null;
    }

    return data as BillingAddress;
}

/**
 * Upsert (insert or update) the billing address for a user.
 * Uses the unique user_id constraint to decide insert vs update.
 */
export async function saveBillingAddress(
    userId: string,
    input: BillingAddressInput
): Promise<{ success: boolean; data?: BillingAddress; error?: string }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("billing_addresses")
            .upsert(
                {
                    user_id: userId,
                    company_name: input.company_name ?? null,
                    phone: input.phone ?? null,
                    country: input.country ?? "India",
                    state: input.state ?? null,
                    street_address: input.street_address ?? null,
                    city: input.city ?? null,
                    zip_code: input.zip_code ?? null,
                },
                { onConflict: "user_id" }
            )
            .select()
            .single();

        if (error) {
            console.error("Error saving billing address:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data as BillingAddress };
    } catch (err) {
        console.error("Unexpected error in saveBillingAddress:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}
