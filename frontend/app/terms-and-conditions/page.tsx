import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { ContentPage } from "@/components/sections/ContentPage";
import { TERMS_BLOCKS } from "@/data/pages";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "The terms for using the Nexora Destinations website. Review booking terms, supplier rules, user responsibilities, and cancellation conditions.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <PageShell>
      <ContentPage
        eyebrow="Legal & Policies"
        title="Terms & Conditions"
        lede="The terms for using the Nexora Destinations website, arranging travel services, and working with our travel specialists."
        blocks={TERMS_BLOCKS}
      />
    </PageShell>
  );
}
