import BookmarksView from '@/components/BookmarksView';
import SignedOutHome from '@/components/SignedOutHome';
import { createServerSupabaseClient } from '@/lib/server';

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <SignedOutHome />;
  }

  const { data } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .maybeSingle();
  const displayName = data?.display_name?.trim() || undefined;

  return <BookmarksView displayName={displayName} />;
}
