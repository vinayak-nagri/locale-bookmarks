alter table bookmarks
  add column user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  add column updated_at timestamptz not null default now(),
  alter column created_at set not null;

create index bookmarks_user_id_idx on bookmarks (user_id);
