'use client';

import AppButton from '@/components/AppButton';
import {LanguageSwitcher} from '@/components/LanguageSwitcher';
import {useColorMode} from '@/app/[locale]/providers';
import {Link, useRouter} from '@/i18n/navigation';
import {supabase} from '@/lib/supabase';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {useTranslations} from 'next-intl';

type NavbarProps = {
  isSignedIn: boolean;
};

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.99 12.64A9 9 0 1 1 11.36 3.01 7 7 0 0 0 20.99 12.64Z" />
    </svg>
  );
}

export default function Navbar({isSignedIn}: NavbarProps) {
  const landingT = useTranslations('landing');
  const homeT = useTranslations('home');
  const authT = useTranslations('auth');
  const router = useRouter();
  const {mode, toggle} = useColorMode();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <Box
      component="nav"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          px: {xs: 2, sm: 3},
          py: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            component={Link}
            href="/"
            variant="h6"
            sx={{
              color: 'text.primary',
              flexShrink: 0,
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {landingT('title')}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <LanguageSwitcher />
            <IconButton
              aria-label={homeT('theme.label')}
              color="inherit"
              onClick={toggle}
            >
              {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
            </IconButton>
            {isSignedIn && (
              <>
                <AppButton component={Link} href="/profile" variant="text">
                  {homeT('profile')}
                </AppButton>
                <AppButton
                  variant="outlined"
                  onClick={() => {
                    void handleSignOut();
                  }}
                >
                  {authT('signout')}
                </AppButton>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
