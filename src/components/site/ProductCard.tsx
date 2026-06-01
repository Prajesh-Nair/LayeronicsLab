import { useEffect, useState } from "react";
import { ShoppingCart, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { ProductColorPicker } from "@/components/site/ProductColorPicker";
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
  /** e.g. "12 × 10 × 8 cm" */
  dimensions?: string | null;
  /** e.g. "85 g" */
  weight?: string | null;
  category: ProductCategoryId;
};

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [color, setColor] = useState(product.colors[0] ?? "#000");

  useEffect(() => {
    setColor(product.colors[0] ?? "#000");
  }, [product.id, product.colors]);

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

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Color</span>
            <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">{color}</span>
          </div>
          <ProductColorPicker colors={product.colors} value={color} onChange={setColor} size="sm" />
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
                color,
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