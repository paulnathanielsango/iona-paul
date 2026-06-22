export interface Price {
  centAmount: number;
  currencyCode: string;
  discounted?: { centAmount: number; currencyCode: string };
}

export interface Variant {
  id: number;
  sku: string;
  images: string[];
  price?: Price;
  prices: Price[];
  attributes: Array<{ name: string; value: unknown }>;
  availability?: { isOnStock?: boolean };
}

export interface Product {
  type: 'Product';
  id: string;
  name: string;
  slug: string;
  description?: string;
  categories: Array<{ id: string }>;
  variants: Variant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: { id: string };
  children?: Category[];
}

export interface CartLine {
  id: string;
  productId: string;
  variantId: number;
  sku: string;
  name: string;
  slug: string;
  quantity: number;
  image?: string;
  price: Price;
  lineTotal: Price;
}

export interface Cart {
  id: string;
  version: number;
  lineItems: CartLine[];
  itemCount: number;
  subtotal: Price;
}

export type ProductSort = 'name' | 'price' | 'newest';
