import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { categoriesQueryKey, useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import { deleteCategory, upsertCategory } from "@/lib/api/categories";
import type { ProductCategory } from "@/data/categories";
import { adminPageTitle } from "@/lib/brand";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({ meta: [{ title: adminPageTitle("Categories") }] }),
  component: AdminCategories,
});

const blank: Omit<ProductCategory, "sortOrder"> & { sortOrder?: number } = {
  id: "",
  label: "",
  description: "",
  allowsPersonalization: false,
};

function AdminCategories() {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading, isError } = useCategories();
  const { data: products = [] } = useProducts();
  const [editing, setEditing] = useState<(typeof blank & { id: string }) | null>(null);
  const [saving, setSaving] = useState(false);

  const productCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    return counts;
  }, [products]);

  const save = async (c: typeof blank & { id?: string }) => {
    setSaving(true);
    try {
      await upsertCategory({
        data: {
          id: c.id || undefined,
          label: c.label,
          description: c.description,
          sortOrder: c.sortOrder,
          allowsPersonalization: c.allowsPersonalization,
        },
      });
      await queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
      setEditing(null);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Could not save category.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, label: string) => {
    if (!confirm(`Delete category "${label}"?`)) return;
    try {
      await deleteCategory({ data: { id } });
      await queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete category.");
    }
  };

  return (
    <AdminLayout title="Categories">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setEditing({ ...blank })}
          className="rounded-full font-semibold"
          disabled={saving}
        >
          <Plus className="w-4 h-4" /> Add category
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground mb-4">Loading categories…</p>}
      {isError && <p className="text-destructive mb-4">Could not load categories.</p>}

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface)] text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-5 py-4">Name</th>
              <th className="text-left font-semibold px-5 py-4 hidden md:table-cell">Description</th>
              <th className="text-left font-semibold px-5 py-4 hidden lg:table-cell">ID</th>
              <th className="text-left font-semibold px-5 py-4">Products</th>
              <th className="text-left font-semibold px-5 py-4 hidden sm:table-cell">Order</th>
              <th className="text-right font-semibold px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-muted/40 transition-smooth">
                <td className="px-5 py-4">
                  <div className="font-semibold">{c.label}</div>
                  {c.allowsPersonalization && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Personalized orders
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-muted-foreground hidden md:table-cell max-w-xs truncate">
                  {c.description || "—"}
                </td>
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground hidden lg:table-cell">{c.id}</td>
                <td className="px-5 py-4 tabular-nums">{productCounts.get(c.id) ?? 0}</td>
                <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell tabular-nums">{c.sortOrder}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditing(c)}
                      className="w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-muted transition-smooth"
                      aria-label="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => void remove(c.id, c.label)}
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

      {editing && (
        <CategoryEditor
          key={editing.id || "new"}
          category={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </AdminLayout>
  );
}

function CategoryEditor({
  category,
  saving,
  onClose,
  onSave,
}: {
  category: typeof blank & { id?: string };
  saving: boolean;
  onClose: () => void;
  onSave: (c: typeof blank & { id?: string }) => void | Promise<void>;
}) {
  const [c, setC] = useState(category);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!c.label.trim()) return setError("Name is required.");
    setError(null);
    try {
      await onSave(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save category.");
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-foreground/40 backdrop-blur-sm grid place-items-center p-4">
      <div className="bg-background rounded-3xl shadow-float w-full max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{category.id ? "Edit category" : "New category"}</h2>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full hover:bg-muted" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {category.id && (
            <label className="block">
              <span className="text-sm font-semibold">Category ID</span>
              <input
                type="text"
                value={category.id}
                readOnly
                className="mt-1.5 w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm font-mono text-muted-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">ID is fixed after creation (used in product links).</p>
            </label>
          )}

          <Input label="Name" value={c.label} onChange={(v) => setC({ ...c, label: v })} />
          <label className="block">
            <span className="text-sm font-semibold">Description</span>
            <textarea
              value={c.description}
              onChange={(e) => setC({ ...c, description: e.target.value })}
              rows={3}
              placeholder="Short blurb shown on the shop page"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth resize-none"
            />
          </label>

          <Input
            label="Display order"
            type="number"
            value={String(c.sortOrder ?? 0)}
            onChange={(v) => setC({ ...c, sortOrder: Number(v) || 0 })}
          />

          <label className="flex items-start gap-3 rounded-xl border border-border p-4 cursor-pointer hover:bg-muted/40 transition-smooth">
            <input
              type="checkbox"
              checked={c.allowsPersonalization}
              onChange={(e) => setC({ ...c, allowsPersonalization: e.target.checked })}
              className="mt-1"
            />
            <span>
              <span className="text-sm font-semibold block">Allow personalized text on products</span>
              <span className="text-xs text-muted-foreground">
                When enabled, you can set a personalization prompt on products in this category so customers type
                custom text before adding to cart.
              </span>
            </span>
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

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
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
