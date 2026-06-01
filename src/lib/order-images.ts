import { LOGO_ICON } from "@/lib/brand";

/** Keep order payloads small — data URLs break Vercel body limits and bloat Postgres. */
const MAX_ORDER_IMAGE_LENGTH = 2048;

export function sanitizeOrderItemImage(image: string): string {
  const trimmed = image.trim();
  if (!trimmed) return LOGO_ICON;
  if (trimmed.startsWith("data:")) return LOGO_ICON;
  if (trimmed.length > MAX_ORDER_IMAGE_LENGTH) return LOGO_ICON;
  return trimmed;
}
