-- Add author_id FK and index for stacks
alter table public.stacks
  add column if not exists author_id uuid;

alter table public.stacks
  add constraint stacks_author_id_fkey
  foreign key (author_id)
  references auth.users(id)
  on delete cascade;

create index if not exists stacks_author_id_idx on public.stacks(author_id);

