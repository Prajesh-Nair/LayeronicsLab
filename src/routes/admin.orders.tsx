import { createFileRoute } from "@tanstack/react-router";
import { adminPageTitle } from "@/lib/brand";
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Order, OrderStatus } from "@/db/mappers.server";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { useAdmin } from "@/store/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: adminPageTitle("Orders") }] }),
  component: AdminOrders,
});

const STATUSES: OrderStatus[] = ["new", "contacted", "printing", "shipped", "done"];
const STATUS_STYLES: Record<OrderStatus, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-[var(--color-accent-orange)]/15 text-[var(--color-accent-orange)]",
  printing: "bg-[var(--color-accent-purple)]/15 text-[var(--color-accent-purple)]",
  shipped: "bg-[var(--color-accent-cyan)]/15 text-[var(--color-accent-cyan)]",
  done: "bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)]",
};

function AdminOrders() {
  const authed = useAdmin((s) => s.authed);
  const { data: orders = [], isLoading, isError } = useAdminOrders(authed);
  const updateStatus = useUpdateOrderStatus();
  const [selected, setSelected] = useState<Order | null>(null);

  const setStatus = (id: string, status: OrderStatus) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <AdminLayout title="Orders">
      {isLoading && <p className="text-muted-foreground mb-4">Loading orders…</p>}
      {isError && <p className="text-destructive mb-4">Could not load orders.</p>}

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface)] text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-5 py-4">Order</th>
                <th className="text-left font-semibold px-5 py-4">Customer</th>
                <th className="text-left font-semibold px-5 py-4">Items</th>
                <th className="text-left font-semibold px-5 py-4">Total</th>
                <th className="text-left font-semibold px-5 py-4">Created</th>
                <th className="text-left font-semibold px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-muted/40 transition-smooth">
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelected(o)}
                      className="font-mono font-semibold text-primary hover:underline"
                    >
                      {o.id}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium">{o.email}</div>
                    <div className="text-xs text-muted-foreground">{o.phone}</div>
                    {o.pincode && <div className="text-xs text-muted-foreground font-mono">PIN {o.pincode}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex -space-x-2">
                      {o.items.slice(0, 4).map((i) => (
                        <img key={i.id} src={i.image} alt="" className="w-8 h-8 rounded-lg border-2 border-background object-cover" />
                      ))}
                      {o.items.length > 4 && (
                        <span className="w-8 h-8 rounded-lg bg-muted text-xs grid place-items-center font-semibold border-2 border-background">
                          +{o.items.length - 4}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold">₹{o.total.toFixed(2)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                      disabled={updateStatus.isPending}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold border-none outline-none cursor-pointer ${STATUS_STYLES[o.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono">Order {selected.id}</DialogTitle>
                <DialogDescription>
                  Placed {new Date(selected.createdAt).toLocaleString()} · Status:{" "}
                  <span className="font-semibold capitalize">{selected.status}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 text-sm py-2">
                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Email</div>
                  <div className="font-medium">{selected.email}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Phone</div>
                  <div className="font-medium">{selected.phone || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Pincode</div>
                  <div className="font-medium font-mono">{selected.pincode || "—"}</div>
                </div>
                {selected.notes && (
                  <div className="col-span-2">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Notes</div>
                    <div className="font-medium">{selected.notes}</div>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <div className="text-sm font-semibold mb-3">Items ({selected.items.length})</div>
                <ul className="space-y-3 max-h-80 overflow-y-auto">
                  {selected.items.map((i) => (
                    <li key={i.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50">
                      <img src={i.image} alt={i.name} className="w-14 h-14 rounded-lg object-cover border border-border" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{i.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-block w-3 h-3 rounded-full border border-border" style={{ background: i.color }} />
                            {i.color}
                          </span>
                          <span>·</span>
                          <span>Qty {i.quantity}</span>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">₹{(i.price * i.quantity).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-bold">₹{selected.total.toFixed(2)}</span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
