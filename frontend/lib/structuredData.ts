import { ADDRESS_LINES, ADDRESS_STRUCTURED, CONTACT, SITE } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

/**
 * Structured data (schema.org JSON-LD).
 *
 * Only facts the site can stand behind are emitted: the business name, its URL,
 * what it does, and contact details *when configured*. There is no rating,
 * review, offer, price or address anywhere here — none exist, and inventing
 * them would violate both the brand rules and Google's structured data policy.
 */

type JsonLd = Record<string, unknown>;

/** Stable node identifiers, so WebSite can reference the Organization. */
const ORG_ID = `${absoluteUrl("/")}/#organization`;
const SITE_ID = `${absoluteUrl("/")}/#website`;

/** The business itself. `TravelAgency` is a subtype of LocalBusiness. */
export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SITE.description,
    ...(CONTACT.email ? { email: CONTACT.email } : {}),
    ...(CONTACT.tollFree
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: CONTACT.tollFree,
            contactType: "customer service",
          },
        }
      : {}),
    // Structured parts describe the built-in address; if the address was
    // overridden by env, fall back to the plain string so the two never differ.
    address:
      CONTACT.address === ADDRESS_LINES.join(", ")
        ? { "@type": "PostalAddress", ...ADDRESS_STRUCTURED }
        : CONTACT.address,
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE.name,
    url: absoluteUrl("/"),
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(
  items: readonly { name: string; path: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(
  entries: readonly { question: string; answer: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}
