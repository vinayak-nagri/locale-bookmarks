'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

export type ColorMode = 'light' | 'dark';

type ColorModeContextValue = {
  mode: ColorMode;
  toggle: () => void;
};

export const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export function useColorMode() {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error('useColorMode must be used within Providers');
  }

  return context;
}

export default function Providers({
  children,
  locale,
  initialMode,
}: {
  children: ReactNode;
  locale: string;
  initialMode: ColorMode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [mode, setMode] = useState<ColorMode>(initialMode);
  const isRtl = locale === 'ar';

  const toggle = useCallback(() => {
    setMode((currentMode) => {
      const nextMode = currentMode === 'dark' ? 'light' : 'dark';
      document.cookie = `color-mode=${nextMode}; path=/; max-age=31536000; SameSite=Lax`;
      return nextMode;
    });
  }, []);

  const colorModeValue = useMemo(
    () => ({ mode, toggle }),
    [mode, toggle]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        direction: locale === 'ar' ? 'rtl' : 'ltr',
      }),
    [locale, mode]
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
        <QueryClientProvider client={queryClient}>
          <ColorModeContext.Provider value={colorModeValue}>
            {children}
          </ColorModeContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
