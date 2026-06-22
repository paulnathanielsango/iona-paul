import 'server-only';

import { COUNTRY_CONFIG } from '@/lib/utils';

export function getCtErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'body' in error) {
    const body = (error as { body?: { message?: string } }).body;
    if (typeof body?.message === 'string') {
      return body.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Could not complete the request';
}

export function toAddToCartError(message: string, locale = 'en-US'): string {
  if (message.includes('missing a tax category')) {
    return 'This product needs a tax category in commercetools (Merchant Center → product → Tax category), then publish again.';
  }

  if (message.includes('does not contain a price for currency')) {
    const config = COUNTRY_CONFIG[locale] ?? COUNTRY_CONFIG['en-US'];
    return `Add a ${config.currency} price for ${config.country} on this product's variant (Merchant Center → Variants → Prices). Remove mismatched country/currency pairs (e.g. EUR with US), then publish.`;
  }

  if (message.includes('price') || message.includes('Price')) {
    return 'This product needs a matching price for your storefront locale. Add the correct currency in Merchant Center → Variants → Prices, then publish.';
  }

  return message;
}
