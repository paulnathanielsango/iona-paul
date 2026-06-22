import 'server-only';

import { createCart, fetchCartById } from '@/lib/ct/cart';
import { clearCartId, getCartId, setCartId } from '@/lib/cart/cookie';
import type { Cart } from '@/lib/types';

export async function getActiveCart(locale: string): Promise<Cart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;

  const cart = await fetchCartById(cartId, locale);
  if (!cart) {
    await clearCartId();
    return null;
  }

  return cart;
}

export async function getOrCreateCart(locale: string): Promise<Cart> {
  const existing = await getActiveCart(locale);
  if (existing) return existing;

  const cart = await createCart(locale);
  await setCartId(cart.id);
  return cart;
}
