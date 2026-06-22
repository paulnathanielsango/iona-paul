import Image from 'next/image';
import { Package, RotateCcw, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Price } from '@/components/commerce/Price';
import { PdpPurchase } from '@/components/commerce/PdpPurchase';
import { getCachedProductBySlug } from '@/lib/catalog/cache';

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = await getCachedProductBySlug(slug, locale);
  if (!product) return { title: 'Product not found' };
  return { title: `${product.name} | IONA` };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = await getCachedProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const t = await getTranslations('product');
  const defaultVariant = product.variants[0];
  const image = defaultVariant?.images[0];
  const price = defaultVariant?.price;

  const variantOptions = product.variants.map((variant, index) => ({
    id: variant.id,
    label: variant.sku || `${t('variant')} ${index + 1}`,
  }));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2">
        <div className="relative mx-auto aspect-[7.5/4] w-full max-w-xs overflow-hidden rounded-lg border border-border bg-card sm:max-w-sm lg:mx-0 lg:max-w-md">
          <div className="absolute inset-6 flex items-center justify-center sm:inset-8">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                width={240}
                height={480}
                priority
                sizes="(max-width: 640px) 100vw, 320px"
                className="max-h-full max-w-full object-contain object-center"
              />
            ) : (
              <div className="h-full w-full bg-muted" aria-hidden />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1 pb-2">
          <div>
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{product.name}</h1>
            {price ? (
              <div className="mt-2">
                <Price price={price} locale={locale} className="text-lg" />
              </div>
            ) : null}
          </div>

          {product.description ? (
            <p className="text-muted-foreground">{product.description}</p>
          ) : null}

          <PdpPurchase locale={locale} productId={product.id} variants={variantOptions} />

          <ul className="grid gap-3 border-t border-border pt-6 mt-4 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <Package className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              {t('freeShipping')}
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              {t('easyReturns')}
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              {t('securePayment')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
