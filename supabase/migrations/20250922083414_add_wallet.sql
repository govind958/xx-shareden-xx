-- ======================
-- 1) WALLETS TABLE
-- ======================

-- Create a wallets table if it does not exist
-- Each user has ONE wallet (1-to-1 with profiles)
create table if not exists public.wallets (
  -- user_id is the primary key
  -- it also references profiles(user_id)
  -- if the profile is deleted, wallet is deleted (cascade)
  user_id    uuid primary key references public.profiles(user_id) on delete cascade,

  -- balance holds the current money in wallet
  -- numeric is used (not int) so you can support decimals (e.g., 99.99)
  balance    numeric not null default 0,

  -- updated_at is for tracking the last update time of the wallet
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS) so not everyone can read/write wallets
alter table public.wallets enable row level security;

-- Policy: Only the wallet owner (auth.uid()) can do CRUD (create, read, update, delete)
create policy "wallets: owner can CRUD"
  on public.wallets for all
  using (auth.uid() = user_id)     -- who can SELECT/UPDATE
  with check (auth.uid() = user_id); -- who can INSERT

-- Index on user_id for fast lookup (helpful if you query wallet by user_id often)
create index if not exists wallets_user_id_idx on public.wallets(user_id);


-- ======================
-- 2) WALLET TRANSACTIONS
-- ======================

-- Create a wallet_transactions table if it does not exist
-- This is an immutable log of every credit/debit action
create table if not exists public.wallet_transactions (
  -- Unique transaction ID
  tx_id       uuid primary key default gen_random_uuid(),

  -- The user whose wallet this transaction belongs to
  user_id     uuid not null references public.profiles(user_id) on delete cascade,

  -- Amount of transaction (positive number)
  amount      numeric not null,

  -- Transaction type: credit (add money) or debit (spend money)
  tx_type     text not null check (tx_type in ('credit', 'debit')),

  -- Reference for why this transaction happened
  -- e.g., "subscription:12345", "top-up:razorpay"
  reference   text,

  -- When this transaction happened
  created_at  timestamptz not null default now()
);

-- Enable RLS so only owners can see their transactions
alter table public.wallet_transactions enable row level security;

-- Policy: Only the owner can CRUD their own transactions
create policy "wallet_transactions: owner can CRUD"
  on public.wallet_transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for fast lookup by user
create index if not exists wallet_transactions_user_id_idx on public.wallet_transactions(user_id);

-- Index for fast sorting/filtering by date (e.g., recent transactions)
create index if not exists wallet_transactions_created_at_idx on public.wallet_transactions(created_at);
