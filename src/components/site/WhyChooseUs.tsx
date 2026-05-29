import { Layers, Palette, Truck, ShieldCheck } from "lucide-react";

const FEATURES = [
  { icon: Layers, title: "Maker-grade quality", desc: "Calibrated printers, tuned profiles, clean finishing on every order." },
  { icon: Palette, title: "Any color you want", desc: "Pick from our material library or request a custom match." },
  { icon: Truck, title: "Fast turnaround", desc: "Most orders ship within 48 hours of confirmation." },
  { icon: ShieldCheck, title: "Reprint guarantee", desc: "Not happy? We reprint it. No questions, no friction." },
];

export function WhyChooseUs() {
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-4 sm:px-10 py-20 sm:py-28">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-sm font-medium text-primary mb-2">Why us</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built by makers, for makers</h2>
        <p className="text-muted-foreground mt-4">A small workshop obsessed with print quality, color and the little details that turn a print into a product.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-card rounded-3xl p-7 shadow-card hover:shadow-float hover:-translate-y-1 transition-smooth">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-5">
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}