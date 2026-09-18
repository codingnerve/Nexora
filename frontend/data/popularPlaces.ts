/**
 * Popular places shown on the flights, hotels and cabs pages.
 *
 * The United States leads — it is the market the business wants to focus on —
 * followed by a short list of European countries. Each city carries its main
 * arrival airport so one record can pre-fill a flight search ("Los Angeles
 * (LAX)"), a hotel search ("Los Angeles, California") and a cab pickup ("Los
 * Angeles International Airport (LAX)").
 *
 * Like the rest of the site, these are places we can help with, not a claim
 * about fares, rooms or vehicles available in them.
 */

export interface PopularCity {
  readonly name: string;
  /** IATA code of the main airport a visitor would arrive at. */
  readonly airportCode: string;
  readonly airportName: string;
}

export interface PlaceGroup {
  /** A US state or a country. */
  readonly region: string;
  readonly country: string;
  readonly cities: readonly PopularCity[];
}

export const US_PLACES: readonly PlaceGroup[] = [
  {
    region: "California",
    country: "United States",
    cities: [
      { name: "Los Angeles", airportCode: "LAX", airportName: "Los Angeles International Airport" },
      { name: "San Francisco", airportCode: "SFO", airportName: "San Francisco International Airport" },
    ],
  },
  {
    region: "New York",
    country: "United States",
    cities: [{ name: "New York City", airportCode: "JFK", airportName: "John F. Kennedy International Airport" }],
  },
  {
    region: "Florida",
    country: "United States",
    cities: [
      { name: "Miami", airportCode: "MIA", airportName: "Miami International Airport" },
      { name: "Orlando", airportCode: "MCO", airportName: "Orlando International Airport" },
    ],
  },
  {
    region: "Massachusetts",
    country: "United States",
    cities: [{ name: "Boston", airportCode: "BOS", airportName: "Boston Logan International Airport" }],
  },
  {
    region: "Washington",
    country: "United States",
    cities: [{ name: "Seattle", airportCode: "SEA", airportName: "Seattle–Tacoma International Airport" }],
  },
  {
    region: "Hawaii",
    country: "United States",
    cities: [{ name: "Honolulu", airportCode: "HNL", airportName: "Daniel K. Inouye International Airport" }],
  },
  {
    region: "New Jersey",
    country: "United States",
    cities: [
      { name: "Newark", airportCode: "EWR", airportName: "Newark Liberty International Airport" },
      { name: "Jersey City", airportCode: "EWR", airportName: "Newark Liberty International Airport" },
    ],
  },
  {
    region: "Nevada",
    country: "United States",
    cities: [{ name: "Las Vegas", airportCode: "LAS", airportName: "Harry Reid International Airport" }],
  },
  {
    region: "Illinois",
    country: "United States",
    cities: [{ name: "Chicago", airportCode: "ORD", airportName: "O'Hare International Airport" }],
  },
];

export const EUROPE_PLACES: readonly PlaceGroup[] = [
  {
    region: "France",
    country: "France",
    cities: [
      { name: "Paris", airportCode: "CDG", airportName: "Paris Charles de Gaulle Airport" },
      { name: "Nice", airportCode: "NCE", airportName: "Nice Côte d'Azur Airport" },
    ],
  },
  {
    region: "Italy",
    country: "Italy",
    cities: [
      { name: "Rome", airportCode: "FCO", airportName: "Rome Fiumicino Airport" },
      { name: "Milan", airportCode: "MXP", airportName: "Milan Malpensa Airport" },
      { name: "Venice", airportCode: "VCE", airportName: "Venice Marco Polo Airport" },
    ],
  },
  {
    region: "Spain",
    country: "Spain",
    cities: [
      { name: "Madrid", airportCode: "MAD", airportName: "Adolfo Suárez Madrid–Barajas Airport" },
      { name: "Barcelona", airportCode: "BCN", airportName: "Barcelona–El Prat Airport" },
    ],
  },
  {
    region: "United Kingdom",
    country: "United Kingdom",
    cities: [
      { name: "London", airportCode: "LHR", airportName: "London Heathrow Airport" },
      { name: "Manchester", airportCode: "MAN", airportName: "Manchester Airport" },
      { name: "Edinburgh", airportCode: "EDI", airportName: "Edinburgh Airport" },
    ],
  },
];

/** The destination guide for each city, where there is one. */
const GUIDE_SLUGS: Record<string, string> = {
  "Los Angeles": "los-angeles",
  "San Francisco": "san-francisco",
  "New York City": "new-york",
  Miami: "miami",
  Orlando: "orlando",
  Boston: "boston",
  Seattle: "seattle",
  Honolulu: "honolulu",
  Newark: "jersey-city-newark",
  "Jersey City": "jersey-city-newark",
  "Las Vegas": "las-vegas",
  Chicago: "chicago",
  Paris: "paris",
  Nice: "nice",
  Rome: "rome",
  Milan: "milan",
  Venice: "venice",
  Madrid: "madrid",
  Barcelona: "barcelona",
  London: "london",
  Manchester: "manchester",
  Edinburgh: "edinburgh",
};

export const guideHref = (city: PopularCity): string | undefined => {
  const slug = GUIDE_SLUGS[city.name];
  return slug ? `/destinations/${slug}` : undefined;
};

/** Every city, US first — used for autocomplete suggestions. */
export const POPULAR_CITIES: readonly (PopularCity & { readonly region: string; readonly country: string })[] =
  [...US_PLACES, ...EUROPE_PLACES].flatMap((group) =>
    group.cities.map((city) => ({ ...city, region: group.region, country: group.country }))
  );

/** "Los Angeles, California" or "Rome, Italy". */
export const cityLabel = (city: PopularCity, group: Pick<PlaceGroup, "region">): string =>
  `${city.name}, ${group.region}`;

/** "Los Angeles (LAX)" — matches the flight search suggestions. */
export const flightLabel = (city: PopularCity): string => `${city.name} (${city.airportCode})`;

/** "Los Angeles International Airport (LAX)". */
export const airportLabel = (city: PopularCity): string => `${city.airportName} (${city.airportCode})`;
