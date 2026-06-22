export const KEY_CART = 'cart';
export const KEY_ACCOUNT = 'account';
export const KEY_ORDERS = 'orders';
export const KEY_ADDRESSES = 'addresses';
export const KEY_WISHLIST = 'wishlist';

export const TAG_PRODUCTS = 'products';
export const TAG_CATEGORIES = 'categories';

export const REVALIDATE_CATALOG = 300;

export function tagProduct(slug: string) {
  return `product-${slug}`;
}

export function keyOrder(id: string) {
  return `order-${id}`;
}
