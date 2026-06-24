import { supabase } from './supabase';
import type { BookmarkInput } from '@/lib/schema';

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

export async function addBookmark(input: BookmarkInput): Promise<void> {
  const { error } = await supabase.from('bookmarks').insert(input);
  if (error) throw error;
}

export async function updateBookmark(
  id: string,
  values: { title: string; url: string }
): Promise<void> {
  const { error } = await supabase.from('bookmarks').update(values).eq('id', id);
  if (error) throw error;
}

export async function deleteBookmark(id: string): Promise<void> {
  const { error } = await supabase.from('bookmarks').delete().eq('id', id);
  if (error) throw error;
}
