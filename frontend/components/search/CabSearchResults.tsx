"use client";

import { CheckCircle2, ShieldCheck, Users, Briefcase, Car } from "lucide-react";

import type { CabOffer, CabSearchParams } from "@/lib/cabsApi";
import { Button } from "@/components/ui/Button";

interface CabSearchResultsProps {
  searchParams: CabSearchParams;
  cabs: CabOffer[];
  loading: boolean;
  onSelectCab: (cab: CabOffer) => void;
}

export function CabSearchResults({
  searchParams,
  cabs,
  loading,
  onSelectCab,
}: CabSearchResultsProps) {
  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 w-full animate-pulse rounded-[20px] border border-sand-300 bg-white p-5"
          />
        ))}
      </div>
    );
  }

  if (cabs.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between rounded-[16px] border border-sand-300 bg-white p-4 shadow-sm">
        <div>
          <h3 className="font-display text-[1.125rem] font-bold text-ink-900">
            Available Cabs & Transfers in {searchParams.pickupLocation || "Selected Area"}
          </h3>
          <p className="text-body-sm text-foreground-muted">
            All rides include airport pickup, flight tracking, and vetted drivers.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {cabs.map((cab) => (
          <article
            key={cab.id}
            className="group flex flex-col justify-between rounded-[20px] border border-sand-300 bg-white p-5 shadow-sm transition-all duration-300 hover:border-sand-400 hover:shadow-card sm:flex-row sm:items-center sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-sand-200/80 text-clay-600">
                <Car className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-clay-500/10 px-2.5 py-0.5 text-[0.6875rem] font-bold text-clay-700">
                    {cab.category}
                  </span>
                  <span className="text-[0.75rem] text-stone-500">
                    {cab.driverOption}
                  </span>
                </div>
                <h4 className="mt-1 font-display text-[1.125rem] font-bold text-ink-900">
                  {cab.model}
                </h4>

                {/* Specs */}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-[0.8125rem] text-foreground-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5 text-stone-500" />
                    {cab.seats} Passengers
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="size-3.5 text-stone-500" />
                    {cab.luggage} Bags
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="size-3.5" />
                    Free Cancellation
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-sand-200 pt-4 sm:mt-0 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
              <div className="sm:text-right">
                <span className="text-[0.6875rem] text-stone-500">Estimated rate</span>
                <p className="nx-figures font-display text-[1.5rem] font-extrabold text-ink-900">
                  ${cab.pricePerDay}
                </p>
              </div>

              <div className="sm:mt-3">
                <Button
                  variant="accent"
                  size="md"
                  onClick={() => onSelectCab(cab)}
                >
                  Book Cab
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
