import { LOGO_ICON } from "@/lib/brand";

/** Client request bodies must stay small; DB rows can store catalog images resolved server-side. */
export const MAX_ORDER_IMAGE_LENGTH = 2048;

export function isOversizedOrderImage(image: string): boolean {
  const trimmed = image.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("data:")) return true;
  if (trimmed.length > MAX_ORDER_IMAGE_LENGTH) return true;
  return false;
}

/** Strip huge payloads from checkout POST — server fills in from the products table. */
export function sanitizeOrderItemImageForRequest(image: string): string {
  if (isOversizedOrderImage(image)) return LOGO_ICON;
  return image.trim();
}

/**
 * Image stored on order_items. Uses cart image when small enough, otherwise catalog image
 * (including base64 from DB — written server-side, not in the checkout request).
 */
export function resolveOrderItemImage(
  productId: string,
  cartImage: string,
  catalogImage?: string | null,
): string {
  if (!isOversizedOrderImage(cartImage)) return cartImage.trim();
  if (catalogImage?.trim()) return catalogImage.trim();
  return LOGO_ICON;
}

export function isPlaceholderOrderImage(image: string): boolean {
  return image === LOGO_ICON || isOversizedOrderImage(image);
}

/** Fix admin display for orders saved before image resolution, or with placeholder rows. */
export function enrichOrderItemImage(
  storedImage: string,
  productId: string,
  catalogByProductId: Map<string, string>,
): string {
  if (!isPlaceholderOrderImage(storedImage)) return storedImage;
  const catalog = catalogByProductId.get(productId);
  if (catalog?.trim()) return catalog.trim();
  return storedImage;
}
