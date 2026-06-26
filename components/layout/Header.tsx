import { Link } from '@/i18n/routing';
import { getActiveCart } from '@/lib/cart/session';
import { LocaleSwitcher } from './LocaleSwitcher';
import { NavPills } from './NavPills';

type HeaderProps = {
  locale: string;
};

export async function Header({ locale }: HeaderProps) {
  const cart = await getActiveCart(locale);
  const itemCount = cart?.itemCount ?? 0;

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-4xl font-semibold tracking-tight text-primary">
          IONA
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <NavPills itemCount={itemCount} />
        </div>
      </div>
    </header>
  );
}
