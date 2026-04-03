-- Add password_hash column to admin_users for password-based admin login
alter table public.admin_users
add column if not exists password_hash text;


