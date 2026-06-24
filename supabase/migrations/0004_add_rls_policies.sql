-- Drop the original open policies (anon, true) — they defeat per-user scoping.
drop policy if exists "Anyone can read bookmarks" on bookmarks;
drop policy if exists "Anyone can insert bookmarks" on bookmarks;

-- RLS already enabled on both tables (bookmarks: original setup; profiles: 0002).
-- Re-asserting is idempotent and makes this file self-contained as the policy record.
alter table bookmarks enable row level security;
alter table profiles  enable row level security;

-- ── bookmarks: identity test is auth.uid() = user_id ──
create policy "Users select own bookmarks"
  on bookmarks for select to authenticated
  using (auth.uid() = user_id);

create policy "Users insert own bookmarks"
  on bookmarks for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users update own bookmarks"
  on bookmarks for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own bookmarks"
  on bookmarks for delete to authenticated
  using (auth.uid() = user_id);

-- ── profiles: PK *is* the user id, so identity test is auth.uid() = id ──
create policy "Users select own profile"
  on profiles for select to authenticated
  using (auth.uid() = id);

create policy "Users insert own profile"
  on profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "Users update own profile"
  on profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users delete own profile"
  on profiles for delete to authenticated
  using (auth.uid() = id);
