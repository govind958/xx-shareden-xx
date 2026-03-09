-- Allow uploads
CREATE POLICY "Users can upload logos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'logos');

-- Allow public reads
CREATE POLICY "Public logo access" ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'logos');

-- Allow users to update/delete their own logos
CREATE POLICY "Users can manage own logos" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);