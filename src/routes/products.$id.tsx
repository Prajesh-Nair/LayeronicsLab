import { createFileRoute, Link } from "@tanstack/react-router";
import { pageTitle } from "@/lib/brand";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart, Truck, ShieldCheck, Layers, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductColorPicker } from "@/components/site/ProductColorPicker";
import { ProductDiscountBadge } from "@/components/site/ProductDiscountBadge";
import { ProductPrice } from "@/components/site/ProductPrice";
import { ProductSpecs } from "@/components/site/ProductSpecs";
import { useProducts } from "@/hooks/use-products";
import { getProduct } from "@/lib/api/products";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => ({
    product: await getProduct({ data: { id: params.id } }),
    id: params.id,
  }),
  head: ({ loaderData }) => ({
    meta: [
      { title: pageTitle(loaderData?.product?.name ?? "Product") },
      { name: "description", content: loaderData?.product?.description ?? "" },
      { property: "og:title", content: pageTitle(loaderData?.product?.name ?? "Product") },
      { property: "og:description", content: loaderData?.product?.description ?? "" },
      { property: "og:image", content: loaderData?.product?.image ?? "" },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { product: loaderProduct, id } = Route.useLoaderData();
  const { data: products = [] } = useProducts();
  const product = products.find((p) => p.id === id) ?? loaderProduct;
  const [color, setColor] = useState(product?.colors?.[0] ?? "#000");
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [personalizationText, setPersonalizationText] = useState("");
  const addItem = useCart((s) => s.addItem);
  const requiresPersonalization = Boolean(product?.personalizationPrompt?.trim());

  useEffect(() => {
    if (product?.colors?.[0]) setColor(product.colors[0]);
    setPersonalizationText("");
  }, [product?.id, product?.colors]);

  const canAdd = !requiresPersonalization || personalizationText.trim().length > 0;

  if (!product) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-24 text-center">
          <h1 className="text-3xl font-bold mb-3">Product not found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find product "{id}".</p>
          <Link to="/">
            <Button className="rounded-full">Back to catalog</Button>
          </Link>
        </div>
      </SiteShell>
    );
  }

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10 pt-8 pb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="w-4 h-4" /> Back to catalog
        </Link>
      </div>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-10 pb-16 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="space-y-4">
          <div className="relative rounded-[32px] overflow-hidden bg-[var(--color-surface)] aspect-square shadow-card">
            <ProductDiscountBadge
              price={product.price}
              originalPrice={product.originalPrice}
              className="top-4 right-4 text-xs"
            />
            <img src={gallery[activeImg]} alt={product.name} className="w-full h-full object-cover" width={1024} height={1024} />
            {product.gif && (
              <img
                src={product.gif}
                alt=""
                aria-hidden
                className="absolute bottom-4 right-4 z-10 w-20 h-20 rounded-2xl border-2 border-card/90 shadow-glass object-cover bg-card/80 backdrop-blur"
              />
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`rounded-2xl overflow-hidden aspect-square bg-[var(--color-surface)] border-2 transition-smooth ${i === activeImg ? "border-primary" : "border-transparent hover:border-border"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          {product.tag && (
            <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary">{product.tag}</span>
          )}
          <div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground mt-3 text-base">{product.description}</p>
          </div>
          <ProductPrice price={product.price} originalPrice={product.originalPrice} size="lg" align="left" />

          <ProductSpecs dimensions={product.dimensions} weight={product.weight} />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Print color</span>
              <span className="text-xs text-muted-foreground font-mono">{color}</span>
            </div>
            <ProductColorPicker colors={product.colors} value={color} onChange={setColor} size="md" />
          </div>

          {requiresPersonalization && (
            <label className="block space-y-2">
              <span className="text-sm font-semibold">
                {product.personalizationPrompt}
                <span className="text-primary"> *</span>
              </span>
              <input
                type="text"
                value={personalizationText}
                onChange={(e) => setPersonalizationText(e.target.value)}
                placeholder="Enter your text"
                maxLength={80}
                className="w-full h-12 rounded-2xl border border-border bg-background px-5 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth"
              />
              <p className="text-xs text-muted-foreground">Required for customized prints before adding to cart.</p>
            </label>
          )}

          <div className="flex items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-border bg-background">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 grid place-items-center" aria-label="Decrease">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-11 h-11 grid place-items-center" aria-label="Increase">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 h-12 rounded-full font-semibold shadow-float hover:-translate-y-0.5 transition-smooth"
              disabled={!canAdd}
              onClick={() =>
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  color,
                  personalizationText: requiresPersonalization
                    ? personalizationText.trim()
                    : undefined,
                  quantity: qty,
                })
              }
            >
              <ShoppingCart className="w-4 h-4" /> Add to cart
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { i: Layers, t: "Premium PLA" },
              { i: Truck, t: "48h ship" },
              { i: ShieldCheck, t: "Reprint guarantee" },
            ].map(({ i: Icon, t }) => (
              <div key={t} className="rounded-2xl bg-[var(--color-surface)] p-3 flex flex-col items-center text-center gap-1.5">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-10 pb-24">
        <h2 className="text-2xl font-bold mb-8">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
