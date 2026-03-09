-- Add address_type column to billing_addresses
-- Allows 'headquarters' (default, used by Settings) and 'office' (used by Stacks Cart checkout)
ALTER TABLE public.billing_addresses
  ADD COLUMN IF NOT EXISTS address_type TEXT NOT NULL DEFAULT 'headquarters';

-- Drop old unique index (one address per user) and create new one (one per type per user)
DROP INDEX IF EXISTS billing_addresses_user_id_idx;
CREATE UNIQUE INDEX billing_addresses_user_id_type_idx
  ON public.billing_addresses(user_id, address_type);
