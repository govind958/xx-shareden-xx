-- Migration: remove image_url column from forms table

---------------------------------------------------------
-- Up migration: apply changes to remove the column
---------------------------------------------------------
alter table public.forms
    drop column if exists image_url;  -- Remove 'image_url' column if it exists

-- Drop index related to the removed column, if any
drop index if exists forms_image_url_idx;  -- Remove the index on 'image_url' if it exists

---------------------------------------------------------
-- Down migration: rollback changes (restore the column)
---------------------------------------------------------
alter table public.forms
    add column image_url text;  -- Recreate 'image_url' column as type text

-- Recreate index for the restored column
create index if not exists forms_image_url_idx on public.forms(image_url); -- Recreate index for 'image_url'
