import type { ReactNode } from 'react';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning className={cn('h-full', geist.variable)}>
      <body className="flex min-h-dvh flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
