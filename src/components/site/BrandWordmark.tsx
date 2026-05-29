import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { BrandLogo } from "@/components/site/BrandLogo";

type BrandWordmarkProps = {
  className?: string;
  linkToHome?: boolean;
};

export function BrandWordmark({ className, linkToHome = true }: BrandWordmarkProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const content = (
    <span className={cn("inline-flex items-center gap-3 sm:gap-3.5 min-w-0", className)}>
      <BrandLogo variant="icon" linkToHome={false} />
      <span className="flex flex-col justify-center min-w-0 leading-none">
        <span
          className={cn(
            "font-brand text-[1.35rem] sm:text-[1.65rem] font-extrabold italic tracking-tight",
            "truncate",
          )}
        >
          <span className="text-primary">Layer</span>
          <span className={isLight ? "text-black" : "text-neutral-400"}>onic</span>
        </span>
        <span className="mt-1 text-[0.62rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/90">
          Labs
        </span>
      </span>
    </span>
  );

  if (!linkToHome) return content;

  return (
    <Link
      to="/"
      className="inline-flex shrink-0 min-w-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {content}
    </Link>
  );
}
