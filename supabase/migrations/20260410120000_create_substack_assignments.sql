-- Per-module (substack) assignment within an order line item.

CREATE TABLE IF NOT EXISTS public.substack_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    order_item_id uuid NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
    sub_stack_id uuid NOT NULL REFERENCES public.sub_stacks(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    assigned_by uuid,
    status character varying(50) DEFAULT 'assigned'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT substack_assignments_order_item_sub_stack_key UNIQUE (order_item_id, sub_stack_id)
);

CREATE INDEX IF NOT EXISTS substack_assignments_employee_id_idx
  ON public.substack_assignments USING btree (employee_id);

CREATE INDEX IF NOT EXISTS substack_assignments_order_item_id_idx
  ON public.substack_assignments USING btree (order_item_id);

CREATE OR REPLACE TRIGGER update_substack_assignments_updated_at
  BEFORE UPDATE ON public.substack_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.substack_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "substack_assignments: admins can CRUD"
  ON public.substack_assignments FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "substack_assignments: employees can view own"
  ON public.substack_assignments FOR SELECT
  USING (true);

GRANT ALL ON TABLE public.substack_assignments TO anon;
GRANT ALL ON TABLE public.substack_assignments TO authenticated;
GRANT ALL ON TABLE public.substack_assignments TO service_role;
