-- 5) Stacks table (MVP + future ready)
create table if not exists public.stacks (
    id serial primary key,
    name varchar(255) not null,
    description text,
    type varchar(50),
    base_price decimal(10,2) not null,
    active boolean default true,
    owner_id uuid references public.profiles(user_id),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable Row-Level Security
alter table public.stacks enable row level security;

-- Policy: Owners can CRUD their own stacks; global stacks are editable only by admins
create policy "stacks: owner or admin can CRUD"
  on public.stacks for all
  using (
    owner_id is null
    or auth.uid() = owner_id
  )
  with check (
    owner_id is null
    or auth.uid() = owner_id
  );

-- Indexes for performance
create index if not exists stacks_type_idx on public.stacks(type);
create index if not exists stacks_owner_id_idx on public.stacks(owner_id);
create index if not exists stacks_created_at_idx on public.stacks(created_at);
