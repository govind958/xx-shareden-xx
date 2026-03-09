"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createOrder, verifyPaymentAndCreateStackOrder } from "@/src/modules/razorpay/payment"

import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

// Extend Window interface for Razorpay
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

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

interface UserDetails {
  name?: string;
  email?: string;
  contact?: string;
}

interface BuyNowButtonProps {
  amount: number;
  discountAmount?: number;
  couponId?: string;
  userDetails?: UserDetails;
  cartItems: CartItem[];
  billingCycle: 'monthly' | 'yearly';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: (verification: any) => void;
  disabled?: boolean;
}

// This function loads the Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function BuyNowButton({ amount, discountAmount, couponId, userDetails, cartItems, billingCycle, onSuccess, disabled }: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"success" | "error">("success")
  const [dialogMessage, setDialogMessage] = useState("")
  const [paymentId, setPaymentId] = useState("")
  const router = useRouter()

  const openCheckout = async () => {
    setLoading(true)

    // 1. Load the Razorpay script
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      setDialogType("error")
      setDialogMessage("Failed to load Razorpay SDK. Please check your connection.")
      setDialogOpen(true)
      setLoading(false)
      return
    }

    // 2. Create an order from your server
    const cartData = { cartItems, totalAmount: amount }
    const order = await createOrder(amount, "INR", cartData)
    if (order.error) {
      setDialogType("error")
      setDialogMessage(`Error: ${order.error}`)
      setDialogOpen(true)
      setLoading(false)
      return
    }

    // 3. Configure Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Shareden",
      description: "Stack Purchase",
      order_id: order.id,

      // 4. This function runs after payment
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async function (response: any) {
        console.log('Payment successful, verifying...', response)

        // 5. Verify payment and create order
        const verification = await verifyPaymentAndCreateStackOrder({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          cartItems: cartItems,
          discountAmount: discountAmount,
          couponId: couponId,
          billingCycle: billingCycle,
        })

        if (verification.error) {
          setDialogType("error")
          setDialogMessage(`Payment failed: ${verification.error}`)
          setDialogOpen(true)
        } else {
          // 6. Payment successful!
          setDialogType("success")
          setDialogMessage("Payment successful! Your stacks are being prepared.")
          setPaymentId(verification.paymentId || '')
          setDialogOpen(true)

          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess(verification)
          }
        }
      },
      prefill: {
        name: userDetails?.name || "",
        email: userDetails?.email || "",
        contact: userDetails?.contact || "",
      },
      theme: {
        color: "#14B8A6", // Teal color
      },
    }

    // 7. Open the Razorpay checkout modal
    const rzp = new window.Razorpay(options)
    rzp.open()
    setLoading(false)
  }

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setDialogOpen(false)
      if (dialogType === "success") {
        window.location.href = "/private?tab=stackboard"
      } else if (dialogType === "error" && dialogMessage.includes("Payment failed")) {
        router.push("/payment-failed")
      }
    }
  }

  const handleButtonClick = () => {
    setDialogOpen(false)
    if (dialogType === "success") {
      window.location.href = "/private?tab=stackboard"
    } else if (dialogType === "error" && dialogMessage.includes("Payment failed")) {
      router.push("/payment-failed")
    }
  }

  return (
    <>
      <button
        onClick={openCheckout}
        disabled={loading || disabled}
        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Pay ₹${amount} Now`}
      </button>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {dialogType === "success" ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <DialogTitle>
                {dialogType === "success" ? "Payment Successful!" : "Payment Failed"}
              </DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              {dialogMessage}
              {dialogType === "success" && paymentId && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Payment ID: {paymentId}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleButtonClick} className="w-full">
              {dialogType === "success" ? "Continue" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
