import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db/client.server";
import { toProduct } from "@/db/mappers.server";
import { ensureProductSeed } from "@/db/seed.server";
import { products } from "@/db/schema";
import { DEFAULT_PRODUCT_CATEGORY } from "@/data/categories";
import { requireAdmin } from "@/lib/auth/admin.server";

const productInput = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().nonnegative(),
  image: z.string().min(1),
  images: z.array(z.string()).optional(),
  colors: z.array(z.string()).min(1),
  tag: z.string().optional(),
  category: z
    .enum(["sculptures", "customized-print", "useful-items"])
    .default(DEFAULT_PRODUCT_CATEGORY),
});

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  await ensureProductSeed();
  const rows = await getDb().select().from(products).orderBy(asc(products.createdAt));
  return rows.map(toProduct);
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await ensureProductSeed();
    const [row] = await getDb().select().from(products).where(eq(products.id, data.id)).limit(1);
    return row ? toProduct(row) : null;
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .inputValidator(productInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    const images = data.images?.length ? data.images : [data.image];
    const now = new Date();
    const values = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      images,
      colors: data.colors,
      tag: data.tag ?? null,
      category: data.category,
      updatedAt: now,
    };

    await getDb()
      .insert(products)
      .values({ ...values, createdAt: now })
      .onConflictDoUpdate({
        target: products.id,
        set: values,
      });

    const [row] = await getDb().select().from(products).where(eq(products.id, data.id)).limit(1);
    if (!row) throw new Error("Failed to save product");
    return toProduct(row);
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await getDb().delete(products).where(eq(products.id, data.id));
    return { ok: true as const };
  });
