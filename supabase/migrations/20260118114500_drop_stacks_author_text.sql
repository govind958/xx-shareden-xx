-- Drop legacy author text field from stacks
alter table public.stacks
  drop column if exists author;

