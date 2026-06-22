'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

type ErrorProps = {
  reset: () => void;
};

export default function LocaleError({ reset }: ErrorProps) {
  const t = useTranslations('error');

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
      <p className="mt-3 text-muted-foreground">{t('description')}</p>
      <Button type="button" className="mt-6 h-11" onClick={reset}>
        {t('retry')}
      </Button>
    </div>
  );
}
