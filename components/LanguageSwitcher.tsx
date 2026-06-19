// components/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import AppButton  from './AppButton';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();   // path WITHOUT the locale prefix
  const router = useRouter();

  const target = locale === 'en' ? 'ar' : 'en';
  const label = target === 'ar' ? 'العربية' : 'English';

  return (
    <AppButton onClick={() => router.replace(pathname, { locale: target })}>
      {label}
    </AppButton>
  );
}