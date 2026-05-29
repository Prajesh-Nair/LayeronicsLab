import { createFileRoute, Link } from "@tanstack/react-router";
import { pageTitle } from "@/lib/brand";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) ?? "",
  }),
  head: () => ({
    meta: [{ title: pageTitle("Order received") }],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { id } = Route.useSearch();
  return (
    <SiteShell>
      <div className="mx-auto max-w-xl px-4 sm:px-10 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--color-accent-green)]/15 grid place-items-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[var(--color-accent-green)]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Thank you!</h1>
        <p className="text-muted-foreground mt-3">
          Your order has been received. We'll contact you soon to confirm the details.
        </p>
        {id && (
          <div className="mt-6 inline-flex px-4 py-2 rounded-full bg-[var(--color-surface)] text-sm font-mono">
            Order ID: <span className="font-bold ml-2">{id}</span>
          </div>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/"><Button className="rounded-full h-12 px-7 font-semibold">Back to catalog</Button></Link>
        </div>
      </div>
    </SiteShell>
  );
}