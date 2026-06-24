import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ProfileForm from '@/components/ProfileForm';
import { redirect } from '@/i18n/navigation';
import { createServerSupabaseClient } from '@/lib/server';
import { getTranslations } from 'next-intl/server';
import type { ProfileInput } from '@/lib/schema';

type ProfilePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

function toPreferredLocale(value: string | null | undefined): ProfileInput['preferred_locale'] {
  return value === 'ar' ? 'ar' : 'en';
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'profile' });
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    redirect({ href: '/signin', locale });
  }

  const profileUserId = userId!;

  const { data } = await supabase
    .from('profiles')
    .select('display_name, preferred_locale')
    .eq('id', profileUserId)
    .maybeSingle();

  return (
    <Container maxWidth="sm" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Typography variant="h5" component="h1">
          {t('title')}
        </Typography>
        <ProfileForm
          userId={profileUserId}
          initialDisplayName={data?.display_name ?? ''}
          initialPreferredLocale={toPreferredLocale(data?.preferred_locale ?? locale)}
        />
      </Stack>
    </Container>
  );
}
