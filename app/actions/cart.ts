'use server';

import { revalidatePath } from 'next/cache';
import { addLineItem, changeLineItemQuantity, removeLineItem } from '@/lib/ct/cart';
import { getCtErrorMessage, toAddToCartError } from '@/lib/ct/errors';
import { getOrCreateCart, getActiveCart } from '@/lib/cart/session';
import { setCartId } from '@/lib/cart/cookie';

function revalidateCartPaths(locale: string) {
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/cart`);
}

export async function addToCartAction(
  locale: string,
  productId: string,
  variantId: number,
  quantity = 1
) {
  try {
    const cart = await getOrCreateCart(locale);
    const updated = await addLineItem(cart.id, locale, productId, variantId, quantity);
    await setCartId(updated.id);
    revalidateCartPaths(locale);
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: toAddToCartError(getCtErrorMessage(error), locale),
    };
  }
}

export async function updateLineQuantityAction(
  locale: string,
  lineItemId: string,
  quantity: number
) {
  const cart = await getActiveCart(locale);
  if (!cart) {
    return { success: false as const, error: 'Cart not found' };
  }

  const updated = await changeLineItemQuantity(cart.id, locale, lineItemId, quantity);
  await setCartId(updated.id);
  revalidateCartPaths(locale);
  return { success: true as const };
}

export async function removeLineItemAction(locale: string, lineItemId: string) {
  const cart = await getActiveCart(locale);
  if (!cart) {
    return { success: false as const, error: 'Cart not found' };
  }

  const updated = await removeLineItem(cart.id, locale, lineItemId);
  await setCartId(updated.id);
  revalidateCartPaths(locale);
  return { success: true as const };
}
