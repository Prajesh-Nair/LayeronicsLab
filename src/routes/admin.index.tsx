import { createFileRoute } from "@tanstack/react-router";
import { adminPageTitle } from "@/lib/brand";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProducts } from "@/hooks/use-products";
import { useAdminOrders } from "@/hooks/use-orders";
import { useAdmin } from "@/store/admin";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: adminPageTitle("Dashboard") }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const authed = useAdmin((s) => s.authed);
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useAdminOrders(authed);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const newOrders = orders.filter((o) => o.status === "new").length;

  const stats = [
    { label: "Total orders", value: orders.length, icon: ShoppingBag, color: "text-primary", bg: "bg-primary/10" },
    { label: "New orders", value: newOrders, icon: TrendingUp, color: "text-[var(--color-accent-orange)]", bg: "bg-[var(--color-accent-orange)]/10" },
    { label: "Products", value: products.length, icon: Package, color: "text-[var(--color-accent-green)]", bg: "bg-[var(--color-accent-green)]/10" },
    { label: "Revenue (pending)", value: `₹${revenue.toFixed(2)}`, icon: DollarSign, color: "text-foreground", bg: "bg-muted" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-5 shadow-card">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} grid place-items-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent orders</h2>
          <span className="text-xs text-muted-foreground">Latest 5</span>
        </div>
        {orders.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No orders yet.</p>}
        <ul className="divide-y divide-border">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-mono text-sm font-semibold">{o.id}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {o.name ? `${o.name} · ` : ""}
                  {o.email} · {o.items.length} item(s)
                </div>
              </div>
              <div className="text-sm font-semibold">₹{o.total.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
