import 'server-only';

import { unstable_cache } from 'next/cache';
import { fetchCategories, fetchCategoryBySlug } from '@/lib/ct/categories';
import { fetchProductBySlug, fetchProducts } from '@/lib/ct/products';
import {
  REVALIDATE_CATALOG,
  TAG_CATEGORIES,
  TAG_PRODUCTS,
  tagProduct,
} from '@/lib/cache-keys';
import type { ProductSort } from '@/lib/types';

const catalogRevalidate =
  process.env.NODE_ENV === 'development' ? 1 : REVALIDATE_CATALOG;

export const getCachedCategories = (locale: string) =>
  unstable_cache(() => fetchCategories(locale), [`categories-${locale}`], {
    tags: [TAG_CATEGORIES],
    revalidate: catalogRevalidate,
  })();

export const getCachedCategoryBySlug = (slug: string, locale: string) =>
  unstable_cache(() => fetchCategoryBySlug(slug, locale), [`category-${slug}-${locale}`], {
    tags: [TAG_CATEGORIES],
    revalidate: catalogRevalidate,
  })();

export const getCachedProducts = (
  locale: string,
  categoryId: string | undefined,
  sort: ProductSort
) =>
  unstable_cache(
    () => fetchProducts({ locale, categoryId, sort }),
    [`products-${locale}-${categoryId ?? 'all'}-${sort}`],
    {
      tags: [TAG_PRODUCTS],
      revalidate: catalogRevalidate,
    }
  )();

export const getCachedProductBySlug = (slug: string, locale: string) =>
  unstable_cache(() => fetchProductBySlug(slug, locale), [`product-${slug}-${locale}`], {
    tags: [TAG_PRODUCTS, tagProduct(slug)],
    revalidate: catalogRevalidate,
  })();
