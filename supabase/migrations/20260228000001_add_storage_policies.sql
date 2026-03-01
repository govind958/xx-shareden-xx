-- Add RLS policies for the chats-file storage bucket

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads to chats-file"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chats-file');

-- Allow authenticated users to read/download files
CREATE POLICY "Allow authenticated reads from chats-file"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'chats-file');

-- Allow public read access (for public URLs to work)
CREATE POLICY "Allow public reads from chats-file"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'chats-file');

-- Allow authenticated users to update their files
CREATE POLICY "Allow authenticated updates to chats-file"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'chats-file');

-- Allow authenticated users to delete their files
CREATE POLICY "Allow authenticated deletes from chats-file"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'chats-file');
