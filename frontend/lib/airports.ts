/**
 * Popular airport directory for autocomplete search.
 */

export interface Airport {
  readonly code: string;
  readonly city: string;
  readonly name: string;
  readonly country: string;
}

export const POPULAR_AIRPORTS: readonly Airport[] = [
  { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "United Arab Emirates" },
  { code: "LHR", city: "London", name: "Heathrow Airport", country: "United Kingdom" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States" },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International Airport", country: "Hong Kong" },
  { code: "MLE", city: "Malé", name: "Velana International Airport", country: "Maldives" },
  { code: "SIN", city: "Singapore", name: "Singapore Changi Airport", country: "Singapore" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle Airport", country: "France" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand" },
  { code: "DOH", city: "Doha", name: "Hamad International Airport", country: "Qatar" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
  { code: "AMS", city: "Amsterdam", name: "Amsterdam Airport Schiphol", country: "Netherlands" },
  { code: "HND", city: "Tokyo", name: "Haneda Airport", country: "Japan" },
  { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith Airport", country: "Australia" },
  { code: "DPS", city: "Bali", name: "Ngurah Rai International Airport", country: "Indonesia" },
  { code: "MAD", city: "Madrid", name: "Adolfo Suárez Madrid–Barajas Airport", country: "Spain" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States" },
  { code: "ORD", city: "Chicago", name: "O'Hare International Airport", country: "United States" },
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
