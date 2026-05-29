import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import hero from "@/assets/hero-print.jpg";

export function CTASection() {
  const addItem = useCart((s) => s.addItem);
  const requestCustom = () => {
    addItem({
      productId: "custom",
      name: "Custom Print Request",
      price: 50,
      image: hero,
      color: "#22C55E",
    });
    toast.success("Custom print added to cart", { description: "Starting at ₹50 — we'll confirm final pricing after reviewing your design." });
  };
  return (
    <section id="contact" className="mx-auto max-w-[1400px] px-4 sm:px-10 pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-primary p-10 sm:p-16 text-white shadow-float">
        <div aria-hidden className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/15 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-10 w-96 h-96 rounded-full bg-black/15 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Have something custom in mind?
          </h2>
          <p className="mt-4 text-white/85 text-base sm:text-lg">
            Send us your idea, sketch or STL. Starts at ₹50 — we'll quote it, print it, and get it to your door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={requestCustom} size="lg" variant="secondary" className="rounded-full h-12 px-7 font-semibold bg-white text-neutral-900 hover:bg-white/90 hover:text-neutral-900">
              Request a custom print
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-12 px-7 font-semibold bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white">
              Browse catalog
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}