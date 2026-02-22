"use server"

import { createClient } from "@/utils/supabase/server"


export async function validateCoupon(code: string, cartTotal: number) {
    const supabase = await createClient();

    const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

        if (error || !coupon) {
            return { success: false, error: "Invalid or inactive coupon code." };
        }
    // 2. Check the minimum cart value requirement
    if (coupon.min_cart_value > 0 && cartTotal < coupon.min_cart_value) {
        return { 
        success: false, 
        error: `Your cart must be at least ₹${coupon.min_cart_value} to use this code.` 
        };
    }
    // 3. Calculate the discount based on the type you set
    let discountAmount = 0;
    
    if (coupon.discount_type === "fixed") {
    discountAmount = coupon.discount_amount;
    } else if (coupon.discount_type === "percentage") {
    discountAmount = (cartTotal * coupon.discount_amount) / 100;
    }
    // 4. Safety check: Don't let the discount be greater than the cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return {
    success: true,
    discountAmount: Math.round(discountAmount), // Rounding to avoid weird decimals
    couponId: coupon.id,
    code: coupon.code,
    };
        
}