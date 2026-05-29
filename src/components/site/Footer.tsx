import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { PackageSearch, Search } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { BRAND_LEGAL } from "@/lib/brand";
import type { Order, OrderStatus } from "@/db/mappers.server";
import { trackOrdersByEmail } from "@/lib/api/orders";

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "New",
  contacted: "Contacted",
  printing: "Printing",
  shipped: "Shipped",
  done: "Delivered",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-[var(--color-accent-orange)]/15 text-[var(--color-accent-orange)]",
  printing: "bg-[var(--color-accent-purple)]/15 text-[var(--color-accent-purple)]",
  shipped: "bg-[var(--color-accent-cyan)]/15 text-[var(--color-accent-cyan)]",
  done: "bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)]",
};

function OrderTracker() {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = email.trim();
    if (!q) return;
    setLoading(true);
    try {
      const found = await trackOrdersByEmail({ data: { email: q } });
      setResults(found);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-card p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
          <PackageSearch className="w-5 h-5" />
        </span>
        <h3 className="text-lg font-bold tracking-tight">Track your order</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Enter the email you used at checkout to see the live status of your prints.
      </p>
      <form onSubmit={search} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 h-11 rounded-full border border-border bg-background px-5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth"
        />
        <button
          type="submit"
          className="h-11 rounded-full px-5 bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center gap-2 hover:opacity-90 transition-smooth"
        >
          <Search className="w-4 h-4" /> {loading ? "Searching…" : "Track"}
        </button>
      </form>

      {results !== null && (
        <div className="mt-5 space-y-2">
          {results.length === 0 && (
            <p className="text-sm text-muted-foreground">No orders found for that email.</p>
          )}
          {results.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--color-surface)] border border-border"
            >
              <div className="min-w-0">
                <div className="font-mono text-xs text-muted-foreground truncate">{o.id}</div>
                <div className="text-sm font-semibold">
                  {o.items.length} item{o.items.length === 1 ? "" : "s"} · ₹{o.total.toFixed(2)}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString()}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[o.status]}`}>
                {STATUS_LABEL[o.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div className="space-y-5">
          <BrandLogo variant="full" />
          <p className="text-sm text-muted-foreground max-w-md">
            Premium 3D prints from {BRAND_LEGAL}. Designed, printed, and finished in-house.
          </p>
          <nav className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <a href="#categories" className="hover:text-foreground transition-smooth">Shop</a>
            <a href="#about" className="hover:text-foreground transition-smooth">About</a>
            <a href="#contact" className="hover:text-foreground transition-smooth">Contact</a>
            <Link to="/privacy" className="hover:text-foreground transition-smooth">
              Privacy
            </Link>
          </nav>
        </div>
        <OrderTracker />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {BRAND_LEGAL}. All rights reserved.
          </p>
          <Link
            to="/admin/login"
            className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-smooth"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}