import { Star } from "lucide-react";

import { getDiscountPercent } from "@/lib/pricing";

type ProductDiscountBadgeProps = {
  price: number;
  originalPrice?: number | null;
  className?: string;
};

export function ProductDiscountBadge({ price, originalPrice, className = "" }: ProductDiscountBadgeProps) {
  const percent = getDiscountPercent(price, originalPrice);
  if (percent == null) return null;

  return (
    <span
      className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 inline-flex items-center gap-0.5 pl-1 pr-1.5 sm:pl-1.5 sm:pr-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-[var(--color-accent-orange)] text-white shadow-md ${className}`}
      aria-label={`${percent} percent off`}
    >
      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" strokeWidth={0} />
      {percent}%
    </span>
  );
}
