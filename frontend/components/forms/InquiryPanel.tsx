"use client";

import { Car, Hotel, Plane } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/utils/cn";
import { PANEL_SURFACE } from "./InquiryCard";
import { CabForm } from "./CabForm";
import { FlightForm } from "./FlightForm";
import { HotelForm } from "./HotelForm";

/**
 * The travel request panel — the homepage's primary conversion surface.
 *
 * Deliberately *not* styled like an airline booking engine: no fare ladder, no
 * "search" button, no results grid. It is a request form, and the copy, the
 * step structure and the submit labels all say so.
 *
 * Implemented as a proper ARIA tab set so arrow keys move between services,
 * which is what a keyboard user expects from a tablist.
 */

type ServiceTab = "flights" | "hotels" | "cabs";

const TABS: {
  id: ServiceTab;
  label: string;
  icon: ReactNode;
  /** Deep-link hash that opens this tab, used by the service cards. */
  hash: string;
}[] = [
  { id: "flights", label: "Flights", icon: <Plane strokeWidth={1.75} />, hash: "#plan-flights" },
  { id: "hotels", label: "Hotels", icon: <Hotel strokeWidth={1.75} />, hash: "#plan-hotels" },
  { id: "cabs", label: "Cabs", icon: <Car strokeWidth={1.75} />, hash: "#plan-cabs" },
];

export function InquiryPanel() {
  const [active, setActive] = useState<ServiceTab>("flights");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /**
   * Service cards elsewhere on the page link to `#plan-flights` and friends.
   * Honour that on load and on subsequent hash changes.
   */
  useEffect(() => {
    const applyHash = () => {
      const match = TABS.find((tab) => tab.hash === window.location.hash);
      if (match) setActive(match.id);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  /** Left/right arrows move between tabs, per the ARIA tabs pattern. */
  const onTabKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      const last = TABS.length - 1;
      let next: number | null = null;

      if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
      else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = last;

      if (next === null) return;
      event.preventDefault();
      const target = TABS[next]!;
      setActive(target.id);
      tabRefs.current[target.id]?.focus();
    },
    []
  );

  return (
    <div
      id="plan-your-trip"
      className={cn(
        // `scroll-mt` keeps the panel clear of the sticky header when linked to.
        "scroll-mt-24",
        // Shared with the service pages so both surfaces stay identical.
        PANEL_SURFACE
      )}
    >
      {/* --- Tabs ---------------------------------------------------------- */}
      <div className="border-b border-sand-300 px-4 pt-4 sm:px-7 sm:pt-6 lg:px-8">
        <div
          role="tablist"
          aria-label="Choose what you need help with"
          className="flex gap-1 sm:gap-2"
        >
          {TABS.map((tab, index) => {
            const selected = tab.id === active;

            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[tab.id] = node;
                }}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 rounded-t-[10px] sm:flex-none",
                  "min-h-12 px-3 pb-4 pt-2 text-[0.9375rem] font-semibold sm:px-5",
                  "transition-colors duration-200",
                  selected ? "text-ink-900" : "text-stone-600 hover:text-ink-900"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 [&>svg]:size-[1.125rem] transition-colors duration-200",
                    selected ? "text-clay-600" : "text-stone-500"
                  )}
                >
                  {tab.icon}
                </span>
                {tab.label}

                {/* Active marker: a coral bar sitting on the panel divider. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-clay-500",
                    "origin-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    selected ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Panel body ---------------------------------------------------- */}
      <div className="p-5 sm:p-7 lg:p-8">
        {TABS.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== active}
          >
            {/* Mounted only while active so each form starts clean and no
                hidden fields end up in the tab order. */}
            {tab.id === active ? (
              tab.id === "flights" ? (
                <FlightForm />
              ) : tab.id === "hotels" ? (
                <HotelForm />
              ) : (
                <CabForm />
              )
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
