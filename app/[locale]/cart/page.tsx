import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { CartLineItem } from '@/components/commerce/CartLineItem';
import { CartOrderSummary } from '@/components/commerce/CartOrderSummary';
import { buttonVariants } from '@/components/ui/button';
import { getActiveCart } from '@/lib/cart/session';
import { cn } from '@/lib/utils';

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;
  const cart = await getActiveCart(locale);
  const t = await getTranslations('cart');

  if (!cart || cart.lineItems.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-foreground">{t('title')}</h1>
        <p className="mt-3 max-w-md text-muted-foreground">{t('emptyDescription')}</p>
        <Link href="/" className={cn(buttonVariants({ size: 'lg' }), 'mt-8 h-11')}>
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-semibold text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('itemCount', { count: cart.itemCount })}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:items-start">
        <section className="lg:col-span-2" aria-label={t('itemsLabel')}>
          <ul className="cart-items divide-y divide-border">
            {cart.lineItems.map((line) => (
              <CartLineItem key={line.id} line={line} locale={locale} />
            ))}
          </ul>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t('continueShopping')}
          </Link>
        </section>

        <aside className="sticky top-8 h-fit rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">{t('summary')}</h2>
          <CartOrderSummary subtotal={cart.subtotal} locale={locale} />
        </aside>
      </div>
    </div>
  );
}
