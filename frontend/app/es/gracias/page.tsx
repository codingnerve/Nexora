import { ArrowLeft, Check, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { EsShell } from "@/components/es/EsShell";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ES_DISCLOSURE } from "@/data/esFlights";
import { CONTACT, toTelHref } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

/**
 * /es/gracias — confirmation after a Spanish flight request.
 *
 * Mirrors /thank-you: the reference is the only query parameter, it is only
 * shown if it matches the format the backend issues, and the page is not
 * indexed.
 */
export const metadata: Metadata = buildMetadata({
  title: "Tu solicitud está en camino",
  description:
    "Recibimos los datos de tu viaje. Un especialista de Nexora Destinations te contactará pronto.",
  path: "/es/gracias",
  locale: "es_US",
  noIndex: true,
});

const REFERENCE_PATTERN = /^NEX-(?:FLT|HOT|CAB|GEN)-[2-9A-HJ-NP-TV-Z]{6}$/;

async function Confirmation({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const raw = typeof params.inquiry === "string" ? params.inquiry : "";
  const reference = REFERENCE_PATTERN.test(raw) ? raw : null;
  const phone = CONTACT.spanish;

  return (
    <Section tone="muted" space="lg">
      <div className="mx-auto max-w-2xl rounded-[20px] border border-sand-300 bg-white p-7 text-center shadow-panel sm:p-12">
        <span
          aria-hidden="true"
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-clay-500 text-ink-900"
        >
          <Check className="size-8" strokeWidth={2.75} />
        </span>

        <h1 className="mt-7 font-display text-display-md text-ink-900 md:text-display-lg">
          Tu solicitud está en camino.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-body-lg text-foreground-muted">
          Gracias: recibimos los datos de tu viaje. Un especialista de Nexora
          te contactará pronto, en español.
        </p>

        {reference ? (
          <>
            <dl className="mx-auto mt-8 max-w-sm rounded-[12px] border border-sand-300 bg-canvas-100 px-5 py-4">
              <dt className="text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-stone-600">
                Número de solicitud
              </dt>
              <dd className="nx-figures mt-1 text-[1.5rem] font-extrabold tracking-[0.02em] text-ink-900">
                {reference}
              </dd>
              <dd className="mt-1 text-body-sm text-foreground-muted">Solicitud de vuelo</dd>
            </dl>
            <p className="mt-4 text-body-sm text-foreground-muted">
              Menciona este número si nos contactas sobre tu solicitud.
            </p>
          </>
        ) : (
          <p className="mx-auto mt-8 max-w-md rounded-[12px] border border-sand-300 bg-canvas-100 p-4 text-body-sm text-foreground-muted">
            No encontramos un número de solicitud en esta página. Si llegaste
            directamente, no se ha enviado nada desde aquí.
          </p>
        )}

        <div className="mx-auto mt-8 max-w-md rounded-[16px] bg-ink-900 p-6 text-canvas-100">
          <p className="font-display text-display-sm">¿Necesitas una respuesta más rápida?</p>
          <p className="mt-2 text-body-sm text-white/80">
            Llámanos y un especialista te ayuda de inmediato.
          </p>
          <ButtonLink
            href={toTelHref(phone)}
            variant="accent"
            size="lg"
            iconLeft={<Phone />}
            fullWidthOnMobile
            className="mt-5"
            aria-label={`Llamar ahora al ${phone}`}
          >
            Llamar {phone}
          </ButtonLink>
        </div>

        <div className="mt-9 flex justify-center">
          <ButtonLink href="/es/vuelos" variant="primary" size="lg" iconLeft={<ArrowLeft />} fullWidthOnMobile>
            Volver a vuelos
          </ButtonLink>
        </div>

        <p className="mt-9 text-caption text-stone-600">{ES_DISCLOSURE.process}</p>
      </div>
    </Section>
  );
}

export default function GraciasPage({ searchParams }: PageProps<"/es/gracias">) {
  return (
    <EsShell>
      <Suspense fallback={<Section tone="muted" space="lg">{null}</Section>}>
        <Confirmation searchParams={searchParams} />
      </Suspense>
    </EsShell>
  );
}
