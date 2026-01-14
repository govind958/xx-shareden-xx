-- 3) usage_tracking
create table if not exists public.usage_tracking (
  user_id       uuid not null references public.profiles(user_id) on delete cascade,
  year_month    text not null,
  tasks_created int4 not null default 0,
  primary key (user_id, year_month)
);

alter table public.usage_tracking enable row level security;

create policy "usage: read own"
  on public.usage_tracking for select
  using (auth.uid() = user_id);

create policy "usage: upsert own"
  on public.usage_tracking for insert
  with check (auth.uid() = user_id);

create policy "usage: update own"
  on public.usage_tracking for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
