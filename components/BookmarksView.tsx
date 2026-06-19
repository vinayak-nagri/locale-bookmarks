'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppButton from '@/components/AppButton';
import BookmarkList from '@/components/BookmarkList';
import BookmarkDialog from '@/components/BookmarkDialog';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import Typography from '@mui/material/Typography';


export default function BookmarksView() {
  const t = useTranslations('home');
  const [open, setOpen] = useState(false);

  return (
    <Container maxWidth="sm" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1.5, sm: 0 } }}>
          <Typography variant="h5" component="h1">{t('title')}</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <LanguageSwitcher />
            <AppButton variant="contained" onClick={() => setOpen(true)}>
              {t('add')}
            </AppButton>
          </Stack>
        </Box>

        <Divider />

        <BookmarkList onAdd={() => setOpen(true)} />

        <BookmarkDialog open={open} onClose={() => setOpen(false)} />
      </Stack>
    </Container>
  );
}