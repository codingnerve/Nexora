import { Mail, Phone } from "lucide-react";
import Link from "next/link";

import { Wordmark } from "@/components/shared/Wordmark";
import { Container } from "@/components/ui/Container";
import {
  CONTACT,
  DISCLOSURE,
  FOOTER_NAV,
  IS_TOLL_FREE_CONFIGURED,
  SITE,
  toTelHref,
  type NavLink,
} from "@/lib/constants";
import { cn } from "@/utils/cn";

/**
 * Site footer.
 *
 * Ordered as requested:
 *   - Brand: Nexora Destinations / Your Journey, Our Destination.
 *   - Quick Links (About Us, Flight Booking, Hotel Booking, Car Rental, Travel Packages, Contact Us)
 *   - Legal (Terms & Conditions, Privacy Policy, Booking Policy, Cancellation & Refund Policy)
 *   - Support (Email, Phone)
 */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly NavLink[];
}) {
  return (
    <div>
      <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-amber-400">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => {
          const className = cn(
            "inline-flex min-h-11 items-center lg:min-h-0",
            "text-body-sm text-white/75 nx-focus-dark",
            "transition-colors duration-200 hover:text-white"
          );

          return (
            <li key={link.label}>
              {link.href.startsWith("tel:") ? (
                <a href={link.href} className={className}>
                  {link.label}
                </a>
              ) : (
                <Link href={link.href} className={className}>
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  // Contact details come only from configuration. An unset email is omitted and
  // an unset phone number becomes a link to the contact page — never a
  // placeholder a visitor might actually try to use.
  const supportEmail = CONTACT.email;
  const supportPhone = IS_TOLL_FREE_CONFIGURED
    ? CONTACT.tollFree
    : "Send us a message";
  const phoneHref = IS_TOLL_FREE_CONFIGURED
    ? toTelHref(CONTACT.tollFree)
    : "/contact";

  return (
    <footer className="bg-ink-900 text-white">
      <Container>
        <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-[1.3fr_2.4fr] lg:gap-16">
          {/* --- Brand Column -------------------------------------------- */}
          <div className="flex flex-col items-start">
            <Wordmark href="/" onDark size="lg" />
            <p className="mt-3 font-display text-[1.125rem] font-bold tracking-tight text-amber-400 sm:text-[1.25rem]">
              Your Journey, Our Destination.
            </p>
            <p className="mt-3 max-w-sm text-body-sm leading-relaxed text-white/70">
              Your travel partner for convenient and reliable travel
              arrangements. Flights, hotels, car rentals, and customized travel
              packages in one place.
            </p>
          </div>

          {/* --- Navigation Columns (Quick Links, Legal, Support) --------- */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            {/* Quick Links */}
            <FooterColumn
              title="Quick Links"
              links={FOOTER_NAV.quickLinks}
            />

            {/* Legal */}
            <FooterColumn title="Legal" links={FOOTER_NAV.legal} />

            {/* Support */}
            <div>
              <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-amber-400">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                {supportEmail ? (
                <li>
                  <a
                    href={`mailto:${supportEmail}`}
                    className="group inline-flex items-start gap-3 text-body-sm text-white/75 transition-colors duration-200 hover:text-white"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-clay-400/30 bg-clay-500/15 text-clay-400 transition-colors group-hover:border-clay-400/60"
                    >
                      <Mail className="size-4" strokeWidth={1.75} />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                        Email
                      </span>
                      <span className="break-all font-medium text-white transition-colors group-hover:text-amber-400">
                        {supportEmail}
                      </span>
                    </span>
                  </a>
                </li>
                ) : null}

                <li>
                  <a
                    href={phoneHref}
                    className="group inline-flex items-start gap-3 text-body-sm text-white/75 transition-colors duration-200 hover:text-white"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-clay-400/30 bg-clay-500/15 text-clay-400 transition-colors group-hover:border-clay-400/60"
                    >
                      <Phone className="size-4" strokeWidth={1.75} />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                        {IS_TOLL_FREE_CONFIGURED ? "Phone" : "Contact"}
                      </span>
                      <span className="nx-figures font-medium text-white transition-colors group-hover:text-amber-400">
                        {supportPhone}
                      </span>
                    </span>
                  </a>
                </li>

                {CONTACT.hours ? (
                  <li className="pt-1 text-caption text-white/55">
                    {CONTACT.hours}
                  </li>
                ) : (
                  <li className="pt-1 text-caption text-white/55">
                    Available for travel inquiries and booking assistance.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* --- Bottom Bar: Copyright & Disclosure ------------------------- */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-7 text-caption text-white/60 md:flex-row md:items-start md:justify-between md:gap-10">
          <p className="md:shrink-0">
            &copy; {year} {SITE.name}. All rights reserved.
          </p>
          <p className="max-w-2xl md:text-right">
            {DISCLOSURE.assistance} {DISCLOSURE.process}
          </p>
        </div>
      </Container>
    </footer>
  );
}

