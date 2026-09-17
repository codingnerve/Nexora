import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { ContentPage } from "@/components/sections/ContentPage";
import { CANCELLATION_BLOCKS } from "@/data/pages";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cancellation & Refund Policy",
  description:
    "Cancellation and refund eligibility depends on the service booked and the applicable travel provider’s terms. Learn about flight, hotel, and car rental cancellation rules.",
  path: "/cancellation-policy",
});

export default function CancellationPolicyPage() {
  return (
    <PageShell>
      <ContentPage
        eyebrow="Legal & Policies"
        title="Cancellation & Refund Policy"
        lede="We understand that travel plans can change. Cancellation and refund eligibility depends on the service booked and the applicable travel provider’s terms."
        blocks={CANCELLATION_BLOCKS}
      />
    </PageShell>
  );
}
