'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CheckoutButton } from '@/components/commerce/CheckoutButton';
import { Price } from '@/components/commerce/Price';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  calculatePromoDiscount,
  isValidPromoCode,
  PROMO_DISCOUNT_PERCENT,
  VALID_PROMO_CODE,
} from '@/lib/cart/promo';
import type { Price as PriceType } from '@/lib/types';

type CartOrderSummaryProps = {
  subtotal: PriceType;
  locale: string;
};

export function CartOrderSummary({ subtotal, locale }: CartOrderSummaryProps) {
  const t = useTranslations('cart');
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);

  const discountCentAmount = promoApplied ? calculatePromoDiscount(subtotal.centAmount) : 0;
  const estimatedTotal: PriceType = {
    centAmount: subtotal.centAmount - discountCentAmount,
    currencyCode: subtotal.currencyCode,
  };
  const discount: PriceType = {
    centAmount: discountCentAmount,
    currencyCode: subtotal.currencyCode,
  };

  function handleApply() {
    if (isValidPromoCode(promoInput)) {
      setPromoApplied(true);
      setPromoError(false);
      setPromoInput(VALID_PROMO_CODE);
      toast.success(t('promoApplied'), {
        description: t('promoAppliedDescription', { percent: PROMO_DISCOUNT_PERCENT }),
      });
      return;
    }

    setPromoApplied(false);
    setPromoError(true);
    toast.error(t('promoInvalid'));
  }

  function handleRemove() {
    setPromoApplied(false);
    setPromoInput('');
    setPromoError(false);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (promoApplied) {
      handleRemove();
      return;
    }
    handleApply();
  }

  return (
    <>
      <form className="mt-2" onSubmit={handleSubmit}>
        {promoApplied ? (
          <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm">
            <span className="font-medium text-accent">{VALID_PROMO_CODE}</span>
            <button
              type="button"
              className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              onClick={handleRemove}
            >
              {t('promoRemove')}
            </button>
          </div>
        ) : (
          <div className="mt-2 flex gap-2">
            <Input
              id="promo-code"
              value={promoInput}
              onChange={(event) => {
                setPromoInput(event.target.value);
                if (promoError) setPromoError(false);
              }}
              placeholder={t('promoPlaceholder')}
              className="h-11 flex-1"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={promoError}
              aria-describedby={promoError ? 'promo-code-error' : undefined}
            />
            <Button type="submit" variant="outline" className="h-11 shrink-0 px-4 cursor-pointer">
              {t('promoApply')}
            </Button>
          </div>
        )}
        {promoError ? (
          <p id="promo-code-error" className="mt-2 text-sm text-destructive" role="alert">
            {t('promoInvalid')}
          </p>
        ) : null}
      </form>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">{t('subtotal')}</dt>
          <dd aria-live="polite">
            <Price price={subtotal} locale={locale} />
          </dd>
        </div>
        {promoApplied ? (
          <div className="flex items-center justify-between text-accent">
            <dt>{t('promoDiscount', { code: VALID_PROMO_CODE })}</dt>
            <dd aria-live="polite">
              −<Price price={discount} locale={locale} />
            </dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">{t('shipping')}</dt>
          <dd className="text-muted-foreground">{t('shippingCalculated')}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 font-semibold text-foreground">
          <dt>{t('estimatedTotal')}</dt>
          <dd aria-live="polite">
            <Price price={estimatedTotal} locale={locale} />
          </dd>
        </div>
      </dl>

      <CheckoutButton />

      <p className="mt-4 text-center text-xs text-muted-foreground">{t('secureCheckout')}</p>
    </>
  );
}
