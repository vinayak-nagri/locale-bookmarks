import Providers from './providers';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {cookies} from 'next/headers';
import {notFound} from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Navbar from '@/components/Navbar';
import {routing} from '@/i18n/routing';
import {createServerSupabaseClient} from '@/lib/server';
import '../globals.css';

type ColorMode = 'light' | 'dark';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const colorMode = (await cookies()).get('color-mode')?.value;
  const initialMode: ColorMode = colorMode === 'light' ? 'light' : 'dark';
  const supabase = await createServerSupabaseClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider>
          <Providers locale={locale} initialMode={initialMode}>
            <Navbar isSignedIn={Boolean(user)} />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Container
                maxWidth="lg"
                disableGutters
                sx={{ px: { xs: 0, md: 3 } }}
              >
                {children}
              </Container>
            </Box>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
