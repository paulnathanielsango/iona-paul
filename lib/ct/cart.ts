import 'server-only';

import type { Cart as CtCart, CartUpdateAction } from '@commercetools/platform-sdk';
import { apiRoot } from './client';
import { mapCart } from '@/lib/mappers/cart';
import type { Cart } from '@/lib/types';
import { COUNTRY_CONFIG } from '@/lib/utils';

async function executeCartUpdate(
  cartId: string,
  version: number,
  actions: CartUpdateAction[]
): Promise<CtCart> {
  const { body } = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({ body: { version, actions } })
    .execute();
  return body;
}

export async function fetchCartById(cartId: string, locale: string): Promise<Cart | null> {
  try {
    const { body } = await apiRoot.carts().withId({ ID: cartId }).get().execute();
    if (body.cartState !== 'Active') return null;
    return mapCart(body, locale);
  } catch {
    return null;
  }
}

export async function createCart(locale: string): Promise<Cart> {
  const config = COUNTRY_CONFIG[locale] ?? COUNTRY_CONFIG['en-US'];

  const { body } = await apiRoot
    .carts()
    .post({
      body: {
        currency: config.currency,
        country: config.country,
      },
    })
    .execute();

  return mapCart(body, locale);
}

export async function addLineItem(
  cartId: string,
  locale: string,
  productId: string,
  variantId: number,
  quantity = 1
): Promise<Cart> {
  const existing = await fetchCartById(cartId, locale);
  if (!existing) {
    throw new Error('Cart not found');
  }

  try {
    const body = await executeCartUpdate(cartId, existing.version, [
      { action: 'addLineItem', productId, variantId, quantity },
    ]);
    return mapCart(body, locale);
  } catch (error) {
    const refreshed = await fetchCartById(cartId, locale);
    if (!refreshed) throw error;
    const body = await executeCartUpdate(cartId, refreshed.version, [
      { action: 'addLineItem', productId, variantId, quantity },
    ]);
    return mapCart(body, locale);
  }
}

export async function changeLineItemQuantity(
  cartId: string,
  locale: string,
  lineItemId: string,
  quantity: number
): Promise<Cart> {
  const existing = await fetchCartById(cartId, locale);
  if (!existing) {
    throw new Error('Cart not found');
  }

  const actions: CartUpdateAction[] =
    quantity <= 0
      ? [{ action: 'removeLineItem', lineItemId }]
      : [{ action: 'changeLineItemQuantity', lineItemId, quantity }];

  try {
    const body = await executeCartUpdate(cartId, existing.version, actions);
    return mapCart(body, locale);
  } catch (error) {
    const refreshed = await fetchCartById(cartId, locale);
    if (!refreshed) throw error;
    const body = await executeCartUpdate(cartId, refreshed.version, actions);
    return mapCart(body, locale);
  }
}

export async function removeLineItem(
  cartId: string,
  locale: string,
  lineItemId: string
): Promise<Cart> {
  return changeLineItemQuantity(cartId, locale, lineItemId, 0);
}
