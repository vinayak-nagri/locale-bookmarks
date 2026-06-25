'use client';

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import {keepPreviousData, useQuery} from '@tanstack/react-query';
import AppButton from '@/components/AppButton';
import {fetchBookmarks, type Bookmark, type BookmarkSort} from '@/lib/bookmarks';
import { useTranslations } from 'next-intl';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

const PAGE_SIZE = 7;
type ViewMode = 'list' | 'folder';

type BookmarkListProps = {
  onAdd: () => void;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
};

export default function BookmarkList({ onAdd, onEdit, onDelete }: BookmarkListProps) {
  const t = useTranslations('home');
  const [sortOption, setSortOption] = useState<BookmarkSort>('created_at');
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const {data, isLoading, isError, isFetching, refetch} = useQuery({
    queryKey: ['bookmarks', sortOption, page],
    queryFn: () => fetchBookmarks(sortOption, page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;

    const lastPage = Math.max(0, Math.ceil(data.count / PAGE_SIZE) - 1);
    if (page <= lastPage) return;

    const timeoutId = window.setTimeout(() => setPage(lastPage), 0);
    return () => window.clearTimeout(timeoutId);
  }, [data, page]);

  function handleSortChange(event: SelectChangeEvent<BookmarkSort>) {
    setPage(0);
    setSortOption(event.target.value);
  }

  function handleViewModeChange(_event: MouseEvent<HTMLElement>, nextViewMode: ViewMode | null) {
    if (nextViewMode) setViewMode(nextViewMode);
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

  const viewToggle = (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={viewMode}
      aria-label={t('view.label')}
      onChange={handleViewModeChange}
      sx={{
        alignSelf: { xs: 'stretch', sm: 'center' },
        '& .MuiToggleButton-root': {
          flex: { xs: 1, sm: '0 0 auto' },
        },
      }}
    >
      <ToggleButton value="list">
        {t('view.list')}
      </ToggleButton>
      <ToggleButton value="folder">
        {t('view.folder')}
      </ToggleButton>
    </ToggleButtonGroup>
  );

  function renderWithControls(content: ReactNode) {
    return (
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          {viewToggle}
          {sortControl}
        </Stack>
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

  type BookmarkActionsProps = {
    bookmark: Bookmark;
    onEdit: (bookmark: Bookmark) => void;
    onDelete: (bookmark: Bookmark) => void;
  };

  function BookmarkActions({ bookmark, onEdit, onDelete }: BookmarkActionsProps) {
    return (
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
          onClick={() => onEdit(bookmark)}
        >
          {t('edit')}
        </AppButton>
        <AppButton
          variant="text"
          color="error"
          size="small"
          onClick={() => onDelete(bookmark)}
        >
          {t('delete')}
        </AppButton>
        <AppButton
          variant="outlined"
          size="small"
          onClick={() => window.open(bookmark.url, '_blank', 'noopener,noreferrer')}
        >
          {t('openLink')}
        </AppButton>
        <AppButton
          variant="text"
          size="small"
          onClick={() => { void handleCopy(bookmark.id, bookmark.url); }}
        >
          {copiedId === bookmark.id ? t('copied') : t('copyLink')}
        </AppButton>
      </Stack>
    );
  }

  if (isLoading) {
    return renderWithControls(
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
    return renderWithControls(
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

  if (!data || data.count === 0) {
    return renderWithControls(
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

  const pageCount = Math.ceil(data.count / PAGE_SIZE);
  const bookmarks = data.bookmarks;

  return renderWithControls(
    <Stack spacing={2}>
      {viewMode === 'list' ? (
        <Box
          component="ul"
          sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 0 }}
        >
          {bookmarks.map((b) => (
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
              <BookmarkActions bookmark={b} onEdit={onEdit} onDelete={onDelete} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 2,
          }}
        >
          {bookmarks.map((b) => (
            <Paper
              component="article"
              elevation={0}
              key={b.id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                minWidth: 0,
              }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {b.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', overflowWrap: 'anywhere' }}>
                  {b.url}
                </Typography>
              </Box>
              <BookmarkActions bookmark={b} onEdit={onEdit} onDelete={onDelete} />
            </Paper>
          ))}
        </Box>
      )}

      {data.count > PAGE_SIZE && (
        <Pagination
          count={pageCount}
          page={page + 1}
          onChange={(_, value) => setPage(value - 1)}
          sx={{ alignSelf: 'center' }}
        />
      )}
    </Stack>
  );
}
