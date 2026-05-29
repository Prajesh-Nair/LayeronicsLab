import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/use-products";

export function FeaturedProducts() {
  const { data: products = [] } = useProducts();
  const featured = products.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section id="featured" className="mx-auto max-w-[1400px] px-4 sm:px-10 py-20 sm:py-28">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-sm font-medium text-primary mb-2">Featured drops</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Hand-picked this week</h2>
        </div>
        <a href="#categories" className="hidden sm:inline text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
          View all →
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
