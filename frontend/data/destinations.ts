import { DESTINATION_GALLERY, DESTINATION_PHOTOS, type EditorialPhoto } from "@/lib/images";
import type { ImageRatio } from "@/components/ui/EditorialImage";
import { EUROPE_GUIDES, US_GUIDES } from "@/data/cityGuides";

/**
 * Destination content.
 *
 * One record per destination drives the homepage mosaic, the /destinations
 * index and the /destinations/[slug] pages — there is no per-destination page
 * markup anywhere. The US and European city guides live in `cityGuides.ts`
 * and are merged in at the bottom of this file.
 *
 * Content rules applied throughout this file:
 *   - no prices, ratings, review counts or availability
 *   - no visa, entry or immigration claims; those change and depend on
 *     nationality, so the pages point travellers at official guidance instead
 *   - highlights describe what a place is generally known for, nothing more
 *
 * `span` and `ratio` drive the homepage mosaic layout, varied deliberately so
 * the section never reads as a row of identical tiles.
 */

export interface DestinationHighlight {
  readonly title: string;
  readonly body: string;
}

export interface PlanningNote {
  readonly label: string;
  readonly value: string;
}

export interface StayArea {
  readonly name: string;
  readonly body: string;
}

/** Guide content added to each destination record, kept apart for readability. */
interface DestinationGuide {
  /** A short descriptor for tiles, e.g. "City breaks, beaches and big experiences." */
  readonly tagline: string;
  /** General areas visitors tend to stay in. Not a claim about any hotel. */
  readonly areas: readonly StayArea[];
  /** Main arrival airports and how they connect to the city. */
  readonly arrival: string;
  /** A second, different photograph of the destination. */
  readonly gallery: EditorialPhoto;
  /** Whether hotel imagery should lean towards resorts or city stays. */
  readonly stayStyle: "resort" | "city";
}

export interface Destination extends DestinationGuide {
  readonly slug: string;
  readonly name: string;
  readonly country: string;
  /** One line, used on cards. */
  readonly description: string;
  /** Two or three sentences, used at the top of the destination page. */
  readonly overview: string;
  readonly highlights: readonly DestinationHighlight[];
  readonly planning: readonly PlanningNote[];
  readonly image: string;
  readonly imageAlt: string;
  /** 12-column span on the homepage mosaic. Each row must total 12. */
  readonly span: 3 | 4 | 5 | 7 | 8;
  readonly ratio: ImageRatio;
}

const BASE: readonly Omit<Destination, keyof DestinationGuide>[] = [
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    description:
      "From skyline views to desert horizons, Dubai combines city energy with an easy escape.",
    overview:
      "Dubai packs a great deal into a small area: a skyline built within a single generation, a long stretch of calm coastline, and open desert less than an hour from the centre. It works equally well as a week of its own or as a two-day stop on a longer route.",
    highlights: [
      {
        title: "Landmarks",
        body: "The Burj Khalifa and Marina towers at one end of the city, the older quarters around Dubai Creek at the other.",
      },
      {
        title: "Desert",
        body: "Dune drives, camel farms and quiet desert camps within easy reach of the city.",
      },
      {
        title: "Food",
        body: "Emirati home cooking, long-standing South Asian restaurants and a well-known fine dining scene.",
      },
      {
        title: "Shopping",
        body: "Large modern malls at one extreme, the gold and spice souks at the other.",
      },
    ],
    planning: [
      { label: "Best time to visit", value: "November to March, when daytime temperatures are comfortable." },
      { label: "Getting around", value: "A metro line runs the length of the city; taxis cover the rest." },
      { label: "Suggested length", value: "Three to five days, or two as a stopover." },
    ],
    image: DESTINATION_PHOTOS.dubai.src,
    imageAlt: DESTINATION_PHOTOS.dubai.alt,
    span: 7,
    ratio: "wide",
  },
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    description:
      "Temples, rice terraces and coastline, with stays from simple to serious.",
    overview:
      "Bali changes character as you move across it: surf and beach clubs on the south coast, rice terraces and temples inland around Ubud, and quieter volcanic country to the north and east. Distances look short on a map and take longer in practice.",
    highlights: [
      { title: "Temples", body: "Lakeside and clifftop temples, several of which are still in daily use." },
      { title: "Rice terraces", body: "Terraced valleys inland, best seen early before the day warms up." },
      { title: "Beaches and surf", body: "Consistent surf on the west coast and calmer water on the east." },
      { title: "Food", body: "Warungs serving Balinese staples alongside a large international scene." },
    ],
    planning: [
      { label: "Best time to visit", value: "April to October is the drier season." },
      { label: "Getting around", value: "Most visitors hire a driver for the day; roads are slow." },
      { label: "Suggested length", value: "Seven to ten days to see more than one part of the island." },
    ],
    image: DESTINATION_PHOTOS.bali.src,
    imageAlt: DESTINATION_PHOTOS.bali.alt,
    span: 5,
    ratio: "tall",
  },
  {
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    description: "Clear lagoons, island resorts and a pace that slows right down.",
    overview:
      "The Maldives is a chain of coral atolls spread across the Indian Ocean, where most resorts occupy an island of their own. Where you stay shapes the whole trip, because the island is also where you eat, swim and spend most of your time.",
    highlights: [
      { title: "Lagoons and reefs", body: "Shallow, clear water and house reefs you can often snorkel from the beach." },
      { title: "Overwater villas", body: "Villas built out over the lagoon, a signature of many resorts." },
      { title: "Marine life", body: "Manta rays, turtles and reef sharks across many of the atolls." },
      { title: "Local islands", body: "Inhabited islands with guesthouses, for a simpler and quieter stay." },
    ],
    planning: [
      { label: "Best time to visit", value: "December to April is the drier season." },
      { label: "Getting around", value: "Speedboats and seaplanes; resorts usually arrange the transfer." },
      { label: "Suggested length", value: "Five to seven days." },
    ],
    image: DESTINATION_PHOTOS.maldives.src,
    imageAlt: DESTINATION_PHOTOS.maldives.alt,
    span: 4,
    ratio: "portrait",
  },
  {
    slug: "singapore",
    name: "Singapore",
    country: "Singapore",
    description: "Compact, easy to get around, and a practical stopover on longer routes.",
    overview:
      "Singapore is small enough to cross in under an hour and dense enough to fill several days. It is one of the easiest cities anywhere to navigate, which makes it as good for a short stopover as for a full trip.",
    highlights: [
      { title: "Gardens and waterfront", body: "The Marina Bay waterfront and the gardens and glasshouses beside it." },
      { title: "Hawker food", body: "Hawker centres serving Chinese, Malay and Peranakan cooking side by side." },
      { title: "Neighbourhoods", body: "Kampong Glam, Chinatown and Tiong Bahru, all walkable and distinct." },
      { title: "Nature", body: "Rainforest reserves and coastal parks within the city limits." },
    ],
    planning: [
      { label: "Best time to visit", value: "Warm and humid year round; rain is short and heavy." },
      { label: "Getting around", value: "The MRT reaches almost everywhere a visitor needs to go." },
      { label: "Suggested length", value: "Two to four days, or one as a stopover." },
    ],
    image: DESTINATION_PHOTOS.singapore.src,
    imageAlt: DESTINATION_PHOTOS.singapore.alt,
    span: 4,
    ratio: "portrait",
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    description: "Temples and street food, and a useful gateway to the islands.",
    overview:
      "Bangkok rewards a few days before most people move on to the coast or the north. Temples and the river sit at its historic centre, while the newer districts along the rail lines are where much of the eating and shopping happens.",
    highlights: [
      { title: "Temples", body: "The Grand Palace, Wat Pho and Wat Arun within a short distance of each other." },
      { title: "Street food", body: "One of the densest street food cultures anywhere, at all hours." },
      { title: "Markets", body: "Weekend markets, flower markets and night markets across the city." },
      { title: "The river", body: "Express boats and canals that are often faster than the roads." },
    ],
    planning: [
      { label: "Best time to visit", value: "November to February is cooler and drier." },
      { label: "Getting around", value: "Skytrain and metro, plus river boats; traffic is heavy." },
      { label: "Suggested length", value: "Three to four days, often before continuing onward." },
    ],
    image: DESTINATION_PHOTOS.bangkok.src,
    imageAlt: DESTINATION_PHOTOS.bangkok.alt,
    span: 4,
    ratio: "portrait",
  },
  {
    slug: "london",
    name: "London",
    country: "United Kingdom",
    description: "A long-haul standard, and a sensible base for the rest of Europe.",
    overview:
      "London is a city of distinct neighbourhoods rather than a single centre, and it rewards picking two or three areas rather than trying to cover all of it. It is also one of the best-connected places in Europe for onward travel.",
    highlights: [
      { title: "Museums", body: "Several of the major national museums are free to enter." },
      { title: "Parks", body: "Large royal parks running through the middle of the city." },
      { title: "Theatre", body: "One of the largest concentrations of working theatres anywhere." },
      { title: "Markets", body: "Food and antique markets, each anchoring its own neighbourhood." },
    ],
    planning: [
      { label: "Best time to visit", value: "Late spring and early autumn are mildest and least crowded." },
      { label: "Getting around", value: "The Underground plus a great deal of walking." },
      { label: "Suggested length", value: "Four to five days, more if continuing by rail." },
    ],
    image: DESTINATION_PHOTOS.london.src,
    imageAlt: DESTINATION_PHOTOS.london.alt,
    span: 5,
    ratio: "landscape",
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    description: "Walkable, well connected by rail, and good in every season.",
    overview:
      "Paris is compact enough to walk across and dense enough that most visits are spent in a handful of arrondissements. The river divides the city usefully, and the rail connections make it a natural start or end to a longer European trip.",
    highlights: [
      { title: "Museums and galleries", body: "From the very large national collections to small single-artist houses." },
      { title: "The Seine", body: "The bridges and quaysides, which are the simplest way to orient yourself." },
      { title: "Food and markets", body: "Neighbourhood markets, bakeries and long-established bistros." },
      { title: "Neighbourhoods", body: "Le Marais, Montmartre and the Latin Quarter, each quite different." },
    ],
    planning: [
      { label: "Best time to visit", value: "April to June and September to October." },
      { label: "Getting around", value: "The Metro is dense; much of the centre is walkable." },
      { label: "Suggested length", value: "Three to five days." },
    ],
    image: DESTINATION_PHOTOS.paris.src,
    imageAlt: DESTINATION_PHOTOS.paris.alt,
    span: 3,
    ratio: "tall",
  },
  {
    slug: "new-york",
    name: "New York",
    country: "United States",
    description: "Dense, fast and walkable, with plenty to do between meetings.",
    overview:
      "New York is more walkable than its reputation suggests, and the subway covers what walking does not. Manhattan is where most first visits concentrate, though Brooklyn and Queens are where a lot of the eating and music happens.",
    highlights: [
      { title: "Museums", body: "Major art and natural history collections, several open late one night a week." },
      { title: "Parks", body: "Central Park and the High Line, both best early in the day." },
      { title: "Food", body: "Close to every cuisine, at every price, across all five boroughs." },
      { title: "Neighbourhoods", body: "Distinct districts within short subway rides of each other." },
    ],
    planning: [
      { label: "Best time to visit", value: "April to June and September to November." },
      { label: "Getting around", value: "The subway runs all night; walking covers most of Manhattan." },
      { label: "Suggested length", value: "Four to six days." },
    ],
    image: DESTINATION_PHOTOS.newYork.src,
    imageAlt: DESTINATION_PHOTOS.newYork.alt,
    span: 4,
    ratio: "landscape",
  },
] as const;

/* ---------------------------------------------------------------------------
 * Guide content
 *
 * Areas and arrival notes are general, long-standing orientation — which part
 * of a city is which, and which airports serve it. They make no claim about
 * specific hotels, availability, prices, journey times or fares.
 * ------------------------------------------------------------------------- */

const GUIDES: Record<string, DestinationGuide> = {
  dubai: {
    tagline: "City breaks, beaches and big experiences.",
    areas: [
      { name: "Downtown Dubai", body: "Around the Burj Khalifa and Dubai Mall — central, busy and well placed for a first visit." },
      { name: "Dubai Marina and JBR", body: "High-rise waterfront living with a long public beach and plenty of places to eat." },
      { name: "Deira and Bur Dubai", body: "The older quarters either side of Dubai Creek, close to the souks and the abra crossings." },
      { name: "Palm Jumeirah", body: "Resort-style stays on the man-made island, suited to slower beach days." },
    ],
    arrival:
      "Most international flights arrive at Dubai International (DXB), which sits close to the city. The Metro Red Line serves Terminals 1 and 3, and taxis wait at every terminal. Some airlines use Al Maktoum International (DWC), which is considerably further out.",
    gallery: DESTINATION_GALLERY.dubai,
    stayStyle: "city",
  },
  bali: {
    tagline: "Temples, rice terraces and island stays.",
    areas: [
      { name: "Seminyak", body: "Beach clubs, restaurants and boutiques on the south-west coast." },
      { name: "Ubud", body: "Inland, among rice terraces, temples and craft villages, with quieter evenings." },
      { name: "Nusa Dua", body: "A planned resort area with calm water, suited to families and longer stays." },
      { name: "Canggu", body: "Surf beaches and cafés, with a relaxed, informal feel." },
    ],
    arrival:
      "Flights arrive at Ngurah Rai International (DPS) in the south of the island. There is no rail network and road journeys often take longer than the distances suggest, so many visitors arrange a car and driver in advance.",
    gallery: DESTINATION_GALLERY.bali,
    stayStyle: "resort",
  },
  maldives: {
    tagline: "Island resorts, clear lagoons and slow days.",
    areas: [
      { name: "North and South Malé Atolls", body: "The closest resorts to the airport, often reachable by speedboat." },
      { name: "Ari Atoll", body: "Known for diving, snorkelling and seasonal whale shark sightings." },
      { name: "Baa Atoll", body: "A UNESCO biosphere reserve, reached by seaplane or domestic flight." },
      { name: "Maafushi", body: "A local island with guesthouses, suited to a simpler, lower-key stay." },
    ],
    arrival:
      "International flights arrive at Velana International (MLE), on its own island beside the capital, Malé. Onward transfers are by speedboat, seaplane or domestic flight depending on the atoll, so mention your resort when you ask about flights.",
    gallery: DESTINATION_GALLERY.maldives,
    stayStyle: "resort",
  },
  singapore: {
    tagline: "A compact city that makes an easy stopover.",
    areas: [
      { name: "Marina Bay", body: "The waterfront skyline, the gardens and the business district in one area." },
      { name: "Orchard Road", body: "The main shopping street, with good MRT connections in both directions." },
      { name: "Clarke Quay and Riverside", body: "Restaurants and bars along the Singapore River, close to the centre." },
      { name: "Sentosa", body: "An island resort area just off the south coast, popular with families." },
    ],
    arrival:
      "Singapore Changi Airport (SIN) is in the east of the island. The MRT connects the airport with the city, and taxis and pre-arranged cars are straightforward for arrivals with luggage.",
    gallery: DESTINATION_GALLERY.singapore,
    stayStyle: "city",
  },
  bangkok: {
    tagline: "Temples, street food and a gateway to Thailand.",
    areas: [
      { name: "Riverside", body: "Along the Chao Phraya, with river boats to the Grand Palace and the old town." },
      { name: "Sukhumvit", body: "Long, lively and served by the Skytrain, with a great deal of dining." },
      { name: "Silom and Sathorn", body: "The business district — convenient for meetings and the metro." },
      { name: "Rattanakosin", body: "The historic old town around the Grand Palace and Wat Pho." },
    ],
    arrival:
      "Bangkok has two airports: Suvarnabhumi (BKK), which handles most international flights and is linked to the city by the Airport Rail Link, and Don Mueang (DMK), used by many low-cost and domestic services. Check which one your flight uses before planning the transfer.",
    gallery: DESTINATION_GALLERY.bangkok,
    stayStyle: "city",
  },
  london: {
    tagline: "Museums, neighbourhoods and onward European travel.",
    areas: [
      { name: "Westminster and South Bank", body: "The river, the landmarks and the theatres and galleries of the South Bank." },
      { name: "Covent Garden and the West End", body: "Central, walkable and close to most of the major theatres." },
      { name: "Kensington", body: "Quieter streets near the large museums and Hyde Park." },
      { name: "The City and Shoreditch", body: "The financial district, and the busier east London streets beside it." },
    ],
    arrival:
      "London is served by several airports, most often Heathrow (LHR) and Gatwick (LGW), as well as Stansted, Luton and London City. Heathrow connects to central London by the Elizabeth line, the Piccadilly line and the Heathrow Express; Gatwick has direct trains into the city.",
    gallery: DESTINATION_GALLERY.london,
    stayStyle: "city",
  },
  paris: {
    tagline: "Walkable streets, galleries and river views.",
    areas: [
      { name: "Le Marais", body: "Narrow streets, small museums and a great many places to eat." },
      { name: "Saint-Germain-des-Prés", body: "The Left Bank — cafés, bookshops and easy walks to the river." },
      { name: "Around the Louvre", body: "Very central, with the Tuileries and the Seine on the doorstep." },
      { name: "Montmartre", body: "On the hill in the north, with views over the city and a village feel." },
    ],
    arrival:
      "Most long-haul flights arrive at Charles de Gaulle (CDG), with others using Orly (ORY) to the south. Both are connected to the city by train and airport bus, and a pre-arranged car is often simpler with luggage or a late arrival.",
    gallery: DESTINATION_GALLERY.paris,
    stayStyle: "city",
  },
  "new-york": {
    tagline: "Big-city energy, one neighbourhood at a time.",
    areas: [
      { name: "Midtown Manhattan", body: "Central for theatres, shopping and most first-time sightseeing." },
      { name: "Lower Manhattan", body: "The Financial District and the waterfront, with good subway connections." },
      { name: "Upper West and East Side", body: "Residential streets beside Central Park and the major museums." },
      { name: "Brooklyn", body: "Neighbourhoods such as Williamsburg and DUMBO, with skyline views back to Manhattan." },
    ],
    arrival:
      "New York is served by John F. Kennedy (JFK), LaGuardia (LGA) and Newark Liberty (EWR) in New Jersey. AirTrain links JFK and Newark to the rail network, and taxis and pre-arranged cars work from all three.",
    gallery: DESTINATION_GALLERY.newYork,
    stayStyle: "city",
  },
};

const ORIGINAL: readonly Destination[] = BASE.map((destination) => {
  const guide = GUIDES[destination.slug];
  if (!guide) throw new Error(`Missing guide content for "${destination.slug}"`);
  return { ...destination, ...guide };
});

export type DestinationRegion = "usa" | "europe" | "asia";

export const REGION_LABELS: Record<DestinationRegion, string> = {
  usa: "United States",
  europe: "Europe",
  asia: "Middle East & Asia",
};

const EUROPEAN_COUNTRIES = new Set(["United Kingdom", "France", "Italy", "Spain"]);

export function regionOf(destination: Pick<Destination, "country">): DestinationRegion {
  if (destination.country === "United States") return "usa";
  return EUROPEAN_COUNTRIES.has(destination.country) ? "europe" : "asia";
}

const REGION_ORDER: readonly DestinationRegion[] = ["usa", "europe", "asia"];

/**
 * Every destination, the United States first — the market the business
 * focuses on — then Europe, then the rest. Order within a region is kept.
 */
export const DESTINATIONS: readonly Destination[] = [...ORIGINAL, ...US_GUIDES, ...EUROPE_GUIDES]
  .map((destination, index) => ({ destination, index }))
  .sort(
    (a, b) =>
      REGION_ORDER.indexOf(regionOf(a.destination)) - REGION_ORDER.indexOf(regionOf(b.destination)) ||
      a.index - b.index
  )
  .map(({ destination }) => destination);

/** Looks up a destination by its URL slug. */
export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((destination) => destination.slug === slug);
}

export const DESTINATION_SLUGS = DESTINATIONS.map((d) => d.slug);
