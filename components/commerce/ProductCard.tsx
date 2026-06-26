import { ArrowUpRight, Star } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Price } from '@/components/commerce/Price';
import { QuickAddToCart } from '@/components/commerce/QuickAddToCart';
import type { Product } from '@/lib/types';

type ProductCardProps = {
  product: Product;
  locale?: string;
};

function getDummyRating(productId: string): string {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = (hash * 31 + productId.charCodeAt(i)) >>> 0;
  }
  const tenths = 38 + (hash % 11);
  return (tenths / 10).toFixed(1);
}

export async function ProductCard({ product, locale = 'en-US' }: ProductCardProps) {
  const t = await getTranslations('product');
  const variant = product.variants[0];
  const image = variant?.images[0];
  const cartPrice = variant?.price;
  const displayPrice = cartPrice ?? variant?.prices[0];
  const rating = getDummyRating(product.id);

  return (
    <div
      className="product-card group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      data-product-id={product.id}
      data-variant-id={variant?.id}
      data-sku={variant?.sku}
      data-product-name={product.name}
      {...(displayPrice ? { 'data-product-price': displayPrice.centAmount } : {})}
    >
      {variant ? (
        <QuickAddToCart
          locale={locale}
          productId={product.id}
          variantId={variant.id}
          sku={variant.sku}
          productName={product.name}
          className="product-card__quick-add absolute left-3 top-3 z-10 h-8 w-8 bg-zinc-50 text-red-500 opacity-0 shadow-none ring-1 ring-black/5 transition-[opacity,colors] pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-red-500 hover:text-white hover:brightness-100 hover:shadow-none hover:ring-0"
        />
      ) : null}

      <Link
        href={`/products/${product.slug}`}
        className="product-card__link flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="product-card__media relative aspect-square w-full shrink-0 overflow-hidden bg-transparent">
          <div className="absolute inset-5 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:inset-6">
            {image ? (
              // Native img: predictable object-contain sizing (images are unoptimized in next.config)
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={product.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain object-center"
              />
            ) : (
              <div className="h-full w-full bg-muted" aria-hidden />
            )}
          </div>
          <span
            className="product-card__rating absolute left-3 top-3 flex h-5 items-center gap-0.5 rounded-md bg-zinc-50 px-1 shadow-none ring-1 ring-black/5 transition-opacity group-hover:opacity-0"
            aria-hidden
          >
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold leading-none text-foreground">{rating}</span>
          </span>
          <span
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-foreground opacity-0 shadow-none ring-1 ring-black/5 transition-opacity group-hover:opacity-100"
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="product-card__body min-w-0 flex-1 p-3">
          <h2 className="product-card__title line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h2>
          {displayPrice ? (
            <div className="product-card__price mt-1 text-xs font-semibold text-muted-foreground">
              <Price price={displayPrice} locale={locale} />
            </div>
          ) : null}
        </div>

        <span className="sr-only">{t('viewProduct', { name: product.name })}</span>
      </Link>
    </div>
  );
}
