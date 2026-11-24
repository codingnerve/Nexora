import type { ReactNode } from "react";

import { EsFooter, EsHeader, EsTopBar } from "@/components/es/EsChrome";
import {
  MobileCallBar,
  MobileCallBarSpacer,
} from "@/components/shared/MobileCallBar";
import { CONTACT } from "@/lib/constants";

/**
 * The chrome around every Spanish page: skip link, top bar, header, main
 * landmark, footer and the mobile call bar — all Spanish, all on the dedicated
 * Spanish assistance line.
 *
 * The root layout sets `<html lang="en">` for the whole site, so this wrapper
 * declares `lang="es"` for everything inside it. Assistive tech then reads the
 * page with Spanish pronunciation.
 */
export function EsShell({ children }: { children: ReactNode }) {
  return (
    <div lang="es">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-modal)] focus:rounded-[10px] focus:bg-ink-900 focus:px-4 focus:py-3 focus:text-canvas-100"
      >
        Saltar al contenido
      </a>

      <EsTopBar />
      <EsHeader />

      <main id="main">
        {children}
        <MobileCallBarSpacer />
      </main>

      <EsFooter />
      <MobileCallBar phone={CONTACT.spanish} label="Llamar ahora" />
    </div>
  );
}
