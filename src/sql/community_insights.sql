-- Run this in the Supabase SQL Editor

create table community_insights (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references profiles(id) on delete cascade not null,
  category   text check (category in ('Warning', 'Shortcuts', 'Fare Tips', 'Driver Reviews')) not null,
  route      text not null,
  content    text not null,
  created_at timestamptz default now() not null
);

-- Let every authenticated user read all insights
alter table community_insights enable row level security;

create policy "Anyone can read insights"
  on community_insights for select
  to authenticated
  using (true);

-- Users can insert their own insights
create policy "Users can insert own insights"
  on community_insights for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can delete only their own insights
create policy "Users can delete own insights"
  on community_insights for delete
  to authenticated
  using (auth.uid() = user_id);

-- ─── Reactions (likes / dislikes) ───

create table insight_reactions (
  id          uuid primary key default gen_random_uuid(),
  insight_id  uuid references community_insights(id) on delete cascade not null,
  user_id     uuid references profiles(id) on delete cascade not null,
  reaction    text check (reaction in ('like', 'dislike')) not null,
  created_at  timestamptz default now() not null,
  unique (insight_id, user_id)
);

alter table insight_reactions enable row level security;

create policy "Anyone can read reactions"
  on insight_reactions for select
  to authenticated
  using (true);

create policy "Users can insert own reactions"
  on insight_reactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own reactions"
  on insight_reactions for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own reactions"
  on insight_reactions for delete
  to authenticated
  using (auth.uid() = user_id);
