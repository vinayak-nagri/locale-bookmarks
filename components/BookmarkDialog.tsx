'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import BookmarkForm from '@/components/BookmarkForm';
import { useTranslations } from 'next-intl';

type BookmarkDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function BookmarkDialog({ open, onClose }: BookmarkDialogProps) {
    const t = useTranslations('home');
  return (
     
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('add')}</DialogTitle>
      <DialogContent>
        <BookmarkForm onSuccess={onClose} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}