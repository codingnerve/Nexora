import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * The raised request surface.
 *
 * Shared with `<InquiryPanel>` so the tabbed homepage panel and the single
 * forms on the service pages sit on an identical surface — same border, same
 * radius, same shadow. Defined once here rather than repeated as class strings.
 */
export const PANEL_SURFACE =
  "overflow-hidden rounded-[16px] border border-sand-300 bg-canvas-50 shadow-panel";

/**
 * A single inquiry form on its own card, for the service pages where the
 * service is already chosen and tabs would be redundant.
 */
export function InquiryCard({
  id = "plan-your-trip",
  title,
  lede,
  children,
  className,
}: {
  id?: string;
  title: string;
  lede: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div id={id} className={cn("mx-auto max-w-5xl scroll-mt-24", PANEL_SURFACE, className)}>
      <div className="p-5 sm:p-7 lg:p-8">
        <div className="mb-7">
          <h2 className="font-display text-display-sm text-ink-900">{title}</h2>
          <p className="mt-2 max-w-lg text-body-sm text-foreground-muted">{lede}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
