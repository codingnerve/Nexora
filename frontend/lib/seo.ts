import type { Metadata } from "next";

import { SITE } from "@/lib/constants";

/**
 * Builds a page's metadata with a canonical URL and Open Graph tags derived
 * from its path, so no page has to repeat the boilerplate.
 *
 * Canonical and OG URLs are relative; the root layout's `metadataBase`
 * (from NEXT_PUBLIC_SITE_URL) turns them into absolute production URLs.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  /** Page title without the brand; the root layout template appends it. */
  title: string;
  description: string;
  /** Route path beginning with a slash, e.g. "/flights". */
  path: string;
  /** Absolute or root-relative OG image URL. */
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = path === "/" ? "/" : path.replace(/\/$/, "");

  // The <title> template adds the brand, but Open Graph and Twitter titles do
  // not go through it — so add it here, unless the title already carries it.
  const socialTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: socialTitle,
      description,
      url: canonical,
      locale: "en_US",
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Absolute URL on the configured production origin. */
export const absoluteUrl = (path: string): string =>
  `${SITE.url}${path === "/" ? "" : path}`;
