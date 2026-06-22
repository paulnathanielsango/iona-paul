import 'server-only';

import { apiRoot } from './client';
import { getLocalizedString } from '@/lib/utils';
import type { Category } from '@/lib/types';

export async function fetchCategories(locale: string): Promise<Category[]> {
  const { body } = await apiRoot
    .categories()
    .get({
      queryArgs: {
        limit: 50,
        sort: 'orderHint asc',
      },
    })
    .execute();

  return (body.results ?? []).map((category) => ({
    id: category.id,
    name: getLocalizedString(category.name, locale),
    slug: getLocalizedString(category.slug, locale),
    parent: category.parent ? { id: category.parent.id } : undefined,
  }));
}

export async function fetchCategoryBySlug(
  slug: string,
  locale: string
): Promise<Category | null> {
  const categories = await fetchCategories(locale);
  return categories.find((c) => c.slug === slug) ?? null;
}
