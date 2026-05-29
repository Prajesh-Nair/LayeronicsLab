import { Link } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import {
  BRAND_NAME,
  LOGO_FULL,
  LOGO_FULL_LIGHT,
  LOGO_ICON,
  LOGO_ICON_LIGHT,
} from "@/lib/brand";

type BrandLogoProps = {
  variant?: "icon" | "full";
  className?: string;
  imageClassName?: string;
  linkToHome?: boolean;
};

export function BrandLogo({
  variant = "icon",
  className,
  imageClassName,
  linkToHome = true,
}: BrandLogoProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const src =
    variant === "full"
      ? isLight
        ? LOGO_FULL_LIGHT
        : LOGO_FULL
      : isLight
        ? LOGO_ICON_LIGHT
        : LOGO_ICON;
  const alt = BRAND_NAME;
  const sizeClass =
    variant === "full"
      ? "h-14 sm:h-16 w-auto max-w-[300px]"
      : "h-12 w-12 sm:h-14 sm:w-14 object-contain";

  const img = (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xl shadow-sm ring-1",
        isLight ? "bg-white ring-black/10" : "bg-black ring-black/10",
        variant === "full" ? "px-4 py-2.5" : "p-2",
        className,
      )}
    >
      <img src={src} alt={alt} className={cn(sizeClass, imageClassName)} />
    </span>
  );

  if (!linkToHome) return img;

  return (
    <Link to="/" className="inline-flex shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
      {img}
    </Link>
  );
}
