-- Add author field for stacks
alter table public.stacks
  add column if not exists author text;

