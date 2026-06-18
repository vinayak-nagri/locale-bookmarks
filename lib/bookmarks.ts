import { supabase } from './supabase';

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export async function fetchBookmarks(): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}