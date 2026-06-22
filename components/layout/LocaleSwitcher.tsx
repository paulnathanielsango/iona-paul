'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LOCALE_LABELS: Record<string, string> = {
  'fi-FI': 'Suomi',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'de-DE': 'Deutsch',
};

type LocaleSwitcherProps = {
  className?: string;
};

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  function handleSelect(nextLocale: string) {
    setOpen(false);
    if (nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale });
    }
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={t('selectLanguage')}
        className="h-10 min-w-[9.5rem] justify-between cursor-pointer gap-2 border-border bg-card px-3 font-medium shadow-sm hover:bg-secondary"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="truncate">{LOCALE_LABELS[locale] ?? locale}</span>
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden
        />
      </Button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t('selectLanguage')}
          className="absolute top-full right-0 z-50 mt-1.5 w-full min-w-[11rem] overflow-hidden rounded-lg border border-border bg-card py-1 shadow-md"
        >
          {routing.locales.map((loc) => {
            const isSelected = loc === locale;

            return (
              <li key={loc} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-foreground hover:bg-secondary'
                  )}
                  onClick={() => handleSelect(loc)}
                >
                  <span>{LOCALE_LABELS[loc] ?? loc}</span>
                  {isSelected ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
