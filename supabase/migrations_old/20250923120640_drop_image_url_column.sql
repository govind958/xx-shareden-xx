-- Up migration: remove column
alter table public.forms
    drop column if exists image_url;  -- <- semicolon is required

-- Down migration: restore column if rollback needed
alter table public.forms
    add column image_url text;
