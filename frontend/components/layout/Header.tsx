"use client";

import { Menu, Phone } from "lucide-react";
import { useState } from "react";

import { MobileNav } from "@/components/navigation/MobileNav";
import { NavLink } from "@/components/navigation/NavLink";
import { Wordmark } from "@/components/shared/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useScrolled } from "@/hooks/useScrolled";
import {
  CONTACT,
  IS_TOLL_FREE_CONFIGURED,
  PRIMARY_NAV,
  toTelHref,
} from "@/lib/constants";
import { cn } from "@/utils/cn";

/**
 * Site header.
 *
 * Solid, near-white and always readable — no transparent-over-photo mode. The
 * navigation sits in the centre, with the primary "Plan My Trip" action on
 * the right. On scroll it tightens slightly and gains a soft shadow.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(12);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[var(--z-header)] w-full border-b bg-white/95 backdrop-blur-sm",
          "transition-[box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "border-sand-300 shadow-subtle" : "border-transparent"
        )}
      >
        <Container
          className={cn(
            "flex items-center justify-between gap-6",
            "transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled ? "h-16" : "h-16 lg:h-[4.5rem]"
          )}
        >
          <Wordmark />

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-8">
            {PRIMARY_NAV.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Always visible, including on phones, so there is a dial button
                with the number on the first screen. */}
            {IS_TOLL_FREE_CONFIGURED ? (
              <ButtonLink
                href={toTelHref(CONTACT.tollFree)}
                variant="primary"
                size="sm"
                iconLeft={<Phone />}
                aria-label={`Call toll-free: ${CONTACT.tollFree}`}
                className="nx-figures px-3 text-[0.8125rem] sm:px-4 sm:text-[0.875rem] [&_svg]:text-clay-400"
              >
                <span className="flex flex-col items-start leading-tight">
                  <span className="hidden text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-white/70 lg:block">
                    Customer Care
                  </span>
                  <span>{CONTACT.tollFree}</span>
                </span>
              </ButtonLink>
            ) : null}

            <ButtonLink
              href="/#plan-your-trip"
              variant="accent"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Plan My Trip
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className={cn(
                "-mr-2 flex size-11 items-center justify-center rounded-[10px] text-ink-900 lg:hidden",
                "transition-colors duration-200 hover:bg-canvas-200"
              )}
            >
              <Menu aria-hidden="true" className="size-6" strokeWidth={1.75} />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </Container>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
