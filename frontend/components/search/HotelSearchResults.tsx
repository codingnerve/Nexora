"use client";

import Image from "next/image";
import { CheckCircle2, MapPin, Star, Wifi, Coffee, Waves } from "lucide-react";

import type { HotelOffer, HotelSearchParams } from "@/lib/hotelsApi";
import { Button } from "@/components/ui/Button";

interface HotelSearchResultsProps {
  searchParams: HotelSearchParams;
  hotels: HotelOffer[];
  loading: boolean;
  onSelectHotel: (hotel: HotelOffer) => void;
}

export function HotelSearchResults({
  searchParams,
  hotels,
  loading,
  onSelectHotel,
}: HotelSearchResultsProps) {
  if (loading) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-80 w-full animate-pulse rounded-[20px] border border-sand-300 bg-white p-4"
          >
            <div className="h-44 w-full rounded-[14px] bg-sand-200" />
            <div className="mt-4 h-6 w-3/4 rounded-md bg-sand-200" />
            <div className="mt-2 h-4 w-1/2 rounded-md bg-sand-200" />
          </div>
        ))}
      </div>
    );
  }

  if (hotels.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between rounded-[16px] border border-sand-300 bg-white p-4 shadow-sm">
        <div>
          <h3 className="font-display text-[1.125rem] font-bold text-ink-900">
            Available Stays in {searchParams.city || "Top Destinations"}
          </h3>
          <p className="text-body-sm text-foreground-muted">
            {searchParams.guests} Guest(s) • {searchParams.rooms} Room(s) • Best
            rate guarantee
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <article
            key={hotel.id}
            className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-sand-300 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sand-400 hover:shadow-card"
          >
            <div>
              {/* Hotel Photo */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand-200">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  sizes="(min-width: 1024px) 380px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink-900/80 px-2.5 py-1 text-[0.75rem] font-bold text-white backdrop-blur-sm">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span>{hotel.rating}</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex items-center gap-1 text-[0.75rem] text-stone-500">
                  <MapPin className="size-3.5 text-clay-600 shrink-0" />
                  <span className="truncate">{hotel.location}</span>
                </div>

                <h4 className="mt-1 font-display text-[1.125rem] font-bold text-ink-900">
                  {hotel.name}
                </h4>
                <p className="text-body-sm text-foreground-subtle">{hotel.roomType}</p>

                {/* Amenities pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {hotel.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-md bg-sand-200/80 px-2 py-0.5 text-[0.6875rem] font-medium text-stone-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="border-t border-sand-200 p-5 pt-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[0.6875rem] uppercase tracking-wider text-stone-500">
                    From
                  </span>
                  <p className="nx-figures font-display text-[1.375rem] font-extrabold text-ink-900">
                    ${hotel.pricePerNight}
                    <span className="text-[0.8125rem] font-normal text-stone-500">
                      {" "}/ night
                    </span>
                  </p>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => onSelectHotel(hotel)}
                >
                  Book Hotel
                </Button>
              </div>

              {hotel.freeCancellation ? (
                <p className="mt-2 text-[0.6875rem] font-medium text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  Free cancellation available
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
