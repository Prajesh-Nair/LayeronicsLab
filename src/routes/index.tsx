import { createFileRoute } from "@tanstack/react-router";
import { BRAND_DESCRIPTION, pageTitle } from "@/lib/brand";
import { SiteShell } from "@/components/site/SiteShell";
import { Hero } from "@/components/site/Hero";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { CategoryCatalog } from "@/components/site/CategoryCatalog";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { CTASection } from "@/components/site/CTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: pageTitle() },
      { name: "description", content: BRAND_DESCRIPTION },
      { property: "og:title", content: pageTitle() },
      { property: "og:description", content: BRAND_DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteShell>
      <Hero />
      <FeaturedProducts />
      <CategoryCatalog />
      <WhyChooseUs />
      <CTASection />
    </SiteShell>
  );
}
