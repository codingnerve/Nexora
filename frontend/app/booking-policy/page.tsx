import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { ContentPage } from "@/components/sections/ContentPage";
import { BOOKING_POLICY_BLOCKS } from "@/data/pages";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Booking Policy",
  description:
    "At Nexora Destinations, we aim to make the travel booking process simple and transparent. Review our booking terms, availability, and confirmation guidelines.",
  path: "/booking-policy",
});

export default function BookingPolicyPage() {
  return (
    <PageShell>
      <ContentPage
        eyebrow="Legal & Policies"
        title="Booking Policy"
        lede="At Nexora Destinations, we aim to make the travel booking process simple and transparent."
        blocks={BOOKING_POLICY_BLOCKS}
      />
    </PageShell>
  );
}
