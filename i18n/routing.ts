import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { LOCALE_ORDER } from '@/lib/utils';

export const routing = defineRouting({
  locales: [...LOCALE_ORDER],
  defaultLocale: 'en-US',
  localePrefix: 'always',
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
