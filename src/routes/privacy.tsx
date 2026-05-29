import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import {
  BRAND_EMAIL,
  BRAND_LEGAL,
  BRAND_NAME,
  BRAND_OWNER,
  pageTitle,
} from "@/lib/brand";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: pageTitle("Privacy Policy") },
      {
        name: "description",
        content: `Privacy policy for ${BRAND_NAME} (${BRAND_LEGAL}). How we collect, use, and protect your information.`,
      },
    ],
  }),
  component: PrivacyPolicy,
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="text-sm sm:text-base text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

function PrivacyPolicy() {
  const updated = "May 29, 2026";

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 sm:px-10 py-12 sm:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <header className="mb-10">
          <p className="text-sm font-medium text-primary mb-2">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            {BRAND_LEGAL} ({BRAND_NAME}) · Last updated {updated}
          </p>
        </header>

        <div className="bg-card rounded-3xl border border-border shadow-card p-6 sm:p-10 space-y-10">
          <Section title="Overview">
            <p>
              This Privacy Policy explains how {BRAND_LEGAL}, operated by {BRAND_OWNER} (“we”, “us”, “our”),
              collects and uses information when you visit our website or place an order for custom 3D printed
              products.
            </p>
            <p>
              By using this site, you agree to this policy. If you do not agree, please do not use the website
              or submit orders through it.
            </p>
          </Section>

          <Section title="Information we collect">
            <p>We may collect the following information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Order details:</strong> name (if provided), email address,
                phone number, order notes, product selections, color choices, quantities, and order totals.
              </li>
              <li>
                <strong className="text-foreground">Communications:</strong> messages you send us by email or
                other channels when discussing custom prints, pricing, or delivery.
              </li>
              <li>
                <strong className="text-foreground">Technical data:</strong> basic usage information such as
                browser type, device type, and pages visited. Our hosting provider may also log IP addresses
                and request timestamps for security and reliability.
              </li>
              <li>
                <strong className="text-foreground">Local storage:</strong> your shopping cart and theme
                preference (light/dark) may be stored in your browser so the site works as expected.
              </li>
            </ul>
          </Section>

          <Section title="How we use your information">
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Contact you about order confirmation, production, shipping, or support</li>
              <li>Provide order status when you track an order using your email address</li>
              <li>Improve our products, website, and customer experience</li>
              <li>Protect against fraud, abuse, or unauthorized access</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </Section>

          <Section title="Payments">
            <p>
              At this time, checkout on our website does not process online card payments. After you place an
              order, we contact you directly to confirm pricing, customization, and payment arrangements.
              Any payment details you share with us outside this website (for example by message) are handled
              only as needed to complete your order.
            </p>
          </Section>

          <Section title="How we store and protect data">
            <p>
              Order and product data are stored on secure servers (cloud database hosting). We use reasonable
              technical and organizational measures to protect your information, including access controls for
              our admin area.
            </p>
            <p>
              No method of transmission or storage is 100% secure. While we work to protect your data, we
              cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="How long we keep data">
            <p>
              We keep order and contact information for as long as needed to fulfill orders, handle support,
              comply with legal obligations, and resolve disputes. You may ask us to delete your data where
              applicable law allows.
            </p>
          </Section>

          <Section title="Sharing with third parties">
            <p>We may share information only when necessary, for example with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Hosting and infrastructure providers that run this website and database</li>
              <li>Delivery or logistics partners when shipping your order</li>
              <li>Authorities if required by law or to protect our legal rights</li>
            </ul>
            <p>These providers are expected to handle data only for the services they provide to us.</p>
          </Section>

          <Section title="Your rights">
            <p>Depending on where you live, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Request access to the personal information we hold about you</li>
              <li>Ask us to correct inaccurate information</li>
              <li>Request deletion of your information, subject to legal and business requirements</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p>
              To make a request, contact us at{" "}
              <a href={`mailto:${BRAND_EMAIL}`} className="text-primary font-medium hover:underline">
                {BRAND_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="Cookies and browser storage">
            <p>
              We use browser local storage for essential features such as your cart contents and display
              theme. We do not use third-party advertising cookies on this site at this time.
            </p>
            <p>You can clear site data through your browser settings at any time.</p>
          </Section>

          <Section title="Children">
            <p>
              Our services are not directed to children under 13. We do not knowingly collect personal
              information from children. If you believe a child has provided us data, please contact us and
              we will delete it.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. The “Last updated” date at the top will
              change when we do. Continued use of the site after changes means you accept the updated policy.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              <strong className="text-foreground">{BRAND_LEGAL}</strong>
              <br />
              Operated by {BRAND_OWNER}
              <br />
              Email:{" "}
              <a href={`mailto:${BRAND_EMAIL}`} className="text-primary font-medium hover:underline">
                {BRAND_EMAIL}
              </a>
            </p>
          </Section>
        </div>
      </div>
    </SiteShell>
  );
}
