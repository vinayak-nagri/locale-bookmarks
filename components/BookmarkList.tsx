'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBookmarks } from '@/lib/bookmarks';

export default function BookmarkList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
  });

  if (isLoading) {
    return <p>Loading your bookmarks…</p>;            // Loading
  }
  if (isError) {
    return <p>Could not load your bookmarks.</p>;       // Error
  }
  if (!data || data.length === 0) {
    return <p>No bookmarks yet.</p>;                   // Empty
  }
  return (                                             // Success
    <ul>
      {data.map((b) => (
        <li key={b.id}>
          <a href={b.url}>{b.title}</a>
        </li>
      ))}
    </ul>
  );
}