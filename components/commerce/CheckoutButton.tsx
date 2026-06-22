'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CheckoutButton() {
  const t = useTranslations('cart');

  function handleCheckout() {
    toast.info(t('checkoutToastTitle'), {
      description: t('checkoutToastDescription'),
      duration: 5000,
    });
  }

  return (
    <Button type="button" size="lg" className="mt-6 cursor-pointer text-base font-semibold h-11 w-full" onClick={handleCheckout}>
      {t('checkout')}
    </Button>
  );
}
