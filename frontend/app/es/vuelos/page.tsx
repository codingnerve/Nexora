import { Check, Globe2, Headphones, PlaneTakeoff, Plus, ShieldCheck, SlidersHorizontal, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { EsFlightForm } from "@/components/es/EsFlightForm";
import { EsRouteCards } from "@/components/es/EsRouteCards";
import { EsShell } from "@/components/es/EsShell";
import { PANEL_SURFACE } from "@/components/forms/InquiryCard";
import { Reveal } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import {
  ES_ASSIST_POINTS,
  ES_BENEFITS,
  ES_FAQS,
  ES_HERO_POINTS,
  ES_ROUTES,
  ES_STEPS,
} from "@/data/esFlights";
import { CONTACT, toTelHref } from "@/lib/constants";
import { FLIGHT_PHOTOS } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

/**
 * /es/vuelos — the Spanish flights landing page.
 *
 * A conversion-first page rather than the editorial /flights layout:
 *
 *   dark hero with the request form beside the pitch → benefits ribbon →
 *   three steps → boarding-pass route cards (tap to pre-fill the form) →
 *   personal-assistance split → two-column FAQ → dark call close.
 *
 * Same tokens, type and components as the rest of the site. Every phone number
 * is the dedicated flights line. Nothing here shows fares, schedules or
 * availability.
 */
export const metadata: Metadata = buildMetadata({
  title: "Vuelos en español: te ayudamos a encontrar tu viaje",
  description:
    "Cuéntanos tu ruta y tus fechas y un especialista te atiende en español con opciones de vuelo nacionales e internacionales. Sin pagos en línea.",
  path: "/es/vuelos",
  image: FLIGHT_PHOTOS.wing.src,
  locale: "es_US",
  languages: { "es-US": "/es/vuelos", "en-US": "/flights", "x-default": "/flights" },
});

const BENEFIT_ICONS = [Globe2, SlidersHorizontal, ShieldCheck, PlaneTakeoff] as const;
const PHONE = CONTACT.spanish;

export default function VuelosPage() {
  return (
    <EsShell>
      {/* --- Hero: pitch beside the form ----------------------------------- */}
      <section aria-labelledby="es-hero-heading" className="relative isolate overflow-hidden bg-ink-900">
        <Image
          src={FLIGHT_PHOTOS.wing.src}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          className="-z-10 object-cover object-center opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-ink-950/90 via-ink-900/70 to-ink-900/40"
        />

        <Container>
          <div className="grid items-start gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:gap-14 lg:py-20">
            <div className="lg:col-span-6 lg:pt-6">
              <Eyebrow onDark>Vuelos en español</Eyebrow>

              <h1
                id="es-hero-heading"
                className="mt-4 font-display text-display-xl text-white lg:text-display-2xl"
              >
                Tu vuelo, en español y con una persona real.
              </h1>

              <p className="mt-5 max-w-xl text-body-lg text-white/80">
                Cuéntanos a dónde quieres ir y un especialista de Nexora te
                ayuda a encontrar las mejores opciones, sin pagar nada por
                pedirlas.
              </p>

              <ul className="mt-8 space-y-3">
                {ES_HERO_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-body-md text-white/90">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-clay-500 text-ink-900">
                      <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-4 border-t border-white/20 pt-8 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href={toTelHref(PHONE)}
                  aria-label={`Llámanos al ${PHONE}`}
                  className="group nx-focus-dark inline-flex items-center gap-4"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-clay-500 text-ink-900 transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none"
                  >
                    <Phone className="size-5" strokeWidth={2} />
                  </span>
                  <span>
                    <span className="block text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white/65">
                      ¿Prefieres llamar?
                    </span>
                    <span className="nx-figures block font-display text-[1.5rem] font-extrabold tracking-[-0.01em] text-white">
                      {PHONE}
                    </span>
                  </span>
                </a>
              </div>
            </div>

            {/* Form card */}
            <div className="lg:col-span-6">
              <div id="solicitar" className={`scroll-mt-28 bg-canvas-50 ${PANEL_SURFACE}`}>
                <div className="p-5 sm:p-7">
                  <div className="mb-6">
                    <h2 className="font-display text-display-sm text-ink-900">
                      Pide opciones de vuelo
                    </h2>
                    <p className="mt-2 text-body-sm text-foreground-muted">
                      Dos pasos cortos. Un especialista te contacta; no se
                      reserva ni se cobra nada.
                    </p>
                  </div>
                  <EsFlightForm />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --- Benefits ribbon ---------------------------------------------- */}
      <section aria-label="Por qué pedir tu vuelo con Nexora" className="border-b border-line bg-white">
        <Container>
          <ul className="grid divide-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4 [&>li]:border-b [&>li]:border-line lg:[&>li]:border-b-0">
            {ES_BENEFITS.map((benefit, index) => {
              const Icon = BENEFIT_ICONS[index] ?? Headphones;
              return (
                <li key={benefit.title} className="flex gap-4 px-2 py-7 sm:px-7">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-clay-600/25 bg-clay-600/[0.07] text-clay-700"
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-body-md font-bold tracking-[-0.01em] text-ink-900">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-body-sm text-foreground-muted">{benefit.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* --- How it works ------------------------------------------------- */}
      <Section id="como-funciona" tone="canvas" space="lg" className="scroll-mt-20">
        <Reveal>
          <SectionHeading
            eyebrow="Cómo funciona"
            title="Pedir tu vuelo es fácil."
            lede="Tres pasos, sin pagos en línea y sin letra pequeña."
            align="center"
            size="lg"
          />
        </Reveal>

        <Reveal delay={0.06}>
          <ol className="relative mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
            {/* Connector line behind the numbers, desktop only */}
            <span
              aria-hidden="true"
              className="absolute left-[16.66%] right-[16.66%] top-7 hidden border-t-2 border-dashed border-sand-400 md:block"
            />
            {ES_STEPS.map((step, index) => (
              <li key={step.title} className="relative text-center">
                <span
                  aria-hidden="true"
                  className="nx-figures relative mx-auto flex size-14 items-center justify-center rounded-full border-4 border-background bg-ink-900 font-display text-[1.375rem] font-extrabold text-white shadow-raised"
                >
                  {index + 1}
                </span>
                <h3 className="mt-5 font-display text-display-sm text-ink-900">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-body-md text-foreground-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* --- Routes ------------------------------------------------------- */}
      <Section id="rutas" tone="muted" space="lg" className="scroll-mt-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Rutas populares"
              title="¿A dónde quieres volar?"
              lede="Toca una ruta y la ponemos en el formulario. No mostramos tarifas: un especialista busca las opciones por ti."
              size="lg"
            />
          </Reveal>
          <ButtonLink href="#solicitar" variant="primary" size="md" className="shrink-0 self-start md:self-auto">
            Otra ruta
          </ButtonLink>
        </div>

        <Reveal delay={0.06} className="mt-10">
          <EsRouteCards routes={ES_ROUTES} />
        </Reveal>
      </Section>

      {/* --- Personal assistance ------------------------------------------ */}
      <Section tone="canvas" space="lg">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-sand-200">
                <Image
                  src={FLIGHT_PHOTOS.lounge.src}
                  alt="Un viajero descansa en la sala de espera de un aeropuerto, con los pies sobre su maleta, mientras un avión despega junto a la ventana."
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 right-4 rounded-[16px] bg-ink-900 px-5 py-4 text-white shadow-panel sm:-right-5">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-amber-400">
                  Atención personal
                </p>
                <p className="mt-1 font-display text-[1.125rem] font-bold">En español, siempre</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.06}>
            <SectionHeading
              eyebrow="Atención personal"
              title="¿Por qué preguntar a una persona y no buscar solo?"
              size="lg"
            />
            <div className="mt-6 space-y-4 text-body-lg text-foreground-muted">
              <p>
                Los buscadores son buenos para listar vuelos. Pero no saben que
                prefieres salir más tarde, que la escala debe ser cómoda con
                niños o que tus fechas pueden moverse.
              </p>
              <p>
                Cuando envías tu solicitud, un especialista la lee, busca
                opciones que encajen y las habla contigo. Tú decides; la
                reserva se hace solo cuando la confirmas.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {ES_ASSIST_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-body-md font-medium text-ink-900">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-clay-700">
                    <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#solicitar" variant="accent" size="lg" fullWidthOnMobile>
                Solicitar opciones
              </ButtonLink>
              <ButtonLink
                href={toTelHref(PHONE)}
                variant="phone"
                size="lg"
                iconLeft={<Phone />}
                fullWidthOnMobile
                aria-label={`Llamar al ${PHONE}`}
              >
                {PHONE}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --- FAQ ---------------------------------------------------------- */}
      <Section id="preguntas" tone="sand" space="lg" className="scroll-mt-20">
        <Reveal>
          <SectionHeading
            eyebrow="Preguntas frecuentes"
            title="Lo que conviene saber antes de pedir."
            align="center"
            size="lg"
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-12">
          <div className="grid items-start gap-4 lg:grid-cols-2">
            {ES_FAQS.map((item) => (
              <details
                key={item.question}
                className="group/item overflow-hidden rounded-[16px] border border-line bg-surface"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-left transition-colors duration-200 hover:bg-canvas-100 sm:px-6 [&::-webkit-details-marker]:hidden">
                  <span className="text-body-md font-semibold tracking-[-0.01em] text-ink-900">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-clay-500/10 text-clay-700 transition-transform duration-300 group-open/item:rotate-45 motion-reduce:transition-none"
                  >
                    <Plus className="size-4" strokeWidth={2.5} />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-body-md text-foreground-muted sm:px-6">{item.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* --- Closing call band -------------------------------------------- */}
      <section className="relative isolate overflow-hidden bg-ink-900">
        <Image
          src={FLIGHT_PHOTOS.gateDusk.src}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-30"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/85 via-ink-950/60 to-ink-900/30"
        />
        <Container>
          <Reveal>
            <div className="flex flex-col gap-10 py-20 md:py-24 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-display text-display-lg text-white md:text-display-xl">
                  ¿Ya sabes a dónde quieres volar?
                </h2>
                <p className="mt-5 max-w-xl text-body-lg text-white/75">
                  Envía tu ruta y tus fechas, o llámanos. Un especialista te
                  atiende en español.
                </p>
              </div>

              <div className="shrink-0">
                <a
                  href={toTelHref(PHONE)}
                  aria-label={`Llámanos al ${PHONE}`}
                  className="nx-focus-dark nx-figures block font-display text-[2rem] font-extrabold tracking-[-0.02em] text-white transition-colors duration-200 hover:text-clay-400 sm:text-[2.5rem]"
                >
                  {PHONE}
                </a>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="#solicitar" variant="accent" size="lg" onDark fullWidthOnMobile>
                    Solicitar opciones
                  </ButtonLink>
                  <ButtonLink
                    href={toTelHref(PHONE)}
                    variant="secondary"
                    size="lg"
                    onDark
                    iconLeft={<Phone />}
                    fullWidthOnMobile
                  >
                    Llamar ahora
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </EsShell>
  );
}
