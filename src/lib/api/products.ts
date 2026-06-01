import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db/client.server";
import { toProduct } from "@/db/mappers.server";
import { ensureProductSeed } from "@/db/seed.server";
import { products } from "@/db/schema";
import { DEFAULT_PRODUCT_CATEGORY } from "@/data/categories";
import { requireAdmin } from "@/lib/auth/admin.server";

const productInput = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
    price: z.number().nonnegative(),
    originalPrice: z.number().positive().nullable().optional(),
    image: z.string().min(1),
    images: z.array(z.string()).optional(),
    colors: z.array(z.string()).min(1),
    tag: z.string().optional(),
    dimensions: z.string().optional(),
    weight: z.string().optional(),
    category: z
      .enum(["sculptures", "customized-print", "useful-items"])
      .default(DEFAULT_PRODUCT_CATEGORY),
  })
  .superRefine((data, ctx) => {
    const imgs = data.images?.length ? data.images : [data.image];
    const bytes = imgs.reduce((n, src) => n + src.length, 0);
    if (bytes > 3_400_000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Images are too large to upload. Use fewer photos or smaller JPG files (under ~3 MB total).",
      });
    }
    if (data.originalPrice != null && data.originalPrice <= data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["originalPrice"],
        message: "Original price must be higher than the selling price to show a discount.",
      });
    }
  });

function rethrowDbError(err: unknown): never {
  const msg = err instanceof Error ? err.message : String(err);
  if (/relation .* does not exist|no such table/i.test(msg)) {
    throw new Error(
      "Database tables are missing. Set DATABASE_URL on Vercel and redeploy (runs db:push), or run: npm run db:push",
    );
  }
  if (/DATABASE_URL is not set/i.test(msg)) {
    throw err instanceof Error ? err : new Error(msg);
  }
  if (/connect|ECONNREFUSED|ENOTFOUND|timeout|authentication failed/i.test(msg)) {
    throw new Error(`Database connection failed. Check DATABASE_URL on Vercel: ${msg}`);
  }
  throw err instanceof Error ? err : new Error(msg);
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await ensureProductSeed();
    const rows = await getDb().select().from(products).orderBy(asc(products.createdAt));
    return rows.map(toProduct);
  } catch (err) {
    rethrowDbError(err);
  }
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
    try {
      await requireAdmin();
    } catch (err) {
      if (err instanceof Response && err.status === 401) {
        throw new Error("Session expired. Log in to admin again.");
      }
      throw err;
    }
    const images = data.images?.length ? data.images : [data.image];
    const now = new Date();
    const values = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice ?? null,
      image: data.image,
      images,
      colors: data.colors,
      tag: data.tag ?? null,
      dimensions: data.dimensions?.trim() || null,
      weight: data.weight?.trim() || null,
      category: data.category,
      updatedAt: now,
    };

    try {
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
    } catch (err) {
      rethrowDbError(err);
    }
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await getDb().delete(products).where(eq(products.id, data.id));
    return { ok: true as const };
  });
