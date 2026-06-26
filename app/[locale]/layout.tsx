import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LocaleHtmlLang } from '@/components/layout/LocaleHtmlLang';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlLang locale={locale} />
      <Header locale={locale} />
      <main className="flex w-full flex-1 flex-col">{children}</main>
      <Footer />
      <Toaster position="top-center" richColors closeButton />
      <Analytics />
    </NextIntlClientProvider>
  );
}
