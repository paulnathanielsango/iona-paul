'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';
import { removeLineItemAction } from '@/app/actions/cart';
import { Price } from '@/components/commerce/Price';
import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { Button } from '@/components/ui/button';
import type { CartLine } from '@/lib/types';

type CartLineItemProps = {
  line: CartLine;
  locale: string;
};

export function CartLineItem({ line, locale }: CartLineItemProps) {
  const t = useTranslations('cart');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      await removeLineItemAction(locale, line.id);
      router.refresh();
    });
  }

  return (
    <li
      className="cart-line-item flex flex-col gap-4 border-b border-border py-6 sm:flex-row sm:items-center"
      data-line-item-id={line.id}
      data-product-id={line.productId}
      data-variant-id={line.variantId}
      data-sku={line.sku}
      data-quantity={line.quantity}
      data-product-price={line.price.centAmount}
    >
      <div className="cart-line-item__details flex flex-1 items-center gap-4">
        <Link href={`/products/${line.slug}`} className="cart-line-item__image-link shrink-0">
          {line.image ? (
            <Image
              src={line.image}
              alt={line.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-lg border border-border bg-muted object-contain object-center p-1"
            />
          ) : (
            <div className="h-24 w-24 rounded-lg bg-muted" aria-hidden />
          )}
        </Link>
        <div className="min-w-0">
          <Link
            href={`/products/${line.slug}`}
            className="cart-line-item__title font-medium text-foreground hover:text-primary"
          >
            {line.name}
          </Link>
          <div className="cart-line-item__unit-price mt-1">
            <Price price={line.price} locale={locale} />
          </div>
        </div>
      </div>

      <div className="cart-line-item__actions flex items-center justify-between gap-4 sm:justify-end">
        <QuantityStepper locale={locale} lineItemId={line.id} quantity={line.quantity} />
        <div className="cart-line-item__line-total min-w-24 text-right font-semibold">
          <Price price={line.lineTotal} locale={locale} />
        </div>
        <Button
          type="button"
          variant="ghost"
          data-action="remove-from-cart"
          data-line-item-id={line.id}
          onClick={handleRemove}
          disabled={isPending}
          className="text-muted-foreground hover:text-destructive cursor-pointer"
        >
          {t('remove')}
        </Button>
      </div>
    </li>
  );
}
