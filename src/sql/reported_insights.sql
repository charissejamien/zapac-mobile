-- Run this in the Supabase SQL Editor

create table reported_insights (
  id          uuid primary key default gen_random_uuid(),
  insight_id  uuid references community_insights(id) on delete cascade not null,
  reported_by uuid references profiles(id) on delete cascade not null,
  reason      text check (reason in ('Spam', 'Harassment', 'Misinformation', 'Other')) not null,
  details     text,
  status      text default 'pending' check (status in ('pending', 'reviewed', 'dismissed')) not null,
  reviewed_by uuid references profiles(id),
  created_at  timestamptz default now() not null
);

alter table reported_insights enable row level security;

-- Authenticated users can submit reports
create policy "Users can insert reports"
  on reported_insights for insert
  to authenticated
  with check (auth.uid() = reported_by);

-- Users can view their own reports
create policy "Users can view own reports"
  on reported_insights for select
  to authenticated
  using (auth.uid() = reported_by);

-- Admin access: use service_role key from the admin dashboard to bypass RLS
