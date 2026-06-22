import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Price } from '@/components/commerce/Price';
import { QuickAddToCart } from '@/components/commerce/QuickAddToCart';
import type { Product } from '@/lib/types';

type ProductCardProps = {
  product: Product;
  locale?: string;
};

export async function ProductCard({ product, locale = 'en-US' }: ProductCardProps) {
  const t = await getTranslations('product');
  const variant = product.variants[0];
  const image = variant?.images[0];
  const cartPrice = variant?.price;
  const displayPrice = cartPrice ?? variant?.prices[0];

  return (
    <div
      className="product-card group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      data-product-id={product.id}
      data-variant-id={variant?.id}
      data-sku={variant?.sku}
      data-product-name={product.name}
      {...(displayPrice ? { 'data-product-price': displayPrice.centAmount } : {})}
    >
      <Link
        href={`/products/${product.slug}`}
        className="product-card__link flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="product-card__media relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-transparent">
          <div className="absolute inset-6 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:inset-8">
            {image ? (
              // Native img: predictable object-contain sizing (images are unoptimized in next.config)
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                loading="lazy"
                className="max-h-full max-w-full object-contain object-center"
              />
            ) : (
              <div className="h-full w-full bg-muted" aria-hidden />
            )}
          </div>
          <span
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="product-card__body min-w-0 flex-1 p-4 pr-16">
          <h2 className="product-card__title line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h2>
          {displayPrice ? (
            <div className="product-card__price mt-1 text-sm font-semibold text-muted-foreground">
              <Price price={displayPrice} locale={locale} />
            </div>
          ) : null}
        </div>

        <span className="sr-only">{t('viewProduct', { name: product.name })}</span>
      </Link>

      {variant ? (
        <QuickAddToCart
          locale={locale}
          productId={product.id}
          variantId={variant.id}
          sku={variant.sku}
          productName={product.name}
          className="product-card__quick-add absolute bottom-4 right-4"
        />
      ) : null}
    </div>
  );
}
