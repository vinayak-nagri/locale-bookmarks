'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import BookmarkForm from '@/components/BookmarkForm';

type BookmarkDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function BookmarkDialog({ open, onClose }: BookmarkDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add bookmark</DialogTitle>
      <DialogContent>
        <BookmarkForm onSuccess={onClose} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}