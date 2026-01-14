create table public.organizations (
    id uuid primary key default gen_random_uuid(),
    org_name text not null,
    org_slug text not null unique,
    company_logo text,
    industry_type text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);