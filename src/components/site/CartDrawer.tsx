import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";

export function CartDrawer() {
  const { items, isOpen, close, updateQty, remove, subtotal } = useCart();
  return (
    <>
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[440px] bg-background shadow-float transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Your cart</h2>
            <span className="text-sm text-muted-foreground">({items.length})</span>
          </div>
          <button onClick={close} className="w-9 h-9 grid place-items-center rounded-full hover:bg-muted transition-smooth" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>Your cart is empty.</p>
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 rounded-2xl bg-[var(--color-surface)]">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-muted" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight truncate">{item.name}</h3>
                  <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-foreground" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <span className="w-3 h-3 rounded-full border border-border" style={{ background: item.color }} />
                  Color
                </div>
                {item.personalizationText && (
                  <p className="text-xs text-foreground mt-1 truncate" title={item.personalizationText}>
                    Text: <span className="font-medium">{item.personalizationText}</span>
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="inline-flex items-center rounded-full border border-border bg-background">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 grid place-items-center" aria-label="Decrease">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 grid place-items-center" aria-label="Increase">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="border-t border-border px-6 py-5 space-y-4 bg-background">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-lg font-bold">₹{subtotal().toFixed(2)}</span>
          </div>
          <Link to="/checkout" onClick={close} className="block">
            <Button disabled={items.length === 0} className="w-full h-[52px] rounded-2xl font-semibold text-base">
              Checkout
            </Button>
          </Link>
          <p className="text-[11px] text-muted-foreground text-center">No payment in V1 — we'll contact you to confirm.</p>
        </footer>
      </aside>
    </>
  );
}