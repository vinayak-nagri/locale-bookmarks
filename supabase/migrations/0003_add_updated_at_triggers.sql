create extension if not exists moddatetime schema extensions;

create trigger bookmarks_set_updated_at
  before update on bookmarks
  for each row execute procedure moddatetime (updated_at);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute procedure moddatetime (updated_at);