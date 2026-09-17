import type { MetadataRoute } from "next";

import { DESTINATIONS } from "@/data/destinations";
import { absoluteUrl } from "@/lib/seo";

/**
 * /sitemap.xml
 *
 * Public, indexable pages only. Deliberately excluded:
 *   /thank-you      transactional, noindex
 *   /design-system  internal reference, not served in production
 *   /api/*          lives on the backend origin, never linked for crawling
 *
 * URLs are built from NEXT_PUBLIC_SITE_URL, so a production build must set it
 * or every entry will point at localhost.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/flights", priority: 0.9, changeFrequency: "monthly" },
    { path: "/hotels", priority: 0.9, changeFrequency: "monthly" },
    { path: "/cabs", priority: 0.9, changeFrequency: "monthly" },
    { path: "/destinations", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.6, changeFrequency: "yearly" },
    { path: "/booking-policy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/cancellation-policy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  ];

  const destinationRoutes = DESTINATIONS.map((destination) => ({
    path: `/destinations/${destination.slug}`,
    priority: 0.7,
    changeFrequency: "yearly" as const,
  }));

  return [...staticRoutes, ...destinationRoutes].map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
