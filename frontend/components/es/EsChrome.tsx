"use client";

import { Globe2, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/shared/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ES_DISCLOSURE, ES_FOOTER_LEGAL, ES_NAV } from "@/data/esFlights";
import { useScrolled } from "@/hooks/useScrolled";
import {
  ADDRESS_LINES,
  ADDRESS_MAP_HREF,
  CONTACT,
  SITE,
  toTelHref,
} from "@/lib/constants";
import { cn } from "@/utils/cn";

/**
 * Header, top bar and footer for the Spanish flights page.
 *
 * Deliberately lighter than the main site's chrome: this is a landing page, so
 * the header carries three on-page anchors, the phone number and one action —
 * not the full site menu. Everything shown here is Spanish and uses the
 * dedicated Spanish assistance line, `CONTACT.spanish`.
 */

const PHONE = CONTACT.spanish;

/* ---------------------------------------------------------------------------
 * Top bar
 * ------------------------------------------------------------------------- */

export function EsTopBar() {
  return (
    <div className="bg-ink-900 text-white">
      <Container className="flex min-h-10 items-center justify-center gap-6 py-1.5 sm:justify-between">
        <p className="flex items-center gap-2.5 text-[0.75rem] font-semibold leading-tight sm:text-[0.8125rem]">
          <span aria-hidden="true" className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          <span>
            <span className="font-bold">Atención en español</span>
            <span className="text-white/60"> · </span>
            <span className="hidden sm:inline">Vuelos nacionales e internacionales</span>
            <span className="sm:hidden">Vuelos para ti y tu familia</span>
          </span>
        </p>

        <a
          href={toTelHref(PHONE)}
          aria-label={`Llámanos al ${PHONE}`}
          className="nx-focus-dark nx-figures hidden h-7 items-center gap-2 rounded-[8px] border border-white/35 px-3 text-[0.8125rem] font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white/10 sm:inline-flex"
        >
          <Phone aria-hidden="true" className="size-3.5 text-clay-400" strokeWidth={2} />
          Llámanos: {PHONE}
        </a>
      </Container>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Header
 * ------------------------------------------------------------------------- */

export function EsHeader() {
  const scrolled = useScrolled(12);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-header)] w-full border-b bg-white/95 backdrop-blur-sm",
        "transition-[box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled ? "border-sand-300 shadow-subtle" : "border-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Wordmark href="/es/vuelos" />

        <nav aria-label="Secciones de la página" className="hidden items-center gap-8 md:flex">
          {ES_NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nx-focus inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-ink-800 transition-colors duration-200 hover:text-clay-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/flights"
            hrefLang="en"
            lang="en"
            className="nx-focus inline-flex min-h-11 items-center gap-1.5 rounded-[10px] px-2 text-[0.8125rem] font-semibold text-stone-600 transition-colors duration-200 hover:bg-canvas-200 hover:text-ink-900 sm:px-3"
          >
            <Globe2 aria-hidden="true" className="size-4" strokeWidth={1.75} />
            English
          </Link>

          <ButtonLink
            href={toTelHref(PHONE)}
            variant="primary"
            size="sm"
            iconLeft={<Phone />}
            aria-label={`Llamar al ${PHONE}`}
            className="nx-figures px-3 text-[0.8125rem] sm:px-4 sm:text-[0.875rem] [&_svg]:text-clay-400"
          >
            <span className="flex flex-col items-start leading-tight">
              <span className="hidden text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-white/70 lg:block">
                Llama ahora
              </span>
              <span>{PHONE}</span>
            </span>
          </ButtonLink>

          <ButtonLink
            href="#solicitar"
            variant="accent"
            size="sm"
            className="hidden lg:inline-flex"
          >
            Solicitar opciones
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}

/* ---------------------------------------------------------------------------
 * Footer
 * ------------------------------------------------------------------------- */

function ContactRow({
  icon,
  label,
  children,
  href,
  external = false,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex items-start gap-3 text-body-sm text-white/75 transition-colors duration-200 hover:text-white"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-white/20 bg-white/[0.06] text-clay-400 transition-colors group-hover:border-clay-400/60"
      >
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/50">
          {label}
        </span>
        <span className="font-medium text-white">{children}</span>
      </span>
    </a>
  );
}

export function EsFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-white">
      <Container>
        <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-10">
          {/* Brand + big phone number */}
          <div className="lg:col-span-5">
            <Wordmark href="/es/vuelos" onDark size="lg" />
            <p className="mt-5 font-display text-[1.25rem] font-bold tracking-tight text-amber-400">
              Tu viaje, nuestro destino.
            </p>
            <p className="mt-3 max-w-sm text-body-sm text-white/70">
              Te ayudamos con tus vuelos, en español y con una persona real al
              otro lado del teléfono.
            </p>

            <a
              href={toTelHref(PHONE)}
              aria-label={`Llámanos al ${PHONE}`}
              className="nx-focus-dark nx-figures mt-8 inline-flex items-center gap-3 rounded-[12px] border border-white/20 px-5 py-3.5 font-display text-[1.375rem] font-extrabold tracking-[-0.01em] text-white transition-colors duration-200 hover:border-clay-400 hover:bg-white/[0.04]"
            >
              <Phone aria-hidden="true" className="size-5 text-clay-400" strokeWidth={2} />
              {PHONE}
            </a>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white">
              Contacto
            </h3>
            <ul className="mt-5 space-y-5">
              <li>
                <ContactRow
                  icon={<Mail className="size-4" strokeWidth={1.75} />}
                  label="Correo"
                  href={`mailto:${CONTACT.email}`}
                >
                  <span className="break-all">{CONTACT.email}</span>
                </ContactRow>
              </li>
              <li>
                <ContactRow
                  icon={<MapPin className="size-4" strokeWidth={1.75} />}
                  label="Dirección"
                  href={ADDRESS_MAP_HREF}
                  external
                >
                  <address className="not-italic">
                    {ADDRESS_LINES.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </ContactRow>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-3">
            <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white">
              Información legal
            </h3>
            <ul className="mt-5 space-y-3">
              {ES_FOOTER_LEGAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    hrefLang="en"
                    className="nx-focus-dark inline-flex min-h-11 items-center text-body-sm font-medium text-white/75 transition-colors duration-200 hover:text-white lg:min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-caption text-white/50">
              Estos documentos están disponibles en inglés.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 py-7 text-caption text-white/55 md:flex-row md:items-start md:justify-between md:gap-10">
          <p className="md:shrink-0">
            &copy; {year} {SITE.name}. Todos los derechos reservados.
          </p>
          <p className="max-w-2xl md:text-right">
            {ES_DISCLOSURE.assistance} {ES_DISCLOSURE.process}
          </p>
        </div>
      </Container>
    </footer>
  );
}
