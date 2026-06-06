export type ProductCategory = {
  id: string;
  label: string;
  description: string;
  sortOrder: number;
  allowsPersonalization: boolean;
};

/** Category id stored on products — dynamic after admin CRUD. */
export type ProductCategoryId = string;

export const DEFAULT_PRODUCT_CATEGORY = "useful-items";

/** Initial rows inserted when the categories table is empty. */
export const CATEGORY_SEED: ProductCategory[] = [
  {
    id: "sculptures",
    label: "Sculptures",
    description: "Display pieces, figurines, and artistic prints made to stand out on your shelf.",
    sortOrder: 0,
    allowsPersonalization: false,
  },
  {
    id: "customized-print",
    label: "Customized Print",
    description:
      "Made-to-order prints — pick your color, size, or personal details and we produce it for you.",
    sortOrder: 1,
    allowsPersonalization: true,
  },
  {
    id: "useful-items",
    label: "Useful Items",
    description: "Everyday objects for your desk, home, and setup — practical prints that earn their spot.",
    sortOrder: 2,
    allowsPersonalization: false,
  },
];

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

export function slugFromLabel(label: string, taken = new Set<string>()): string {
  let base = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!base) base = `category-${Date.now()}`;
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export function getCategoryLabel(id: string, categories: ProductCategory[]): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}
