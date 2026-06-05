import type { Product } from "@/components/site/ProductCard";
import { DEFAULT_PRODUCT_CATEGORY, isProductCategoryId } from "@/data/categories";
import type { DbOrder, DbOrderItem, DbProduct } from "./schema";

export type OrderStatus = "new" | "contacted" | "printing" | "shipped" | "done";

export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  personalizationText?: string;
  quantity: number;
};

export type Order = {
  id: string;
  email: string;
  phone: string;
  pincode: string;
  notes: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: OrderStatus;
};

export function toProduct(row: DbProduct): Product {
  const images = row.images?.length ? row.images : row.image ? [row.image] : [];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.originalPrice ?? undefined,
    image: row.image,
    images,
    colors: row.colors,
    tag: row.tag ?? undefined,
    dimensions: row.dimensions ?? undefined,
    weight: row.weight ?? undefined,
    gif: row.gif ?? undefined,
    personalizationPrompt: row.personalizationPrompt ?? undefined,
    category: isProductCategoryId(row.category) ? row.category : DEFAULT_PRODUCT_CATEGORY,
  };
}

export function toOrder(row: DbOrder, items: DbOrderItem[]): Order {
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    pincode: row.pincode ?? "",
    notes: row.notes,
    total: row.total,
    createdAt: row.createdAt.toISOString(),
    status: row.status as OrderStatus,
    items: items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.name,
      price: i.price,
      image: i.image,
      color: i.color,
      personalizationText: i.personalizationText ?? undefined,
      quantity: i.quantity,
    })),
  };
}
