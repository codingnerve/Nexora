import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

import { MotionProvider } from "@/components/shared/MotionProvider";
import { SITE } from "@/lib/constants";

import "./globals.css";

/**
 * The single typeface. Manrope is variable (200-800), so headings, UI and body
 * all come from one font file — no decorative display face.
 */
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Flights, Hotels & Cab Booking Assistance`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    url: "/",
    title: `${SITE.name} | Flights, Hotels & Cab Booking Assistance`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Flights, Hotels & Cab Booking Assistance`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/images/fevicon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/fevicon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/images/fevicon.png"],
  },
  formatDetection: { telephone: true, email: true, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafaf7",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={SITE.locale}
      className={manrope.variable}
    >
      <body className="min-h-dvh overflow-x-hidden bg-background text-foreground">
        {/* Scroll-reveal content starts hidden and is shown by JavaScript. If
            scripts never run, show it anyway rather than leave a blank page. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
