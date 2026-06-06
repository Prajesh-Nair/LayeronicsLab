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
  /** Optional small animated preview. */
  gif?: string | null;
  /** When set, customers must enter text before adding to cart. */
  personalizationPrompt?: string | null;
  category: ProductCategoryId;
};

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [color, setColor] = useState(product.colors[0] ?? "#000");
  const [personalizationText, setPersonalizationText] = useState("");
  const requiresPersonalization = Boolean(product.personalizationPrompt?.trim());

  useEffect(() => {
    setColor(product.colors[0] ?? "#000");
    setPersonalizationText("");
  }, [product.id, product.colors]);

  const canAdd =
    !requiresPersonalization || personalizationText.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color,
      personalizationText: requiresPersonalization
        ? personalizationText.trim()
        : undefined,
    });
  };

  return (
    <article className="group bg-card rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-card hover:shadow-float sm:hover:-translate-y-1 transition-smooth">
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="relative block rounded-xl sm:rounded-2xl overflow-hidden bg-black aspect-square"
      >
        {product.tag && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-semibold bg-card/90 text-foreground shadow-glass backdrop-blur">
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
          className="w-full h-full object-contain group-hover:scale-[1.03] transition-smooth"
        />
        {product.gif && (
          <img
            src={product.gif}
            alt=""
            aria-hidden
            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 border-card/90 shadow-glass object-cover bg-card/80 backdrop-blur"
          />
        )}
      </Link>

      <div className="pt-2.5 sm:pt-5 pb-1 sm:pb-2 px-0.5 sm:px-1 space-y-2 sm:space-y-3">
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-sm sm:text-lg font-semibold text-foreground leading-tight line-clamp-2">
            {product.name}
          </h3>
          <ProductPrice price={product.price} originalPrice={product.originalPrice} size="sm" align="left" />
          <p className="hidden sm:block text-sm text-muted-foreground line-clamp-1">{product.description}</p>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">Color</span>
            <span className="hidden sm:inline text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">
              {color}
            </span>
          </div>
          <ProductColorPicker colors={product.colors} value={color} onChange={setColor} size="sm" />
        </div>

        {product.dimensions?.trim() && (
          <div className="rounded-lg sm:rounded-xl bg-[var(--color-surface)] px-2 py-1.5 sm:px-3 sm:py-2">
            <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Dimension (L × B × H)
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-foreground mt-0.5 line-clamp-2">
              {product.dimensions}
            </div>
          </div>
        )}

        {requiresPersonalization && (
          <label className="block space-y-1 sm:space-y-1.5">
            <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground line-clamp-2">
              {product.personalizationPrompt}
              <span className="text-primary"> *</span>
            </span>
            <input
              type="text"
              value={personalizationText}
              onChange={(e) => setPersonalizationText(e.target.value)}
              placeholder="Your text"
              maxLength={80}
              className="w-full h-8 sm:h-9 rounded-lg sm:rounded-xl border border-border bg-background px-2.5 sm:px-3 text-xs sm:text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth"
            />
          </label>
        )}

        <div className="flex gap-1.5 sm:gap-2 pt-1 sm:pt-2">
          <Button
            className="flex-1 rounded-full font-medium h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
            size="sm"
            disabled={!canAdd}
            onClick={handleAdd}
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
          <Link to="/products/$id" params={{ id: product.id }}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full font-medium bg-card text-foreground h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 sm:p-2"
              aria-label={`View ${product.name}`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">View</span>
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
