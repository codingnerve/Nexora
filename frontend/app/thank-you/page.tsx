import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowLeft, Check, Phone } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { CONTACT, DISCLOSURE, IS_TOLL_FREE_CONFIGURED, toTelHref } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

/**
 * /thank-you
 *
 * Shown after a successful submission. The reference arrives as the only query
 * parameter — no name, email, phone or travel detail ever goes in the URL,
 * since URLs end up in history, logs and referrer headers.
 *
 * Not indexed: it is a transactional page with no standalone value in search.
 */
export const metadata: Metadata = buildMetadata({
  title: "Your request is on its way",
  description:
    "Thank you for contacting Nexora Destination. We've received your travel details and one of our specialists will contact you shortly.",
  path: "/thank-you",
  noIndex: true,
});

/** Reference format issued by the backend, e.g. NEX-FLT-7A92K1. */
const REFERENCE_PATTERN = /^NEX-(?:FLT|HOT|CAB|GEN)-[2-9A-HJ-NP-TV-Z]{6}$/;

const SERVICE_FOR_PREFIX: Record<string, string> = {
  FLT: "Flight request",
  HOT: "Hotel request",
  CAB: "Cab request",
  GEN: "General enquiry",
};

async function Confirmation({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const raw = typeof params.inquiry === "string" ? params.inquiry : "";

  // Only render a reference that matches the format the backend issues, so an
  // arbitrary string in the URL can never be echoed back onto the page.
  const reference = REFERENCE_PATTERN.test(raw) ? raw : null;
  const service = reference
    ? (SERVICE_FOR_PREFIX[reference.split("-")[1] ?? ""] ?? null)
    : null;

  return (
    <Section tone="muted" space="lg">
      <div className="mx-auto max-w-2xl rounded-[20px] border border-sand-300 bg-white p-7 text-center shadow-panel sm:p-12">
        <span
          aria-hidden="true"
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-clay-500 text-ink-900"
        >
          <Check className="size-8" strokeWidth={2.75} />
        </span>

        <h1 className="mt-7 font-display text-display-md text-ink-900 md:text-display-lg">
          Your request is on its way.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-body-lg text-foreground-muted">
          Thanks — we&rsquo;ve received your travel details. A Nexora specialist
          will contact you shortly.
        </p>

        {reference ? (
          <>
            <dl className="mx-auto mt-8 max-w-sm rounded-[12px] border border-sand-300 bg-canvas-100 px-5 py-4">
              <dt className="text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-stone-600">
                Inquiry ID
              </dt>
              <dd className="nx-figures mt-1 text-[1.5rem] font-extrabold tracking-[0.02em] text-ink-900">
                {reference}
              </dd>
              {service ? (
                <dd className="mt-1 text-body-sm text-foreground-muted">{service}</dd>
              ) : null}
            </dl>
            {/* Deliberately does not claim an email was sent — delivery depends
                on backend configuration the browser cannot see. */}
            <p className="mt-4 text-body-sm text-foreground-muted">
              Please quote this ID if you get in touch about your request.
            </p>
          </>
        ) : (
          // Reached directly, or with a malformed reference. Say so plainly
          // rather than inventing a reference.
          <p className="mx-auto mt-8 max-w-md rounded-[12px] border border-sand-300 bg-canvas-100 p-4 text-body-sm text-foreground-muted">
            We couldn&rsquo;t find a request ID on this page. If you reached it
            directly, nothing has been submitted from here.
          </p>
        )}

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/" variant="primary" size="lg" iconLeft={<ArrowLeft />} fullWidthOnMobile>
            Back to Homepage
          </ButtonLink>

          {IS_TOLL_FREE_CONFIGURED ? (
            <ButtonLink
              href={toTelHref(CONTACT.tollFree)}
              variant="phone"
              size="lg"
              iconLeft={<Phone />}
              fullWidthOnMobile
              aria-label={`Call toll-free: ${CONTACT.tollFree}`}
            >
              Call Toll-Free
            </ButtonLink>
          ) : null}
        </div>

        <p className="mt-9 text-caption text-stone-600">{DISCLOSURE.process}</p>
      </div>
    </Section>
  );
}

export default function ThankYouPage({
  searchParams,
}: PageProps<"/thank-you">) {
  return (
    <PageShell>
      {/* `searchParams` makes this route dynamic; the fallback keeps the shell
          visible while it resolves. */}
      <Suspense fallback={<Section tone="muted" space="lg">{null}</Section>}>
        <Confirmation searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}
