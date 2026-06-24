'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import AppButton from '@/components/AppButton';
import { Link, useRouter } from '@/i18n/navigation';
import { authSchema } from '@/lib/schema';
import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import type { z } from 'zod';

type AuthFormMode = 'signin' | 'signup';
type AuthInput = z.infer<typeof authSchema>;

type AuthFormProps = {
  mode: AuthFormMode;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthInput>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: async ({ email, password }: AuthInput) => {
      const { error } =
        mode === 'signin'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) throw error;
    },
    onSuccess: () => {
      router.push('/');
      router.refresh();
    },
  });

  const onSubmit = (data: AuthInput) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2} sx={{ mt: 1 }}>
        {mutation.isError && (
          <Alert severity="error">
            {t('auth.error')}
          </Alert>
        )}

        <TextField
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          fullWidth
          {...register('email')}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />

        <TextField
          label={t('auth.password')}
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          fullWidth
          {...register('password')}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />

        <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
          <AppButton
            type="submit"
            variant="contained"
            loading={mutation.isPending}
            loadingText={t('auth.submitting')}
          >
            {mode === 'signin' ? t('auth.signin') : t('auth.signup')}
          </AppButton>

          <Typography variant="body2">
            <Link href={mode === 'signin' ? '/signup' : '/signin'}>
              {mode === 'signin' ? t('auth.toSignup') : t('auth.toSignin')}
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </form>
  );
}
