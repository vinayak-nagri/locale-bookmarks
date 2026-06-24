'use client';

import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppButton from '@/components/AppButton';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  loading: boolean;
  errorMessage?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  loading,
  errorMessage,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body1">
            {body}
          </Typography>

          {errorMessage && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
            <AppButton variant="text" onClick={onClose} disabled={loading}>
              {cancelLabel}
            </AppButton>
            <AppButton
              variant="contained"
              color="error"
              loading={loading}
              loadingText={confirmLabel}
              onClick={onConfirm}
            >
              {confirmLabel}
            </AppButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
