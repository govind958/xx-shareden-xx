-- Plan-based subscription table
-- Replaces per-stack pricing with flat plan pricing (starter / pro / enterprise)

create type plan_type as enum ('starter', 'pro', 'enterprise');
create type subscription_status as enum ('active', 'cancelled', 'expired', 'past_due');

create table if not exists user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan plan_type not null default 'starter',
  status subscription_status not null default 'active',
  billing_cycle text check (billing_cycle in ('monthly', 'yearly')),
  razorpay_subscription_id text,
  razorpay_payment_id text,
  amount integer not null default 0,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Each user can only have one active subscription at a time
create unique index idx_user_active_subscription
  on user_subscriptions (user_id)
  where status = 'active';

-- RLS
alter table user_subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on user_subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on user_subscriptions for all
  using (true)
  with check (true);
