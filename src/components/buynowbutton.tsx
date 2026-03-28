"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createOrder,
  createRecurringSubscription,
  verifyPaymentAndCreateStackOrder,
  verifySubscriptionPaymentAndCreateStackOrder,
} from "@/src/modules/razorpay/payment"
import mixpanel from '@/src/lib/mixpanelClient'

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

type PaymentMode = "recurring" | "one-time"
type RecurringMethod = "card" | "upi"

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
  mode?: PaymentMode;
  recurringMethod?: RecurringMethod;
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

export default function BuyNowButton({
  amount,
  discountAmount,
  couponId,
  userDetails,
  cartItems,
  billingCycle,
  onSuccess,
  disabled,
  mode = "one-time",
  recurringMethod,
}: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"success" | "error">("success")
  const [dialogMessage, setDialogMessage] = useState("")
  const [paymentId, setPaymentId] = useState("")
  const router = useRouter()

  const openCheckout = async () => {
    setLoading(true)
    mixpanel.track('Payment Initiated', { amount, mode, billing_cycle: billingCycle })

    // 1. Load the Razorpay script
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      setDialogType("error")
      setDialogMessage("Failed to load Razorpay SDK. Please check your connection.")
      setDialogOpen(true)
      setLoading(false)
      return
    }

    const cartData = { cartItems, totalAmount: amount }

    const isRecurring = mode === "recurring"

    let checkoutConfig:
      | {
          id: string
          amount: number
          currency: string
          type: "order"
        }
      | {
          id: string
          amount: number
          currency: string
          type: "subscription"
        }

    if (isRecurring) {
      const subscription = await createRecurringSubscription(amount, billingCycle, cartData)
      if ((subscription as { error?: string }).error) {
        setDialogType("error")
        setDialogMessage(`Error: ${(subscription as { error: string }).error}`)
        setDialogOpen(true)
        setLoading(false)
        return
      }

      checkoutConfig = {
        id: (subscription as { id: string }).id,
        amount: (subscription as { amount: number }).amount,
        currency: (subscription as { currency: string }).currency,
        type: "subscription",
      }
    } else {
      const orderResult = await createOrder(amount, "INR", cartData)
      if ("error" in orderResult) {
        setDialogType("error")
        setDialogMessage(`Error: ${orderResult.error}`)
        setDialogOpen(true)
        setLoading(false)
        return
      }

      checkoutConfig = {
        id: orderResult.id,
        amount: Number(orderResult.amount),
        currency: orderResult.currency,
        type: "order",
      }
    }

    // 3. Configure Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: checkoutConfig.amount,
      currency: checkoutConfig.currency,
      name: "Shareden",
      description: "Stack Purchase",
      ...(checkoutConfig.type === "order"
        ? { order_id: checkoutConfig.id }
        : { subscription_id: checkoutConfig.id }),

      // 4. This function runs after payment
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async function (response: any) {
        console.log("Payment successful, verifying...", response)
        setVerifyingPayment(true)

        try {
          const verification = isRecurring
            ? await verifySubscriptionPaymentAndCreateStackOrder({
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartItems: cartItems,
                discountAmount: discountAmount,
                couponId: couponId,
                billingCycle: billingCycle,
              })
            : await verifyPaymentAndCreateStackOrder({
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
            setDialogType("success")
            setDialogMessage("Payment successful! Your stacks are being prepared.")
            setPaymentId(verification.paymentId || "")
            setDialogOpen(true)
            mixpanel.track('Payment Successful', { amount, payment_id: verification.paymentId, mode, billing_cycle: billingCycle })

            if (onSuccess) {
              onSuccess(verification)
            }
          }
        } catch (err) {
          setDialogType("error")
          setDialogMessage(`Verification failed: ${err instanceof Error ? err.message : "Unknown error"}`)
          setDialogOpen(true)
          mixpanel.track('Payment Failed', { amount, error: err instanceof Error ? err.message : 'unknown' })
        } finally {
          setVerifyingPayment(false)
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
        disabled={loading || verifyingPayment || disabled}
        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Pay ₹${amount} Now`}
      </button>

      {/* Verification loading overlay */}
      {verifyingPayment && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-teal-400 animate-spin mb-4" />
          <p className="text-sm font-medium text-white">Verifying your payment...</p>
          <p className="text-xs text-slate-400 mt-1">Please wait</p>
        </div>
      )}

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
