import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/**
 * /robots.txt
 *
 * Public pages are crawlable. The transactional confirmation page and the
 * internal design reference are disallowed (both are also `noindex`, and the
 * design reference is not served at all in production). The API lives on a
 * separate origin, so it needs no rule here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/thank-you", "/design-system"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
