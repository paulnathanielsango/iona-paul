import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LOCALE_ORDER = ['fi-FI', 'en-US', 'en-GB', 'de-DE'] as const;

export const COUNTRY_CONFIG: Record<
  string,
  { currency: string; locale: string; country: string; label: string }
> = {
  'fi-FI': { locale: 'fi-FI', currency: 'EUR', country: 'FI', label: 'Finland' },
  'en-US': { locale: 'en-US', currency: 'USD', country: 'US', label: 'United States' },
  'en-GB': { locale: 'en-GB', currency: 'GBP', country: 'GB', label: 'United Kingdom' },
  'de-DE': { locale: 'de-DE', currency: 'EUR', country: 'DE', label: 'Germany' },
};

export const DEFAULT_LOCALE = COUNTRY_CONFIG['en-US'];

export function formatMoney(centAmount: number, currencyCode: string, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(
    centAmount / 100
  );
}

export function getLocalizedString(
  obj: Record<string, string> | undefined,
  locale: string
): string {
  if (!obj) return '';
  return obj[locale] ?? obj[locale.split('-')[0]] ?? Object.values(obj)[0] ?? '';
}
