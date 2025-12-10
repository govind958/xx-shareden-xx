-- ======================
-- EMPLOYEES TABLE
-- ======================

-- Create employees table
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  email varchar(255) not null unique,
  role varchar(100) not null,
  specialization text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row-Level Security
alter table public.employees enable row level security;

-- Policy: Only admins can view and manage employees
-- Note: This assumes admin access is handled via admin_sessions
create policy "employees: admins can CRUD"
  on public.employees for all
  using (true)  -- In production, add proper admin check
  with check (true);

-- Indexes for performance
create index if not exists employees_email_idx on public.employees(email);
create index if not exists employees_role_idx on public.employees(role);
create index if not exists employees_is_active_idx on public.employees(is_active);

-- ======================
-- EMPLOYEE ASSIGNMENTS TABLE
-- ======================

-- Create employee_assignments table
create table if not exists public.employee_assignments (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  assigned_at timestamptz default now(),
  assigned_by uuid,  -- admin user id
  status varchar(50) default 'assigned',  -- assigned, in_progress, completed
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(employee_id, order_item_id)
);

-- Enable Row-Level Security
alter table public.employee_assignments enable row level security;

-- Policy: Admins can view and manage assignments
create policy "employee_assignments: admins can CRUD"
  on public.employee_assignments for all
  using (true)
  with check (true);

-- Policy: Employees can view their own assignments
create policy "employee_assignments: employees can view own"
  on public.employee_assignments for select
  using (true);  -- In production, add proper employee auth check

-- Indexes for performance
create index if not exists employee_assignments_employee_id_idx on public.employee_assignments(employee_id);
create index if not exists employee_assignments_order_item_id_idx on public.employee_assignments(order_item_id);
create index if not exists employee_assignments_status_idx on public.employee_assignments(status);

-- ======================
-- INSERT STATIC EMPLOYEES
-- ======================

-- Insert sample employees
insert into public.employees (name, email, role, specialization, is_active) values
  ('Anuj Pal', 'anujpal27669@gmailcom', 'Developer', 'Full Stack Development', true),
  ('Sarah Johnson', 'sarah.johnson@company.com', 'Designer', 'UI/UX Design', true),
  ('Mike Chen', 'mike.chen@company.com', 'Developer', 'Backend Development', true),
  ('Emily Davis', 'emily.davis@company.com', 'Project Manager', 'Project Coordination', true),
  ('David Wilson', 'david.wilson@company.com', 'Developer', 'Frontend Development', true),
  ('Lisa Anderson', 'lisa.anderson@company.com', 'QA Engineer', 'Quality Assurance', true),
  ('Robert Brown', 'robert.brown@company.com', 'DevOps Engineer', 'Infrastructure & Deployment', true),
  ('Maria Garcia', 'maria.garcia@company.com', 'Developer', 'Mobile Development', true);

-- ======================
-- UPDATE ORDER_ITEMS TO LINK WITH ASSIGNMENTS
-- ======================

-- Add a trigger to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_employees_updated_at before update on public.employees
  for each row execute function update_updated_at_column();

create trigger update_employee_assignments_updated_at before update on public.employee_assignments
  for each row execute function update_updated_at_column();

