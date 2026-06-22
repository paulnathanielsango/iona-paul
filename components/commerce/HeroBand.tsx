import { getTranslations } from 'next-intl/server';

export async function HeroBand() {
  const t = await getTranslations('plp');

  return (
    <section className="bg-gradient-to-b from-secondary to-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          {t('heroTitle')}{' '}
          <span className="text-primary">{t('heroAccent')}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground md:text-lg">{t('heroSubtitle')}</p>
      </div>
    </section>
  );
}
