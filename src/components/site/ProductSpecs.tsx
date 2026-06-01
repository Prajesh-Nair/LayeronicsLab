import { Ruler, Weight } from "lucide-react";

type ProductSpecsProps = {
  dimensions?: string | null;
  weight?: string | null;
  className?: string;
};

export function ProductSpecs({ dimensions, weight, className = "" }: ProductSpecsProps) {
  const dim = dimensions?.trim();
  const wt = weight?.trim();
  if (!dim && !wt) return null;

  return (
    <div className={`rounded-2xl border border-border bg-[var(--color-surface)] p-4 space-y-3 ${className}`}>
      <h2 className="text-sm font-semibold text-foreground">Print specs</h2>
      <dl className="grid gap-3 sm:grid-cols-2 text-sm">
        {dim && (
          <div className="flex gap-3">
            <Ruler className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
            <div>
              <dt className="text-xs text-muted-foreground uppercase tracking-wide">Dimensions</dt>
              <dd className="font-medium mt-0.5">{dim}</dd>
            </div>
          </div>
        )}
        {wt && (
          <div className="flex gap-3">
            <Weight className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
            <div>
              <dt className="text-xs text-muted-foreground uppercase tracking-wide">Weight</dt>
              <dd className="font-medium mt-0.5">{wt}</dd>
            </div>
          </div>
        )}
      </dl>
    </div>
  );
}
