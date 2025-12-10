-- Create admin_users table for separate admin authentication
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  secret_key_hash text not null, -- hashed secret key
  password_hash text not null,
  name text,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.admin_users enable row level security;

-- Policy: Only admins can read admin_users (we'll check this server-side)
-- For now, we'll disable public access and handle auth server-side
create policy "admin_users: no public access"
  on public.admin_users for all
  using (false)
  with check (false);

-- Index for email lookups
create index if not exists admin_users_email_idx on public.admin_users(email);

-- Index for active admins
create index if not exists admin_users_is_active_idx on public.admin_users(is_active);

-- Create admin_sessions table to track admin sessions
create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.admin_users(id) on delete cascade,
  session_token text unique not null,
  expires_at timestamptz not null,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.admin_sessions enable row level security;

-- Policy: No public access (server-side only)
create policy "admin_sessions: no public access"
  on public.admin_sessions for all
  using (false)
  with check (false);

-- Indexes
create index if not exists admin_sessions_token_idx on public.admin_sessions(session_token);
create index if not exists admin_sessions_admin_user_id_idx on public.admin_sessions(admin_user_id);
create index if not exists admin_sessions_expires_at_idx on public.admin_sessions(expires_at);

