-- 2) forms
create table if not exists public.forms (
  form_id     uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(user_id) on delete cascade,
  title       text not null,
  description text,
  image_url   text,
  label       text,
  created_at  timestamptz not null default now()
);

alter table public.forms enable row level security;

create policy "forms: owner can CRUD"
  on public.forms for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes for performance
create index if not exists forms_user_id_idx on public.forms(user_id);
create index if not exists forms_created_at_idx on public.forms(created_at);
