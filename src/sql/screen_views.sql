-- Run this in the Supabase SQL Editor

create table screen_views (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references profiles(id) on delete cascade not null,
  screen_name      text not null,
  entered_at       timestamptz default now() not null,
  duration_seconds int
);

alter table screen_views enable row level security;

-- Authenticated users can insert their own screen views
create policy "Users can insert own screen views"
  on screen_views for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Admin access: use service_role key from the admin dashboard to bypass RLS
