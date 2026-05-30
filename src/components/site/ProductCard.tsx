import { ShoppingCart, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { ProductDiscountBadge } from "@/components/site/ProductDiscountBadge";
import { ProductPrice } from "@/components/site/ProductPrice";

import type { ProductCategoryId } from "@/data/categories";

export type Product = {
  id: string;
  name: string;
  description: string;
  /** Selling price (what the customer pays). */
  price: number;
  /** MRP / list price — optional, shown struck through when higher than `price`. */
  originalPrice?: number | null;
  image: string;
  images?: string[];
  colors: string[];
  tag?: string;
  category: ProductCategoryId;
};

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  return (
    <article className="group bg-card rounded-3xl p-4 shadow-card hover:shadow-float hover:-translate-y-1 transition-smooth">
      <Link to="/products/$id" params={{ id: product.id }} className="relative block rounded-2xl overflow-hidden bg-[var(--color-surface)] aspect-square">
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-card/90 text-foreground shadow-glass backdrop-blur">
            {product.tag}
          </span>
        )}
        <ProductDiscountBadge price={product.price} originalPrice={product.originalPrice} />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-smooth"
        />
      </Link>

      <div className="pt-5 pb-2 px-1 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground leading-tight">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{product.description}</p>
          </div>
          <ProductPrice price={product.price} originalPrice={product.originalPrice} size="md" align="right" />
        </div>

        <div className="flex items-center gap-1.5">
          {product.colors.slice(0, 5).map((c) => (
            <span
              key={c}
              className="w-4 h-4 rounded-full border border-border"
              style={{ background: c }}
              aria-label={`Color ${c}`}
            />
          ))}
          {product.colors.length > 5 && (
            <span className="text-xs text-muted-foreground ml-1">+{product.colors.length - 5}</span>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 rounded-full font-medium"
            size="sm"
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                color: product.colors[0],
              })
            }
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </Button>
          <Link to="/products/$id" params={{ id: product.id }}>
            <Button variant="outline" size="sm" className="rounded-full font-medium bg-card text-foreground">
              View
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}