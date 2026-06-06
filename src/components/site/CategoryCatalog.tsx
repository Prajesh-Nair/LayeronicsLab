import { ProductCard } from "./ProductCard";
import { PRODUCT_CATEGORIES } from "@/data/categories";
import { useProducts } from "@/hooks/use-products";

export function CategoryCatalog() {
  const { data: products = [], isLoading, isError } = useProducts();

  return (
    <section id="categories" className="bg-background scroll-mt-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-20 sm:py-28">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-medium text-primary mb-2">Categories</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Shop by collection</h2>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            Browse sculptures, customized prints, and useful everyday items — each made in our workshop.
          </p>
        </div>

        {isLoading && <p className="text-center text-muted-foreground py-12">Loading products…</p>}
        {isError && (
          <p className="text-center text-destructive py-12">
            Could not load products. Check that DATABASE_URL is set and run npm run db:push.
          </p>
        )}

        {!isLoading && !isError && (
          <div className="space-y-20 sm:space-y-24">
            {PRODUCT_CATEGORIES.map((category) => {
              const items = products.filter((p) => p.category === category.id);
              return (
                <div key={category.id} id={`category-${category.id}`} className="scroll-mt-28">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-border">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{category.label}</h3>
                      <p className="text-muted-foreground mt-2 max-w-xl text-sm sm:text-base">{category.description}</p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground tabular-nums">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center rounded-2xl bg-[var(--color-surface)] border border-border">
                      No products in this category yet. Check back soon.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                      {items.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
