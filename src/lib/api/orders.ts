import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db/client.server";
import { type OrderStatus, toOrder } from "@/db/mappers.server";
import { orderItems, orders } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin.server";
import { sanitizeOrderItemImage } from "@/lib/order-images";

function rethrowOrderError(err: unknown): never {
  const msg = err instanceof Error ? err.message : String(err);
  if (/relation .* does not exist|no such table/i.test(msg)) {
    throw new Error(
      "Order tables are missing. Run npm run db:push against your production database, then redeploy.",
    );
  }
  if (/DATABASE_URL is not set/i.test(msg)) {
    throw err instanceof Error ? err : new Error(msg);
  }
  if (/connect|ECONNREFUSED|ENOTFOUND|timeout|authentication failed/i.test(msg)) {
    throw new Error(`Could not reach the database. Check DATABASE_URL on Vercel: ${msg}`);
  }
  throw err instanceof Error ? err : new Error(msg);
}

const orderStatusSchema = z.enum(["new", "contacted", "printing", "shipped", "done"]);

const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  image: z.string(),
  color: z.string(),
  quantity: z.number().int().positive(),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      phone: z.string().min(10),
      notes: z.string().optional(),
      items: z.array(cartItemSchema).min(1),
      total: z.number().nonnegative(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
      const db = getDb();

      await db.insert(orders).values({
        id,
        email: data.email.toLowerCase(),
        phone: data.phone,
        notes: data.notes ?? "",
        total: data.total,
        status: "new",
      });

      await db.insert(orderItems).values(
        data.items.map((item, index) => ({
          id: `${id}-${index}`,
          orderId: id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: sanitizeOrderItemImage(item.image),
          color: item.color,
          quantity: item.quantity,
        })),
      );

      return { id };
    } catch (err) {
      rethrowOrderError(err);
    }
  });

export const listOrders = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const db = getDb();
  const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  if (orderRows.length === 0) return [];

  const itemRows = await db.select().from(orderItems);
  const itemsByOrder = new Map<string, typeof itemRows>();
  for (const item of itemRows) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  return orderRows.map((row) => toOrder(row, itemsByOrder.get(row.id) ?? []));
});

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      status: orderStatusSchema,
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await getDb().update(orders).set({ status: data.status }).where(eq(orders.id, data.id));
    return { ok: true as const };
  });

export const trackOrdersByEmail = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const db = getDb();
    const orderRows = await db
      .select()
      .from(orders)
      .where(eq(orders.email, data.email.trim().toLowerCase()))
      .orderBy(desc(orders.createdAt));

    if (orderRows.length === 0) return [];

    const ids = orderRows.map((o) => o.id);
    const itemRows = await db.select().from(orderItems);
    const filteredItems = itemRows.filter((i) => ids.includes(i.orderId));
    const itemsByOrder = new Map<string, typeof filteredItems>();
    for (const item of filteredItems) {
      const list = itemsByOrder.get(item.orderId) ?? [];
      list.push(item);
      itemsByOrder.set(item.orderId, list);
    }

    return orderRows.map((row) => toOrder(row, itemsByOrder.get(row.id) ?? []));
  });

export type { OrderStatus };
