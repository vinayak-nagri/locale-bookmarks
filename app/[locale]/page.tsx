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

  return <BookmarksView />;
}
