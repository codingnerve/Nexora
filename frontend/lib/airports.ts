/**
 * Popular airport directory for autocomplete search.
 *
 * Ordered by focus: the United States first, then France, Italy, Spain and the
 * United Kingdom, then the other destinations the site covers.
 */

export interface Airport {
  readonly code: string;
  readonly city: string;
  readonly name: string;
  readonly country: string;
}

export const POPULAR_AIRPORTS: readonly Airport[] = [
  // United States
  { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States" },
  { code: "MIA", city: "Miami", name: "Miami International Airport", country: "United States" },
  { code: "MCO", city: "Orlando", name: "Orlando International Airport", country: "United States" },
  { code: "BOS", city: "Boston", name: "Boston Logan International Airport", country: "United States" },
  { code: "SEA", city: "Seattle", name: "Seattle–Tacoma International Airport", country: "United States" },
  { code: "HNL", city: "Honolulu", name: "Daniel K. Inouye International Airport", country: "United States" },
  { code: "EWR", city: "Newark", name: "Newark Liberty International Airport", country: "United States" },
  { code: "LAS", city: "Las Vegas", name: "Harry Reid International Airport", country: "United States" },
  { code: "ORD", city: "Chicago", name: "O'Hare International Airport", country: "United States" },
  // Europe
  { code: "CDG", city: "Paris", name: "Charles de Gaulle Airport", country: "France" },
  { code: "NCE", city: "Nice", name: "Nice Côte d'Azur Airport", country: "France" },
  { code: "FCO", city: "Rome", name: "Rome Fiumicino Airport", country: "Italy" },
  { code: "MXP", city: "Milan", name: "Milan Malpensa Airport", country: "Italy" },
  { code: "VCE", city: "Venice", name: "Venice Marco Polo Airport", country: "Italy" },
  { code: "MAD", city: "Madrid", name: "Adolfo Suárez Madrid–Barajas Airport", country: "Spain" },
  { code: "BCN", city: "Barcelona", name: "Barcelona–El Prat Airport", country: "Spain" },
  { code: "LHR", city: "London", name: "Heathrow Airport", country: "United Kingdom" },
  { code: "MAN", city: "Manchester", name: "Manchester Airport", country: "United Kingdom" },
  { code: "EDI", city: "Edinburgh", name: "Edinburgh Airport", country: "United Kingdom" },
  // Elsewhere
  { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "United Arab Emirates" },
  { code: "SIN", city: "Singapore", name: "Singapore Changi Airport", country: "Singapore" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand" },
  { code: "DPS", city: "Bali", name: "Ngurah Rai International Airport", country: "Indonesia" },
  { code: "MLE", city: "Malé", name: "Velana International Airport", country: "Maldives" },
  { code: "DOH", city: "Doha", name: "Hamad International Airport", country: "Qatar" },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International Airport", country: "Hong Kong" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
  { code: "AMS", city: "Amsterdam", name: "Amsterdam Airport Schiphol", country: "Netherlands" },
  { code: "HND", city: "Tokyo", name: "Haneda Airport", country: "Japan" },
  { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith Airport", country: "Australia" },
  { code: "YYZ", city: "Toronto", name: "Toronto Pearson International", country: "Canada" },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey" },
] as const;

export function searchAirports(query: string): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return POPULAR_AIRPORTS.slice(0, 6);

  return POPULAR_AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, 6);
}
