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
      className={`absolute top-3 right-3 z-10 inline-flex items-center gap-0.5 pl-1.5 pr-2 py-1 rounded-full text-[11px] font-bold bg-[var(--color-accent-orange)] text-white shadow-md ${className}`}
      aria-label={`${percent} percent off`}
    >
      <Star className="w-3.5 h-3.5 fill-current shrink-0" strokeWidth={0} />
      {percent}%
    </span>
  );
}
