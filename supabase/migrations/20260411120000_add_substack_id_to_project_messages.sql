-- Add sub_stack_id column to project_messages for substack-level messaging

ALTER TABLE public.project_messages 
ADD COLUMN IF NOT EXISTS sub_stack_id uuid REFERENCES public.sub_stacks(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS project_messages_sub_stack_id_idx 
ON public.project_messages USING btree (sub_stack_id);

COMMENT ON COLUMN public.project_messages.sub_stack_id IS 'Optional reference to a specific substack for module-level messaging threads';
