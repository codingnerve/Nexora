import { env } from "../config/env";

export interface DuffelSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  cabin?: string;
  adults?: number;
  children?: number;
  infants?: number;
}

export interface DuffelSegment {
  id: string;
  flightNumber?: string;
  carrier?: {
    name?: string;
    code?: string;
    logoUrl?: string | null;
  };
  origin?: string;
  originName?: string;
  destination?: string;
  destinationName?: string;
  departingAt?: string;
  arrivingAt?: string;
  duration?: string;
  aircraft?: string;
  cabin?: string;
}

export interface DuffelSlice {
  origin?: string;
  originName?: string;
  destination?: string;
  destinationName?: string;
  duration?: string;
  fareBrand?: string;
  segments?: DuffelSegment[];
}

export interface MappedFlightOffer {
  id: string;
  totalAmount?: number;
  baseAmount?: number;
  taxAmount?: number;
  currency?: string;
  owner?: {
    name?: string;
    code?: string;
    logoUrl?: string | null;
  };
  expiresAt?: string;
  slices?: DuffelSlice[];
}

function mapSegment(s: any): DuffelSegment {
  const cabinInfo = s.passengers?.[0];
  const marketingCarrier = s.marketing_carrier || s.operating_carrier || s.carrier;
  const flightNum = s.marketing_carrier_flight_number || s.operating_carrier_flight_number || s.flight_number;

  return {
    id: s.id,
    flightNumber: flightNum
      ? `${marketingCarrier?.iata_code || ""}${flightNum}`
      : undefined,
    carrier: {
      name: marketingCarrier?.name,
      code: marketingCarrier?.iata_code || marketingCarrier?.code,
      logoUrl: marketingCarrier?.logo_symbol_url || marketingCarrier?.logo_lockup_url || null,
    },
    origin: s.origin?.iata_code || s.origin?.code || s.origin,
    originName: s.origin?.city_name || s.origin?.name,
    destination: s.destination?.iata_code || s.destination?.code || s.destination,
    destinationName: s.destination?.city_name || s.destination?.name,
    departingAt: s.departing_at || s.departingAt,
    arrivingAt: s.arriving_at || s.arrivingAt,
    duration: s.duration,
    aircraft: s.aircraft?.name || s.aircraft,
    cabin: cabinInfo?.cabin_class_marketing_name || cabinInfo?.cabin_class,
  };
}

function mapSlice(sl: any): DuffelSlice {
  return {
    origin: sl.origin?.iata_code || sl.origin?.code || sl.origin,
    originName: sl.origin?.city_name || sl.origin?.name,
    destination: sl.destination?.iata_code || sl.destination?.code || sl.destination,
    destinationName: sl.destination?.city_name || sl.destination?.name,
    duration: sl.duration,
    fareBrand: sl.fare_brand_name || sl.fareBrand,
    segments: Array.isArray(sl.segments) ? sl.segments.map(mapSegment) : [],
  };
}

export function mapDuffelOffer(offer: any): MappedFlightOffer {
  return {
    id: offer.id,
    totalAmount: offer.total_amount ? Number(offer.total_amount) : offer.totalAmount ? Number(offer.totalAmount) : undefined,
    baseAmount: offer.base_amount ? Number(offer.base_amount) : offer.baseAmount ? Number(offer.baseAmount) : undefined,
    taxAmount: offer.tax_amount ? Number(offer.tax_amount) : offer.taxAmount ? Number(offer.taxAmount) : undefined,
    currency: offer.total_currency || offer.currency,
    owner: {
      name: offer.owner?.name,
      code: offer.owner?.iata_code || offer.owner?.code,
      logoUrl: offer.owner?.logo_symbol_url || offer.owner?.logo_lockup_url || offer.owner?.logoUrl || null,
    },
    expiresAt: offer.expires_at || offer.expiresAt,
    slices: Array.isArray(offer.slices) ? offer.slices.map(mapSlice) : [],
  };
}

/**
 * Searches Duffel flight offer requests.
 */
export async function searchDuffelOffers(params: DuffelSearchParams): Promise<MappedFlightOffer[]> {
  if (!env.DUFFEL_ACCESS_TOKEN) {
    throw new Error("DUFFEL_ACCESS_TOKEN is not configured on the backend.");
  }

  const adults = Math.max(1, Math.min(9, Number(params.adults) || 1));
  const children = Math.max(0, Math.min(8, Number(params.children) || 0));
  const infants = Math.max(0, Math.min(8, Number(params.infants) || 0));

  const passengers: Array<{ type?: string; age?: number }> = [];
  for (let i = 0; i < adults; i++) passengers.push({ type: "adult" });
  for (let i = 0; i < children; i++) passengers.push({ age: 8 });
  for (let i = 0; i < infants; i++) passengers.push({ type: "infant_without_seat" });

  const slices = [
    {
      origin: params.origin.toUpperCase().trim().slice(0, 3),
      destination: params.destination.toUpperCase().trim().slice(0, 3),
      departure_date: params.departDate,
    },
  ];

  if (params.returnDate) {
    slices.push({
      origin: params.destination.toUpperCase().trim().slice(0, 3),
      destination: params.origin.toUpperCase().trim().slice(0, 3),
      departure_date: params.returnDate,
    });
  }

  const cabinClass = (params.cabin || "economy").toLowerCase();

  const baseUrl = env.DUFFEL_API_URL.replace(/\/$/, "");
  const endpoint = `${baseUrl}/air/offer_requests?return_offers=true`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.DUFFEL_ACCESS_TOKEN}`,
      "Duffel-Version": env.DUFFEL_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      data: {
        slices,
        passengers,
        cabin_class: cabinClass,
      },
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as any;
    const errorMsg =
      errorData?.errors?.[0]?.message ||
      errorData?.errors?.[0]?.title ||
      `Duffel API returned HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  const json = (await response.json()) as any;
  const offers = json?.data?.offers || [];
  return offers.map(mapDuffelOffer);
}

/**
 * Retrieves a single Duffel offer by its ID.
 */
export async function getDuffelOfferById(offerId: string): Promise<MappedFlightOffer | null> {
  if (!env.DUFFEL_ACCESS_TOKEN) {
    throw new Error("DUFFEL_ACCESS_TOKEN is not configured on the backend.");
  }

  const baseUrl = env.DUFFEL_API_URL.replace(/\/$/, "");
  const endpoint = `${baseUrl}/air/offers/${encodeURIComponent(offerId)}`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${env.DUFFEL_ACCESS_TOKEN}`,
      "Duffel-Version": env.DUFFEL_VERSION,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as any;
  return json?.data ? mapDuffelOffer(json.data) : null;
}
