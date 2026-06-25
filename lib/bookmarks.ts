import { supabase } from './supabase';
import type { BookmarkInput } from '@/lib/schema';

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export type BookmarkSort = 'created_at' | 'updated_at' | 'title';

export async function fetchBookmarks(sort: BookmarkSort): Promise<Bookmark[]> {
  const sortConfig: Record<BookmarkSort, { column: string; ascending: boolean }> = {
    created_at: { column: 'created_at', ascending: false },
    updated_at: { column: 'updated_at', ascending: false },
    title: { column: 'title', ascending: true },
  };
  const { column, ascending } = sortConfig[sort];
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order(column, { ascending });

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
