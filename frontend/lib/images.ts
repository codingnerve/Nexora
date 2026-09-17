/**
 * Photography manifest.
 *
 * Every entry below was verified twice: the URL was confirmed to return a live
 * image, and the image was **viewed** to confirm it actually depicts what the
 * alt text claims. That second check matters — several plausible-looking IDs
 * returned HTTP 200 for completely unrelated subjects (a pile of skulls, sports
 * cars, a kingfisher, a brand logo) and were rejected.
 *
 * Selection rules: editorial, naturally lit, no visible watermarks or large
 * text, no sports cars or showroom shots for transport, no staged "business
 * team" photos, and no photograph used twice on the same page.
 *
 * These are documented placeholders under the Unsplash License. Replace them
 * with licensed brand photography before launch: drop files into
 * `public/images/`, point `src` at the local path, and remove the Unsplash
 * entry from `images.remotePatterns` in `next.config.ts`.
 */

export interface EditorialPhoto {
  readonly src: string;
  /** Describes the scene. Never a filename, never the word "image". */
  readonly alt: string;
}

const unsplash = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

/* ---------------------------------------------------------------------------
 * Hero
 * ------------------------------------------------------------------------- */

export const HERO_PHOTO: EditorialPhoto = {
  src: unsplash("1540541338287-41700207dee6"),
  alt: "A clifftop resort seen from above, with a curving pool, palm trees and parasols beside the open ocean.",
};

/* ---------------------------------------------------------------------------
 * Flights
 * ------------------------------------------------------------------------- */

export const FLIGHT_PHOTOS = {
  terminal: {
    src: unsplash("1569154941061-e231b4725ef1"),
    alt: "A widebody airliner taxiing towards the camera in front of a modern glass airport terminal.",
  },
  gateSunrise: {
    src: unsplash("1542296332-2e4473faf563"),
    alt: "A widebody airliner parked at an airport gate at sunrise, with ground crew and service vehicles alongside it.",
  },
  gateDusk: {
    src: unsplash("1464037866556-6812c9d1c72e"),
    alt: "A jet parked at an airport gate beneath a dramatic evening sky.",
  },
  takeoff: {
    src: unsplash("1520437358207-323b43b50729"),
    alt: "An airliner lifting off the runway at dusk with its landing lights on.",
  },
  wing: {
    src: unsplash("1436491865332-7a61a109cc05"),
    alt: "An aircraft wing above a sea of sunlit clouds, seen from a passenger window.",
  },
  lounge: {
    src: unsplash("1530521954074-e64f6810b32d"),
    alt: "A traveller resting in an airport departure lounge, feet on his suitcase, as an aircraft climbs past the window.",
  },
  cabin: {
    src: unsplash("1540339832862-474599807836"),
    alt: "Passengers seated along the aisle of an airliner cabin during a flight.",
  },
  landing: {
    src: unsplash("1556388158-158ea5ccacbd"),
    alt: "An airliner on final approach over the runway lights, with snow-capped mountains behind.",
  },
  arrival: {
    src: unsplash("1504150558240-0b4fd8946624"),
    alt: "The silhouette of a traveller with a suitcase at a terminal window, watching an aircraft take off.",
  },
  departures: {
    src: unsplash("1517400508447-f8dd518b86db"),
    alt: "A traveller with a camera over his shoulder looking up at an airport departures board.",
  },
} as const satisfies Record<string, EditorialPhoto>;

/* ---------------------------------------------------------------------------
 * Hotels
 * ------------------------------------------------------------------------- */

export const HOTEL_PHOTOS = {
  tropicalResort: {
    src: unsplash("1520250497591-112f2f40a3f4"),
    alt: "A tropical resort pool surrounded by palms and thatched villas, with limestone peaks rising behind.",
  },
  resortDusk: {
    src: unsplash("1566073771259-6a8506099945"),
    alt: "A beachfront resort at dusk, with sun loungers and cushions lining a timber deck beside the pool.",
  },
  infinityDeck: {
    src: unsplash("1584132967334-10e028bd69f7"),
    alt: "Sun loungers on a timber deck beside an infinity pool looking out over a calm tropical sea.",
  },
  palmsPool: {
    src: unsplash("1551882547-ff40c63fe5fa"),
    alt: "Palm trees and low white buildings reflected in a resort pool under a pink evening sky.",
  },
  poolTerrace: {
    src: unsplash("1571896349842-33c89424de2d"),
    alt: "A resort terrace and rows of white parasols reflected in a still swimming pool at dusk.",
  },
  warmRoom: {
    src: unsplash("1611892440504-42a792e24d32"),
    alt: "A warmly lit hotel room with a timber bed, a robe hanging by the door and a view onto a garden.",
  },
  classicSuite: {
    src: unsplash("1590490360182-c33d57733427"),
    alt: "An elegant hotel suite with a tufted sofa, tall curtained windows and a made-up double bed.",
  },
  cityRoom: {
    src: unsplash("1631049307264-da0ec9d70304"),
    alt: "A modern city hotel room with a padded headboard, bedside lamps and a window onto high-rise buildings.",
  },
  businessRoom: {
    src: unsplash("1618773928121-c32242e63f39"),
    alt: "A contemporary hotel room with a king-size bed, warm bedside lamps and a wall-mounted television.",
  },
  brightRoom: {
    src: unsplash("1512918728675-ed5a9ecdebfd"),
    alt: "A bright, simply furnished hotel room with a double bed and a polished tiled floor.",
  },
  morningLight: {
    src: unsplash("1582719478250-c89cae4dc85b"),
    alt: "Morning light falling across a hotel bed through tall glass doors.",
  },
  valleyView: {
    src: unsplash("1596394516093-501ba68a0ba6"),
    alt: "A bed and a small bistro table set out on a timber deck high above a lake and mountain valley.",
  },
  breakfast: {
    src: unsplash("1533777857889-4be7c70b33f7"),
    alt: "A traveller enjoying breakfast and coffee at a sunlit café table.",
  },
} as const satisfies Record<string, EditorialPhoto>;

/* ---------------------------------------------------------------------------
 * Cabs and transfers
 * ------------------------------------------------------------------------- */

export const CAB_PHOTOS = {
  eveningDrive: {
    src: unsplash("1536700503339-1e4b06520771"),
    alt: "A black saloon car driving along a tree-lined road at dusk with its headlights on.",
  },
  driverDusk: {
    src: unsplash("1449965408869-eaa3f722e40d"),
    alt: "View from inside a car as the driver steers through city traffic at dusk.",
  },
  saloon: {
    src: unsplash("1616422285623-13ff0162193c"),
    alt: "A silver executive saloon parked on a mountain road in the evening light.",
  },
  suv: {
    src: unsplash("1563720360172-67b8f3dce741"),
    alt: "A black full-size SUV parked on a quiet street outside a modern house, beside a people carrier.",
  },
  navigation: {
    src: unsplash("1600320254374-ce2d293c324e"),
    alt: "A driver following phone navigation while driving through a city underpass.",
  },
  cityTraffic: {
    src: unsplash("1473042904451-00171c69419d"),
    alt: "Light trails from evening traffic on a highway leading towards a city skyline.",
  },
  luggage: {
    src: unsplash("1581553680321-4fffae59fccd"),
    alt: "A traveller standing at a doorway with two hard-shell suitcases, ready to leave.",
  },
} as const satisfies Record<string, EditorialPhoto>;

/* ---------------------------------------------------------------------------
 * Trips and people
 * ------------------------------------------------------------------------- */

export const TRIP_PHOTOS = {
  lakeEscape: {
    src: unsplash("1476514525535-07fb3b4ae5f1"),
    alt: "The bow of a wooden boat on a clear green lake beneath forested mountain peaks.",
  },
  familyBeach: {
    src: unsplash("1475503572774-15a45e5d60b9"),
    alt: "A family holding hands as they walk into the waves on a sunny beach.",
  },
  balloons: {
    src: unsplash("1530789253388-582c481c54b0"),
    alt: "Two travellers photographing hot-air balloons drifting over a rocky valley.",
  },
  friendsSunset: {
    src: unsplash("1511632765486-a01980e01a18"),
    alt: "Four friends with their arms around each other, looking out over the hills at sunset.",
  },
  mapRoute: {
    src: unsplash("1499591934245-40b55745b905"),
    alt: "A hand tracing a route across a paper map beside an open notebook and a camera.",
  },
  mapFlatlay: {
    src: unsplash("1488646953014-85cb44e25828"),
    alt: "A map, a backpack, a notebook and a camera laid out on a table while planning a trip.",
  },
  beachPalms: {
    src: unsplash("1519046904884-53103b34b206"),
    alt: "A leaning palm tree and a thatched parasol on a white-sand beach beside turquoise water.",
  },
} as const satisfies Record<string, EditorialPhoto>;

/* ---------------------------------------------------------------------------
 * Destinations — a lead photograph and a second, different view of each place
 * ------------------------------------------------------------------------- */

export const DESTINATION_PHOTOS = {
  dubai: {
    src: unsplash("1518684079-3c830dcef090"),
    alt: "An aerial view of the Burj Al Arab and the Jumeirah coastline in Dubai.",
  },
  singapore: {
    src: unsplash("1525625293386-3f8f99389edd"),
    alt: "Marina Bay Sands and the Singapore waterfront seen from above at sunset.",
  },
  bangkok: {
    src: unsplash("1563492065599-3520f775eeed"),
    alt: "The gilded spire of Loha Prasat rising above temple rooftops in Bangkok.",
  },
  london: {
    src: unsplash("1513635269975-59663e0ac1ad"),
    alt: "Tower Bridge and the River Thames winding through London, seen from above at dusk.",
  },
  newYork: {
    src: unsplash("1522083165195-3424ed129620"),
    alt: "The Manhattan skyline at sunrise, framed by the suspension cables of the Brooklyn Bridge.",
  },
  maldives: {
    src: unsplash("1514282401047-d79a71a590e8"),
    alt: "An aerial view of overwater villas curving across a turquoise lagoon in the Maldives.",
  },
  bali: {
    src: unsplash("1537996194471-e657df975ab4"),
    alt: "The tiered Ulun Danu Beratan temple in Bali, mirrored in the still lake around it.",
  },
  paris: {
    src: unsplash("1502602898657-3e91760cbb34"),
    alt: "The Eiffel Tower above the Seine at dusk, with riverboats moored along the embankment.",
  },
} as const satisfies Record<string, EditorialPhoto>;

export const DESTINATION_GALLERY = {
  dubai: {
    src: unsplash("1526495124232-a04e1849168c"),
    alt: "Dubai's towers and the lanes of Sheikh Zayed Road lit up in the evening.",
  },
  singapore: {
    src: unsplash("1508964942454-1a56651d54ac"),
    alt: "The Supertree Grove and its elevated walkway among the planting at Gardens by the Bay, Singapore.",
  },
  bangkok: {
    src: unsplash("1508009603885-50cf7c579365"),
    alt: "Tuk-tuks and neon shop signs on a rain-soaked street in Bangkok's Chinatown at night.",
  },
  london: {
    src: unsplash("1505761671935-60b3a7427bad"),
    alt: "Big Ben and the Houses of Parliament beside Westminster Bridge in London.",
  },
  newYork: {
    src: unsplash("1534430480872-3498386e7856"),
    alt: "Midtown Manhattan seen from above, with the Empire State Building rising from the skyline.",
  },
  maldives: {
    src: unsplash("1540202404-a2f29016b523"),
    alt: "A white sandbar and a wooden jetty leading to thatched villas over a coral reef.",
  },
  bali: {
    src: unsplash("1555400038-63f5ba517a47"),
    alt: "Terraced rice fields and coconut palms filling a green valley.",
  },
  paris: {
    src: unsplash("1499856871958-5b9627545d1a"),
    alt: "Ornate lamps along the Pont Alexandre III bridge over the Seine in Paris at dusk.",
  },
} as const satisfies Record<keyof typeof DESTINATION_PHOTOS, EditorialPhoto>;

/* ---------------------------------------------------------------------------
 * Backwards-compatible aliases used by metadata and older sections
 * ------------------------------------------------------------------------- */

export const SERVICE_PHOTOS = {
  flights: FLIGHT_PHOTOS.takeoff,
  hotels: HOTEL_PHOTOS.tropicalResort,
  cabs: CAB_PHOTOS.eveningDrive,
} as const satisfies Record<string, EditorialPhoto>;

export const EDITORIAL_PHOTOS = {
  travellers: TRIP_PHOTOS.friendsSunset,
} as const satisfies Record<string, EditorialPhoto>;
