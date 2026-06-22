import { getTranslations } from 'next-intl/server';
import { HeroBand } from '@/components/commerce/HeroBand';
import { FilterBar } from '@/components/commerce/FilterBar';
import { ProductCard } from '@/components/commerce/ProductCard';
import {
  getCachedCategories,
  getCachedCategoryBySlug,
  getCachedProducts,
} from '@/lib/catalog/cache';
import type { ProductSort } from '@/lib/types';

type HomePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; sort?: string }>;
};

function parseSort(value?: string): ProductSort {
  if (value === 'price' || value === 'newest') return value;
  return 'name';
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  const { category: categorySlug, sort: sortParam } = await searchParams;
  const sort = parseSort(sortParam);
  const t = await getTranslations('plp');

  const [categories, category] = await Promise.all([
    getCachedCategories(locale),
    categorySlug ? getCachedCategoryBySlug(categorySlug, locale) : Promise.resolve(null),
  ]);

  const { products, total } = await getCachedProducts(locale, category?.id, sort);

  return (
    <>
      <HeroBand />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <FilterBar
          categories={categories}
          activeCategory={categorySlug}
          activeSort={sort}
        />
        <section className="py-8 md:py-12" aria-label={t('gridLabel')}>
          <p className="mb-6 text-sm text-muted-foreground">
            {t('productCount', { count: total })}
          </p>
          {products.length === 0 ? (
            <div className="rounded-lg border border-border bg-card px-6 py-16 text-center">
              <p className="text-lg font-medium text-foreground">{t('emptyTitle')}</p>
              <p className="mt-2 text-muted-foreground">{t('emptyDescription')}</p>
            </div>
          ) : (
            <ul className="product-grid grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
              {products.map((product) => (
                <li key={product.id} className="product-grid__item">
                  <ProductCard product={product} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
