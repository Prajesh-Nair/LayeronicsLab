import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { pageTitle } from "@/lib/brand";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Lock, MessageCircle, Truck } from "lucide-react";
import { BRAND_EMAIL, BRAND_LEGAL } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteShell";
import { useCart } from "@/store/cart";
import { createOrder } from "@/lib/api/orders";
import { sanitizeOrderItemImageForRequest } from "@/lib/order-images";

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
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ""))) {
      setError("Please enter a valid phone number (10+ digits, optional + prefix)");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit delivery pincode");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const result = await createOrder({
        data: {
          email,
          phone,
          pincode,
          notes,
          total: subtotal(),
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            image: sanitizeOrderItemImageForRequest(i.image),
            color: i.color,
            personalizationText: i.personalizationText,
            quantity: i.quantity,
          })),
        },
      });
      clear();
      navigate({ to: "/order-success", search: { id: result.id } });
    } catch (err) {
      setError(formatCheckoutError(err));
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
            <p className="text-muted-foreground mt-2">
              No online payment yet — submit your order and {BRAND_LEGAL} will confirm with you directly.
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-[var(--color-surface)] p-5 space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
                <p>
                  After you place your order, we will contact you on <strong className="text-foreground">WhatsApp</strong> at
                  the phone number below and by <strong className="text-foreground">email</strong> at the address you provide
                  to confirm your order and share next steps.
                </p>
              </div>
              <div className="flex gap-3">
                <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
                <p>
                  <strong className="text-foreground">Delivery charges depend on your location.</strong> We use your pincode
                  to estimate shipping. The final amount (including delivery) will be shared with you on WhatsApp and email
                  before we print and ship.
                </p>
              </div>
            </div>

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
              <Field label="Delivery pincode" required hint="6-digit Indian PIN">
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="110001"
                  disabled={submitting}
                  className="w-full h-14 rounded-2xl border border-border bg-background px-5 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-smooth disabled:opacity-60 tracking-widest font-mono"
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
                    {i.personalizationText && (
                      <div className="text-xs text-foreground mt-0.5 truncate" title={i.personalizationText}>
                        Text: {i.personalizationText}
                      </div>
                    )}
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
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-1 gap-4">
              <span>Delivery</span>
              <span className="text-right">Based on pincode — confirmed on WhatsApp &amp; email</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Questions? Reach us at{" "}
              <a href={`mailto:${BRAND_EMAIL}`} className="text-primary font-medium hover:underline">
                {BRAND_EMAIL}
              </a>
              .
            </p>
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

function formatCheckoutError(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "object" && err !== null && "message" in err && typeof err.message === "string") {
    return err.message;
  }
  return "Could not place your order. Check your connection and try again.";
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
