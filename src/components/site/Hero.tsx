import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPrint from "@/assets/hero-print.jpg";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-hero-gradient">
      {/* decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-primary/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-40 -right-32 w-[460px] h-[460px] rounded-full bg-[var(--color-accent-orange)]/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-[var(--color-accent-purple)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-10 pt-16 pb-20 sm:pt-24 sm:pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-foreground shadow-glass">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            New drops every week
          </span>

          <h1 className="text-[44px] leading-[1.05] sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
            Custom 3D Prints
            <br />
            Built For <span className="bg-gradient-primary bg-clip-text text-transparent">Makers</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
            Premium filament. Precise prints. A growing catalog of objects designed and produced in our workshop — pick your color, place an order, we handle the rest.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full h-12 px-7 text-base font-semibold shadow-float hover:-translate-y-0.5 transition-smooth"
            >
              <a href="#categories">
                Explore products
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>

          <dl className="grid grid-cols-3 gap-6 pt-6 max-w-md">
            {[
              { k: "120+", v: "Designs" },
              { k: "5★", v: "Maker quality" },
              { k: "48h", v: "Avg. ship" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="text-2xl font-bold text-foreground">{s.k}</dt>
                <dd className="text-xs text-muted-foreground mt-1">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative mx-auto w-full max-w-[520px] aspect-square">
            <div aria-hidden className="absolute inset-0 rounded-[40px] bg-card shadow-float" />
            <img
              src={heroPrint}
              alt="Premium 3D printed geometric sculpture in blue and orange filament"
              width={1024}
              height={1024}
              className="relative rounded-[40px] w-full h-full object-cover animate-float"
            />
            <div className="absolute -bottom-5 -left-5 glass shadow-glass rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[var(--color-accent-green)]/15 grid place-items-center text-[var(--color-accent-green)] font-bold">PLA</span>
              <div className="text-sm">
                <div className="font-semibold text-foreground">Premium PLA</div>
                <div className="text-muted-foreground text-xs">Matte · Silk · Tough</div>
              </div>
            </div>
            <div className="absolute -top-5 -right-3 glass shadow-glass rounded-2xl px-4 py-3 hidden sm:flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[var(--color-accent-orange)]" />
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="w-3 h-3 rounded-full bg-[var(--color-accent-green)]" />
              <span className="w-3 h-3 rounded-full bg-foreground" />
              <span className="text-xs font-medium text-foreground ml-1">5 colors</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}