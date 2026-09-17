import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { ContentPage } from "@/components/sections/ContentPage";
import { JsonLd } from "@/components/shared/JsonLd";
import { FAQ_ENTRIES } from "@/data/pages";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "How Nexora Destination works: sending a travel request, what happens next, why there are no online payments, and how bookings are arranged by our specialists.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <PageShell>
      <JsonLd data={faqSchema(FAQ_ENTRIES)} />
      <ContentPage
        eyebrow="FAQ"
        title="Questions, answered plainly."
        lede="How requests work, what happens after you send one, and what this website does and does not do."
      >
        <dl>
          {FAQ_ENTRIES.map((entry) => (
            <div key={entry.question} className="border-t border-line py-7 first:border-t-0 first:pt-0">
              <dt className="font-display text-display-sm text-ink-900">{entry.question}</dt>
              <dd className="mt-3 text-body-md text-foreground-muted">{entry.answer}</dd>
            </div>
          ))}
        </dl>
      </ContentPage>
    </PageShell>
  );
}
