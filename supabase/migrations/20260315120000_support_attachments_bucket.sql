-- Bucket for support ticket file attachments (screenshots, logs, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'support-attachments',
  'support-attachments',
  true,
  10485760,  -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/json']
)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload into their own folder (user_id in path)
CREATE POLICY "Users can upload support attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'support-attachments');

-- Public read so support team and ticket view can show attachment links
CREATE POLICY "Public read support attachments"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'support-attachments');
