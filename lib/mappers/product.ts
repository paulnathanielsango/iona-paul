import type { ProductProjection, ProductVariant } from '@commercetools/platform-sdk';
import { COUNTRY_CONFIG, getLocalizedString } from '@/lib/utils';
import type { Price, Product, Variant } from '@/lib/types';

function pickPriceForLocale(
  variant: ProductVariant,
  locale: string
): NonNullable<ProductVariant['prices']>[number] | undefined {
  const config = COUNTRY_CONFIG[locale] ?? COUNTRY_CONFIG['en-US'];
  const prices = variant.prices ?? [];

  const byCurrency = prices.find((p) => p.value.currencyCode === config.currency);
  if (byCurrency) return byCurrency;

  const byCountry = prices.find((p) => p.country === config.country);
  if (byCountry) return byCountry;

  return undefined;
}

function mapPrice(
  price: NonNullable<ProductVariant['prices']>[number] | undefined
): Price | undefined {
  if (!price) return undefined;

  const currencyCode = price.value.currencyCode;
  const centAmount = price.value.centAmount;
  const discounted = price.discounted?.value;

  return {
    centAmount,
    currencyCode,
    discounted: discounted
      ? { centAmount: discounted.centAmount, currencyCode: discounted.currencyCode }
      : undefined,
  };
}

function mapVariant(variant: ProductVariant, locale: string): Variant {
  const images = (variant.images ?? []).map((img) => img.url);
  const prices = (variant.prices ?? []).map((p) => mapPrice(p)).filter(Boolean) as Price[];
  const matchedPrice = mapPrice(pickPriceForLocale(variant, locale));

  return {
    id: variant.id,
    sku: variant.sku ?? '',
    images,
    price: matchedPrice,
    prices,
    attributes: (variant.attributes ?? []).map((attr) => ({
      name: attr.name,
      value: attr.value,
    })),
    availability: variant.availability?.isOnStock != null
      ? { isOnStock: variant.availability.isOnStock }
      : undefined,
  };
}

export function mapProductProjection(projection: ProductProjection, locale: string): Product {
  const masterVariant = mapVariant(projection.masterVariant, locale);
  const otherVariants = (projection.variants ?? []).map((v) => mapVariant(v, locale));

  return {
    type: 'Product',
    id: projection.id,
    name: getLocalizedString(projection.name, locale),
    slug: getLocalizedString(projection.slug, locale),
    description: getLocalizedString(projection.description, locale) || undefined,
    categories: (projection.categories ?? []).map((c) => ({ id: c.id })),
    variants: [masterVariant, ...otherVariants],
  };
}
