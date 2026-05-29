export const BRAND_NAME = "LAYERONIC";
export const BRAND_LEGAL = "Layeronic Labs";
export const BRAND_TAGLINE = "Custom 3D Prints For Makers";
export const BRAND_DESCRIPTION =
  "Premium 3D printed products and custom orders. Pick a color, place your order, we print and ship.";

export const BRAND_OWNER = "Prajesh Nair";
export const BRAND_EMAIL = "LayeronicsLab@gmail.com";

export const LOGO_ICON = "/brand/layeronic-icon.png";
export const LOGO_FULL = "/brand/layeronic-logo-full.png";
export const LOGO_ICON_LIGHT = "/brand/layeronic-icon-light.png";
export const LOGO_FULL_LIGHT = "/brand/layeronic-logo-full-light.png";

export function pageTitle(page?: string) {
  if (!page) return `${BRAND_NAME} — ${BRAND_TAGLINE}`;
  return `${page} — ${BRAND_NAME}`;
}

export function adminPageTitle(page: string) {
  return `${page} — ${BRAND_NAME} Admin`;
}
