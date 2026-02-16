"use server";

import {createClient} from "@/utils/supabase/server";
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
}

// Initialize Razorpay client
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })

// ACTION 1: Create a Razorpay Order
export async function createOrder(amount: number, currency = "INR", cartData: CartData | null = null) {
  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        ...(cartData ? { 
          cart_items: JSON.stringify(cartData.cartItems?.map(item => ({ 
            cart_id: item.cart_id, 
            name: item.name 
          }))),
          total_amount: cartData.totalAmount 
        } : {})
      }
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

// ACTION 2: Verify Payment and Create Stack Orders
export async function verifyPaymentAndCreateStackOrder(paymentData: StackPaymentData) {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature, 
    cartItems 
  } = paymentData
  
  const supabase = await createClient()

  // 1. Get the logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "User not authenticated" }
  }

  // 2. Verify the Razorpay signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature !== razorpay_signature) {
    return { error: "Invalid payment signature" }
  }

  // 3. Signature is valid. Process the order
  try {
    // Get the order details to find the amount
    const orderDetails = await razorpay.orders.fetch(razorpay_order_id)
    const totalAmount = Number(orderDetails.amount) / 100 // Convert from paise to rupees

    if (!cartItems || cartItems.length === 0) {
      return { error: "No cart items found" }
    }

    // Process each cart item - create stacks for unsaved clusters
    const processedItems: Array<{ stack_id: string; sub_stack_ids: string[]; cart_id: string }> = []

    for (const item of cartItems) {
      if (item.isUnsaved && item.cluster_data) {
        // Check if a matching stack with same substacks already exists
        const clusterName = item.cluster_name || item.name
        const currentSubstackNames = item.cluster_data.map((s: { name: string }) => s.name).sort()

        const { data: existingStacks } = await supabase
          .from('stacks')
          .select('id, name')
          .eq('active', true)

        let foundStackId: string | null = null
        let foundSubStackIds: string[] = []

        if (existingStacks && existingStacks.length > 0) {
          for (const stack of existingStacks) {
            const { data: existingSubStacks } = await supabase
              .from('sub_stacks')
              .select('id, name')
              .eq('stack_id', stack.id)

            if (existingSubStacks) {
              const existingNames = existingSubStacks.map((s: { name: string }) => s.name).sort()
              const isMatch = currentSubstackNames.length === existingNames.length &&
                currentSubstackNames.every((val: string, index: number) => val === existingNames[index])

              if (isMatch) {
                foundStackId = stack.id
                foundSubStackIds = existingSubStacks.map((s: { id: string }) => s.id)
                break
              }
            }
          }
        }

        if (foundStackId) {
          // Reuse existing stack
          processedItems.push({
            stack_id: foundStackId,
            sub_stack_ids: foundSubStackIds,
            cart_id: item.cart_id,
          })
        } else {
          // Create new stack
          const { data: stackRow, error: stackError } = await supabase
            .from('stacks')
            .insert({
              name: clusterName,
              description: 'Custom infrastructure stack',
              type: 'custom',
              base_price: item.price,
              author_id: user.id,
              active: true,
            })
            .select('id')
            .single()

          if (stackError || !stackRow) {
            throw new Error(`Failed to create stack: ${stackError?.message || 'Unknown error'}`)
          }

          // Create sub_stacks
          const subStackPayload = item.cluster_data.map((sub: { name: string; price: number; is_free: boolean }) => ({
            stack_id: stackRow.id,
            name: sub.name,
            price: sub.price,
            is_free: sub.is_free,
          }))

          const { data: subRows, error: subError } = await supabase
            .from('sub_stacks')
            .insert(subStackPayload)
            .select('id')

          if (subError) {
            throw new Error(`Failed to create sub_stacks: ${subError.message}`)
          }

          const subStackIds = (subRows || []).map((row: { id: string }) => row.id)

          processedItems.push({
            stack_id: stackRow.id,
            sub_stack_ids: subStackIds,
            cart_id: item.cart_id,
          })
        }
      } else {
        // Already saved stack - use existing IDs
        processedItems.push({
          stack_id: item.stack_id!,
          sub_stack_ids: item.sub_stacks.filter((s: { id?: string }) => s.id).map((s: { id?: string }) => s.id!),
          cart_id: item.cart_id,
        })
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        payment_method: 'razorpay',
      payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
    })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      throw orderError
    }

    // Create order items
    const orderItems = processedItems.map((item) => ({
      order_id: order.id,
      user_id: user.id,
      stack_id: item.stack_id,
      sub_stack_ids: item.sub_stack_ids,
      status: 'initiated',
      step: 1,
      progress_percent: 0,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items creation error:', itemsError)
      throw itemsError
    }

    // Clear cart
    const cartIdsToDelete = processedItems.map(item => item.cart_id)
    const { error: clearError } = await supabase
      .from('cart_stacks')
      .delete()
      .in('id', cartIdsToDelete)

    if (clearError) {
      console.error('Cart clearing error:', clearError)
      // Don't fail the whole transaction for this
    }

    // Send invoice email
    try {
      // Get user profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const customerName = profile?.full_name || user.email?.split('@')[0] || 'Customer'

      // Send invoice email via Nodemailer
      const emailResult = await sendInvoiceEmail({
        customerEmail: user.email!,
        customerName: customerName,
        orderId: order.id,
        paymentId: razorpay_payment_id,
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
        })),
        totalAmount: totalAmount,
      })

      if (emailResult.success) {
        console.log('Invoice email sent successfully to:', user.email)
      } else {
        console.warn('Invoice email failed:', emailResult.error)
      }
    } catch (emailErr) {
      console.error('Failed to send invoice email:', emailErr)
      // Don't fail the payment for email errors
    }

    // Return success with order ID
    return { 
      success: true, 
      paymentId: razorpay_payment_id,
      orderId: order.id 
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error("Error verifying payment and creating order:", errorMessage)
    return { error: errorMessage }
  }
}