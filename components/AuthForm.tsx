'use client';

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
import Typography from '@mui/material/Typography';
import AppButton from '@/components/AppButton';
import { Link, useRouter } from '@/i18n/navigation';
import { authSchema, signUpSchema, type SignUpInput } from '@/lib/schema';
import { supabase } from '@/lib/supabase';
import { useLocale, useTranslations } from 'next-intl';
import type { z } from 'zod';

type AuthFormMode = 'signin' | 'signup';
type AuthInput = z.infer<typeof authSchema>;
type PreferredLocale = SignUpInput['preferredLocale'];

type AuthFormProps = {
  mode: AuthFormMode;
};

function toPreferredLocale(value: string | null | undefined): PreferredLocale {
  return value === 'ar' ? 'ar' : 'en';
}

function writeLocaleCookie(locale: PreferredLocale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function AuthForm({ mode }: AuthFormProps) {
  return mode === 'signin' ? <SignInForm /> : <SignUpForm />;
}

function SignInForm() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const currentLocale = toPreferredLocale(locale);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthInput>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ email, password }: AuthInput) => {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      if (!user) throw new Error('Sign-in did not return a user.');

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('preferred_locale')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const nextLocale = toPreferredLocale(data?.preferred_locale ?? currentLocale);
      writeLocaleCookie(nextLocale);
      return nextLocale;
    },
    onSuccess: (preferredLocale) => {
      router.push('/', { locale: preferredLocale });
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
          autoComplete="current-password"
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
            {t('auth.signin')}
          </AppButton>

          <Typography variant="body2">
            <Link href="/signup">
              {t('auth.toSignup')}
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </form>
  );
}

function SignUpForm() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const currentLocale = toPreferredLocale(locale);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      preferredLocale: currentLocale,
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ email, password, displayName, preferredLocale }: SignUpInput) => {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({ email, password });

      if (error) throw error;
      if (!user) throw new Error('Sign-up did not return a user.');

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName,
          preferred_locale: preferredLocale,
        });

      if (profileError) throw profileError;

      writeLocaleCookie(preferredLocale);
      return preferredLocale;
    },
    onSuccess: (preferredLocale) => {
      router.push('/', { locale: preferredLocale });
      router.refresh();
    },
  });

  const onSubmit = (data: SignUpInput) => {
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
          autoComplete="new-password"
          fullWidth
          {...register('password')}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />

        <TextField
          label={t('auth.displayNameLabel')}
          fullWidth
          {...register('displayName')}
          error={Boolean(errors.displayName)}
          helperText={errors.displayName?.message}
        />

        <FormControl fullWidth error={Boolean(errors.preferredLocale)}>
          <InputLabel id="auth-preferred-locale-label">
            {t('auth.localeLabel')}
          </InputLabel>
          <Controller
            name="preferredLocale"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="auth-preferred-locale-label"
                label={t('auth.localeLabel')}
              >
                <MenuItem value="en">
                  {t('auth.localeEn')}
                </MenuItem>
                <MenuItem value="ar">
                  {t('auth.localeAr')}
                </MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.preferredLocale?.message}</FormHelperText>
        </FormControl>

        <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
          <AppButton
            type="submit"
            variant="contained"
            loading={mutation.isPending}
            loadingText={t('auth.submitting')}
          >
            {t('auth.signup')}
          </AppButton>

          <Typography variant="body2">
            <Link href="/signin">
              {t('auth.toSignin')}
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </form>
  );
}
