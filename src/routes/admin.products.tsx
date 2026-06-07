import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCategories } from "@/hooks/use-categories";
import { productsQueryKey, useProducts } from "@/hooks/use-products";
import { deleteProduct, upsertProduct } from "@/lib/api/products";
import type { Product } from "@/components/site/ProductCard";
import { adminPageTitle } from "@/lib/brand";
import { DEFAULT_PRODUCT_CATEGORY, getCategoryLabel, type ProductCategory } from "@/data/categories";
import {
  MAX_PRODUCT_GIF_BYTES,
  MAX_PRODUCT_IMAGE_BYTES,
  compressImageToDataUrl,
  estimateDataUrlBytes,
  readGifToDataUrl,
} from "@/lib/compress-image";
import { formatInr, getDiscountPercent } from "@/lib/pricing";
import { ProductPrice } from "@/components/site/ProductPrice";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: adminPageTitle("Products") }] }),
  component: AdminProducts,
});

const blank: Product = {
  id: "",
  name: "",
  description: "",
  price: 0,
  originalPrice: undefined,
  image: "",
  images: [],
  colors: ["#22C55E"],
  dimensions: "",
  weight: "",
  gif: "",
  personalizationPrompt: "",
  category: DEFAULT_PRODUCT_CATEGORY,
};

function AdminProducts() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading, isError } = useProducts();
  const { data: categories = [] } = useCategories();
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async (p: Product) => {
    setSaving(true);
    try {
      const id = p.id || `p-${Date.now()}`;
      await upsertProduct({ data: { ...p, id } });
      await queryClient.invalidateQueries({ queryKey: productsQueryKey });
      setEditing(null);
    } catch (err) {
      throw new Error(formatSaveError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    await deleteProduct({ data: { id } });
    await queryClient.invalidateQueries({ queryKey: productsQueryKey });
  };

  return (
    <AdminLayout title="Products">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() =>
            setEditing({ ...blank, category: categories[0]?.id ?? DEFAULT_PRODUCT_CATEGORY })
          }
          className="rounded-full font-semibold"
          disabled={saving}
        >
          <Plus className="w-4 h-4" /> Add product
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground mb-4">Loading products…</p>}
      {isError && <p className="text-destructive mb-4">Could not load products.</p>}

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-[var(--color-surface)] text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-5 py-4">Product</th>
              <th className="text-left font-semibold px-5 py-4 hidden md:table-cell">Description</th>
              <th className="text-left font-semibold px-5 py-4">Price</th>
              <th className="text-left font-semibold px-5 py-4 hidden lg:table-cell">Category</th>
              <th className="text-left font-semibold px-5 py-4 hidden md:table-cell">Colors</th>
              <th className="text-right font-semibold px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-muted/40 transition-smooth">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-[var(--color-surface)]" />}
                    <span className="font-semibold">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground hidden md:table-cell max-w-xs truncate">{p.description}</td>
                <td className="px-5 py-4">
                  <ProductPrice price={p.price} originalPrice={p.originalPrice} size="sm" align="left" />
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-muted-foreground">
                  {getCategoryLabel(p.category, categories)}
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="flex gap-1">
                    {p.colors.slice(0, 5).map((c) => (
                      <span key={c} className="w-4 h-4 rounded-full border border-border" style={{ background: c }} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-muted transition-smooth"
                      aria-label="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => void remove(p.id, p.name)}
                      className="w-9 h-9 grid place-items-center rounded-xl border border-border text-destructive hover:bg-destructive/10 transition-smooth"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {editing && (
        <ProductEditor
          key={editing.id || "new"}
          product={editing}
          categories={categories}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </AdminLayout>
  );
}

function ProductEditor({
  product,
  categories,
  saving,
  onClose,
  onSave,
}: {
  product: Product;
  categories: ProductCategory[];
  saving: boolean;
  onClose: () => void;
  onSave: (p: Product) => void | Promise<void>;
}) {
  const [p, setP] = useState<Product>(product);
  const selectedCategory = categories?.find((c) => c.id === p.category);
  const allowsPersonalization = selectedCategory?.allowsPersonalization ?? false;
  const [colorsInput, setColorsInput] = useState(() => product.colors.join(", "));
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const gifRef = useRef<HTMLInputElement>(null);

  const parseColors = (raw: string) =>
    raw
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  const images = p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const jpgs = arr.filter((f) => /jpe?g$/i.test(f.type) || /\.jpe?g$/i.test(f.name));
    if (jpgs.length !== arr.length) {
      setError("Only JPG/JPEG files are allowed.");
      return;
    }
    const combined = [...images, ...jpgs];
    if (combined.length > 5) {
      setError("Maximum 5 images allowed.");
      return;
    }
    setError(null);
    try {
      const newOnes = await Promise.all(jpgs.map((file) => compressImageToDataUrl(file)));
      const allUrls = [...images.filter((x) => typeof x === "string"), ...newOnes].slice(0, 5);
      if (estimateDataUrlBytes(allUrls) > MAX_PRODUCT_IMAGE_BYTES) {
        setError("Images are still too large. Remove a photo or use smaller JPG files.");
        return;
      }
      setP({ ...p, image: allUrls[0] ?? "", images: allUrls });
    } catch {
      setError("Could not process one of the images. Try a different JPG.");
    }
  };

  const removeImage = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    setP({ ...p, image: next[0] ?? "", images: next });
  };

  const handleGif = async (files: FileList | null) => {
    if (!files?.[0]) return;
    setError(null);
    try {
      const dataUrl = await readGifToDataUrl(files[0]);
      if (estimateDataUrlBytes([...images, dataUrl]) > MAX_PRODUCT_IMAGE_BYTES) {
        setError("GIF plus images are too large. Remove a photo or use a smaller GIF.");
        return;
      }
      setP({ ...p, gif: dataUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process GIF.");
    }
  };

  const submit = async () => {
    if (!p.name.trim()) return setError("Name is required.");
    if (images.length < 1) return setError("Please upload at least 1 image.");
    const colors = parseColors(colorsInput);
    if (colors.length < 1) {
      return setError("Add at least one color (hex codes, separated by commas).");
    }
    if (p.originalPrice != null && p.originalPrice > 0 && p.originalPrice <= p.price) {
      return setError("Original price must be higher than the selling price.");
    }
    const mediaBytes = estimateDataUrlBytes(images) + (p.gif?.length ?? 0);
    if (mediaBytes > MAX_PRODUCT_IMAGE_BYTES) {
      return setError(
        "Images are too large for the server (Vercel limit). Use fewer or smaller JPGs/GIF — they are compressed on upload after you redeploy.",
      );
    }
    setError(null);
    try {
      await onSave({ ...p, colors });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-foreground/40 backdrop-blur-sm grid place-items-center p-4">
      <div className="bg-background rounded-3xl shadow-float w-full max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{product.id ? "Edit product" : "New product"}</h2>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full hover:bg-muted" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <Input label="Name" value={p.name} onChange={(v) => setP({ ...p, name: v })} />
          <Input label="Description" value={p.description} onChange={(v) => setP({ ...p, description: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Selling price (INR)"
              type="number"
              value={String(p.price)}
              onChange={(v) => setP({ ...p, price: Number(v) || 0 })}
            />
            <Input
              label="Original price / MRP (optional)"
              type="number"
              value={p.originalPrice != null && p.originalPrice > 0 ? String(p.originalPrice) : ""}
              onChange={(v) => {
                const n = Number(v);
                setP({ ...p, originalPrice: v.trim() === "" || !n ? undefined : n });
              }}
            />
          </div>
          {getDiscountPercent(p.price, p.originalPrice) != null && (
            <p className="text-xs text-[var(--color-accent-orange)] font-semibold -mt-2">
              {getDiscountPercent(p.price, p.originalPrice)}% off — customers see {formatInr(p.originalPrice!)} struck
              through and {formatInr(p.price)} as the price
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Dimensions (optional)"
              value={p.dimensions ?? ""}
              onChange={(v) => setP({ ...p, dimensions: v })}
              placeholder="12 × 10 × 8 cm"
            />
            <Input
              label="Weight (optional)"
              value={p.weight ?? ""}
              onChange={(v) => setP({ ...p, weight: v })}
              placeholder="85 g"
            />
          </div>

          <label className="block">
            <span className="text-sm font-semibold">Category</span>
            <select
              value={p.category}
              onChange={(e) => {
                const category = e.target.value;
                const nextCategory = categories?.find((c) => c.id === category);
                setP({
                  ...p,
                  category,
                  personalizationPrompt: nextCategory?.allowsPersonalization ? p.personalizationPrompt : "",
                });
              }}
              className="mt-1.5 w-full h-11 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth"
            >
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          {allowsPersonalization && (
            <Input
              label="Personalization prompt (optional)"
              value={p.personalizationPrompt ?? ""}
              onChange={(v) => setP({ ...p, personalizationPrompt: v })}
              placeholder="e.g. Name to print on the item"
            />
          )}
          {allowsPersonalization && p.personalizationPrompt?.trim() && (
            <p className="text-xs text-muted-foreground -mt-2">
              Customers must enter this text before they can add the product to cart.
            </p>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold">Preview GIF (optional, max {Math.round(MAX_PRODUCT_GIF_BYTES / 1000)} KB)</span>
            </div>
            <input
              ref={gifRef}
              type="file"
              accept="image/gif,.gif"
              hidden
              onChange={(e) => {
                void handleGif(e.target.files);
                if (gifRef.current) gifRef.current.value = "";
              }}
            />
            {p.gif ? (
              <div className="flex items-center gap-3">
                <img src={p.gif} alt="" className="w-16 h-16 rounded-xl border border-border object-cover" />
                <button
                  type="button"
                  onClick={() => setP({ ...p, gif: "" })}
                  className="text-sm text-destructive hover:underline"
                >
                  Remove GIF
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => gifRef.current?.click()}
                className="w-full h-16 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-smooth grid place-items-center text-sm text-muted-foreground"
              >
                <span className="inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload a small GIF preview
                </span>
              </button>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold">Images (JPG, 1–5, auto-compressed)</span>
              <span className="text-xs text-muted-foreground">{images.length}/5</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,.jpg,.jpeg"
              multiple
              hidden
              onChange={(e) => {
                void handleFiles(e.target.files);
                if (fileRef.current) fileRef.current.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={images.length >= 5}
              className="w-full h-24 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-smooth grid place-items-center text-sm text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {images.length === 0 ? "Upload up to 5 JPG images" : "Add more images"}
              </span>
            </button>
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {images.map((src, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={src} alt="" className="w-full h-full object-cover rounded-lg border border-border" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 grid place-items-center rounded-full bg-destructive text-destructive-foreground shadow"
                      aria-label="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                        MAIN
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="block">
            <span className="text-sm font-semibold">Material colors (comma-separated hex)</span>
            <input
              type="text"
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
              onBlur={() => {
                const parsed = parseColors(colorsInput);
                if (parsed.length > 0) {
                  setP({ ...p, colors: parsed });
                  setColorsInput(parsed.join(", "));
                }
              }}
              placeholder="#22C55E, #3B82F6, #111111"
              className="mt-1.5 w-full h-11 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Example: <span className="font-mono">#22C55E, #FF7A00, #111111</span>
            </p>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="rounded-full" disabled={saving}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} className="rounded-full font-semibold" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatSaveError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err && typeof err.message === "string") {
    return err.message;
  }
  return "Could not save product. Large photos often fail on Vercel — use fewer/smaller JPGs and redeploy the latest site.";
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth"
      />
    </label>
  );
}
