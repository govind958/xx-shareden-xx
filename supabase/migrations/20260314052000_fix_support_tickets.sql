-- Fix user_id: change from INTEGER to UUID and add foreign key to auth.users
ALTER TABLE support_tickets
  ALTER COLUMN user_id TYPE UUID USING user_id::text::uuid;

ALTER TABLE support_tickets
  ADD CONSTRAINT fk_support_tickets_user
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Re-add the timestamp columns that were previously dropped
ALTER TABLE support_tickets
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE support_tickets
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
