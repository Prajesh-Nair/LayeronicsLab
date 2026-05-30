/** MRP / list price shown struck through when higher than selling price. */
export function getDiscountPercent(
  sellingPrice: number,
  originalPrice?: number | null,
): number | null {
  if (originalPrice == null || originalPrice <= sellingPrice) return null;
  return Math.round((1 - sellingPrice / originalPrice) * 100);
}

export function hasDiscount(sellingPrice: number, originalPrice?: number | null): boolean {
  return getDiscountPercent(sellingPrice, originalPrice) != null;
}

export function formatInr(amount: number): string {
  return Number.isInteger(amount) ? `₹${amount}` : `₹${amount.toFixed(2)}`;
}
