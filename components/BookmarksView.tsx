'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
import AppButton from '@/components/AppButton';
import BookmarkList from '@/components/BookmarkList';
import BookmarkDialog from '@/components/BookmarkDialog';

export default function BookmarksView() {
  const [open, setOpen] = useState(false);

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <AppButton variant="contained" onClick={() => setOpen(true)}>
          Add bookmark
        </AppButton>
      </Stack>

      <BookmarkList onAdd={() => setOpen(true)} />

      <BookmarkDialog open={open} onClose={() => setOpen(false)} />
    </Stack>
  );
}