-- Create a basic coupons table
CREATE TABLE public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,          -- The code the user types (e.g., 'SAVE500')
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_amount numeric NOT NULL,   -- The exact amount to deduct (e.g., 500)
  is_active boolean DEFAULT true,     -- Toggle to true/false to turn the coupon on/off
  created_at timestamp with time zone DEFAULT now(),
  used_count integer DEFAULT 0,
  min_cart_value numeric DEFAULT 0,
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);

-- Just track how much was discounted on the final order
ALTER TABLE public.orders ADD COLUMN discount_amount numeric DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN coupon_id uuid REFERENCES public.coupons(id);