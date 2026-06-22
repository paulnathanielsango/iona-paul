import 'server-only';

import { apiRoot } from './client';
import { mapProductProjection } from '@/lib/mappers/product';
import type { Product, ProductSort } from '@/lib/types';

export type GetProductsOptions = {
  locale: string;
  categoryId?: string;
  sort?: ProductSort;
  limit?: number;
  offset?: number;
};

function getSortParam(locale: string, sort: ProductSort = 'name'): string[] | undefined {
  switch (sort) {
    case 'price':
      // Product projections cannot sort by price server-side; sorted after fetch.
      return undefined;
    case 'newest':
      return ['createdAt desc'];
    case 'name':
    default:
      return [`name.${locale} asc`];
  }
}

function sortProductsByPrice(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const priceA = a.variants[0]?.price?.centAmount ?? Number.MAX_SAFE_INTEGER;
    const priceB = b.variants[0]?.price?.centAmount ?? Number.MAX_SAFE_INTEGER;
    return priceA - priceB;
  });
}

function buildWhere(categoryId?: string): string | undefined {
  if (!categoryId) return undefined;
  return `categories(id="${categoryId}")`;
}

export async function fetchProducts({
  locale,
  categoryId,
  sort = 'name',
  limit = 24,
  offset = 0,
}: GetProductsOptions): Promise<{ products: Product[]; total: number }> {
  const sortParam = getSortParam(locale, sort);

  const { body } = await apiRoot
    .productProjections()
    .get({
      queryArgs: {
        limit,
        offset,
        localeProjection: locale,
        where: buildWhere(categoryId),
        ...(sortParam ? { sort: sortParam } : {}),
      },
    })
    .execute();

  let products = (body.results ?? []).map((p) => mapProductProjection(p, locale));

  if (sort === 'price') {
    products = sortProductsByPrice(products);
  }

  return {
    products,
    total: body.total ?? products.length,
  };
}

export async function fetchProductBySlug(slug: string, locale: string): Promise<Product | null> {
  const { body } = await apiRoot
    .productProjections()
    .get({
      queryArgs: {
        limit: 1,
        localeProjection: locale,
        where: `slug(${locale}="${slug}")`,
      },
    })
    .execute();

  const projection = body.results?.[0];
  if (!projection) return null;

  return mapProductProjection(projection, locale);
}
