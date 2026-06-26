import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <section
      aria-labelledby="not-found-heading"
      className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24"
    >
      <p
        aria-hidden="true"
        className="text-8xl font-bold leading-none tracking-tight text-primary/40 md:text-9xl"
      >
        404
      </p>
      <h1
        id="not-found-heading"
        className="mt-5 text-2xl font-semibold text-foreground md:text-3xl"
      >
        {t('title')}
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
        {t('description')}
      </p>
      <Link href="/" className={cn(buttonVariants(), 'mt-8 h-11 px-8')}>
        {t('backHome')}
      </Link>
    </section>
  );
}
