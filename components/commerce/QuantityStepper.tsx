'use client';

import { Minus, Plus } from 'lucide-react';
import { useTransition } from 'react';
import { updateLineQuantityAction } from '@/app/actions/cart';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type QuantityStepperProps = {
  locale: string;
  lineItemId: string;
  quantity: number;
  className?: string;
};

export function QuantityStepper({
  locale,
  lineItemId,
  quantity,
  className,
}: QuantityStepperProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function update(nextQuantity: number) {
    if (nextQuantity < 1) return;
    startTransition(async () => {
      await updateLineQuantityAction(locale, lineItemId, nextQuantity);
      router.refresh();
    });
  }

  return (
    <div
      className={cn('inline-flex items-center rounded-lg border border-border', className)}
      aria-label="Quantity"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-11 w-11 rounded-none rounded-l-lg cursor-pointer"
        onClick={() => update(quantity - 1)}
        disabled={isPending || quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="flex h-11 min-w-11 items-center justify-center border-x border-border px-2 text-sm font-medium">
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-11 w-11 rounded-none rounded-r-lg cursor-pointer"
        onClick={() => update(quantity + 1)}
        disabled={isPending}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
