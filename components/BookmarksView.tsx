'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppButton from '@/components/AppButton';
import BookmarkList from '@/components/BookmarkList';
import BookmarkDialog from '@/components/BookmarkDialog';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import { deleteBookmark, type Bookmark } from '@/lib/bookmarks';
import { LanguageSwitcher } from './LanguageSwitcher';
import Typography from '@mui/material/Typography';


export default function BookmarksView() {
  const t = useTranslations('home');
  const authT = useTranslations('auth');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      setDeletingBookmark(null);
    },
  });

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/signin');
    router.refresh();
  }

  function handleDelete(bookmark: Bookmark) {
    deleteMutation.reset();
    setDeletingBookmark(bookmark);
  }

  function handleDeleteClose() {
    if (deleteMutation.isPending) return;

    deleteMutation.reset();
    setDeletingBookmark(null);
  }

  function handleDeleteConfirm() {
    if (!deletingBookmark) return;

    deleteMutation.mutate(deletingBookmark.id);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 0 } }}>
          <Typography variant="h5" component="h1">{t('title')}</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <LanguageSwitcher />
            <AppButton component={Link} href="/profile" variant="text">
              {t('profile')}
            </AppButton>
            <AppButton variant="outlined" onClick={() => { void handleSignOut(); }}>
              {authT('signout')}
            </AppButton>
            <AppButton variant="contained" onClick={() => setOpen(true)}>
              {t('add')}
            </AppButton>
          </Stack>
        </Box>

        <Divider />

        <BookmarkList
          onAdd={() => setOpen(true)}
          onEdit={setEditingBookmark}
          onDelete={handleDelete}
        />

        <BookmarkDialog
          open={open}
          title={t('add')}
          onClose={() => setOpen(false)}
        />
        <BookmarkDialog
          open={Boolean(editingBookmark)}
          title={t('editTitle')}
          bookmark={editingBookmark}
          onClose={() => setEditingBookmark(null)}
        />
        <ConfirmDialog
          open={Boolean(deletingBookmark)}
          title={t('deleteTitle')}
          body={t('deleteBody')}
          confirmLabel={t('deleteConfirm')}
          cancelLabel={t('deleteCancel')}
          loading={deleteMutation.isPending}
          errorMessage={deleteMutation.isError ? t('deleteError') : undefined}
          onConfirm={handleDeleteConfirm}
          onClose={handleDeleteClose}
        />
      </Stack>
    </Container>
  );
}
