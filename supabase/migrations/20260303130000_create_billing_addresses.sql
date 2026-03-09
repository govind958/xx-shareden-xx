-- Create billing_addresses table
CREATE TABLE IF NOT EXISTS public.billing_addresses (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name  TEXT,
  phone         TEXT,
  country       TEXT DEFAULT 'India',
  state         TEXT,
  street_address TEXT,
  city          TEXT,
  zip_code      TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- One billing address per user
CREATE UNIQUE INDEX IF NOT EXISTS billing_addresses_user_id_idx
  ON public.billing_addresses(user_id);

-- RLS
ALTER TABLE public.billing_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "billing_addresses: read own"
  ON public.billing_addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "billing_addresses: insert own"
  ON public.billing_addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "billing_addresses: update own"
  ON public.billing_addresses FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER update_billing_addresses_updated_at
  BEFORE UPDATE ON public.billing_addresses 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grants
GRANT ALL ON TABLE public.billing_addresses TO anon;
GRANT ALL ON TABLE public.billing_addresses TO authenticated;
GRANT ALL ON TABLE public.billing_addresses TO service_role;
