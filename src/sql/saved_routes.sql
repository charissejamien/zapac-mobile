-- Run this in the Supabase SQL Editor

create table saved_routes (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references profiles(id) on delete cascade not null,
  name                text not null,
  origin_address      text not null,
  origin_lat          double precision not null,
  origin_lng          double precision not null,
  destination_address text not null,
  destination_lat     double precision not null,
  destination_lng     double precision not null,
  encoded_polyline    text not null,
  created_at          timestamptz default now() not null
);

alter table saved_routes enable row level security;

create policy "Users can read own routes"
  on saved_routes for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own routes"
  on saved_routes for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own routes"
  on saved_routes for delete
  to authenticated
  using (auth.uid() = user_id);
