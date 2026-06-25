import { supabase } from './supabase';
import type { BookmarkInput } from '@/lib/schema';

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export type BookmarkSort = 'created_at' | 'updated_at' | 'title';

export type FetchBookmarksResult = {
  bookmarks: Bookmark[];
  count: number;
};

export async function fetchBookmarks(
  sort: BookmarkSort,
  page: number,
  pageSize: number,
  search?: string
): Promise<FetchBookmarksResult> {
  const sortConfig: Record<BookmarkSort, { column: string; ascending: boolean }> = {
    created_at: { column: 'created_at', ascending: false },
    updated_at: { column: 'updated_at', ascending: false },
    title: { column: 'title', ascending: true },
  };
  const { column, ascending } = sortConfig[sort];
  const from = page * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from('bookmarks')
    .select('*', { count: 'exact' })
    .order(column, { ascending });

  const term = search?.trim();
  if (term) {
    query = query.ilike('title', `%${term}%`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;
  return { bookmarks: data ?? [], count: count ?? 0 };
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
