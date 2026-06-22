export const VALID_PROMO_CODE = 'IONA-PAUL';
export const PROMO_DISCOUNT_PERCENT = 40;

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function isValidPromoCode(code: string): boolean {
  return normalizePromoCode(code) === VALID_PROMO_CODE;
}

export function calculatePromoDiscount(
  centAmount: number,
  percent = PROMO_DISCOUNT_PERCENT
): number {
  return Math.round(centAmount * (percent / 100));
}
