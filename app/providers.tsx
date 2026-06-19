'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo, useState } from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

export default function Providers({
  children,
  locale
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const isRtl = locale === 'ar';

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: 'dark' },
        direction: isRtl ? 'rtl' : 'ltr'
      }),
    [isRtl]
  );

  const cacheOptions = useMemo(
    () =>
      isRtl
        ? { key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] }
        : undefined,
    [isRtl]
  );

  return (
    <AppRouterCacheProvider options={cacheOptions}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
