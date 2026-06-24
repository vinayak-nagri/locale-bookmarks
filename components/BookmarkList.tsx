'use client';

import { useState } from 'react';
import {useQuery} from '@tanstack/react-query';
import AppButton from '@/components/AppButton';
import {fetchBookmarks, type Bookmark} from '@/lib/bookmarks';
import { useTranslations } from 'next-intl';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

type BookmarkListProps = {
  onAdd: () => void;
  onEdit: (bookmark: Bookmark) => void;
};

export default function BookmarkList({ onAdd, onEdit }: BookmarkListProps) {
  const {data, isLoading, isError, isFetching, refetch} = useQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
  });

  const t = useTranslations('home');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(id: string, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  if (isLoading) {
    return (
      <Box
        component="ul"
        role="status"
        aria-label={t('loading')}
        aria-busy="true"
        sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
      >
        {Array.from({length: 3}, (_, i) => (
          <Box
            component="li"
            key={i}
            sx={{
              px: 2,
              py: 1.5,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1.5,
              '&:not(:last-of-type)': { borderBottom: 1, borderColor: 'divider' },
            }}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="55%" sx={{ fontSize: '1rem' }} />
            </Box>
            <Skeleton variant="rounded" width={120} height={32} sx={{ flexShrink: 0 }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (isError) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', borderRadius: 2, bgcolor: 'background.paper' }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ color: 'error.main' }}>{t('error')}</Typography>
          <AppButton
            variant="outlined"
            loading={isFetching}
            loadingText={t('retrying')}
            onClick={() => { void refetch(); }}
          >
            {t('retry')}
          </AppButton>
        </Stack>
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', borderRadius: 2, bgcolor: 'background.paper' }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>{t('empty.message')}</Typography>
          <AppButton variant="contained" onClick={onAdd}>
            {t('empty.cta')}
          </AppButton>
        </Stack>
      </Paper>
    );
  }

  return (
    <Box
      component="ul"
      sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 0 }}
    >
      {data.map((b) => (
        <Box
          component="li"
          key={b.id}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
            px: 2,
            py: 1.5,
            '&:not(:last-of-type)': { borderBottom: 1, borderColor: 'divider' },
            '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12) },
          }}
        >
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{b.title}</Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <AppButton
              variant="text"
              size="small"
              onClick={() => onEdit(b)}
            >
              {t('edit')}
            </AppButton>
            <AppButton
              variant="outlined"
              size="small"
              onClick={() => window.open(b.url, '_blank', 'noopener,noreferrer')}
            >
              {t('openLink')}
            </AppButton>
            <AppButton
              variant="text"
              size="small"
              onClick={() => { void handleCopy(b.id, b.url); }}
            >
              {copiedId === b.id ? t('copied') : t('copyLink')}
            </AppButton>
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
