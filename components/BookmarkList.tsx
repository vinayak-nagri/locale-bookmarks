'use client';

import {useQuery} from '@tanstack/react-query';
import AppButton from '@/components/AppButton';
import {fetchBookmarks} from '@/lib/bookmarks';

export default function BookmarkList() {
  const {data, isLoading, isError, isFetching, refetch} = useQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
  });

  if (isLoading) {
    return <p>Loading your bookmarks…</p>; // Loading
  }

  if (isError) {
    return (
      <div>
        <p>Could not load your bookmarks.</p>
        <AppButton
          variant="outlined"
          loading={isFetching}
          loadingText="Retrying..."
          onClick={() => {
            void refetch();
          }}
        >
          Retry
        </AppButton>
      </div>
    ); // Error
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <p>No bookmarks yet.</p>
        <AppButton variant="contained">
          Add your first bookmark
        </AppButton>
      </div>
    ); // Empty
  }

  return (
    <ul>
      {data.map((b) => (
        <li key={b.id}>
          <a href={b.url}>{b.title}</a>
        </li>
      ))}
    </ul>
  ); // Success
}