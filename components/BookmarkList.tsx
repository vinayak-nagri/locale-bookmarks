'use client';

import {useQuery} from '@tanstack/react-query';
import AppButton from '@/components/AppButton';
import {fetchBookmarks} from '@/lib/bookmarks';
import { useTranslations } from 'next-intl';
import Skeleton from '@mui/material/Skeleton';

type BookmarkListProps = { onAdd: () => void };

export default function BookmarkList({ onAdd }: BookmarkListProps) {
  const {data, isLoading, isError, isFetching, refetch} = useQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
  });

  const t = useTranslations('home');

  if (isLoading) {
    return (
      <ul role="status" aria-label={t('loading')} aria-busy="true">
        {Array.from({length: 3}, (_, i) => (
          <li key={i}>
            <Skeleton variant="text" width="55%" />
            <Skeleton variant="text" width="35%" />
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div>
        <p>{t('error')}</p>
        <AppButton
          variant="outlined"
          loading={isFetching}
          loadingText={t('retrying')}
          onClick={() => {
            void refetch();
          }}
        >
          {t('retry')}
        </AppButton>
      </div>
    ); // Error
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <p>{t('empty.message')}</p>
        <AppButton variant="contained" onClick={onAdd}>
          {t('empty.cta')}
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