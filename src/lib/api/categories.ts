import { createServerFn } from "@tanstack/react-start";
import { asc, count, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db/client.server";
import { categories, products } from "@/db/schema";
import { ensureCategorySeed } from "@/db/seed.server";
import type { ProductCategory } from "@/data/categories";
import { slugFromLabel } from "@/data/categories";
import { requireAdmin } from "@/lib/auth/admin.server";

function rethrowCategoryError(err: unknown): never {
  const msg = err instanceof Error ? err.message : String(err);
  if (/relation .* does not exist|no such table/i.test(msg)) {
    throw new Error(
      "Database tables are missing. Set DATABASE_URL and run npm run db:push, then redeploy.",
    );
  }
  if (/DATABASE_URL is not set/i.test(msg)) {
    throw err instanceof Error ? err : new Error(msg);
  }
  if (/connect|ECONNREFUSED|ENOTFOUND|timeout|authentication failed/i.test(msg)) {
    throw new Error(`Database connection failed. Check DATABASE_URL: ${msg}`);
  }
  throw err instanceof Error ? err : new Error(msg);
}

function toCategory(row: typeof categories.$inferSelect): ProductCategory {
  return {
    id: row.id,
    label: row.label,
    description: row.description,
    sortOrder: row.sortOrder,
    allowsPersonalization: row.allowsPersonalization,
  };
}

const categoryInput = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  allowsPersonalization: z.boolean().optional(),
});

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await ensureCategorySeed();
    const rows = await getDb().select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.label));
    return rows.map(toCategory);
  } catch (err) {
    rethrowCategoryError(err);
  }
});

export const upsertCategory = createServerFn({ method: "POST" })
  .inputValidator(categoryInput)
  .handler(async ({ data }) => {
    try {
      await requireAdmin();
    } catch (err) {
      if (err instanceof Response && err.status === 401) {
        throw new Error("Session expired. Log in to admin again.");
      }
      throw err;
    }

    const db = getDb();
    await ensureCategorySeed();
    const now = new Date();

    if (data.id) {
      const [existing] = await db.select().from(categories).where(eq(categories.id, data.id)).limit(1);
      if (!existing) throw new Error("Category not found.");

      const values = {
        label: data.label.trim(),
        description: data.description?.trim() ?? "",
        sortOrder: data.sortOrder ?? existing.sortOrder,
        allowsPersonalization: data.allowsPersonalization ?? existing.allowsPersonalization,
        updatedAt: now,
      };

      await db.update(categories).set(values).where(eq(categories.id, data.id));
      const [row] = await db.select().from(categories).where(eq(categories.id, data.id)).limit(1);
      if (!row) throw new Error("Failed to save category");
      return toCategory(row);
    }

    const existingRows = await db.select({ id: categories.id, sortOrder: categories.sortOrder }).from(categories);
    const taken = new Set(existingRows.map((r) => r.id));
    const id = slugFromLabel(data.label, taken);
    const maxSort = existingRows.reduce((max, r) => Math.max(max, r.sortOrder), -1);

    const values = {
      id,
      label: data.label.trim(),
      description: data.description?.trim() ?? "",
      sortOrder: data.sortOrder ?? maxSort + 1,
      allowsPersonalization: data.allowsPersonalization ?? false,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(categories).values(values);
    const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (!row) throw new Error("Failed to create category");
    return toCategory(row);
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    await ensureCategorySeed();

    const [{ value: productCount }] = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.category, data.id));

    if (productCount > 0) {
      throw new Error(
        `Cannot delete — ${productCount} product${productCount === 1 ? "" : "s"} still use this category. Move or delete them first.`,
      );
    }

    const [{ value: categoryCount }] = await db.select({ value: count() }).from(categories);
    if (categoryCount <= 1) {
      throw new Error("You must keep at least one category.");
    }

    await db.delete(categories).where(eq(categories.id, data.id));
    return { ok: true as const };
  });
