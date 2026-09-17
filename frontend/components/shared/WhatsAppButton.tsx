"use client";

import { useScrolled } from "@/hooks/useScrolled";
import {
  CONTACT,
  IS_TOLL_FREE_CONFIGURED,
  IS_WHATSAPP_CONFIGURED,
  SITE,
  toWhatsAppHref,
} from "@/lib/constants";
import { cn } from "@/utils/cn";

/**
 * Mobile-only floating WhatsApp button.
 *
 * Sits bottom-right below `lg`, matching the call bar's breakpoint. When the
 * call bar slides in (toll-free configured and the visitor has scrolled past
 * the first screen), the button lifts above it rather than covering it.
 *
 * Until a number is configured there is no chat to open, so the button links to
 * the contact page instead — no fallback number is ever invented.
 */

const GREETING = `Hi ${SITE.name}, I'd like help planning a trip.`;

export function WhatsAppButton() {
  // Same threshold as MobileCallBar, so the two move together.
  const callBarVisible = useScrolled(560) && IS_TOLL_FREE_CONFIGURED;

  const linkProps = IS_WHATSAPP_CONFIGURED
    ? {
        href: toWhatsAppHref(CONTACT.whatsapp, GREETING),
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": "Chat with us on WhatsApp (opens in a new tab)",
      }
    : { href: "/contact", "aria-label": "Contact us" };

  return (
    <a
      {...linkProps}
      className={cn(
        "fixed right-4 z-[var(--z-callbar)] grid size-14 place-items-center rounded-full lg:hidden",
        // WhatsApp's own brand green — the one colour here that is not a token.
        "bg-[#25D366] text-white shadow-panel ring-4 ring-white/70",
        "transition-[transform,bottom] duration-300 ease-brand active:scale-95",
        "focus-visible:outline-none focus-visible:ring-ink-900",
        callBarVisible
          ? "bottom-[calc(5.5rem+env(safe-area-inset-bottom))]"
          : "bottom-[max(1.25rem,env(safe-area-inset-bottom))]"
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="currentColor">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.9.99 6.68 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.2-4.24 9.43-9.45 9.43Zm8.04-17.47A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.09-1.6a11.33 11.33 0 0 0 5.37 1.37h.01c6.26 0 11.36-5.1 11.37-11.37 0-3.03-1.18-5.89-3.33-8.03Z" />
      </svg>
    </a>
  );
}
