'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
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
    
    <Stack spacing={2}>
      <Typography variant="h5" component="h1">{t('title')}</Typography>
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        
        <AppButton variant="contained" onClick={() => setOpen(true)}> 
            
          {t('add')}
        </AppButton>
        <LanguageSwitcher />
      </Stack>

      <BookmarkList onAdd={() => setOpen(true)} />

      <BookmarkDialog open={open} onClose={() => setOpen(false)} />
    </Stack>
  );
}