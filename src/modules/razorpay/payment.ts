"use server";

import { createClient } from "@/utils/supabase/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendInvoiceEmail } from "@/src/modules/email/send-invoice";

// Types
interface CartItem {
  cart_id: string;
  stack_id: string | null;
  name: string;
  price: number;
  sub_stacks: Array<{ id?: string; name: string; price: number }>;
  cluster_name?: string;
  cluster_data?: Array<{ name: string; price: number; is_free: boolean }>;
  isUnsaved?: boolean;
}

interface CartData {
  cartItems: CartItem[];
  totalAmount: number;
}

interface StackPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  cartItems: CartItem[];
  discountAmount?: number;
  couponId?: string;
  billingCycle: 'monthly' | 'yearly';
}

interface StackSubscriptionPaymentData {
  razorpay_subscription_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  cartItems: CartItem[];
  discountAmount?: number;
  couponId?: string;
  billingCycle: 'monthly' | 'yearly';
}

// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// ACTION 1: Create a Razorpay Order
export async function createOrder(amount: number, currency = "INR", cartData: CartData | null = null) {
  try {
    // Razorpay requires minimum ₹1
    const finalAmount = Math.max(amount, 1)

    console.log("amount", finalAmount, cartData)

    let notes: Record<string, string | number> | undefined
    if (cartData) {
      notes = {
        cart_items: JSON.stringify(
          cartData.cartItems?.map((item) => ({
            cart_id: item.cart_id,
            name: item.name,
          }))
        ),
        total_amount: cartData.totalAmount,
      }
    }

    const options = {
      amount: finalAmount * 100, // Amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes,
    }

    // Create the order
    const order = await razorpay.orders.create(options)

    if (!order) {
      throw new Error("Failed to create order")
    }

    // Return the order details to the client
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error("Error creating Razorpay order:", errorMessage)
    return { error: errorMessage }
  }
}

// ACTION 1b: Create a Razorpay Subscription for recurring payments
export async function createRecurringSubscription(
  amount: number,
  billingCycle: 'monthly' | 'yearly',
  cartData: CartData | null = null
) {
  try {
    const finalAmount = Math.max(amount, 1)

    // Prefer pre-created plans if available
    const monthlyPlanId = process.env.RAZORPAY_PLAN_MONTHLY_ID
    const yearlyPlanId = process.env.RAZORPAY_PLAN_YEARLY_ID

    let planId: string | null = null

    if (billingCycle === 'monthly' && monthlyPlanId) {
      planId = monthlyPlanId
    } else if (billingCycle === 'yearly' && yearlyPlanId) {
      planId = yearlyPlanId
    }

    // If no plan id is configured, create a plan on the fly
    if (!planId) {
      console.log("Creating Razorpay plan on the fly:", { billingCycle, amount: finalAmount * 100 })

      const plan = (await razorpay.plans.create({
        period: billingCycle,
        interval: 1,
        item: {
          name: `Shareden ${billingCycle} subscription`,
          amount: finalAmount * 100,
          currency: "INR",
        },
      })) as { id: string }

      if (!plan || !plan.id) {
        throw new Error("Failed to create Razorpay plan for subscription")
      }

      console.log("Razorpay plan created:", plan.id)
      planId = plan.id
    }

    let notes: Record<string, string | number> | undefined
    if (cartData) {
      notes = {
        cart_items: JSON.stringify(
          cartData.cartItems?.map((item) => ({
            cart_id: item.cart_id,
            name: item.name,
          }))
        ),
        total_amount: cartData.totalAmount,
      }
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: billingCycle === 'yearly' ? 10 : 120,
      customer_notify: 1,
      notes: notes || {},
    })

    if (!subscription || !subscription.id) {
      throw new Error("Failed to create Razorpay subscription")
    }

    return {
      id: subscription.id,
      plan_id: planId,
      amount: finalAmount * 100,
      currency: "INR",
    }
  } catch (error: unknown) {
    let errorMessage = "Unknown error"
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (
      typeof error === "object" &&
      error !== null &&
      "error" in error
    ) {
      const rzpError = (error as { error: { description?: string; code?: string } }).error
      errorMessage = rzpError.description || rzpError.code || JSON.stringify(rzpError)
    }
    console.error("Error creating Razorpay subscription:", errorMessage, error)
    return { error: errorMessage }
  }
}

// // ACTION 2: Verify Payment and Create Stack Orders
// export async function verifyPaymentAndCreateStackOrder(paymentData: StackPaymentData) {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     cartItems,
//     discountAmount,
//     couponId,
//     billingCycle
//   } = paymentData

//   const supabase = await createClient()

//   // 1. Get the logged-in user
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) {
//     return { error: "User not authenticated" }
//   }

//   // 2. Verify the Razorpay signature
//   const body = `${razorpay_order_id}|${razorpay_payment_id}`
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//     .update(body.toString())
//     .digest("hex")

//   if (expectedSignature !== razorpay_signature) {
//     return { error: "Invalid payment signature" }
//   }

//   // 3. Signature is valid. Process the order
//   try {
//     // Get the order details to find the amount
//     const orderDetails = await razorpay.orders.fetch(razorpay_order_id)
//     const totalAmount = Number(orderDetails.amount) / 100 // Convert from paise to rupees

//     if (!cartItems || cartItems.length === 0) {
//       return { error: "No cart items found" }
//     }

//     // Process each cart item - create stacks for unsaved clusters
//     const processedItems: Array<{ stack_id: string; sub_stack_ids: string[]; cart_id: string }> = []

//     for (const item of cartItems) {
//       if (item.isUnsaved && item.cluster_data) {
//         const clusterName = item.cluster_name || item.name
//         const currentSubstackNames = item.cluster_data.map((s: { name: string }) => s.name).sort()

//         const { data: existingStacks } = await supabase
//           .from('stacks')
//           .select('id, name, base_price')
//           .eq('active', true)

//         let foundStackId: string | null = null
//         let foundSubStackIds: string[] = []

//         if (existingStacks && existingStacks.length > 0) {
//           for (const stack of existingStacks) {
//             const { data: existingSubStacks } = await supabase
//               .from('sub_stacks')
//               .select('id, name')
//               .eq('stack_id', stack.id)

//             if (existingSubStacks) {
//               const existingNames = existingSubStacks.map((s: { name: string }) => s.name).sort()
//               const namesMatch = currentSubstackNames.length === existingNames.length &&
//                 currentSubstackNames.every((val: string, index: number) => val === existingNames[index])
//               const priceMatch = (stack.base_price ?? 0) === item.price

//               if (namesMatch && priceMatch) {
//                 foundStackId = stack.id
//                 foundSubStackIds = existingSubStacks.map((s: { id: string }) => s.id)
//                 break
//               }
//             }
//           }
//         }

//         if (foundStackId) {
//           processedItems.push({
//             stack_id: foundStackId,
//             sub_stack_ids: foundSubStackIds,
//             cart_id: item.cart_id,
//           })
//         } else {
//           const { data: stackRow, error: stackError } = await supabase
//             .from('stacks')
//             .insert({
//               name: clusterName,
//               description: 'Custom infrastructure stack',
//               type: 'custom',
//               base_price: item.price,
//               author_id: user.id,
//               active: true,
//             })
//             .select('id')
//             .single()

//           if (stackError || !stackRow) {
//             throw new Error(`Failed to create stack: ${stackError?.message || 'Unknown error'}`)
//           }

//           const subStackPayload = item.cluster_data.map((sub: { name: string; price: number; is_free: boolean }) => ({
//             stack_id: stackRow.id,
//             name: sub.name,
//             price: sub.price,
//             is_free: sub.is_free,
//           }))

//           const { data: subRows, error: subError } = await supabase
//             .from('sub_stacks')
//             .insert(subStackPayload)
//             .select('id')

//           if (subError) {
//             throw new Error(`Failed to create sub_stacks: ${subError.message}`)
//           }

//           const subStackIds = (subRows || []).map((row: { id: string }) => row.id)

//           processedItems.push({
//             stack_id: stackRow.id,
//             sub_stack_ids: subStackIds,
//             cart_id: item.cart_id,
//           })
//         }
//       } else {
//         processedItems.push({
//           stack_id: item.stack_id!,
//           sub_stack_ids: item.sub_stacks.filter((s: { id?: string }) => s.id).map((s: { id?: string }) => s.id!),
//           cart_id: item.cart_id,
//         })
//       }
//     }

//     // Create order with coupon info and billing cycle
//     const { data: order, error: orderError } = await supabase
//       .from('orders')
//       .insert({
//         user_id: user.id,
//         total_amount: totalAmount,
//         payment_method: 'razorpay',
//         payment_id: razorpay_payment_id,
//         razorpay_order_id: razorpay_order_id,
//         discount_amount: discountAmount || 0,
//         coupon_id: couponId || null,
//         subscription_duration: billingCycle,
//       })
//       .select('id')
//       .single()

//     // If coupon was used, increment its used_count
//     if (couponId) {
//       const { data: currentCoupon } = await supabase
//         .from('coupons')
//         .select('used_count')
//         .eq('id', couponId)
//         .single()

//       if (currentCoupon) {
//         await supabase
//           .from('coupons')
//           .update({ used_count: (currentCoupon.used_count || 0) + 1 })
//           .eq('id', couponId)
//       }
//     }

//     if (orderError || !order) {
//       console.error('Order creation error:', orderError)
//       throw orderError
//     }

//     // Create order items
//     const orderItems = processedItems.map((item) => ({
//       order_id: order.id,
//       user_id: user.id,
//       stack_id: item.stack_id,
//       sub_stack_ids: item.sub_stack_ids,
//       status: 'initiated',
//       step: 1,
//       progress_percent: 0,
//     }))

//     const { error: itemsError } = await supabase
//       .from('order_items')
//       .insert(orderItems)

//     if (itemsError) {
//       console.error('Order items creation error:', itemsError)
//       throw itemsError
//     }

//     // Clear cart
//     const cartIdsToDelete = processedItems.map(item => item.cart_id)
//     const { error: clearError } = await supabase
//       .from('cart_stacks')
//       .delete()
//       .in('id', cartIdsToDelete)

//     if (clearError) {
//       console.error('Cart clearing error:', clearError)
//       // Don't fail the whole transaction for this
//     }

//     // Send invoice email
//     try {
//       // Get user profile for name
//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('full_name')
//         .eq('id', user.id)
//         .single()

//       const customerName = profile?.full_name || user.email?.split('@')[0] || 'Customer'

//       // Send invoice email via Nodemailer
//       const emailResult = await sendInvoiceEmail({
//         customerEmail: user.email!,
//         customerName: customerName,
//         orderId: order.id,
//         paymentId: razorpay_payment_id,
//         items: cartItems.map(item => ({
//           name: item.name,
//         })),
//       })

//       if (emailResult.success) {
//         console.log('Invoice email sent successfully to:', user.email)
//       } else {
//         console.warn('Invoice email failed:', emailResult.error)
//       }
//     } catch (emailErr) {
//       console.error('Failed to send invoice email:', emailErr)
//       // Don't fail the payment for email errors
//     }

//     // Return success with order ID
//     return {
//       success: true,
//       paymentId: razorpay_payment_id,
//       orderId: order.id
//     }

//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error'
//     console.error("Error verifying payment and creating order:", errorMessage)
//     return { error: errorMessage }
//   }
// }

// // ACTION 3: Verify Subscription Payment and Create Stack Orders (recurring)
// export async function verifySubscriptionPaymentAndCreateStackOrder(
//   paymentData: StackSubscriptionPaymentData
// ) {
//   const {
//     razorpay_subscription_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     cartItems,
//     discountAmount,
//     couponId,
//     billingCycle,
//   } = paymentData

//   const supabase = await createClient()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()
//   if (!user) {
//     return { error: "User not authenticated" }
//   }

//   // Verify subscription signature per Razorpay docs
//   const body = `${razorpay_subscription_id}|${razorpay_payment_id}`
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//     .update(body.toString())
//     .digest("hex")

//   if (expectedSignature !== razorpay_signature) {
//     return { error: "Invalid subscription payment signature" }
//   }

//   try {
//     // Fetch payment details to get amount
//     const payment = await razorpay.payments.fetch(razorpay_payment_id)
//     const totalAmount = Number(payment.amount) / 100

//     if (!cartItems || cartItems.length === 0) {
//       return { error: "No cart items found" }
//     }

//     // Reuse the same cart processing logic as one-time payments
//     const processedItems: Array<{ stack_id: string; sub_stack_ids: string[]; cart_id: string }> = []

//     for (const item of cartItems) {
//       if (item.isUnsaved && item.cluster_data) {
//         const clusterName = item.cluster_name || item.name
//         const currentSubstackNames = item.cluster_data.map((s: { name: string }) => s.name).sort()

//         const { data: existingStacks } = await supabase
//           .from("stacks")
//           .select("id, name, base_price")
//           .eq("active", true)

//         let foundStackId: string | null = null
//         let foundSubStackIds: string[] = []

//         if (existingStacks && existingStacks.length > 0) {
//           for (const stack of existingStacks) {
//             const { data: existingSubStacks } = await supabase
//               .from("sub_stacks")
//               .select("id, name")
//               .eq("stack_id", stack.id)

//             if (existingSubStacks) {
//               const existingNames = existingSubStacks.map((s: { name: string }) => s.name).sort()
//               const namesMatch =
//                 currentSubstackNames.length === existingNames.length &&
//                 currentSubstackNames.every((val: string, index: number) => val === existingNames[index])
//               const priceMatch = (stack.base_price ?? 0) === item.price

//               if (namesMatch && priceMatch) {
//                 foundStackId = stack.id
//                 foundSubStackIds = existingSubStacks.map((s: { id: string }) => s.id)
//                 break
//               }
//             }
//           }
//         }

//         if (foundStackId) {
//           processedItems.push({
//             stack_id: foundStackId,
//             sub_stack_ids: foundSubStackIds,
//             cart_id: item.cart_id,
//           })
//         } else {
//           const { data: stackRow, error: stackError } = await supabase
//             .from("stacks")
//             .insert({
//               name: clusterName,
//               description: "Custom infrastructure stack",
//               type: "custom",
//               base_price: item.price,
//               author_id: user.id,
//               active: true,
//             })
//             .select("id")
//             .single()

//           if (stackError || !stackRow) {
//             throw new Error(`Failed to create stack: ${stackError?.message || "Unknown error"}`)
//           }

//           const subStackPayload = item.cluster_data.map(
//             (sub: { name: string; price: number; is_free: boolean }) => ({
//               stack_id: stackRow.id,
//               name: sub.name,
//               price: sub.price,
//               is_free: sub.is_free,
//             })
//           )

//           const { data: subRows, error: subError } = await supabase
//             .from("sub_stacks")
//             .insert(subStackPayload)
//             .select("id")

//           if (subError) {
//             throw new Error(`Failed to create sub_stacks: ${subError.message}`)
//           }

//           const subStackIds = (subRows || []).map((row: { id: string }) => row.id)

//           processedItems.push({
//             stack_id: stackRow.id,
//             sub_stack_ids: subStackIds,
//             cart_id: item.cart_id,
//           })
//         }
//       } else {
//         processedItems.push({
//           stack_id: item.stack_id!,
//           sub_stack_ids: item.sub_stacks
//             .filter((s: { id?: string }) => s.id)
//             .map((s: { id?: string }) => s.id!),
//           cart_id: item.cart_id,
//         })
//       }
//     }

//     const { data: order, error: orderError } = await supabase
//       .from("orders")
//       .insert({
//         user_id: user.id,
//         total_amount: totalAmount,
//         payment_method: "razorpay_subscription",
//         payment_id: razorpay_payment_id,
//         razorpay_subscription_id: razorpay_subscription_id,
//         discount_amount: discountAmount || 0,
//         coupon_id: couponId || null,
//         subscription_duration: billingCycle,
//         is_recurring: true,
//       })
//       .select("id")
//       .single()

//     if (couponId) {
//       const { data: currentCoupon } = await supabase
//         .from("coupons")
//         .select("used_count")
//         .eq("id", couponId)
//         .single()

//       if (currentCoupon) {
//         await supabase
//           .from("coupons")
//           .update({ used_count: (currentCoupon.used_count || 0) + 1 })
//           .eq("id", couponId)
//       }
//     }

//     if (orderError || !order) {
//       console.error("Order creation error (subscription):", orderError)
//       throw orderError
//     }

//     const orderItems = processedItems.map((item) => ({
//       order_id: order.id,
//       user_id: user.id,
//       stack_id: item.stack_id,
//       sub_stack_ids: item.sub_stack_ids,
//       status: "initiated",
//       step: 1,
//       progress_percent: 0,
//     }))

//     const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

//     if (itemsError) {
//       console.error("Order items creation error (subscription):", itemsError)
//       throw itemsError
//     }

//     const cartIdsToDelete = processedItems.map((item) => item.cart_id)
//     const { error: clearError } = await supabase
//       .from("cart_stacks")
//       .delete()
//       .in("id", cartIdsToDelete)

//     if (clearError) {
//       console.error("Cart clearing error (subscription):", clearError)
//     }

//     try {
//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("full_name")
//         .eq("id", user.id)
//         .single()

//       const customerName = profile?.full_name || user.email?.split("@")[0] || "Customer"

//       const emailResult = await sendInvoiceEmail({
//         customerEmail: user.email!,
//         customerName: customerName,
//         orderId: order.id,
//         paymentId: razorpay_payment_id,
//         items: cartItems.map((item) => ({
//           name: item.name,
//         })),
//       })

//       if (emailResult.success) {
//         console.log("Invoice email sent successfully to (subscription):", user.email)
//       } else {
//         console.warn("Invoice email failed (subscription):", emailResult.error)
//       }
//     } catch (emailErr) {
//       console.error("Failed to send invoice email (subscription):", emailErr)
//     }

//     return {
//       success: true,
//       paymentId: razorpay_payment_id,
//       orderId: order.id,
//       subscriptionId: razorpay_subscription_id,
//     }
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "Unknown error"
//     console.error("Error verifying subscription payment and creating order:", errorMessage)
//     return { error: errorMessage }
//   }
// }