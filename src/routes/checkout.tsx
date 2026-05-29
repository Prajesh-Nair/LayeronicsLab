import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { pageTitle } from "@/lib/brand";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteShell";
import { useCart } from "@/store/cart";
import { createOrder } from "@/lib/api/orders";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: pageTitle("Checkout") },
      { name: "description", content: "Place your custom 3D print order. We'll contact you to confirm." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ""))) {
      setError("Please enter a valid phone number (10+ digits, optional + prefix)");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const result = await createOrder({
        data: {
          email,
          phone,
          notes,
          total: subtotal(),
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            image: i.image,
            color: i.color,
            quantity: i.quantity,
          })),
        },
      });
      clear();
      navigate({ to: "/order-success", search: { id: result.id } });
    } catch {
      setError("Could not place your order. Please try again in a moment.");
      setSubmitting(false);
    }
  };

  return (
    <SiteShell hideFooter>
      <div className="mx-auto max-w-[1100px] px-4 sm:px-10 pt-8 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6">
          <ArrowLeft className="w-4 h-4" /> Continue shopping
        </Link>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Checkout</h1>
            <p className="text-muted-foreground mt-2">No payment in V1 — share your details and we'll reach out to confirm your order.</p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <Field label="Email address" required>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  disabled={submitting}
                  className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth disabled:opacity-60"
                />
              </Field>
              <Field label="Phone number" required hint="Includes country code, e.g. +91 98XXXXXXXX">
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                  disabled={submitting}
                  className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth disabled:opacity-60"
                />
              </Field>
              <Field label="Notes / custom requests" hint="Optional">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any preferences, deadline, or custom details"
                  rows={4}
                  disabled={submitting}
                  className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth resize-none disabled:opacity-60"
                />
              </Field>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full h-[52px] rounded-2xl text-base font-semibold shadow-float hover:-translate-y-0.5 transition-smooth"
              >
                {submitting ? "Submitting…" : "Place order"}
              </Button>
              <p className="text-xs text-muted-foreground flex items-center gap-2 justify-center">
                <Lock className="w-3 h-3" /> Your details are kept private and only used to fulfill your order.
              </p>
            </form>
          </div>

          <aside className="bg-card rounded-3xl p-6 shadow-card h-fit lg:sticky lg:top-28">
            <h2 className="font-semibold mb-4">Order summary</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty.</p>}
              {items.map((i) => (
                <div key={i.id} className="flex gap-3">
                  <img src={i.image} alt={i.name} className="w-14 h-14 rounded-xl object-cover bg-[var(--color-surface)]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{i.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-border" style={{ background: i.color }} />
                      × {i.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">₹{(i.price * i.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border my-5" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{subtotal().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
              <span>Shipping</span>
              <span>Calculated after confirmation</span>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">₹{subtotal().toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-semibold">
          {label}
          {required && <span className="text-primary"> *</span>}
        </span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
