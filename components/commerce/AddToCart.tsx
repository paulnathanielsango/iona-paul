'use client';

import { useTranslations } from 'next-intl';
import { useAddToCart } from '@/hooks/useAddToCart';
import { Button } from '@/components/ui/button';

type AddToCartProps = {
  locale: string;
  productId: string;
  variantId: number;
};

export function AddToCart({ locale, productId, variantId }: AddToCartProps) {
  const t = useTranslations('product');
  const { addToCart, isPending } = useAddToCart(locale);

  return (
    <Button
      type="button"
      size="lg"
      className="h-11 w-full md:w-auto cursor-pointer"
      onClick={() => addToCart(productId, variantId)}
      disabled={isPending}
    >
      {isPending ? t('adding') : t('addToCart')}
    </Button>
  );
}
