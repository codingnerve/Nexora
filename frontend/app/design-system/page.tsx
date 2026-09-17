import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DesignSystemShowcase } from "./Showcase";

/**
 * Internal component reference.
 *
 * Not linked from anywhere in the site and excluded from indexing — it exists
 * so the design system can be inspected in one place at every breakpoint.
 */
export const metadata: Metadata = {
  title: "Design system",
  description: "Internal component reference for Nexora Destination.",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  // Internal tooling only. Its example phone numbers and demo states must never
  // be reachable on the public site, so production builds 404 this route unless
  // it is explicitly enabled.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ENABLE_DESIGN_SYSTEM !== "true"
  ) {
    notFound();
  }

  return <DesignSystemShowcase />;
}
