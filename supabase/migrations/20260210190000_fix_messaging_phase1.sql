-- Phase 1: Fix messaging backend
-- 1) Drop the sender_id FK that references auth.users (blocks employee inserts)
ALTER TABLE public.project_messages
  DROP CONSTRAINT IF EXISTS project_messages_sender_id_fkey;

-- 2) Create sender_role enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sender_role_enum') THEN
    CREATE TYPE sender_role_enum AS ENUM ('client', 'employee');
  END IF;
END$$;

-- 3) Convert sender_role from text to enum
ALTER TABLE public.project_messages
  ALTER COLUMN sender_role TYPE sender_role_enum
  USING sender_role::sender_role_enum;
