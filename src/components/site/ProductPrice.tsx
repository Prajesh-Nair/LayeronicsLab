import { formatInr, hasDiscount } from "@/lib/pricing";

type ProductPriceProps = {
  price: number;
  originalPrice?: number | null;
  size?: "sm" | "md" | "lg";
  align?: "left" | "right";
  className?: string;
};

const sizeClasses = {
  sm: { sale: "text-sm font-bold", original: "text-xs" },
  md: { sale: "text-lg font-bold", original: "text-sm" },
  lg: { sale: "text-4xl font-bold", original: "text-lg" },
} as const;

export function ProductPrice({
  price,
  originalPrice,
  size = "md",
  align = "right",
  className = "",
}: ProductPriceProps) {
  const onSale = hasDiscount(price, originalPrice);
  const styles = sizeClasses[size];

  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${align === "right" ? "justify-end" : "justify-start"} ${className}`}
    >
      {onSale && originalPrice != null && (
        <span className={`${styles.original} text-muted-foreground line-through tabular-nums`}>
          {formatInr(originalPrice)}
        </span>
      )}
      <span className={`${styles.sale} text-foreground tabular-nums`}>{formatInr(price)}</span>
    </div>
  );
}
