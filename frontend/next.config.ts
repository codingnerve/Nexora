import type { NextConfig } from "next";

/**
 * Canonical URLs, Open Graph URLs, the sitemap and robots.txt are all built
 * from NEXT_PUBLIC_SITE_URL, and NEXT_PUBLIC_* values are inlined at build
 * time. A production build without it would ship localhost everywhere, so say
 * so loudly. (A warning rather than a hard failure, so local production builds
 * still work.)
 */
if (process.env.NODE_ENV === "production") {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const isLocal = (url: string) => !url || /localhost|127\.0\.0\.1/.test(url);

  if (isLocal(siteUrl)) {
    console.warn(
      "\n⚠  NEXT_PUBLIC_SITE_URL is unset or points at localhost. Canonical URLs, " +
        "Open Graph tags and the sitemap will be wrong in this build.\n"
    );
  }
  if (isLocal(apiUrl)) {
    console.warn(
      "⚠  NEXT_PUBLIC_API_URL is unset or points at localhost. Forms will not " +
        "reach a production API from this build.\n"
    );
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Never leak a stack trace or framework version to the browser.
  poweredByHeader: false,

  images: {
    /**
     * Editorial photography is currently served from Unsplash as documented
     * placeholders (see README > Photography). Replace these patterns with the
     * brand's own image host — or drop files into `public/images` and use local
     * paths — once licensed assets are available.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    // AVIF first for a photography-heavy site, WebP as the fallback.
    formats: ["image/avif", "image/webp"],
    // Next.js 16 narrows `qualities` to [75] by default; declare the steps used.
    qualities: [60, 75, 85],
  },

  async redirects() {
    return [
      // The Goa guide was replaced by the Maldives; keep old links working.
      {
        source: "/destinations/goa",
        destination: "/destinations/maldives",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // The site is never meant to be framed; blocks clickjacking.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
