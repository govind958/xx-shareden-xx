-- Script to create your first admin user
-- Run this in your Supabase SQL editor after running the migration
-- Replace 'your-admin@email.com' and 'your-secret-key' with actual values


-- The secret key and password will be hashed using SHA-256
-- Make sure to use strong, unique values

INSERT INTO public.admin_users (email, secret_key_hash, password_hash, name, is_active)
VALUES (
  'admin@gmail.com',  -- Replace with your admin email
  encode(digest('secret', 'sha256'), 'hex'),  -- Replace with your admin secret key
  encode(digest('admin', 'sha256'), 'hex'),  -- Replace with your admin password
  'Admin User',
  true
);

-- To verify the hashes match, you can test with:
-- SELECT encode(digest('secret', 'sha256'), 'hex');          -- secret key
-- SELECT encode(digest('admin-password', 'sha256'), 'hex');  -- admin password

