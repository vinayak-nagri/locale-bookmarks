'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AppButton from '@/components/AppButton';
import { useRouter } from '@/i18n/navigation';
import { profileSchema, type ProfileInput } from '@/lib/schema';
import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';

type ProfileFormProps = {
  userId: string;
  initialDisplayName: string;
  initialPreferredLocale: ProfileInput['preferred_locale'];
};

function writeLocaleCookie(locale: ProfileInput['preferred_locale']) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function ProfileForm({
  userId,
  initialDisplayName,
  initialPreferredLocale,
}: ProfileFormProps) {
  const t = useTranslations('profile');
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: initialDisplayName,
      preferred_locale: initialPreferredLocale,
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ display_name, preferred_locale }: ProfileInput) => {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, display_name, preferred_locale });

      if (error) throw error;

      return preferred_locale;
    },
    onMutate: () => {
      setSaved(false);
    },
    onSuccess: (preferredLocale) => {
      writeLocaleCookie(preferredLocale);
      setSaved(true);
      router.replace('/profile', { locale: preferredLocale });
      router.refresh();
    },
  });

  const onSubmit = (data: ProfileInput) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2} sx={{ mt: 1 }}>
        {saved && (
          <Alert severity="success">
            {t('success')}
          </Alert>
        )}

        {mutation.isError && (
          <Alert severity="error">
            {t('error')}
          </Alert>
        )}

        <TextField
          label={t('displayNameLabel')}
          fullWidth
          {...register('display_name')}
          error={Boolean(errors.display_name)}
          helperText={errors.display_name?.message}
        />

        <FormControl fullWidth error={Boolean(errors.preferred_locale)}>
          <InputLabel id="preferred-locale-label">
            {t('localeLabel')}
          </InputLabel>
          <Controller
            name="preferred_locale"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="preferred-locale-label"
                label={t('localeLabel')}
              >
                <MenuItem value="en">
                  {t('localeEn')}
                </MenuItem>
                <MenuItem value="ar">
                  {t('localeAr')}
                </MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.preferred_locale?.message}</FormHelperText>
        </FormControl>

        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
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
