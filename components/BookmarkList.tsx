'use client';

import { useState, type ReactNode } from 'react';
import {useQuery} from '@tanstack/react-query';
import AppButton from '@/components/AppButton';
import {fetchBookmarks, type Bookmark, type BookmarkSort} from '@/lib/bookmarks';
import { useTranslations } from 'next-intl';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

type BookmarkListProps = {
  onAdd: () => void;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
};

export default function BookmarkList({ onAdd, onEdit, onDelete }: BookmarkListProps) {
  const t = useTranslations('home');
  const [sortOption, setSortOption] = useState<BookmarkSort>('created_at');
  const {data, isLoading, isError, isFetching, refetch} = useQuery({
    queryKey: ['bookmarks', sortOption],
    queryFn: () => fetchBookmarks(sortOption),
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleSortChange(event: SelectChangeEvent<BookmarkSort>) {
    setSortOption(event.target.value);
  }

  const sortControl = (
    <FormControl
      size="small"
      sx={{
        minWidth: { xs: '100%', sm: 220 },
        alignSelf: { xs: 'stretch', sm: 'flex-end' },
      }}
    >
      <InputLabel id="bookmark-sort-label">{t('sortLabel')}</InputLabel>
      <Select<BookmarkSort>
        labelId="bookmark-sort-label"
        value={sortOption}
        label={t('sortLabel')}
        onChange={handleSortChange}
      >
        <MenuItem value="created_at">{t('sortNewest')}</MenuItem>
        <MenuItem value="updated_at">{t('sortUpdated')}</MenuItem>
        <MenuItem value="title">{t('sortAlphabetical')}</MenuItem>
      </Select>
    </FormControl>
  );

  function renderWithSortControl(content: ReactNode) {
    return (
      <Stack spacing={2}>
        {sortControl}
        {content}
      </Stack>
    );
  }

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
    return renderWithSortControl(
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
    return renderWithSortControl(
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
    return renderWithSortControl(
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

  return renderWithSortControl(
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
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexShrink: 0,
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            }}
          >
            <AppButton
              variant="text"
              size="small"
              onClick={() => onEdit(b)}
            >
              {t('edit')}
            </AppButton>
            <AppButton
              variant="text"
              color="error"
              size="small"
              onClick={() => onDelete(b)}
            >
              {t('delete')}
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
