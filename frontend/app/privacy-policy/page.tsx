import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { ContentPage } from "@/components/sections/ContentPage";
import { PRIVACY_BLOCKS } from "@/data/pages";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Nexora Destinations respects your privacy and is committed to protecting the information you provide when using our website and services.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <ContentPage
        eyebrow="Legal & Policies"
        title="Privacy Policy"
        lede="Nexora Destinations respects your privacy and is committed to protecting the information you provide when using our website and services."
        blocks={PRIVACY_BLOCKS}
      />
    </PageShell>
  );
}
