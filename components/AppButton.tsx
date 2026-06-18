'use client';

import Button from '@mui/material/Button';
import type {ButtonProps} from '@mui/material/Button';
import type {ReactNode} from 'react';

type AppButtonProps = ButtonProps & {
  loading?: boolean;
  loadingText?: ReactNode;
};

export default function AppButton({
  loading = false,
  loadingText = 'Loading...',
  disabled,
  children,
  ...props
}: AppButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? loadingText : children}
    </Button>
  );
}