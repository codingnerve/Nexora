import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
  MobileCallBar,
  MobileCallBarSpacer,
} from "@/components/shared/MobileCallBar";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

/**
 * The chrome every public page shares: skip link, header, main landmark,
 * footer and the mobile call bar.
 *
 * Extracted so a new page cannot accidentally ship without the skip link or
 * the call bar, and so the spacer that keeps the call bar off the page's last
 * element is never forgotten.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-modal)] focus:rounded-[10px] focus:bg-ink-900 focus:px-4 focus:py-3 focus:text-canvas-100"
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        {children}
        <MobileCallBarSpacer />
      </main>

      <Footer />
      <MobileCallBar />
      <WhatsAppButton />
    </>
  );
}
