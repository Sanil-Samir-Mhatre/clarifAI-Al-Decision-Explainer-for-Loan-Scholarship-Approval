-- Veridict — Supabase schema
-- Run in the Supabase SQL editor (or via `supabase db push`).
-- Uses Supabase Auth (auth.users) for login; this adds the app-specific tables.

-- Role + display name for each authenticated user
create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    name text not null,
    role text not null check (role in ('student', 'admin')),
    created_at timestamptz not null default now()
);

create table if not exists applications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    case_ref text,
    label text,
    profile jsonb not null,          -- the raw applicant fields
    status text not null default 'submitted',
    submitted_at timestamptz not null default now()
);

create table if not exists decisions (
    id uuid primary key default gen_random_uuid(),
    application_id uuid not null references applications(id) on delete cascade,
    user_id uuid not null references profiles(id) on delete cascade,
    rule_score numeric not null,
    model_score numeric not null,
    consensus_score numeric not null,
    verdict text not null check (verdict in ('Approve', 'Reject', 'Needs Review')),
    confidence text not null check (confidence in ('Low', 'Medium', 'High')),
    triggered_rules text[] not null default '{}',
    fairness_flag text,
    ollama_summary text,
    decided_at timestamptz not null default now()
);

create table if not exists audit_log (
    id uuid primary key default gen_random_uuid(),
    application_id uuid not null references applications(id) on delete cascade,
    admin_id uuid references profiles(id),
    action text not null,            -- e.g. 'override'
    previous_verdict text,
    new_verdict text,
    reason text,
    created_at timestamptz not null default now()
);

-- Row Level Security: students see only their own rows, admins see all.
alter table profiles enable row level security;
alter table applications enable row level security;
alter table decisions enable row level security;
alter table audit_log enable row level security;

create policy "own profile" on profiles
    for select using (auth.uid() = id);

create policy "own applications" on applications
    for select using (
        auth.uid() = user_id
        or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
    );

create policy "students insert own applications" on applications
    for insert with check (auth.uid() = user_id);

create policy "own decisions" on decisions
    for select using (
        auth.uid() = user_id
        or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
    );

create policy "admin only audit log" on audit_log
    for all using (
        exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
    );
