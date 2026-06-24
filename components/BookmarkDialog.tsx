'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import BookmarkForm from '@/components/BookmarkForm';
import type { Bookmark } from '@/lib/bookmarks';

type BookmarkDialogProps = {
  open: boolean;
  title: string;
  bookmark?: Pick<Bookmark, 'id' | 'title' | 'url'> | null;
  onClose: () => void;
};

export default function BookmarkDialog({ open, title, bookmark, onClose }: BookmarkDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <BookmarkForm bookmark={bookmark ?? undefined} onSuccess={onClose} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
