import { count, eq } from "drizzle-orm";

import { CATEGORY_SEED, SEED_PRODUCT_CATEGORIES } from "@/data/categories";
import { products as seedProducts } from "@/data/products";
import { getDb } from "./client.server";
import { categories, products } from "./schema";

let seeded = false;
let categoriesSeeded = false;

/** Inserts default category rows when the categories table is empty. */
export async function ensureCategorySeed() {
  if (categoriesSeeded) return;
  const db = getDb();
  const [{ value }] = await db.select({ value: count() }).from(categories);
  if (value === 0) {
    const now = new Date();
    await db.insert(categories).values(
      CATEGORY_SEED.map((c) => ({
        id: c.id,
        label: c.label,
        description: c.description,
        sortOrder: c.sortOrder,
        allowsPersonalization: c.allowsPersonalization,
        createdAt: now,
        updatedAt: now,
      })),
    );
  }
  categoriesSeeded = true;
}

async function backfillSeedCategories() {
  const db = getDb();
  for (const [id, category] of Object.entries(SEED_PRODUCT_CATEGORIES)) {
    await db.update(products).set({ category }).where(eq(products.id, id));
  }
}

/** Inserts catalog seed rows when the products table is empty. */
export async function ensureProductSeed() {
  await ensureCategorySeed();
  if (seeded) return;
  const db = getDb();
  const [{ value }] = await db.select({ value: count() }).from(products);
  if (value > 0) {
    await backfillSeedCategories();
    seeded = true;
    return;
  }

  await db.insert(products).values(
    seedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice ?? null,
      image: p.image,
      images: p.images?.length ? p.images : p.image ? [p.image] : [],
      colors: p.colors,
      tag: p.tag ?? null,
      dimensions: p.dimensions?.trim() || null,
      weight: p.weight?.trim() || null,
      category: p.category,
    })),
  );
  seeded = true;
}
