-- Allow deleting stacks that are referenced by order_items
alter table public.order_items
  drop constraint if exists order_items_stack_id_fkey;

alter table public.order_items
  add constraint order_items_stack_id_fkey
  foreign key (stack_id)
  references public.stacks(id)
  on delete cascade;

