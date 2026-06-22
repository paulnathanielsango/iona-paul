import type { Cart as CtCart, LineItem } from '@commercetools/platform-sdk';
import { getLocalizedString } from '@/lib/utils';
import type { Cart, CartLine, Price } from '@/lib/types';

function mapLinePrice(lineItem: LineItem, locale: string): Price {
  const total = lineItem.totalPrice;
  const quantity = lineItem.quantity || 1;

  return {
    centAmount: Math.round(total.centAmount / quantity),
    currencyCode: total.currencyCode,
  };
}

function mapLineItem(lineItem: LineItem, locale: string): CartLine {
  const image = lineItem.variant.images?.[0]?.url;

  return {
    id: lineItem.id,
    productId: lineItem.productId,
    variantId: lineItem.variant.id,
    sku: lineItem.variant.sku ?? '',
    name: getLocalizedString(lineItem.name, locale),
    slug: getLocalizedString(lineItem.productSlug, locale),
    quantity: lineItem.quantity,
    image,
    price: mapLinePrice(lineItem, locale),
    lineTotal: {
      centAmount: lineItem.totalPrice.centAmount,
      currencyCode: lineItem.totalPrice.currencyCode,
    },
  };
}

export function mapCart(cart: CtCart, locale: string): Cart {
  return {
    id: cart.id,
    version: cart.version,
    lineItems: (cart.lineItems ?? []).map((item) => mapLineItem(item, locale)),
    itemCount: (cart.lineItems ?? []).reduce((sum, item) => sum + item.quantity, 0),
    subtotal: {
      centAmount: cart.totalPrice.centAmount,
      currencyCode: cart.totalPrice.currencyCode,
    },
  };
}
