import type { Destination } from "@/data/destinations";
import { CITY_PHOTOS } from "@/lib/images";

/**
 * Destination guides for the US and European cities featured across the site.
 *
 * Same content rules as `destinations.ts`: no prices, ratings or availability,
 * no visa or entry claims, and highlights, areas and arrival notes describe
 * only general, long-standing orientation.
 *
 * Kept apart from the original eight so neither file becomes unmanageable;
 * `destinations.ts` merges them into one list.
 */

type CitySlug = keyof typeof CITY_PHOTOS;

type GuideInput = Omit<Destination, "slug" | "image" | "imageAlt" | "gallery" | "span" | "ratio">;

/** Attaches the verified photographs for `slug`. `span` and `ratio` only matter on the homepage mosaic. */
function guide(slug: CitySlug, input: GuideInput): Destination {
  const photos = CITY_PHOTOS[slug];
  return {
    ...input,
    slug,
    image: photos.lead.src,
    imageAlt: photos.lead.alt,
    gallery: photos.gallery,
    span: 4,
    ratio: "landscape",
  };
}

/* ---------------------------------------------------------------------------
 * United States
 * ------------------------------------------------------------------------- */

export const US_GUIDES: readonly Destination[] = [
  guide("los-angeles", {
    name: "Los Angeles",
    country: "United States",
    tagline: "Beaches, studios and a city built around the drive.",
    description: "Sprawling and sunny, with beaches, hills and neighbourhoods that each feel like their own town.",
    overview:
      "Los Angeles is less a single city than a collection of distinct districts spread between the mountains and the Pacific. Choosing where to stay matters more here than almost anywhere, because the distances between areas are long and the traffic can be slow.",
    highlights: [
      { title: "Beaches", body: "Santa Monica, Venice and Malibu along the coast, each with a different character." },
      { title: "Film and entertainment", body: "Studio tours, Hollywood's historic streets and theatres." },
      { title: "Museums", body: "Large art collections in the hills and along Wilshire Boulevard." },
      { title: "Food", body: "Taco stands, Koreatown barbecue and a broad restaurant scene across the city." },
    ],
    planning: [
      { label: "Best time to visit", value: "Mild all year; spring and autumn are especially comfortable." },
      { label: "Getting around", value: "Distances are long — most visitors drive or use pre-arranged cars." },
      { label: "Suggested length", value: "Four to six days." },
    ],
    areas: [
      { name: "Santa Monica", body: "On the ocean, walkable, with the pier and a long beach path." },
      { name: "Hollywood", body: "Central for sightseeing, theatres and the hills behind." },
      { name: "Downtown LA", body: "Museums, concert halls and the arts district, with good rail links." },
      { name: "Beverly Hills and West Hollywood", body: "Shopping, dining and quieter, leafier streets." },
    ],
    arrival:
      "Most flights arrive at Los Angeles International (LAX), on the coast south-west of downtown. Burbank (BUR), Long Beach (LGB) and Orange County (SNA) are smaller alternatives. Because the city is so spread out, a pre-arranged transfer to your hotel is often the simplest option.",
    stayStyle: "city",
  }),
  guide("san-francisco", {
    name: "San Francisco",
    country: "United States",
    tagline: "Hills, bay views and neighbourhoods you can walk.",
    description: "Compact and hilly, with the bay on three sides and plenty within walking distance.",
    overview:
      "San Francisco packs a lot into a small, steep peninsula. Most visits combine a few central neighbourhoods on foot with a cable car ride, a walk across or near the Golden Gate Bridge, and often a day trip north to the wine country.",
    highlights: [
      { title: "The Golden Gate", body: "The bridge and the headlands around it, best on a clear morning." },
      { title: "Cable cars", body: "Historic cable car lines climbing between downtown and the waterfront." },
      { title: "Neighbourhoods", body: "Chinatown, North Beach and the Mission, all very different." },
      { title: "Day trips", body: "Napa and Sonoma wine country, and redwood forests north of the city." },
    ],
    planning: [
      { label: "Best time to visit", value: "September and October are often the warmest; summers can be foggy." },
      { label: "Getting around", value: "Walking, cable cars, Muni buses and BART cover the city." },
      { label: "Suggested length", value: "Three to five days." },
    ],
    areas: [
      { name: "Union Square", body: "Central, with shopping, theatres and cable car stops nearby." },
      { name: "Fisherman's Wharf and North Beach", body: "On the waterfront, close to the piers and Italian cafés." },
      { name: "SoMa", body: "Modern hotels near the convention centre and museums." },
      { name: "Nob Hill", body: "Quieter, historic hotels on the hill above downtown." },
    ],
    arrival:
      "San Francisco International (SFO) is south of the city and connected to downtown by BART trains. Oakland (OAK) and San José (SJC) also serve the Bay Area. Taxis and pre-arranged cars wait at every terminal.",
    stayStyle: "city",
  }),
  guide("miami", {
    name: "Miami",
    country: "United States",
    tagline: "Beaches, Art Deco and Latin American energy.",
    description: "Warm water, Art Deco streets and a strong Latin American influence on food and music.",
    overview:
      "Miami splits naturally in two: Miami Beach, on the barrier island with its Art Deco district and long sands, and the mainland city of Brickell, Downtown and Little Havana. Many visitors combine both, and it is also a common starting point for cruises and the Florida Keys.",
    highlights: [
      { title: "Beaches", body: "Long stretches of sand along Miami Beach, from South Beach northwards." },
      { title: "Art Deco", body: "Pastel 1930s hotels along Ocean Drive and Collins Avenue." },
      { title: "Little Havana", body: "Cuban cafés, music and the life around Calle Ocho." },
      { title: "Art and design", body: "Street murals in Wynwood and galleries in the Design District." },
    ],
    planning: [
      { label: "Best time to visit", value: "December to April is drier; June to November is hurricane season." },
      { label: "Getting around", value: "Taxis and ride-hailing; Metrorail links the airport and Downtown." },
      { label: "Suggested length", value: "Four to five days, more with the Keys." },
    ],
    areas: [
      { name: "South Beach", body: "The Art Deco district, beaches and nightlife." },
      { name: "Mid-Beach and North Beach", body: "Quieter beachfront hotels further up the island." },
      { name: "Brickell and Downtown", body: "High-rise hotels, restaurants and the business district." },
      { name: "Coral Gables", body: "Leafy streets and historic buildings, a calmer base on the mainland." },
    ],
    arrival:
      "Miami International (MIA) is west of Downtown, with Metrorail and taxis into the city. Fort Lauderdale–Hollywood (FLL), to the north, is a common alternative. Miami Beach is a drive across the causeways, so a pre-arranged transfer is often easiest.",
    stayStyle: "resort",
  }),
  guide("orlando", {
    name: "Orlando",
    country: "United States",
    tagline: "Theme parks, lakes and family trips.",
    description: "Theme parks at the centre, with lakes, springs and the coast within reach.",
    overview:
      "Orlando is best known for its theme parks, which sit to the south-west of the city and shape where most visitors stay. Beyond them are lakes, natural springs and Florida's Atlantic coast, all within a day trip.",
    highlights: [
      { title: "Theme parks", body: "Several major theme park resorts, each large enough to fill a few days." },
      { title: "Springs and lakes", body: "Clear freshwater springs for swimming, kayaking and wildlife." },
      { title: "The Space Coast", body: "Kennedy Space Center, about an hour's drive to the east." },
      { title: "Downtown", body: "Lake Eola and a smaller, more local restaurant scene." },
    ],
    planning: [
      { label: "Best time to visit", value: "March to May and October to November; summers are hot with afternoon storms." },
      { label: "Getting around", value: "A car or pre-arranged transfers; parks run their own transport." },
      { label: "Suggested length", value: "Five to seven days for the parks." },
    ],
    areas: [
      { name: "Lake Buena Vista", body: "Close to the largest theme park resort, popular with families." },
      { name: "International Drive", body: "Hotels, restaurants and attractions between the main parks." },
      { name: "Kissimmee", body: "Holiday homes and larger rental properties south of the parks." },
      { name: "Downtown Orlando", body: "Around Lake Eola, better suited to a city-focused stay." },
    ],
    arrival:
      "Orlando International (MCO) is south-east of the city and a drive of around half an hour or more from the main theme park areas. Orlando Sanford (SFB), to the north, is used by some international and holiday flights.",
    stayStyle: "resort",
  }),
  guide("boston", {
    name: "Boston",
    country: "United States",
    tagline: "History, harbour views and a walkable centre.",
    description: "One of America's oldest cities, compact and easy to explore on foot.",
    overview:
      "Boston's historic centre is small enough to walk, with the Freedom Trail linking many of its revolutionary-era sites. Across the Charles River, Cambridge adds university campuses, bookshops and cafés, and the harbour brings the city's seafood to the table.",
    highlights: [
      { title: "History", body: "The Freedom Trail through colonial and revolutionary sites." },
      { title: "Universities", body: "Harvard and MIT across the river in Cambridge." },
      { title: "Parks", body: "Boston Common, the Public Garden and the Charles River Esplanade." },
      { title: "Seafood", body: "Oysters, chowder and lobster rolls around the harbour." },
    ],
    planning: [
      { label: "Best time to visit", value: "May to June and September to October; autumn colour peaks in October." },
      { label: "Getting around", value: "Walking and the 'T' subway; driving downtown is slow." },
      { label: "Suggested length", value: "Three to four days." },
    ],
    areas: [
      { name: "Back Bay", body: "Brownstone streets, shopping on Newbury Street and good transport." },
      { name: "Beacon Hill", body: "Historic, gas-lit lanes beside Boston Common." },
      { name: "Seaport", body: "Modern hotels and restaurants on the waterfront." },
      { name: "Cambridge", body: "Around the universities, just across the river." },
    ],
    arrival:
      "Boston Logan International (BOS) sits across the harbour, very close to downtown. The Silver Line bus and the Blue Line subway connect it with the city, and water taxis cross the harbour.",
    stayStyle: "city",
  }),
  guide("seattle", {
    name: "Seattle",
    country: "United States",
    tagline: "Waterfront, markets and mountains on the horizon.",
    description: "A green, waterside city with mountains, islands and national parks close by.",
    overview:
      "Seattle sits between Puget Sound and Lake Washington, with the Cascade and Olympic mountains on either horizon. The city itself is compact around the waterfront and Pike Place Market, and ferries and scenic drives lead out to islands and national parks.",
    highlights: [
      { title: "Pike Place Market", body: "A working market above the waterfront, busiest in the morning." },
      { title: "The Space Needle", body: "Views over the city, the Sound and, on a clear day, Mount Rainier." },
      { title: "Ferries", body: "Short crossings to Bainbridge Island and further across the Sound." },
      { title: "The outdoors", body: "Mount Rainier and Olympic National Parks as day or overnight trips." },
    ],
    planning: [
      { label: "Best time to visit", value: "July to September is the driest and sunniest." },
      { label: "Getting around", value: "Link light rail, buses and walking cover the centre." },
      { label: "Suggested length", value: "Three to four days, longer with the parks." },
    ],
    areas: [
      { name: "Downtown and Pike Place", body: "Central, near the market, the waterfront and shopping." },
      { name: "Belltown", body: "Restaurants and bars, walkable to the Space Needle." },
      { name: "South Lake Union", body: "Newer hotels near the lake and the tech district." },
      { name: "Capitol Hill", body: "Lively, with cafés, music venues and independent shops." },
    ],
    arrival:
      "Seattle–Tacoma International (SEA) is south of the city. Link light rail runs from the airport to downtown, and taxis and pre-arranged cars are available at the terminal.",
    stayStyle: "city",
  }),
  guide("honolulu", {
    name: "Honolulu",
    country: "United States",
    tagline: "Waikiki, volcanic ridges and warm Pacific water.",
    description: "Hawaii's capital, with Waikiki's beaches and the rest of Oahu close at hand.",
    overview:
      "Honolulu is the gateway to Hawaii and the base for most visits to the island of Oahu. Waikiki's beaches and hotels sit a short distance from the city's historic centre, and the island's quieter north shore and windward coast are within a day's drive.",
    highlights: [
      { title: "Waikiki", body: "A long, calm beach backed by hotels, with Diamond Head at the end." },
      { title: "Pearl Harbor", body: "The memorial and museums on the harbour west of the city." },
      { title: "Hikes and views", body: "Diamond Head and coastal trails with views over the Pacific." },
      { title: "The North Shore", body: "Surf beaches and small towns on the far side of the island." },
    ],
    planning: [
      { label: "Best time to visit", value: "Warm year round; April to May and September to October are quieter." },
      { label: "Getting around", value: "Buses and walking in Waikiki; a car for the rest of the island." },
      { label: "Suggested length", value: "Five to seven days." },
    ],
    areas: [
      { name: "Waikiki", body: "Beachfront hotels, restaurants and shopping in one walkable area." },
      { name: "Ala Moana", body: "Beside a large beach park and shopping centre, just west of Waikiki." },
      { name: "Downtown and Chinatown", body: "The historic centre, closer to the harbour and the airport." },
      { name: "Ko Olina", body: "A resort area with calm lagoons on the island's west coast." },
    ],
    arrival:
      "Daniel K. Inouye International (HNL) is west of downtown Honolulu. Waikiki is a drive further east, so most visitors take a taxi, shuttle or pre-arranged transfer from the airport.",
    stayStyle: "resort",
  }),
  guide("jersey-city-newark", {
    name: "Jersey City & Newark",
    country: "United States",
    tagline: "A New Jersey base with Manhattan across the river.",
    description: "Skyline views and quick trains into Manhattan, with Newark's airport on the doorstep.",
    overview:
      "Jersey City sits on the Hudson directly across from Lower Manhattan, and Newark, a few miles west, is home to one of the New York area's main airports. Together they make a practical base for New York trips, business travel and connecting flights.",
    highlights: [
      { title: "Skyline views", body: "Waterfront walks facing Lower Manhattan and the Statue of Liberty." },
      { title: "Liberty State Park", body: "Open parkland on the harbour, with ferries towards the statue." },
      { title: "Newark's cathedral and parks", body: "A large Gothic cathedral and Branch Brook Park's spring blossom." },
      { title: "Easy access to Manhattan", body: "PATH trains reach Manhattan in minutes." },
    ],
    planning: [
      { label: "Best time to visit", value: "April to June and September to November." },
      { label: "Getting around", value: "PATH trains, NJ Transit and light rail; taxis for the rest." },
      { label: "Suggested length", value: "Two to four days, often alongside New York." },
    ],
    areas: [
      { name: "Jersey City waterfront", body: "Exchange Place and Newport, with Manhattan views and PATH stations." },
      { name: "Downtown Jersey City", body: "Brownstone streets and restaurants around Grove Street." },
      { name: "Downtown Newark", body: "Near Newark Penn Station, the arts centre and the arena." },
      { name: "Newark Airport area", body: "Practical for early flights and short connections." },
    ],
    arrival:
      "Newark Liberty International (EWR) serves both cities. AirTrain links the terminals with a rail station for NJ Transit and Amtrak trains, and PATH trains connect Newark, Jersey City and Manhattan. New York's JFK and LaGuardia airports are also within reach.",
    stayStyle: "city",
  }),
  guide("las-vegas", {
    name: "Las Vegas",
    country: "United States",
    tagline: "Shows, resorts and the desert beyond the Strip.",
    description: "Resort hotels, shows and dining on the Strip, with canyons and desert close by.",
    overview:
      "Las Vegas is built around the Strip, a long boulevard of resort hotels, shows and restaurants. Beyond the city, the Mojave Desert offers some striking day trips, from Red Rock Canyon on the edge of town to the Hoover Dam and the Grand Canyon further away.",
    highlights: [
      { title: "The Strip", body: "Resort hotels, fountains and light shows along one long boulevard." },
      { title: "Shows", body: "Residencies, magic, comedy and large-scale productions." },
      { title: "Red Rock Canyon", body: "Sandstone cliffs and trails a short drive west of the city." },
      { title: "Day trips", body: "The Hoover Dam, and flights or drives to the Grand Canyon." },
    ],
    planning: [
      { label: "Best time to visit", value: "March to May and October to November; summer is very hot." },
      { label: "Getting around", value: "Walking along the Strip, the monorail, and taxis beyond it." },
      { label: "Suggested length", value: "Three to four days." },
    ],
    areas: [
      { name: "Centre Strip", body: "The busiest stretch, with many of the best-known resorts." },
      { name: "South Strip", body: "Large resorts, closest to the airport." },
      { name: "Downtown and Fremont Street", body: "The original casino district, with a more old-school feel." },
      { name: "Off-Strip", body: "Quieter hotels and resorts a short drive from the action." },
    ],
    arrival:
      "Harry Reid International (LAS) sits just east of the southern end of the Strip, so transfers to most hotels are short. Taxis, shuttles and pre-arranged cars wait outside both terminals.",
    stayStyle: "resort",
  }),
  guide("chicago", {
    name: "Chicago",
    country: "United States",
    tagline: "Architecture, lakefront and deep-dish.",
    description: "Striking architecture on the shore of Lake Michigan, with museums and food to match.",
    overview:
      "Chicago rises straight from the shore of Lake Michigan, and its architecture is one of the main reasons to go. The centre is walkable around the river and the Loop, with a long lakefront of parks and beaches to the north and south.",
    highlights: [
      { title: "Architecture", body: "River cruises past some of America's most important buildings." },
      { title: "Millennium Park", body: "Cloud Gate, gardens and free summer concerts." },
      { title: "Museums", body: "Major art, science and natural history collections." },
      { title: "Food", body: "Deep-dish pizza, Chicago hot dogs and a strong restaurant scene." },
    ],
    planning: [
      { label: "Best time to visit", value: "May to September; winters are cold and windy." },
      { label: "Getting around", value: "The 'L' trains, buses and a walkable centre." },
      { label: "Suggested length", value: "Three to five days." },
    ],
    areas: [
      { name: "The Loop", body: "The business and theatre district, close to Millennium Park." },
      { name: "River North", body: "Restaurants, galleries and nightlife just north of the river." },
      { name: "Magnificent Mile and Streeterville", body: "Shopping, hotels and the lakefront." },
      { name: "West Loop", body: "A former warehouse district now known for its restaurants." },
    ],
    arrival:
      "Chicago O'Hare International (ORD) is north-west of the city, connected to downtown by the CTA Blue Line. Midway International (MDW), to the south-west, is closer to the centre and linked by the Orange Line.",
    stayStyle: "city",
  }),
];

/* ---------------------------------------------------------------------------
 * Europe
 * ------------------------------------------------------------------------- */

export const EUROPE_GUIDES: readonly Destination[] = [
  guide("rome", {
    name: "Rome",
    country: "Italy",
    tagline: "Ancient ruins, piazzas and long lunches.",
    description: "Layers of history on every street, and some of Italy's best food.",
    overview:
      "Rome combines ancient ruins, Renaissance churches and everyday neighbourhood life in a centre compact enough to explore mostly on foot. The Vatican sits across the river, and it is worth planning around its opening hours and queues.",
    highlights: [
      { title: "Ancient Rome", body: "The Colosseum, the Roman Forum and the Palatine Hill." },
      { title: "The Vatican", body: "St Peter's Basilica and the Vatican Museums." },
      { title: "Piazzas and fountains", body: "The Pantheon, Piazza Navona and the Trevi Fountain." },
      { title: "Food", body: "Trattorias, pizza al taglio and gelato across the city." },
    ],
    planning: [
      { label: "Best time to visit", value: "April to June and September to October." },
      { label: "Getting around", value: "Walking in the centre, with metro, buses and trams." },
      { label: "Suggested length", value: "Three to five days." },
    ],
    areas: [
      { name: "Centro Storico", body: "Around the Pantheon and Piazza Navona, very central." },
      { name: "Trastevere", body: "Cobbled lanes and restaurants across the river." },
      { name: "Monti", body: "Close to the Colosseum, with independent shops and bars." },
      { name: "Prati", body: "Near the Vatican, with wider streets and a calmer feel." },
    ],
    arrival:
      "Rome Fiumicino (FCO) is on the coast south-west of the city, linked to Roma Termini by the Leonardo Express train. Ciampino (CIA), used by many low-cost airlines, is closer to the south-east.",
    stayStyle: "city",
  }),
  guide("venice", {
    name: "Venice",
    country: "Italy",
    tagline: "Canals, palazzi and a city without cars.",
    description: "A city of canals and bridges where every journey is on foot or by boat.",
    overview:
      "Venice is built across more than a hundred small islands in a lagoon, with no cars and very few straight streets. Getting a little lost is part of the experience, and the quieter corners away from St Mark's are where the city feels most itself.",
    highlights: [
      { title: "St Mark's", body: "The basilica, the Doge's Palace and the square in front of them." },
      { title: "The Grand Canal", body: "Palazzi along the city's main waterway, best seen by vaporetto." },
      { title: "The lagoon islands", body: "Murano's glass, Burano's colourful houses and quiet Torcello." },
      { title: "Art", body: "The Accademia, the Peggy Guggenheim Collection and the Biennale." },
    ],
    planning: [
      { label: "Best time to visit", value: "April to June and September to October; high tides are more likely in autumn and winter." },
      { label: "Getting around", value: "Walking and the vaporetto water buses." },
      { label: "Suggested length", value: "Two to four days." },
    ],
    areas: [
      { name: "San Marco", body: "The most central district, around the main square." },
      { name: "Dorsoduro", body: "Quieter, with galleries and views across the water." },
      { name: "Cannaregio", body: "More residential, with local bars and the ghetto." },
      { name: "The Lido", body: "A long island with beaches, a short boat ride away." },
    ],
    arrival:
      "Venice Marco Polo (VCE) is on the mainland. Water buses and water taxis cross the lagoon to the city, and buses run to Piazzale Roma, where cars and road transport stop. Treviso (TSF) is used by some low-cost flights. Mention luggage when you ask about transfers — the last stretch is often on foot.",
    stayStyle: "city",
  }),
  guide("milan", {
    name: "Milan",
    country: "Italy",
    tagline: "Fashion, design and a gateway to the lakes.",
    description: "Italy's style and business capital, and an easy base for Lake Como.",
    overview:
      "Milan is Italy's centre of fashion, design and business, and it rewards those who look past its busy streets. Its cathedral, galleries and canals are within easy reach of each other, and the lakes and mountains to the north are close enough for a day trip.",
    highlights: [
      { title: "The Duomo", body: "The Gothic cathedral and its rooftop terraces." },
      { title: "The Last Supper", body: "Leonardo da Vinci's mural, which must be booked in advance." },
      { title: "Fashion and design", body: "The Quadrilatero della Moda and design showrooms." },
      { title: "Lake Como", body: "Lakeside towns an hour or so away by train." },
    ],
    planning: [
      { label: "Best time to visit", value: "April to June and September to October." },
      { label: "Getting around", value: "An efficient metro and tram network." },
      { label: "Suggested length", value: "Two to three days, more with the lakes." },
    ],
    areas: [
      { name: "Duomo and Centro", body: "Central, near the cathedral and the Galleria." },
      { name: "Brera", body: "Galleries, boutiques and cobbled streets." },
      { name: "Navigli", body: "Canalside bars and restaurants, lively in the evening." },
      { name: "Porta Nuova and Centrale", body: "Modern towers and hotels near the main station." },
    ],
    arrival:
      "Milan Malpensa (MXP) handles most long-haul flights and is linked to the city by the Malpensa Express train. Linate (LIN) is much closer, with a metro line into the centre, and Bergamo (BGY) is used by many low-cost airlines.",
    stayStyle: "city",
  }),
  guide("barcelona", {
    name: "Barcelona",
    country: "Spain",
    tagline: "Gaudí, beaches and late dinners.",
    description: "Modernist architecture, a medieval old town and city beaches, all in one place.",
    overview:
      "Barcelona sits between the mountains and the Mediterranean, with a medieval old town at its heart and the grid of the Eixample around it. Gaudí's buildings are the headline, but the city's markets, beaches and late-night dining are just as much a part of it.",
    highlights: [
      { title: "Gaudí", body: "The Sagrada Família, Park Güell and the houses on Passeig de Gràcia." },
      { title: "The Gothic Quarter", body: "Narrow medieval streets around the cathedral." },
      { title: "Beaches", body: "City beaches from Barceloneta northwards." },
      { title: "Food", body: "Tapas bars, La Boqueria market and seafood by the sea." },
    ],
    planning: [
      { label: "Best time to visit", value: "May to June and September to October." },
      { label: "Getting around", value: "An extensive metro, plus walking and buses." },
      { label: "Suggested length", value: "Three to five days." },
    ],
    areas: [
      { name: "Gothic Quarter", body: "Historic and central, close to La Rambla." },
      { name: "Eixample", body: "Wide avenues, modernist buildings and good transport." },
      { name: "El Born", body: "Boutiques, bars and the Picasso Museum." },
      { name: "Barceloneta", body: "By the beach, with seafood restaurants along the front." },
    ],
    arrival:
      "Barcelona–El Prat (BCN) is south-west of the city, connected to the centre by train, metro and the Aerobús. Girona and Reus airports are used by some low-cost airlines and are considerably further out.",
    stayStyle: "city",
  }),
  guide("madrid", {
    name: "Madrid",
    country: "Spain",
    tagline: "Great museums, grand plazas and late nights.",
    description: "Spain's capital, with world-class museums and a famously late social life.",
    overview:
      "Madrid is a city of grand boulevards, leafy parks and neighbourhood bars. Three of Europe's major art museums sit within a short walk of each other, and the evenings start late and run long.",
    highlights: [
      { title: "The art walk", body: "The Prado, the Reina Sofía and the Thyssen-Bornemisza." },
      { title: "Retiro Park", body: "Gardens, a boating lake and the Crystal Palace." },
      { title: "Plazas", body: "Plaza Mayor and Puerta del Sol in the historic centre." },
      { title: "Tapas", body: "Bar-hopping in La Latina and around the markets." },
    ],
    planning: [
      { label: "Best time to visit", value: "April to June and September to October; summer is hot." },
      { label: "Getting around", value: "A large, efficient metro and a walkable centre." },
      { label: "Suggested length", value: "Three to four days." },
    ],
    areas: [
      { name: "Sol and Centro", body: "The historic heart, close to everything." },
      { name: "Barrio de las Letras", body: "Between Sol and the Prado, with bars and restaurants." },
      { name: "Salamanca", body: "Elegant streets, shopping and quieter evenings." },
      { name: "Malasaña and Chueca", body: "Lively, independent and good for nightlife." },
    ],
    arrival:
      "Adolfo Suárez Madrid–Barajas (MAD) is north-east of the city. Metro Line 8 runs into the centre, and suburban trains serve Terminal 4. Taxis and pre-arranged cars are straightforward from every terminal.",
    stayStyle: "city",
  }),
  guide("nice", {
    name: "Nice",
    country: "France",
    tagline: "The Riviera's seafront, old town and hill villages.",
    description: "A sunny seafront city and the natural base for the French Riviera.",
    overview:
      "Nice curves around the Baie des Anges, with a pastel old town, a long seafront promenade and markets full of Provençal produce. It is also the easiest base for exploring the Riviera, with Monaco, Antibes and the hill villages all close by.",
    highlights: [
      { title: "The Promenade des Anglais", body: "The seafront walk along the length of the bay." },
      { title: "Vieux Nice", body: "The old town's lanes, markets and Cours Saleya." },
      { title: "Art", body: "The Matisse and Chagall museums in Cimiez." },
      { title: "Along the coast", body: "Monaco, Villefranche and Èze by train or bus." },
    ],
    planning: [
      { label: "Best time to visit", value: "May to June and September; July and August are busiest." },
      { label: "Getting around", value: "Trams, buses and coastal trains." },
      { label: "Suggested length", value: "Three to five days." },
    ],
    areas: [
      { name: "Vieux Nice", body: "The old town, close to the beach and the markets." },
      { name: "Promenade des Anglais", body: "Seafront hotels looking out over the bay." },
      { name: "City centre", body: "Around Place Masséna, with shops and trams." },
      { name: "The Port", body: "Quieter, with restaurants around the harbour." },
    ],
    arrival:
      "Nice Côte d'Azur (NCE) is on the coast just west of the city, with a tram line into the centre. It is also the main airport for Monaco and Cannes, so transfers along the coast are common.",
    stayStyle: "resort",
  }),
  guide("edinburgh", {
    name: "Edinburgh",
    country: "United Kingdom",
    tagline: "A castle, closes and festival summers.",
    description: "Scotland's capital, split between a medieval Old Town and a Georgian New Town.",
    overview:
      "Edinburgh's castle sits on an old volcanic rock above the city, with the Royal Mile running down to the palace below. The medieval Old Town and the Georgian New Town face each other across the gardens, and the whole centre is compact and walkable, if hilly.",
    highlights: [
      { title: "The castle and Royal Mile", body: "From Edinburgh Castle down to the Palace of Holyroodhouse." },
      { title: "Viewpoints", body: "Arthur's Seat and Calton Hill, both a short walk from the centre." },
      { title: "The festivals", body: "The Fringe and the International Festival every August." },
      { title: "The Highlands", body: "Day and overnight trips into Scotland's mountains and lochs." },
    ],
    planning: [
      { label: "Best time to visit", value: "May to September; August is the busiest month." },
      { label: "Getting around", value: "Walking, buses and a tram line." },
      { label: "Suggested length", value: "Three to four days." },
    ],
    areas: [
      { name: "Old Town", body: "Along the Royal Mile, historic and atmospheric." },
      { name: "New Town", body: "Elegant Georgian streets with shops and restaurants." },
      { name: "West End", body: "Near Haymarket station and the theatres." },
      { name: "Leith", body: "The port district, known for its restaurants." },
    ],
    arrival:
      "Edinburgh Airport (EDI) is west of the city, linked to the centre by tram and the Airlink bus. Glasgow is also within reach, and trains from London arrive at Waverley in the heart of the city.",
    stayStyle: "city",
  }),
  guide("manchester", {
    name: "Manchester",
    country: "United Kingdom",
    tagline: "Music, football and industrial heritage.",
    description: "A lively northern city with music, football and a strong food scene.",
    overview:
      "Manchester grew rich in the industrial revolution, and its red-brick mills and canals now house bars, galleries and hotels. It is known for its music, its two famous football clubs and its easy access to the Peak District and the Lake District.",
    highlights: [
      { title: "Football", body: "Stadium tours and match days at both of the city's clubs." },
      { title: "Music", body: "Venues large and small, from arenas to Northern Quarter bars." },
      { title: "Museums", body: "Science and industry, art and the city's own history." },
      { title: "Day trips", body: "The Peak District, the Lake District and Liverpool." },
    ],
    planning: [
      { label: "Best time to visit", value: "May to September; expect rain at any time of year." },
      { label: "Getting around", value: "Metrolink trams, free city-centre buses and walking." },
      { label: "Suggested length", value: "Two to three days." },
    ],
    areas: [
      { name: "City centre", body: "Around Piccadilly and St Peter's Square, convenient for trains." },
      { name: "Northern Quarter", body: "Independent shops, cafés and live music." },
      { name: "Spinningfields", body: "Modern hotels, restaurants and the riverside." },
      { name: "Salford Quays", body: "Waterside, near MediaCityUK and one of the football grounds." },
    ],
    arrival:
      "Manchester Airport (MAN) is south of the city, with direct trains to Manchester Piccadilly and a Metrolink tram line. Trains from London arrive at Piccadilly in a little over two hours.",
    stayStyle: "city",
  }),
];
