-- Trial period tracking on orders (e.g. 3-day free trial before paid plan)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS trial_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;

COMMENT ON COLUMN public.orders.trial_started_at IS 'When the trial window started for this order (set once at first qualifying purchase).';
COMMENT ON COLUMN public.orders.trial_ends_at IS 'When trial access ends; after this, require paid plan if not already paid.';

CREATE INDEX IF NOT EXISTS idx_orders_trial_ends_at
  ON public.orders (trial_ends_at)
  WHERE trial_ends_at IS NOT NULL;
