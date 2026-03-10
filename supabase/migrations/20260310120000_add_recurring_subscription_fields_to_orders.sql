-- Add columns required for Razorpay recurring subscription support
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS is_recurring boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id text,
  ADD COLUMN IF NOT EXISTS subscription_status text;

-- Index on razorpay_subscription_id for fast webhook lookups
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_subscription_id
  ON public.orders (razorpay_subscription_id)
  WHERE razorpay_subscription_id IS NOT NULL;
