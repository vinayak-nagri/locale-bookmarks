'use client';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppButton from '@/components/AppButton';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function SignedOutHome() {
  const t = useTranslations('landing');

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 4,
        px: { xs: 2, sm: 3 },
        minHeight: { xs: '60vh', md: 'calc(100dvh - 65px)' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', alignItems: 'center', textAlign: 'center' }}>
        <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {t('welcome')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('body')}
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <AppButton component={Link} href="/signin" variant="contained">
            {t('signin')}
          </AppButton>
          <AppButton component={Link} href="/signup" variant="text">
            {t('signup')}
          </AppButton>
        </Stack>
      </Stack>
    </Container>
  );
}
