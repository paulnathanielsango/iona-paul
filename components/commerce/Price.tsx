import { cn, formatMoney } from '@/lib/utils';
import type { Price as PriceType } from '@/lib/types';

type PriceProps = {
  price: PriceType;
  locale?: string;
  className?: string;
};

export function Price({ price, locale = 'en-US', className }: PriceProps) {
  const display = price.discounted ?? price;
  const hasDiscount = Boolean(price.discounted);

  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className={cn('font-semibold', hasDiscount && 'text-primary')}>
        {formatMoney(display.centAmount, display.currencyCode, locale)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatMoney(price.centAmount, price.currencyCode, locale)}
        </span>
      )}
    </span>
  );
}
