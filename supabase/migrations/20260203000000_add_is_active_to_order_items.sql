-- Add is_active column to order_items table for granular subscription cancellation
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true NOT NULL;

-- Create index for faster queries on active order items
CREATE INDEX IF NOT EXISTS order_items_is_active_idx ON public.order_items (is_active);
