import { getTranslations } from 'next-intl/server';
import { FooterLink } from '@/components/layout/FooterLink';

export async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-red-700 font-bold text-foreground">{t('shop')}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <FooterLink
                label={t('newArrivals')}
                toastTitle={t('newArrivalsToastTitle')}
                toastDescription={t('newArrivalsToastDescription')}
              />
              <FooterLink
                label={t('bestsellers')}
                toastTitle={t('bestsellersToastTitle')}
                toastDescription={t('bestsellersToastDescription')}
              />
              <FooterLink
                label={t('giftIdeas')}
                toastTitle={t('giftIdeasToastTitle')}
                toastDescription={t('giftIdeasToastDescription')}
              />
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700 font-bold text-foreground">{t('customerCare')}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <FooterLink
                label={t('shippingReturns')}
                toastTitle={t('shippingReturnsToastTitle')}
                toastDescription={t('shippingReturnsToastDescription')}
              />
              <FooterLink
                label={t('sizeGuide')}
                toastTitle={t('sizeGuideToastTitle')}
                toastDescription={t('sizeGuideToastDescription')}
              />
              <FooterLink
                label={t('contactUs')}
                toastTitle={t('contactUsToastTitle')}
                toastDescription={t('contactUsToastDescription')}
              />
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700 text-foreground">{t('about')}</p>
            <p className="mt-3 text-sm text-muted-foreground">{t('aboutDescription')}</p>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} IONA Store. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
