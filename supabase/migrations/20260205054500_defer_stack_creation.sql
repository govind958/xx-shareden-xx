-- Migration: Modify cart_stacks table to support deferred stack creation
-- The stack should only be created during checkout, not when user clicks Buy

-- Add columns to store cluster data directly
ALTER TABLE cart_stacks 
  ADD COLUMN IF NOT EXISTS cluster_name text,
  ADD COLUMN IF NOT EXISTS cluster_data jsonb;

-- Make stack_id nullable (it will be set during checkout after stack is created)
ALTER TABLE cart_stacks 
  ALTER COLUMN stack_id DROP NOT NULL;

-- Drop the foreign key constraint on stack_id to allow null values
-- and cart entries without existing stacks
ALTER TABLE cart_stacks 
  DROP CONSTRAINT IF EXISTS cart_stacks_stack_id_fkey;

-- Re-add the foreign key with ON DELETE SET NULL (optional, for when stack is deleted)
ALTER TABLE cart_stacks 
  ADD CONSTRAINT cart_stacks_stack_id_fkey 
  FOREIGN KEY (stack_id) REFERENCES stacks(id) ON DELETE SET NULL;
