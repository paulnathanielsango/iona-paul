'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/routing';
import { addToCartAction } from '@/app/actions/cart';

export function useAddToCart(locale: string) {
  const t = useTranslations('product');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function addToCart(productId: string, variantId: number, quantity = 1) {
    startTransition(async () => {
      const result = await addToCartAction(locale, productId, variantId, quantity);
      if (result.success) {
        toast.success(t('addedToCart'), {
          description: t('addedToCartDescription'),
          action: {
            label: t('viewCart'),
            onClick: () => router.push('/cart'),
          },
        });
        router.refresh();
        return;
      }

      toast.error(t('addToCartFailed'), {
        description: result.error,
      });
    });
  }

  return { addToCart, isPending };
}
