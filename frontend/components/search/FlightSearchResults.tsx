"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Luggage,
  Plane,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

import type { FlightOffer, FlightSearchParams } from "@/lib/flightsApi";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface FlightSearchResultsProps {
  searchParams: FlightSearchParams;
  flights: FlightOffer[];
  loading: boolean;
  onSelectFlight: (flight: FlightOffer) => void;
}

type SortOption = "cheapest" | "fastest" | "best";

export function FlightSearchResults({
  searchParams,
  flights,
  loading,
  onSelectFlight,
}: FlightSearchResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>("best");
  const [nonStopOnly, setNonStopOnly] = useState(false);

  // Filter & Sort
  const filteredFlights = flights.filter((f) => {
    if (nonStopOnly && f.stops > 0) return false;
    return true;
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortBy === "cheapest") return a.price - b.price;
    if (sortBy === "fastest") return parseInt(a.duration) - parseInt(b.duration);
    // "best" considers price and stops
    return a.price + a.stops * 100 - (b.price + b.stops * 100);
  });

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 text-body-md text-foreground-muted animate-pulse">
          <div className="size-5 rounded-full bg-clay-500/20" />
          <span>Searching live airline schedules and fare options...</span>
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-44 w-full animate-pulse rounded-[20px] border border-sand-300 bg-white/70 p-6"
          >
            <div className="flex justify-between">
              <div className="h-6 w-36 rounded-md bg-sand-200" />
              <div className="h-8 w-24 rounded-md bg-sand-200" />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="h-10 w-28 rounded-md bg-sand-200" />
              <div className="h-2 w-40 rounded-md bg-sand-200" />
              <div className="h-10 w-28 rounded-md bg-sand-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (flights.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Search Header / Summary Bar */}
      <div className="flex flex-col gap-4 rounded-[16px] border border-sand-300 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-clay-500/10 px-3 py-0.5 text-[0.8125rem] font-bold text-clay-700">
              <Sparkles className="size-3.5" />
              {sortedFlights.length} Flights Available
            </span>
            <span className="text-body-sm text-foreground-muted">
              {searchParams.from.toUpperCase()} → {searchParams.to.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-body-sm text-foreground-subtle">
            {searchParams.tripType === "ROUND_TRIP" ? "Round Trip" : "One Way"} •{" "}
            {searchParams.adults + searchParams.children} Traveler(s) •{" "}
            {searchParams.cabinClass}
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setNonStopOnly(!nonStopOnly)}
            className={cn(
              "rounded-[10px] border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
              nonStopOnly
                ? "border-clay-600 bg-clay-500/10 text-clay-700"
                : "border-sand-300 bg-white text-ink-900 hover:border-sand-400"
            )}
          >
            Direct only
          </button>

          <div className="flex items-center rounded-[10px] border border-sand-300 bg-sand-100 p-0.5 text-[0.8125rem] font-medium">
            <button
              type="button"
              onClick={() => setSortBy("best")}
              className={cn(
                "rounded-[8px] px-2.5 py-1 transition-colors",
                sortBy === "best"
                  ? "bg-white text-ink-900 shadow-sm font-semibold"
                  : "text-stone-600 hover:text-ink-900"
              )}
            >
              Best
            </button>
            <button
              type="button"
              onClick={() => setSortBy("cheapest")}
              className={cn(
                "rounded-[8px] px-2.5 py-1 transition-colors",
                sortBy === "cheapest"
                  ? "bg-white text-ink-900 shadow-sm font-semibold"
                  : "text-stone-600 hover:text-ink-900"
              )}
            >
              Cheapest
            </button>
            <button
              type="button"
              onClick={() => setSortBy("fastest")}
              className={cn(
                "rounded-[8px] px-2.5 py-1 transition-colors",
                sortBy === "fastest"
                  ? "bg-white text-ink-900 shadow-sm font-semibold"
                  : "text-stone-600 hover:text-ink-900"
              )}
            >
              Fastest
            </button>
          </div>
        </div>
      </div>

      {/* Flight Cards List */}
      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <article
            key={flight.id}
            className="group relative overflow-hidden rounded-[20px] border border-sand-300 bg-white p-5 shadow-sm transition-all duration-300 hover:border-sand-400 hover:shadow-card sm:p-6"
          >
            {/* Outbound Leg */}
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                {/* Airline & Aircraft Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-[10px] bg-sand-200/80 text-ink-900 font-extrabold text-[0.8125rem]">
                      {flight.airlineCode}
                    </div>
                    <div>
                      <h4 className="font-display text-[0.9375rem] font-bold text-ink-900">
                        {flight.airline}
                      </h4>
                      <p className="text-[0.75rem] text-foreground-subtle">
                        {flight.flightNumber} • {flight.aircraft}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-sand-200/70 px-2.5 py-0.5 text-[0.75rem] font-semibold text-ink-800">
                    {flight.cabinClass}
                  </span>
                </div>

                {/* Times & Timeline */}
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-8">
                  {/* Departure */}
                  <div className="text-left">
                    <p className="nx-figures font-display text-[1.375rem] font-extrabold text-ink-900">
                      {flight.departureTime}
                    </p>
                    <p className="text-[0.875rem] font-bold text-stone-700">
                      {flight.departureAirport}
                    </p>
                    <p className="text-[0.75rem] text-foreground-subtle">Departure</p>
                  </div>

                  {/* Flight Track Duration */}
                  <div className="flex flex-col items-center">
                    <span className="text-[0.75rem] font-semibold text-foreground-muted">
                      {flight.duration}
                    </span>
                    <div className="relative my-1 flex w-full max-w-[14rem] items-center">
                      <div className="size-2 rounded-full border-2 border-clay-500 bg-white" />
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-clay-500 via-sand-400 to-ink-900" />
                      <Plane className="size-4 text-clay-600 rotate-90" />
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-sand-400 to-ink-900" />
                      <div className="size-2 rounded-full border-2 border-ink-900 bg-white" />
                    </div>
                    <span className="text-[0.75rem] font-medium text-stone-600">
                      {flight.stops === 0 ? "Non-stop" : flight.stopDetails || "1 stop"}
                    </span>
                  </div>

                  {/* Arrival */}
                  <div className="text-right">
                    <p className="nx-figures font-display text-[1.375rem] font-extrabold text-ink-900">
                      {flight.arrivalTime}
                    </p>
                    <p className="text-[0.875rem] font-bold text-stone-700">
                      {flight.arrivalAirport}
                    </p>
                    <p className="text-[0.75rem] text-foreground-subtle">Arrival</p>
                  </div>
                </div>

                {/* Return Leg (if Round Trip) */}
                {flight.returnLeg ? (
                  <div className="mt-4 border-t border-sand-200/80 pt-4">
                    <div className="flex items-center gap-2 mb-2 text-[0.75rem] font-bold uppercase tracking-wider text-clay-700">
                      <span>Return Flight</span>
                      <span className="text-stone-400">•</span>
                      <span className="font-normal text-stone-600">
                        {flight.returnLeg.flightNumber}
                      </span>
                    </div>
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-8">
                      <div className="text-left">
                        <p className="nx-figures font-display text-[1.125rem] font-bold text-ink-900">
                          {flight.returnLeg.departureTime}
                        </p>
                        <p className="text-[0.8125rem] font-semibold text-stone-700">
                          {flight.returnLeg.departureAirport}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[0.6875rem] text-foreground-muted">
                          {flight.returnLeg.duration}
                        </span>
                        <div className="relative my-0.5 h-0.5 w-full max-w-[10rem] bg-sand-300" />
                        <span className="text-[0.6875rem] text-stone-500">
                          {flight.returnLeg.stops === 0 ? "Non-stop" : "1 stop"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="nx-figures font-display text-[1.125rem] font-bold text-ink-900">
                          {flight.returnLeg.arrivalTime}
                        </p>
                        <p className="text-[0.8125rem] font-semibold text-stone-700">
                          {flight.returnLeg.arrivalAirport}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Price & Action Column */}
              <div className="flex flex-row items-center justify-between border-t border-sand-200 pt-4 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <div className="text-left lg:text-right">
                  <span className="text-[0.75rem] text-foreground-subtle">
                    Total per person
                  </span>
                  <p className="nx-figures font-display text-[1.75rem] font-extrabold text-ink-900">
                    ${flight.price}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-emerald-700">
                    <CheckCircle2 className="size-3" />
                    Taxes & fees included
                  </span>
                </div>

                <div className="mt-4 flex flex-col items-end gap-2">
                  <Button
                    variant="accent"
                    size="md"
                    onClick={() => onSelectFlight(flight)}
                    className="min-w-[10rem]"
                  >
                    Select Flight
                  </Button>
                  <span className="text-[0.6875rem] text-clay-700 font-semibold">
                    {flight.seatsLeft} seats left at this fare
                  </span>
                </div>
              </div>
            </div>

            {/* Amenities & Baggage footer strip */}
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-sand-200/80 pt-3 text-[0.75rem] text-foreground-muted">
              <span className="inline-flex items-center gap-1.5">
                <Luggage className="size-3.5 text-stone-500" />
                {flight.baggage}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-stone-500" />
                {flight.refundable ? "Refundable fare" : "Standard fare conditions"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
