"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  Calendar,
  Car,
  ChevronDown,
  Hotel,
  MapPin,
  Plane,
  Search,
  Users,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { todayISO, addDaysISO } from "@/components/ui/DateInput";
import { searchAirports, type Airport } from "@/lib/airports";
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
import { cn } from "@/utils/cn";
import { FlightSearchResults } from "./FlightSearchResults";
import { HotelSearchResults } from "./HotelSearchResults";
import { CabSearchResults } from "./CabSearchResults";
import { BookingModal, type BookingModalData } from "./BookingModal";

export type SearchTab = "flights" | "hotels" | "cabs";

export interface TravelSearchBarInitialParams {
  fromCode?: string;
  fromCity?: string;
  toCode?: string;
  toCity?: string;
  depDate?: string;
  retDate?: string;
  tripType?: "ROUND_TRIP" | "ONE_WAY";
  cabinClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  adults?: number;
  children?: number;
  hotelCity?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  pickupLoc?: string;
  dropoffLoc?: string;
  cabDate?: string;
  cabTime?: string;
  vehicleType?: string;
}

interface TravelSearchBarProps {
  initialTab?: SearchTab;
  autoSearchInitial?: boolean;
  className?: string;
  redirectToResultsPage?: boolean;
  showResultsInline?: boolean;
  initialParams?: TravelSearchBarInitialParams;
  onSearchSubmitted?: (tab: SearchTab, params: any) => void;
}

export function TravelSearchBar({
  initialTab = "flights",
  autoSearchInitial = false,
  className,
  redirectToResultsPage = true,
  showResultsInline = false,
  initialParams,
  onSearchSubmitted,
}: TravelSearchBarProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>(initialTab);

  // --- Flight State --------------------------------------------------------
  const [tripType, setTripType] = useState<"ROUND_TRIP" | "ONE_WAY">(
    initialParams?.tripType || "ROUND_TRIP"
  );
  const [fromCode, setFromCode] = useState(initialParams?.fromCode || "DXB");
  const [fromCity, setFromCity] = useState(
    initialParams?.fromCity || "Dubai (DXB)"
  );
  const [toCode, setToCode] = useState(initialParams?.toCode || "LHR");
  const [toCity, setToCity] = useState(
    initialParams?.toCity || "London (LHR)"
  );
  const [depDate, setDepDate] = useState(
    initialParams?.depDate || addDaysISO(todayISO(), 7)
  );
  const [retDate, setRetDate] = useState(
    initialParams?.retDate || addDaysISO(todayISO(), 14)
  );
  const [cabinClass, setCabinClass] = useState<
    "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST"
  >(initialParams?.cabinClass || "ECONOMY");
  const [adults, setAdults] = useState(initialParams?.adults ?? 1);
  const [children, setChildren] = useState(initialParams?.children ?? 0);

  // --- Autocomplete Popovers -----------------------------------------------
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [fromQuery, setFromQuery] = useState("");
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [toQuery, setToQuery] = useState("");
  const [showPaxPopover, setShowPaxPopover] = useState(false);

  // --- Hotel State ---------------------------------------------------------
  const [hotelCity, setHotelCity] = useState(initialParams?.hotelCity || "Dubai");
  const [checkIn, setCheckIn] = useState(
    initialParams?.checkIn || addDaysISO(todayISO(), 5)
  );
  const [checkOut, setCheckOut] = useState(
    initialParams?.checkOut || addDaysISO(todayISO(), 10)
  );
  const [rooms, setRooms] = useState(initialParams?.rooms ?? 1);
  const [guests, setGuests] = useState(initialParams?.guests ?? 2);

  // --- Cab State -----------------------------------------------------------
  const [pickupLoc, setPickupLoc] = useState(
    initialParams?.pickupLoc || "Dubai International Airport (DXB)"
  );
  const [dropoffLoc, setDropoffLoc] = useState(
    initialParams?.dropoffLoc || "Downtown Dubai / Palm Jumeirah"
  );
  const [cabDate, setCabDate] = useState(
    initialParams?.cabDate || addDaysISO(todayISO(), 3)
  );
  const [cabTime, setCabTime] = useState(initialParams?.cabTime || "10:00");
  const [vehicleType, setVehicleType] = useState(
    initialParams?.vehicleType || "ANY"
  );

  // Sync with initialParams if updated
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    if (initialParams) {
      if (initialParams.fromCode) setFromCode(initialParams.fromCode);
      if (initialParams.fromCity) setFromCity(initialParams.fromCity);
      if (initialParams.toCode) setToCode(initialParams.toCode);
      if (initialParams.toCity) setToCity(initialParams.toCity);
      if (initialParams.depDate) setDepDate(initialParams.depDate);
      if (initialParams.retDate) setRetDate(initialParams.retDate);
      if (initialParams.tripType) setTripType(initialParams.tripType);
      if (initialParams.cabinClass) setCabinClass(initialParams.cabinClass);
      if (initialParams.adults !== undefined) setAdults(initialParams.adults);
      if (initialParams.children !== undefined) setChildren(initialParams.children);
      if (initialParams.hotelCity) setHotelCity(initialParams.hotelCity);
      if (initialParams.checkIn) setCheckIn(initialParams.checkIn);
      if (initialParams.checkOut) setCheckOut(initialParams.checkOut);
      if (initialParams.guests !== undefined) setGuests(initialParams.guests);
      if (initialParams.rooms !== undefined) setRooms(initialParams.rooms);
      if (initialParams.pickupLoc) setPickupLoc(initialParams.pickupLoc);
      if (initialParams.dropoffLoc) setDropoffLoc(initialParams.dropoffLoc);
      if (initialParams.cabDate) setCabDate(initialParams.cabDate);
      if (initialParams.cabTime) setCabTime(initialParams.cabTime);
      if (initialParams.vehicleType) setVehicleType(initialParams.vehicleType);
    }
  }, [initialTab, initialParams]);

  // --- Results State -------------------------------------------------------
  const [flightOffers, setFlightOffers] = useState<FlightOffer[]>([]);
  const [hotelOffers, setHotelOffers] = useState<HotelOffer[]>([]);
  const [cabOffers, setCabOffers] = useState<CabOffer[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // --- Booking Modal State -------------------------------------------------
  const [bookingData, setBookingData] = useState<BookingModalData | null>(null);

  // Autocomplete ref handlers
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const paxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowToSuggestions(false);
      }
      if (paxRef.current && !paxRef.current.contains(e.target as Node)) {
        setShowPaxPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Swap origin & destination
  const handleSwapAirports = () => {
    const tempCode = fromCode;
    const tempCity = fromCity;
    setFromCode(toCode);
    setFromCity(toCity);
    setToCode(tempCode);
    setToCity(tempCity);
  };

  // Execute Flight Search
  const handleFlightSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

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

    if (redirectToResultsPage) {
      const q = new URLSearchParams({
        type: "flights",
        from: fromCode,
        fromCity,
        to: toCode,
        toCity,
        dep: depDate,
        tripType,
        cabin: cabinClass,
        adults: String(adults),
        children: String(children),
      });
      if (tripType === "ROUND_TRIP" && retDate) {
        q.set("ret", retDate);
      }
      router.push(`/search?${q.toString()}`);
      return;
    }

    if (onSearchSubmitted) {
      onSearchSubmitted("flights", params);
      return;
    }

    if (showResultsInline) {
      setSearching(true);
      setHasSearched(true);
      const results = await searchFlights(params);
      setFlightOffers(results);
      setSearching(false);
    }
  };

  // Execute Hotel Search
  const handleHotelSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params: HotelSearchParams = {
      city: hotelCity,
      checkIn,
      checkOut,
      rooms,
      guests,
    };

    if (redirectToResultsPage) {
      const q = new URLSearchParams({
        type: "hotels",
        city: hotelCity,
        checkIn,
        checkOut,
        guests: String(guests),
        rooms: String(rooms),
      });
      router.push(`/search?${q.toString()}`);
      return;
    }

    if (onSearchSubmitted) {
      onSearchSubmitted("hotels", params);
      return;
    }

    if (showResultsInline) {
      setSearching(true);
      setHasSearched(true);
      const results = await searchHotels(params);
      setHotelOffers(results);
      setSearching(false);
    }
  };

  // Execute Cab Search
  const handleCabSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params: CabSearchParams = {
      pickupLocation: pickupLoc,
      dropoffLocation: dropoffLoc,
      pickupDate: cabDate,
      pickupTime: cabTime,
      vehicleType,
    };

    if (redirectToResultsPage) {
      const q = new URLSearchParams({
        type: "cabs",
        pickup: pickupLoc,
        dropoff: dropoffLoc,
        date: cabDate,
        time: cabTime,
        category: vehicleType,
      });
      router.push(`/search?${q.toString()}`);
      return;
    }

    if (onSearchSubmitted) {
      onSearchSubmitted("cabs", params);
      return;
    }

    if (showResultsInline) {
      setSearching(true);
      setHasSearched(true);
      const results = await searchCabs(params);
      setCabOffers(results);
      setSearching(false);
    }
  };

  // Optional initial search
  useEffect(() => {
    if (autoSearchInitial && showResultsInline) {
      handleFlightSearch();
    }
  }, [autoSearchInitial, showResultsInline]);

  return (
    <div className={cn("w-full", className)}>
      {/* Master Search Bar Card */}
      <div className="relative rounded-[24px] border border-sand-300 bg-white shadow-raised transition-shadow duration-300">
        {/* Top Tab Bar */}
        <div className="flex rounded-t-[23px] border-b border-sand-200 bg-sand-100/60 p-2 sm:px-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("flights");
                setHasSearched(false);
              }}
              className={cn(
                "flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-[0.875rem] font-bold transition-all",
                activeTab === "flights"
                  ? "bg-white text-ink-900 shadow-subtle"
                  : "text-stone-600 hover:text-ink-900"
              )}
            >
              <Plane className="size-4 text-clay-600" />
              <span>Flights</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("hotels");
                setHasSearched(false);
              }}
              className={cn(
                "flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-[0.875rem] font-bold transition-all",
                activeTab === "hotels"
                  ? "bg-white text-ink-900 shadow-subtle"
                  : "text-stone-600 hover:text-ink-900"
              )}
            >
              <Hotel className="size-4 text-clay-600" />
              <span>Hotels</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("cabs");
                setHasSearched(false);
              }}
              className={cn(
                "flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-[0.875rem] font-bold transition-all",
                activeTab === "cabs"
                  ? "bg-white text-ink-900 shadow-subtle"
                  : "text-stone-600 hover:text-ink-900"
              )}
            >
              <Car className="size-4 text-clay-600" />
              <span>Car Rentals</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* FLIGHT SEARCH TAB */}
        {/* ================================================================= */}
        {activeTab === "flights" ? (
          <form onSubmit={handleFlightSearch} className="p-5 sm:p-7">
            {/* Top Toolbar: Trip type & Passenger / Class dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
              <div className="flex items-center gap-3">
                {/* Trip Type Pills */}
                <div className="flex rounded-[10px] border border-sand-300 bg-sand-100 p-0.5 text-[0.8125rem] font-semibold">
                  <button
                    type="button"
                    onClick={() => setTripType("ROUND_TRIP")}
                    className={cn(
                      "rounded-[8px] px-3 py-1 transition-colors",
                      tripType === "ROUND_TRIP"
                        ? "bg-white text-ink-900 shadow-sm"
                        : "text-stone-600 hover:text-ink-900"
                    )}
                  >
                    Round Trip
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType("ONE_WAY")}
                    className={cn(
                      "rounded-[8px] px-3 py-1 transition-colors",
                      tripType === "ONE_WAY"
                        ? "bg-white text-ink-900 shadow-sm"
                        : "text-stone-600 hover:text-ink-900"
                    )}
                  >
                    One Way
                  </button>
                </div>

                {/* Cabin Class Selector */}
                <select
                  value={cabinClass}
                  onChange={(e) =>
                    setCabinClass(e.target.value as typeof cabinClass)
                  }
                  className="rounded-[10px] border border-sand-300 bg-white px-3 py-1.5 text-[0.8125rem] font-semibold text-ink-900 focus:outline-none focus:ring-2 focus:ring-clay-500"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business Class</option>
                  <option value="FIRST">First Class</option>
                </select>
              </div>

              {/* Passengers Popover Trigger */}
              <div ref={paxRef} className={cn("relative", showPaxPopover && "z-30")}>
                <button
                  type="button"
                  onClick={() => setShowPaxPopover(!showPaxPopover)}
                  className="inline-flex items-center gap-2 rounded-[10px] border border-sand-300 bg-white px-3 py-1.5 text-[0.8125rem] font-semibold text-ink-900 hover:border-sand-400"
                >
                  <Users className="size-3.5 text-stone-500" />
                  <span>
                    {adults + children} Traveler{adults + children > 1 ? "s" : ""}
                  </span>
                  <ChevronDown className="size-3 text-stone-400" />
                </button>

                {showPaxPopover ? (
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-[16px] border border-sand-300 bg-white p-4 shadow-2xl animate-fade-in">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-body-sm font-bold text-ink-900">
                            Adults
                          </p>
                          <p className="text-[0.6875rem] text-stone-500">
                            Age 12+
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={adults <= 1}
                            onClick={() => setAdults(adults - 1)}
                            className="size-7 rounded-full border border-sand-300 bg-sand-100 font-bold text-ink-900 disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-ink-900">
                            {adults}
                          </span>
                          <button
                            type="button"
                            onClick={() => setAdults(adults + 1)}
                            className="size-7 rounded-full border border-sand-300 bg-sand-100 font-bold text-ink-900"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-sand-200 pt-3">
                        <div>
                          <p className="text-body-sm font-bold text-ink-900">
                            Children
                          </p>
                          <p className="text-[0.6875rem] text-stone-500">
                            Age 2-11
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={children <= 0}
                            onClick={() => setChildren(children - 1)}
                            className="size-7 rounded-full border border-sand-300 bg-sand-100 font-bold text-ink-900 disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-ink-900">
                            {children}
                          </span>
                          <button
                            type="button"
                            onClick={() => setChildren(children + 1)}
                            className="size-7 rounded-full border border-sand-300 bg-sand-100 font-bold text-ink-900"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => setShowPaxPopover(false)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_auto_1.3fr_1.1fr_1.1fr_auto]">
              {/* Departure (From) */}
              <div ref={fromRef} className={cn("relative", showFromSuggestions && "z-30")}>
                <div
                  onClick={() => setShowFromSuggestions(true)}
                  className="flex h-14 cursor-pointer items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors hover:border-sand-400 focus-within:border-clay-500"
                >
                  <Plane className="size-5 text-clay-600 shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                      From
                    </span>
                    <span className="font-display text-[0.9375rem] font-bold text-ink-900 truncate">
                      {fromCity}
                    </span>
                  </div>
                </div>

                {/* Suggestions Popover */}
                {showFromSuggestions ? (
                  <div className="absolute left-0 top-full z-50 mt-2 w-72 sm:w-80 rounded-[16px] border border-sand-300 bg-white p-2 shadow-2xl animate-fade-in">
                    <div className="p-2">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search city or code (e.g. DXB)..."
                        value={fromQuery}
                        onChange={(e) => setFromQuery(e.target.value)}
                        className="w-full rounded-[8px] border border-sand-300 px-3 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-clay-500"
                      />
                    </div>
                    <ul className="max-h-56 overflow-y-auto space-y-1">
                      {searchAirports(fromQuery).map((airport) => (
                        <li key={airport.code}>
                          <button
                            type="button"
                            onClick={() => {
                              setFromCode(airport.code);
                              setFromCity(`${airport.city} (${airport.code})`);
                              setShowFromSuggestions(false);
                            }}
                            className="flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-body-sm hover:bg-sand-100 transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-ink-900">
                                {airport.city}
                              </p>
                              <p className="text-[0.6875rem] text-stone-500">
                                {airport.name}
                              </p>
                            </div>
                            <span className="rounded bg-sand-200 px-2 py-0.5 font-mono text-[0.75rem] font-bold text-clay-700">
                              {airport.code}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Swap Button */}
              <div className="hidden lg:flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  title="Swap Origin and Destination"
                  className="flex size-10 items-center justify-center rounded-full border border-sand-300 bg-white text-stone-600 hover:border-sand-400 hover:bg-sand-100 hover:text-ink-900 transition-all active:scale-95"
                >
                  <ArrowLeftRight className="size-4" />
                </button>
              </div>

              {/* Destination (To) */}
              <div ref={toRef} className={cn("relative", showToSuggestions && "z-30")}>
                <div
                  onClick={() => setShowToSuggestions(true)}
                  className="flex h-14 cursor-pointer items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors hover:border-sand-400 focus-within:border-clay-500"
                >
                  <MapPin className="size-5 text-clay-600 shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                      To
                    </span>
                    <span className="font-display text-[0.9375rem] font-bold text-ink-900 truncate">
                      {toCity}
                    </span>
                  </div>
                </div>

                {/* Suggestions Popover */}
                {showToSuggestions ? (
                  <div className="absolute left-0 top-full z-50 mt-2 w-72 sm:w-80 rounded-[16px] border border-sand-300 bg-white p-2 shadow-2xl animate-fade-in">
                    <div className="p-2">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search city or code (e.g. LHR)..."
                        value={toQuery}
                        onChange={(e) => setToQuery(e.target.value)}
                        className="w-full rounded-[8px] border border-sand-300 px-3 py-1.5 text-body-sm focus:outline-none focus:ring-1 focus:ring-clay-500"
                      />
                    </div>
                    <ul className="max-h-56 overflow-y-auto space-y-1">
                      {searchAirports(toQuery).map((airport) => (
                        <li key={airport.code}>
                          <button
                            type="button"
                            onClick={() => {
                              setToCode(airport.code);
                              setToCity(`${airport.city} (${airport.code})`);
                              setShowToSuggestions(false);
                            }}
                            className="flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left text-body-sm hover:bg-sand-100 transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-ink-900">
                                {airport.city}
                              </p>
                              <p className="text-[0.6875rem] text-stone-500">
                                {airport.name}
                              </p>
                            </div>
                            <span className="rounded bg-sand-200 px-2 py-0.5 font-mono text-[0.75rem] font-bold text-clay-700">
                              {airport.code}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Departure Date */}
              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-clay-500">
                <Calendar className="size-5 text-clay-600 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                    Departure
                  </span>
                  <input
                    type="date"
                    required
                    min={todayISO()}
                    value={depDate}
                    onChange={(e) => setDepDate(e.target.value)}
                    className="w-full bg-transparent font-display text-[0.875rem] font-bold text-ink-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Return Date */}
              {tripType === "ROUND_TRIP" ? (
                <div className="flex h-14 items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-clay-500">
                  <Calendar className="size-5 text-clay-600 shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                      Return
                    </span>
                    <input
                      type="date"
                      required
                      min={depDate || todayISO()}
                      value={retDate}
                      onChange={(e) => setRetDate(e.target.value)}
                      className="w-full bg-transparent font-display text-[0.875rem] font-bold text-ink-900 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex h-14 items-center rounded-[12px] border border-dashed border-sand-300 bg-sand-100/40 px-3.5 text-stone-400 text-body-sm">
                  One Way Journey
                </div>
              )}

              {/* Search Button */}
              <div className="sm:col-span-2 lg:col-span-1">
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={searching}
                  className="h-14 w-full px-6 font-bold"
                >
                  {searching ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="size-4" />
                      <span>Search</span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        ) : null}

        {/* ================================================================= */}
        {/* HOTEL SEARCH TAB */}
        {/* ================================================================= */}
        {activeTab === "hotels" ? (
          <form onSubmit={handleHotelSearch} className="p-5 sm:p-7">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.8fr_1.2fr_1.2fr_1.2fr_auto]">
              {/* Destination */}
              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-clay-500">
                <MapPin className="size-5 text-clay-600 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                    Destination / City
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dubai, London, Bali"
                    value={hotelCity}
                    onChange={(e) => setHotelCity(e.target.value)}
                    className="w-full bg-transparent font-display text-[0.9375rem] font-bold text-ink-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-clay-500">
                <Calendar className="size-5 text-clay-600 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                    Check-In
                  </span>
                  <input
                    type="date"
                    required
                    min={todayISO()}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent font-display text-[0.875rem] font-bold text-ink-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-clay-500">
                <Calendar className="size-5 text-clay-600 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                    Check-Out
                  </span>
                  <input
                    type="date"
                    required
                    min={checkIn || todayISO()}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent font-display text-[0.875rem] font-bold text-ink-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Rooms & Guests */}
              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-clay-500">
                <Users className="size-5 text-clay-600 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                    Guests / Rooms
                  </span>
                  <select
                    value={`${guests}-${rooms}`}
                    onChange={(e) => {
                      const [g, r] = e.target.value.split("-");
                      setGuests(Number(g));
                      setRooms(Number(r));
                    }}
                    className="w-full bg-transparent font-display text-[0.875rem] font-bold text-ink-900 focus:outline-none"
                  >
                    <option value="1-1">1 Guest, 1 Room</option>
                    <option value="2-1">2 Guests, 1 Room</option>
                    <option value="4-2">4 Guests, 2 Rooms</option>
                    <option value="6-3">6+ Guests, 3 Rooms</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-2 lg:col-span-1">
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={searching}
                  className="h-14 w-full px-6 font-bold"
                >
                  {searching ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="size-4" />
                      <span>Search</span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        ) : null}

        {/* ================================================================= */}
        {/* CAB / CAR RENTAL SEARCH TAB */}
        {/* ================================================================= */}
        {activeTab === "cabs" ? (
          <form onSubmit={handleCabSearch} className="p-5 sm:p-7">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1.1fr_1fr_auto]">
              {/* Pickup Location */}
              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-clay-500">
                <MapPin className="size-5 text-clay-600 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                    Pickup Location
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Airport, hotel, address"
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className="w-full bg-transparent font-display text-[0.9375rem] font-bold text-ink-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Drop-off Location */}
              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-clay-500">
                <MapPin className="size-5 text-clay-600 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                    Drop-off Location
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City center, destination"
                    value={dropoffLoc}
                    onChange={(e) => setDropoffLoc(e.target.value)}
                    className="w-full bg-transparent font-display text-[0.9375rem] font-bold text-ink-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-clay-500">
                <Calendar className="size-5 text-clay-600 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                    Pickup Date
                  </span>
                  <input
                    type="date"
                    required
                    min={todayISO()}
                    value={cabDate}
                    onChange={(e) => setCabDate(e.target.value)}
                    className="w-full bg-transparent font-display text-[0.875rem] font-bold text-ink-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="flex h-14 items-center gap-3 rounded-[12px] border border-sand-300 bg-white px-3.5 transition-colors focus-within:border-clay-500">
                <Car className="size-5 text-clay-600 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-stone-500">
                    Vehicle Type
                  </span>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full bg-transparent font-display text-[0.875rem] font-bold text-ink-900 focus:outline-none"
                  >
                    <option value="ANY">Any Category</option>
                    <option value="SEDAN">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="LUXURY">Luxury</option>
                    <option value="VAN">Van / Minibus</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-2 lg:col-span-1">
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={searching}
                  className="h-14 w-full px-6 font-bold"
                >
                  {searching ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="size-4" />
                      <span>Search</span>
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        ) : null}
      </div>

      {/* =================================================================== */}
      {/* SEARCH RESULTS SECTION */}
      {/* =================================================================== */}
      {showResultsInline && activeTab === "flights" && (hasSearched || flightOffers.length > 0) ? (
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
          flights={flightOffers}
          loading={searching}
          onSelectFlight={(flight) => {
            setBookingData({
              type: "flight",
              item: flight,
              summary: `${flight.airline} (${flight.flightNumber}) • ${flight.departureAirport} → ${flight.arrivalAirport}`,
              price: flight.price,
            });
          }}
        />
      ) : null}

      {showResultsInline && activeTab === "hotels" && (hasSearched || hotelOffers.length > 0) ? (
        <HotelSearchResults
          searchParams={{
            city: hotelCity,
            checkIn,
            checkOut,
            rooms,
            guests,
          }}
          hotels={hotelOffers}
          loading={searching}
          onSelectHotel={(hotel) => {
            setBookingData({
              type: "hotel",
              item: hotel,
              summary: `${hotel.name} • ${hotel.roomType} (${hotel.city})`,
              price: hotel.totalPrice,
            });
          }}
        />
      ) : null}

      {showResultsInline && activeTab === "cabs" && (hasSearched || cabOffers.length > 0) ? (
        <CabSearchResults
          searchParams={{
            pickupLocation: pickupLoc,
            dropoffLocation: dropoffLoc,
            pickupDate: cabDate,
            pickupTime: cabTime,
            vehicleType,
          }}
          cabs={cabOffers}
          loading={searching}
          onSelectCab={(cab) => {
            setBookingData({
              type: "cab",
              item: cab,
              summary: `${cab.model} (${cab.category}) • ${pickupLoc}`,
              price: cab.totalPrice,
            });
          }}
        />
      ) : null}

      {/* Booking Modal */}
      {showResultsInline && bookingData ? (
        <BookingModal
          data={bookingData}
          onClose={() => setBookingData(null)}
        />
      ) : null}
    </div>
  );
}
