'use client';

import { usePathname } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type NavPillsProps = {
  itemCount: number;
};

export function NavPills({ itemCount }: NavPillsProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const isCart = pathname === '/cart' || pathname.endsWith('/cart');
  const isHome = !isCart;

  return (
    <nav aria-label="Primary" className="flex items-center gap-1 rounded-full bg-secondary p-1">
      <Link
        href="/"
        className={cn(
          'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
          isHome ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
        )}
      >
        {t('home')}
      </Link>
      <Link
        href="/cart"
        className={cn(
          'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
          isCart ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
        )}
      >
        {itemCount > 0 ? t('cartWithCount', { count: itemCount }) : t('cart')}
      </Link>
    </nav>
  );
}
