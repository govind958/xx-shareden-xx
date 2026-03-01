-- Add file sharing support to project_messages

-- Add 'file' to message_type_enum
ALTER TYPE message_type_enum ADD VALUE IF NOT EXISTS 'file';

-- Add file_url column to store the public URL of uploaded files
ALTER TABLE public.project_messages
  ADD COLUMN IF NOT EXISTS file_url TEXT DEFAULT NULL;

-- Add file_type column to store MIME type (e.g., 'image/png', 'application/pdf')
ALTER TABLE public.project_messages
  ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT NULL;

-- Add file_name column to store original file name for display
ALTER TABLE public.project_messages
  ADD COLUMN IF NOT EXISTS file_name TEXT DEFAULT NULL;

-- Comment for documentation
COMMENT ON COLUMN public.project_messages.file_url IS 'Public URL of the uploaded file in Supabase Storage';
COMMENT ON COLUMN public.project_messages.file_type IS 'MIME type of the uploaded file (e.g., image/png, application/pdf)';
COMMENT ON COLUMN public.project_messages.file_name IS 'Original file name for display purposes';
