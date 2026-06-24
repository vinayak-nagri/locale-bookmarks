'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AppButton from '@/components/AppButton';
import { addBookmark, updateBookmark, type Bookmark } from '@/lib/bookmarks';
import { bookmarkSchema, type BookmarkInput } from '@/lib/schema';
import { useTranslations } from 'next-intl';

type BookmarkFormProps = {
  bookmark?: Pick<Bookmark, 'id' | 'title' | 'url'>;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function BookmarkForm({ bookmark, onSuccess, onCancel }: BookmarkFormProps) {
  const t = useTranslations('form');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookmarkInput>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      title: bookmark?.title ?? '',
      url: bookmark?.url ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: (input: BookmarkInput) =>
      bookmark ? updateBookmark(bookmark.id, input) : addBookmark(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = (data: BookmarkInput) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2} sx={{ mt: 1 }}>
        {mutation.isError && (
          <Alert severity="error">
            {t('error')}
          </Alert>
        )}

        <TextField
          label={t('title')}
          fullWidth
          {...register('title')}
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
        />

        <TextField
          label={t('url')}
          fullWidth
          {...register('url')}
          error={Boolean(errors.url)}
          helperText={errors.url?.message}
        />

        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end'}}>
          {onCancel && (
            <Button onClick={onCancel} disabled={mutation.isPending}>
              {t('cancel')}
            </Button>
          )}
          <AppButton
            type="submit"
            variant="contained"
            loading={mutation.isPending}
            loadingText={t('saving')}
          >
            {t('save')}
          </AppButton>
        </Stack>
      </Stack>
    </form>
  );
}
