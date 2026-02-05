-- Remove is_active column from orders table (no longer needed - using order_items.is_active instead)
ALTER TABLE public.orders
  DROP COLUMN IF EXISTS is_active;

-- Drop the index if it exists
DROP INDEX IF EXISTS orders_is_active_idx;
