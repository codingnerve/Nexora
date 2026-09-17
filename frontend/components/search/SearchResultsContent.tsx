"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  ChevronRight,
  Hotel,
  Plane,
  Search,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  TravelSearchBar,
  type SearchTab,
  type TravelSearchBarInitialParams,
} from "./TravelSearchBar";
import { FlightSearchResults } from "./FlightSearchResults";
import { HotelSearchResults } from "./HotelSearchResults";
import { CabSearchResults } from "./CabSearchResults";
import { BookingModal, type BookingModalData } from "./BookingModal";
import {
  searchFlights,
  type FlightOffer,
  type FlightSearchParams,
} from "@/lib/flightsApi";
import {
  searchHotels,
  type HotelOffer,
  type HotelSearchParams,
} from "@/lib/hotelsApi";
import {
  searchCabs,
  type CabOffer,
  type CabSearchParams,
} from "@/lib/cabsApi";
import { todayISO, addDaysISO } from "@/components/ui/DateInput";
import { cn } from "@/utils/cn";

export function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Parse active tab
  const rawType = searchParams.get("type");
  const activeTab: SearchTab =
    rawType === "hotels" || rawType === "cabs" ? rawType : "flights";

  // 2. Parse Flight query parameters
  const fromCode = searchParams.get("from") || "DXB";
  const fromCity = searchParams.get("fromCity") || "Dubai (DXB)";
  const toCode = searchParams.get("to") || "LHR";
  const toCity = searchParams.get("toCity") || "London (LHR)";
  const depDate = searchParams.get("dep") || addDaysISO(todayISO(), 7);
  const retDate = searchParams.get("ret") || addDaysISO(todayISO(), 14);
  const tripType =
    (searchParams.get("tripType") as "ROUND_TRIP" | "ONE_WAY") || "ROUND_TRIP";
  const cabinClass =
    (searchParams.get("cabin") as
      | "ECONOMY"
      | "PREMIUM_ECONOMY"
      | "BUSINESS"
      | "FIRST") || "ECONOMY";
  const adults = Number(searchParams.get("adults")) || 1;
  const children = Number(searchParams.get("children")) || 0;

  // 3. Parse Hotel query parameters
  const hotelCity = searchParams.get("city") || "Dubai";
  const checkIn = searchParams.get("checkIn") || addDaysISO(todayISO(), 5);
  const checkOut = searchParams.get("checkOut") || addDaysISO(todayISO(), 10);
  const guests = Number(searchParams.get("guests")) || 2;
  const rooms = Number(searchParams.get("rooms")) || 1;

  // 4. Parse Cab query parameters
  const pickupLoc =
    searchParams.get("pickup") || "Dubai International Airport (DXB)";
  const dropoffLoc =
    searchParams.get("dropoff") || "Downtown Dubai / Palm Jumeirah";
  const cabDate = searchParams.get("date") || addDaysISO(todayISO(), 3);
  const cabTime = searchParams.get("time") || "10:00";
  const vehicleCategory = searchParams.get("category") || "ANY";

  // Results State
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [hotels, setHotels] = useState<HotelOffer[]>([]);
  const [cabs, setCabs] = useState<CabOffer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [flightSort, setFlightSort] = useState<"best" | "cheapest" | "fastest">(
    "best"
  );
  const [nonStopOnly, setNonStopOnly] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState<string>("ALL");

  const [hotelSort, setHotelSort] = useState<"recommended" | "price_asc" | "rating">(
    "recommended"
  );
  const [hotelStarFilter, setHotelStarFilter] = useState<number>(0);

  const [cabCategoryFilter, setCabCategoryFilter] = useState<string>("ALL");

  // Booking Modal
  const [bookingData, setBookingData] = useState<BookingModalData | null>(null);

  // Re-search toggle
  const [isEditingSearch, setIsEditingSearch] = useState(false);

  // Initial params object for TravelSearchBar
  const initialParams: TravelSearchBarInitialParams = useMemo(
    () => ({
      fromCode,
      fromCity,
      toCode,
      toCity,
      depDate,
      retDate,
      tripType,
      cabinClass,
      adults,
      children,
      hotelCity,
      checkIn,
      checkOut,
      guests,
      rooms,
      pickupLoc,
      dropoffLoc,
      cabDate,
      cabTime,
      vehicleType: vehicleCategory,
    }),
    [
      fromCode,
      fromCity,
      toCode,
      toCity,
      depDate,
      retDate,
      tripType,
      cabinClass,
      adults,
      children,
      hotelCity,
      checkIn,
      checkOut,
      guests,
      rooms,
      pickupLoc,
      dropoffLoc,
      cabDate,
      cabTime,
      vehicleCategory,
    ]
  );

  // Fetch results whenever search parameters change
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function executeSearch() {
      if (activeTab === "flights") {
        const params: FlightSearchParams = {
          from: fromCode,
          to: toCode,
          departureDate: depDate,
          returnDate: tripType === "ROUND_TRIP" ? retDate : undefined,
          tripType,
          adults,
          children,
          infants: 0,
          cabinClass,
        };
        const results = await searchFlights(params);
        if (!isCancelled) {
          setFlights(results);
          setLoading(false);
        }
      } else if (activeTab === "hotels") {
        const params: HotelSearchParams = {
          city: hotelCity,
          checkIn,
          checkOut,
          guests,
          rooms,
        };
        const results = await searchHotels(params);
        if (!isCancelled) {
          setHotels(results);
          setLoading(false);
        }
      } else if (activeTab === "cabs") {
        const params: CabSearchParams = {
          pickupLocation: pickupLoc,
          dropoffLocation: dropoffLoc,
          pickupDate: cabDate,
          pickupTime: cabTime,
          vehicleType: vehicleCategory,
        };
        const results = await searchCabs(params);
        if (!isCancelled) {
          setCabs(results);
          setLoading(false);
        }
      }
    }

    executeSearch();

    return () => {
      isCancelled = true;
    };
  }, [
    activeTab,
    fromCode,
    toCode,
    depDate,
    retDate,
    tripType,
    cabinClass,
    adults,
    children,
    hotelCity,
    checkIn,
    checkOut,
    guests,
    rooms,
    pickupLoc,
    dropoffLoc,
    cabDate,
    cabTime,
    vehicleCategory,
  ]);

  // Airlines list for filter
  const availableAirlines = useMemo(() => {
    const set = new Set<string>();
    flights.forEach((f) => set.add(f.airline));
    return Array.from(set);
  }, [flights]);

  // Filtered & Sorted Flights
  const filteredFlights = useMemo(() => {
    return flights
      .filter((f) => {
        if (nonStopOnly && f.stops > 0) return false;
        if (selectedAirline !== "ALL" && f.airline !== selectedAirline)
          return false;
        return true;
      })
      .sort((a, b) => {
        if (flightSort === "cheapest") return a.price - b.price;
        if (flightSort === "fastest")
          return parseInt(a.duration) - parseInt(b.duration);
        return a.price + a.stops * 100 - (b.price + b.stops * 100);
      });
  }, [flights, nonStopOnly, selectedAirline, flightSort]);

  // Filtered & Sorted Hotels
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((h) => {
        if (hotelStarFilter > 0 && h.rating < hotelStarFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (hotelSort === "price_asc") return a.pricePerNight - b.pricePerNight;
        if (hotelSort === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [hotels, hotelStarFilter, hotelSort]);

  // Filtered Cabs
  const filteredCabs = useMemo(() => {
    return cabs.filter((c) => {
      if (cabCategoryFilter !== "ALL" && c.category !== cabCategoryFilter)
        return false;
      return true;
    });
  }, [cabs, cabCategoryFilter]);

  // Handle in-place search submission from TravelSearchBar
  const handleInPlaceSearch = (tab: SearchTab, params: any) => {
    setIsEditingSearch(false);
    let q: URLSearchParams;

    if (tab === "flights") {
      q = new URLSearchParams({
        type: "flights",
        from: params.from,
        fromCity: params.fromCity || fromCity,
        to: params.to,
        toCity: params.toCity || toCity,
        dep: params.departureDate,
        tripType: params.tripType,
        cabin: params.cabinClass,
        adults: String(params.adults),
        children: String(params.children),
      });
      if (params.tripType === "ROUND_TRIP" && params.returnDate) {
        q.set("ret", params.returnDate);
      }
    } else if (tab === "hotels") {
      q = new URLSearchParams({
        type: "hotels",
        city: params.city,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: String(params.guests),
        rooms: String(params.rooms),
      });
    } else {
      q = new URLSearchParams({
        type: "cabs",
        pickup: params.pickupLocation,
        dropoff: params.dropoffLocation,
        date: params.pickupDate,
        time: params.pickupTime,
        category: params.vehicleType,
      });
    }

    router.replace(`/search?${q.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-[85vh] bg-sand-100/50 pb-20 pt-8 sm:pt-12">
      <Container>
        {/* --- Breadcrumb & Header ---------------------------------------- */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[0.8125rem] text-stone-500">
            <Link
              href="/"
              className="font-medium hover:text-ink-900 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href={
                activeTab === "flights"
                  ? "/flights"
                  : activeTab === "hotels"
                    ? "/hotels"
                    : "/cabs"
              }
              className="font-medium capitalize hover:text-ink-900 transition-colors"
            >
              {activeTab === "cabs" ? "Car Rentals" : activeTab}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-bold text-ink-900">Search Results</span>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingSearch(!isEditingSearch)}
            className="inline-flex items-center gap-2 rounded-[12px] border border-sand-300 bg-white px-3.5 py-1.5 text-[0.8125rem] font-bold text-ink-900 shadow-sm transition-all hover:border-sand-400 hover:bg-sand-100"
          >
            <Search className="size-3.5 text-clay-600" />
            <span>{isEditingSearch ? "Close Search Box" : "Modify Search"}</span>
          </button>
        </div>

        {/* --- Top Search Modifier (collapsible or interactive) ----------- */}
        {isEditingSearch ? (
          <div className="mb-8 rounded-[24px] border border-sand-300 bg-white p-4 shadow-card animate-fade-in sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-display text-[1.125rem] font-bold text-ink-900">
                Update Search Criteria
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingSearch(false)}
                className="text-[0.75rem] font-semibold text-stone-500 hover:text-ink-900"
              >
                Cancel
              </button>
            </div>
            <TravelSearchBar
              initialTab={activeTab}
              initialParams={initialParams}
              redirectToResultsPage={false}
              showResultsInline={false}
              onSearchSubmitted={handleInPlaceSearch}
            />
          </div>
        ) : null}

        {/* --- Query Summary Banner --------------------------------------- */}
        <div className="mb-8 rounded-[24px] border border-sand-300 bg-white p-6 shadow-sm transition-all sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-clay-500/10 px-3 py-1 text-[0.75rem] font-bold uppercase tracking-wider text-clay-700">
                  {activeTab === "flights" ? (
                    <>
                      <Plane className="size-3.5" />
                      Flights
                    </>
                  ) : activeTab === "hotels" ? (
                    <>
                      <Hotel className="size-3.5" />
                      Hotels & Stays
                    </>
                  ) : (
                    <>
                      <Car className="size-3.5" />
                      Cabs & Rentals
                    </>
                  )}
                </span>

                <span className="text-[0.8125rem] font-semibold text-stone-500">
                  •
                </span>

                <span className="text-[0.8125rem] font-bold text-ink-900">
                  {activeTab === "flights"
                    ? `${tripType === "ROUND_TRIP" ? "Round Trip" : "One Way"} • ${adults + children} Passenger(s) • ${cabinClass}`
                    : activeTab === "hotels"
                      ? `${guests} Guest(s) • ${rooms} Room(s)`
                      : `${vehicleCategory} Category`}
                </span>
              </div>

              <h1 className="mt-3 font-display text-[1.5rem] font-bold tracking-tight text-ink-900 sm:text-[1.875rem]">
                {activeTab === "flights" ? (
                  <span className="flex flex-wrap items-center gap-2">
                    <span>{fromCity}</span>
                    <ArrowRight className="size-5 text-clay-600" />
                    <span>{toCity}</span>
                  </span>
                ) : activeTab === "hotels" ? (
                  <span>Stays & Accommodations in {hotelCity}</span>
                ) : (
                  <span className="flex flex-wrap items-center gap-2">
                    <span>{pickupLoc}</span>
                    <ArrowRight className="size-5 text-clay-600" />
                    <span>{dropoffLoc}</span>
                  </span>
                )}
              </h1>

              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-body-sm text-foreground-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-4 text-stone-400" />
                  {activeTab === "flights"
                    ? `${depDate}${tripType === "ROUND_TRIP" ? ` — ${retDate}` : ""}`
                    : activeTab === "hotels"
                      ? `Check-in: ${checkIn} • Check-out: ${checkOut}`
                      : `Date: ${cabDate} at ${cabTime}`}
                </span>

                <span className="hidden sm:inline text-stone-300">•</span>

                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="size-4" />
                  Real-time Availability
                </span>
              </div>
            </div>

            {/* Quick Actions / Results Count Badge */}
            <div className="flex shrink-0 items-center gap-3 border-t border-sand-200 pt-4 lg:border-t-0 lg:pt-0">
              <div className="rounded-[16px] bg-sand-200/70 px-4 py-3 text-center">
                <span className="block font-mono text-[1.5rem] font-bold text-ink-900">
                  {loading
                    ? "..."
                    : activeTab === "flights"
                      ? filteredFlights.length
                      : activeTab === "hotels"
                        ? filteredHotels.length
                        : filteredCabs.length}
                </span>
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-600">
                  {activeTab === "flights"
                    ? "Offers Found"
                    : activeTab === "hotels"
                      ? "Hotels Found"
                      : "Rides Available"}
                </span>
              </div>

              {!isEditingSearch ? (
                <button
                  type="button"
                  onClick={() => setIsEditingSearch(true)}
                  className="flex size-12 items-center justify-center rounded-[16px] border border-sand-300 bg-white text-ink-900 shadow-sm transition-all hover:bg-sand-100"
                  title="Edit Search Details"
                >
                  <Search className="size-5 text-clay-600" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* --- Filter & Sorting Toolbar ----------------------------------- */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-sand-300 bg-white p-4 shadow-sm">
          {activeTab === "flights" ? (
            <>
              {/* Flight Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.8125rem] font-bold text-stone-500 mr-1">
                  Filters:
                </span>

                <button
                  type="button"
                  onClick={() => setNonStopOnly(!nonStopOnly)}
                  className={cn(
                    "rounded-[10px] px-3 py-1.5 text-[0.8125rem] font-semibold transition-all",
                    nonStopOnly
                      ? "bg-clay-600 text-white shadow-sm"
                      : "border border-sand-300 bg-white text-stone-700 hover:border-sand-400 hover:bg-sand-100"
                  )}
                >
                  Direct Only
                </button>

                {availableAirlines.length > 1 ? (
                  <select
                    value={selectedAirline}
                    onChange={(e) => setSelectedAirline(e.target.value)}
                    className="rounded-[10px] border border-sand-300 bg-white px-3 py-1.5 text-[0.8125rem] font-semibold text-stone-700 focus:outline-none focus:ring-1 focus:ring-clay-500"
                  >
                    <option value="ALL">All Airlines</option>
                    {availableAirlines.map((airline) => (
                      <option key={airline} value={airline}>
                        {airline}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>

              {/* Flight Sort */}
              <div className="flex items-center gap-2">
                <span className="text-[0.8125rem] font-bold text-stone-500">
                  Sort:
                </span>
                <div className="flex rounded-[10px] border border-sand-300 bg-sand-100 p-0.5 text-[0.8125rem] font-semibold">
                  <button
                    type="button"
                    onClick={() => setFlightSort("best")}
                    className={cn(
                      "rounded-[8px] px-3 py-1 transition-colors",
                      flightSort === "best"
                        ? "bg-white text-ink-900 shadow-sm"
                        : "text-stone-600 hover:text-ink-900"
                    )}
                  >
                    Best Value
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlightSort("cheapest")}
                    className={cn(
                      "rounded-[8px] px-3 py-1 transition-colors",
                      flightSort === "cheapest"
                        ? "bg-white text-ink-900 shadow-sm"
                        : "text-stone-600 hover:text-ink-900"
                    )}
                  >
                    Cheapest
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlightSort("fastest")}
                    className={cn(
                      "rounded-[8px] px-3 py-1 transition-colors",
                      flightSort === "fastest"
                        ? "bg-white text-ink-900 shadow-sm"
                        : "text-stone-600 hover:text-ink-900"
                    )}
                  >
                    Fastest
                  </button>
                </div>
              </div>
            </>
          ) : activeTab === "hotels" ? (
            <>
              {/* Hotel Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.8125rem] font-bold text-stone-500 mr-1">
                  Star Rating:
                </span>
                {[
                  { label: "All Stays", val: 0 },
                  { label: "4+ Stars", val: 4 },
                  { label: "5-Star Luxury", val: 4.8 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setHotelStarFilter(item.val)}
                    className={cn(
                      "rounded-[10px] px-3 py-1.5 text-[0.8125rem] font-semibold transition-all",
                      hotelStarFilter === item.val
                        ? "bg-clay-600 text-white shadow-sm"
                        : "border border-sand-300 bg-white text-stone-700 hover:border-sand-400 hover:bg-sand-100"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Hotel Sort */}
              <div className="flex items-center gap-2">
                <span className="text-[0.8125rem] font-bold text-stone-500">
                  Sort:
                </span>
                <select
                  value={hotelSort}
                  onChange={(e) =>
                    setHotelSort(e.target.value as typeof hotelSort)
                  }
                  className="rounded-[10px] border border-sand-300 bg-white px-3 py-1.5 text-[0.8125rem] font-semibold text-stone-700 focus:outline-none focus:ring-1 focus:ring-clay-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="rating">Highest Guest Rating</option>
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Cab Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.8125rem] font-bold text-stone-500 mr-1">
                  Vehicle Type:
                </span>
                {[
                  { label: "All Vehicles", val: "ALL" },
                  { label: "Sedan", val: "SEDAN" },
                  { label: "SUV", val: "SUV" },
                  { label: "Luxury", val: "LUXURY" },
                  { label: "Van", val: "VAN" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setCabCategoryFilter(item.val)}
                    className={cn(
                      "rounded-[10px] px-3 py-1.5 text-[0.8125rem] font-semibold transition-all",
                      cabCategoryFilter === item.val
                        ? "bg-clay-600 text-white shadow-sm"
                        : "border border-sand-300 bg-white text-stone-700 hover:border-sand-400 hover:bg-sand-100"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="text-[0.8125rem] font-medium text-emerald-700">
                ✓ Free Cancellation up to 24h
              </div>
            </>
          )}
        </div>

        {/* --- Results Section -------------------------------------------- */}
        {activeTab === "flights" ? (
          <FlightSearchResults
            searchParams={{
              from: fromCode,
              to: toCode,
              departureDate: depDate,
              returnDate: tripType === "ROUND_TRIP" ? retDate : undefined,
              tripType,
              adults,
              children,
              infants: 0,
              cabinClass,
            }}
            flights={filteredFlights}
            loading={loading}
            onSelectFlight={(flight) => {
              setBookingData({
                type: "flight",
                item: flight,
                summary: `${flight.airline} (${flight.flightNumber}) • ${flight.departureAirport} → ${flight.arrivalAirport}`,
                price: flight.price,
              });
            }}
          />
        ) : activeTab === "hotels" ? (
          <HotelSearchResults
            searchParams={{
              city: hotelCity,
              checkIn,
              checkOut,
              rooms,
              guests,
            }}
            hotels={filteredHotels}
            loading={loading}
            onSelectHotel={(hotel) => {
              setBookingData({
                type: "hotel",
                item: hotel,
                summary: `${hotel.name} • ${hotel.roomType} (${hotel.city})`,
                price: hotel.totalPrice,
              });
            }}
          />
        ) : (
          <CabSearchResults
            searchParams={{
              pickupLocation: pickupLoc,
              dropoffLocation: dropoffLoc,
              pickupDate: cabDate,
              pickupTime: cabTime,
              vehicleType: vehicleCategory,
            }}
            cabs={filteredCabs}
            loading={loading}
            onSelectCab={(cab) => {
              setBookingData({
                type: "cab",
                item: cab,
                summary: `${cab.model} (${cab.category}) • ${pickupLoc}`,
                price: cab.totalPrice,
              });
            }}
          />
        )}

        {/* Empty State if 0 Results */}
        {!loading &&
        ((activeTab === "flights" && filteredFlights.length === 0) ||
          (activeTab === "hotels" && filteredHotels.length === 0) ||
          (activeTab === "cabs" && filteredCabs.length === 0)) ? (
          <div className="mt-12 rounded-[24px] border border-sand-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sand-200 text-stone-500">
              <Search className="size-6" />
            </div>
            <h3 className="mt-4 font-display text-[1.375rem] font-bold text-ink-900">
              No matching options found
            </h3>
            <p className="mt-2 text-body-md text-foreground-muted max-w-md mx-auto">
              We couldn&apos;t find any availability matching your exact filter
              criteria. Try resetting filters or choosing alternate dates.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setNonStopOnly(false);
                  setSelectedAirline("ALL");
                  setHotelStarFilter(0);
                  setCabCategoryFilter("ALL");
                }}
              >
                Reset Filters
              </Button>
              <Button
                variant="accent"
                size="md"
                onClick={() => setIsEditingSearch(true)}
              >
                Modify Search
              </Button>
            </div>
          </div>
        ) : null}

        {/* Booking Modal */}
        <BookingModal
          data={bookingData}
          onClose={() => setBookingData(null)}
        />
      </Container>
    </div>
  );
}
