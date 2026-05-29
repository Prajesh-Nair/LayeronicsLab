export const PRODUCT_CATEGORIES = [
  {
    id: "sculptures",
    label: "Sculptures",
    description: "Display pieces, figurines, and artistic prints made to stand out on your shelf.",
  },
  {
    id: "customized-print",
    label: "Customized Print",
    description: "Made-to-order prints — pick your color, size, or personal details and we produce it for you.",
  },
  {
    id: "useful-items",
    label: "Useful Items",
    description: "Everyday objects for your desk, home, and setup — practical prints that earn their spot.",
  },
] as const;

export type ProductCategoryId = (typeof PRODUCT_CATEGORIES)[number]["id"];

export const DEFAULT_PRODUCT_CATEGORY: ProductCategoryId = "useful-items";

export const PRODUCT_CATEGORY_IDS = PRODUCT_CATEGORIES.map((c) => c.id);

export function isProductCategoryId(value: string): value is ProductCategoryId {
  return (PRODUCT_CATEGORY_IDS as readonly string[]).includes(value);
}

export function getCategoryLabel(id: ProductCategoryId): string {
  return PRODUCT_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/** Default category per seed product id (used when backfilling existing DB rows). */
export const SEED_PRODUCT_CATEGORIES: Record<string, ProductCategoryId> = {
  "1": "sculptures",
  "2": "useful-items",
  "3": "useful-items",
  "4": "useful-items",
  "5": "sculptures",
  "6": "sculptures",
  "7": "customized-print",
  "8": "useful-items",
};
