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