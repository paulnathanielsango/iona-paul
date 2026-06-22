import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import type { Category, ProductSort } from '@/lib/types';

type FilterBarProps = {
  categories: Category[];
  activeCategory?: string;
  activeSort: ProductSort;
};

const sortOptions: ProductSort[] = ['name', 'price', 'newest'];

function buildHref(category?: string, sort?: ProductSort) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (sort && sort !== 'name') params.set('sort', sort);
  const query = params.toString();
  return query ? `/?${query}` : '/';
}

export async function FilterBar({ categories, activeCategory, activeSort }: FilterBarProps) {
  const t = await getTranslations('filters');

  return (
    <div className="border-b border-border py-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('category')}
          </span>
          <Link
            href={buildHref(undefined, activeSort)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm transition-colors',
              !activeCategory
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-foreground hover:bg-secondary'
            )}
          >
            {t('all')}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildHref(category.slug, activeSort)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm transition-colors',
                activeCategory === category.slug
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-foreground hover:bg-secondary'
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('sort')}
          </span>
          {sortOptions.map((sort) => (
            <Link
              key={sort}
              href={buildHref(activeCategory, sort)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm transition-colors',
                activeSort === sort
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-foreground hover:bg-secondary'
              )}
            >
              {t(sort)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
