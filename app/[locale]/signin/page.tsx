import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AuthForm from '@/components/AuthForm';
import { useTranslations } from 'next-intl';

export default function SignInPage() {
  const t = useTranslations('auth');

  return (
    <Container maxWidth="sm" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Typography variant="h5" component="h1">
          {t('signinTitle')}
        </Typography>
        <AuthForm mode="signin" />
      </Stack>
    </Container>
  );
}
