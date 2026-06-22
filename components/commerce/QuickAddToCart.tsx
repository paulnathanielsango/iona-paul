'use client';

import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAddToCart } from '@/hooks/useAddToCart';
import { cn } from '@/lib/utils';

type QuickAddToCartProps = {
  locale: string;
  productId: string;
  variantId: number;
  sku?: string;
  productName: string;
  className?: string;
};

export function QuickAddToCart({
  locale,
  productId,
  variantId,
  sku,
  productName,
  className,
}: QuickAddToCartProps) {
  const t = useTranslations('product');
  const { addToCart, isPending } = useAddToCart(locale);

  return (
    <button
      type="button"
      className={cn(
        'flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-[box-shadow,filter,transform] duration-150 ease-out hover:shadow-md hover:brightness-90 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 disabled:opacity-50 disabled:hover:brightness-100',
        className
      )}
      data-action="add-to-cart"
      data-product-id={productId}
      data-variant-id={variantId}
      {...(sku ? { 'data-sku': sku } : {})}
      aria-label={t('quickAddToCart', { name: productName })}
      disabled={isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addToCart(productId, variantId);
      }}
    >
      <ShoppingCart className="h-4 w-4" aria-hidden />
    </button>
  );
}
