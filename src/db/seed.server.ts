import { count, eq } from "drizzle-orm";

import { SEED_PRODUCT_CATEGORIES } from "@/data/categories";
import { products as seedProducts } from "@/data/products";
import { getDb } from "./client.server";
import { products } from "./schema";

let seeded = false;

async function backfillSeedCategories() {
  const db = getDb();
  for (const [id, category] of Object.entries(SEED_PRODUCT_CATEGORIES)) {
    await db.update(products).set({ category }).where(eq(products.id, id));
  }
}

/** Inserts catalog seed rows when the products table is empty. */
export async function ensureProductSeed() {
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
      image: p.image,
      images: p.images?.length ? p.images : p.image ? [p.image] : [],
      colors: p.colors,
      tag: p.tag ?? null,
      category: p.category,
    })),
  );
  seeded = true;
}
