-- Add message_type and metadata columns to project_messages for component-based messaging
-- Supports: text, appointment, meeting, rating message types

-- Create message type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_type_enum') THEN
    CREATE TYPE message_type_enum AS ENUM ('text', 'appointment', 'meeting', 'rating');
  END IF;
END$$;

-- Add message_type column with default 'text' for backward compatibility
ALTER TABLE public.project_messages
  ADD COLUMN IF NOT EXISTS message_type message_type_enum DEFAULT 'text';

-- Add metadata column to store type-specific data (appointment details, meeting info, ratings)
ALTER TABLE public.project_messages
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT NULL;

-- Create index on message_type for efficient filtering
CREATE INDEX IF NOT EXISTS idx_project_messages_message_type 
  ON public.project_messages(message_type);

-- Comment for documentation
COMMENT ON COLUMN public.project_messages.message_type IS 'Type of message: text, appointment, meeting, or rating';
COMMENT ON COLUMN public.project_messages.metadata IS 'JSON metadata for non-text messages (appointment details, meeting info, rating data)';
