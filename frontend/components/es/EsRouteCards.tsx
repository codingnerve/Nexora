"use client";

import { ArrowRight, Plane } from "lucide-react";

import { ES_PREFILL_EVENT, type EsPrefillDetail } from "@/components/es/EsFlightForm";
import type { EsRoute } from "@/data/esFlights";

/**
 * Example routes, drawn as boarding passes.
 *
 * Tapping one fills the origin and destination in the request form and scrolls
 * to it. No fares, times or availability are shown — these are starting points,
 * not offers.
 */
export function EsRouteCards({ routes }: { routes: readonly EsRoute[] }) {
  const pick = (route: EsRoute) => {
    const detail: EsPrefillDetail = {
      from: `${route.fromCity} (${route.fromCode})`,
      to: `${route.toCity} (${route.toCode})`,
    };
    window.dispatchEvent(new CustomEvent(ES_PREFILL_EVENT, { detail }));
    document.getElementById("solicitar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {routes.map((route) => (
        <li key={`${route.fromCode}-${route.toCode}`}>
          <button
            type="button"
            onClick={() => pick(route)}
            aria-label={`Solicitar vuelo de ${route.fromCity} a ${route.toCity}`}
            className="nx-focus group relative flex w-full overflow-hidden rounded-[16px] border border-sand-300 bg-white text-left shadow-subtle transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-clay-500/60 hover:shadow-raised motion-reduce:hover:translate-y-0"
          >
            {/* Main ticket body */}
            <span className="flex-1 p-5 sm:p-6">
              <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-clay-700">
                Ruta popular
              </span>

              <span className="mt-4 flex items-center gap-3">
                <span className="nx-figures font-display text-[1.875rem] font-extrabold leading-none tracking-[-0.02em] text-ink-900">
                  {route.fromCode}
                </span>
                <span aria-hidden="true" className="flex flex-1 items-center gap-1.5 text-clay-600">
                  <span className="h-px flex-1 border-t border-dashed border-stone-400" />
                  <Plane className="size-4 shrink-0" strokeWidth={2} />
                  <span className="h-px flex-1 border-t border-dashed border-stone-400" />
                </span>
                <span className="nx-figures font-display text-[1.875rem] font-extrabold leading-none tracking-[-0.02em] text-ink-900">
                  {route.toCode}
                </span>
              </span>

              <span className="mt-4 flex items-center justify-between gap-3 text-body-sm text-foreground-muted">
                <span>{route.fromCity}</span>
                <span>{route.toCity}</span>
              </span>
            </span>

            {/* Perforation + stub */}
            <span
              aria-hidden="true"
              className="relative flex w-16 shrink-0 flex-col items-center justify-center gap-1 border-l-2 border-dashed border-sand-400 bg-canvas-200 transition-colors duration-200 group-hover:bg-clay-500/10"
            >
              <span className="absolute -left-[0.6875rem] -top-3 size-5 rounded-full border border-sand-300 bg-background" />
              <span className="absolute -bottom-3 -left-[0.6875rem] size-5 rounded-full border border-sand-300 bg-background" />
              <ArrowRight
                className="size-5 text-ink-900 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
                strokeWidth={2.25}
              />
              <span className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-stone-600">
                Pedir
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
