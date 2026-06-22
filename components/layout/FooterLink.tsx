'use client';

import { toast } from 'sonner';

type FooterLinkProps = {
  label: string;
  toastTitle: string;
  toastDescription: string;
};

export function FooterLink({ label, toastTitle, toastDescription }: FooterLinkProps) {
  return (
    <li>
      <button
        type="button"
        className="text-left transition-colors cursor-pointer hover:text-foreground"
        onClick={() =>
          toast.info(toastTitle, {
            description: toastDescription,
            duration: 5000,
          })
        }
      >
        {label}
      </button>
    </li>
  );
}
