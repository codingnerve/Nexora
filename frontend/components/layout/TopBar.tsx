import { Phone } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { CONTACT, IS_TOLL_FREE_CONFIGURED, toTelHref } from "@/lib/constants";

/**
 * Slim announcement strip above the header.
 *
 * Left: what the service is. Right: support hours when
 * `NEXT_PUBLIC_SUPPORT_HOURS` is set (never invented), plus a call button with
 * the toll-free number. On phones only the message shows — the sticky header
 * below carries the call button there. It is a normal block, not sticky: it
 * scrolls away and the main header stays pinned on its own.
 */
export function TopBar() {
  const hours = CONTACT.hours;

  return (
    <div className="bg-ink-900 text-white">
      <Container className="flex min-h-10 items-center justify-center gap-6 py-1.5 sm:justify-between">
        <p className="flex items-center gap-2.5 text-[0.75rem] font-semibold leading-tight sm:text-[0.8125rem]">
          <span aria-hidden="true" className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          <span>
            <span className="font-bold">Customer Care</span>
            <span className="text-white/60"> · </span>
            <span className="hidden sm:inline">
              Contact us for flight, hotel &amp; cab enquiries
            </span>
            <span className="sm:hidden">Contact us for any enquiry</span>
          </span>
        </p>

        <div className="hidden items-center gap-4 sm:flex">
          {hours ? (
            <p className="text-[0.8125rem] font-medium text-white/85">
              Support Hours: {hours}
            </p>
          ) : null}

          {IS_TOLL_FREE_CONFIGURED ? (
            <a
              href={toTelHref(CONTACT.tollFree)}
              aria-label={`Call toll-free: ${CONTACT.tollFree}`}
              className="nx-focus-dark nx-figures inline-flex h-7 items-center gap-2 rounded-[8px] border border-white/35 px-3 text-[0.8125rem] font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
            >
              <Phone aria-hidden="true" className="size-3.5 text-clay-400" strokeWidth={2} />
              Call to enquire: {CONTACT.tollFree}
            </a>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
