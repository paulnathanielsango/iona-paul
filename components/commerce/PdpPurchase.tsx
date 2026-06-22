'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AddToCart } from './AddToCart';

type VariantSelectorProps = {
  variants: Array<{ id: number; label: string }>;
  selectedId: number;
  onChange: (variantId: number) => void;
};

function VariantSelector({ variants, selectedId, onChange }: VariantSelectorProps) {
  const t = useTranslations('product');

  if (variants.length <= 1) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t('variant')}
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <Button
            key={variant.id}
            type="button"
            variant="outline"
            className={cn(
              'h-11',
              selectedId === variant.id && 'border-primary bg-primary text-primary-foreground'
            )}
            onClick={() => onChange(variant.id)}
          >
            {variant.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

type PdpPurchaseProps = {
  locale: string;
  productId: string;
  variants: Array<{ id: number; label: string }>;
};

export function PdpPurchase({ locale, productId, variants }: PdpPurchaseProps) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? 0);

  return (
    <div className="space-y-6">
      <VariantSelector variants={variants} selectedId={selectedId} onChange={setSelectedId} />
      <AddToCart locale={locale} productId={productId} variantId={selectedId} />
    </div>
  );
}
