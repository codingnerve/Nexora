/**
 * Hotel search dummy engine & types.
 */

export interface HotelSearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
}

export interface HotelOffer {
  id: string;
  name: string;
  city: string;
  location: string;
  image: string;
  stars: number;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  totalPrice: number;
  roomType: string;
  amenities: readonly string[];
  freeCancellation: boolean;
}

const SAMPLE_HOTELS: readonly Omit<HotelOffer, "id" | "totalPrice">[] = [
  {
    name: "The Grand Horizon Palace",
    city: "Dubai",
    location: "Downtown / Burj Khalifa Views",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    stars: 5,
    rating: 4.9,
    reviewsCount: 1240,
    pricePerNight: 280,
    roomType: "Deluxe Skyline King",
    amenities: ["Free High-Speed WiFi", "Infinity Pool", "Spa & Wellness", "Breakfast Included"],
    freeCancellation: true,
  },
  {
    name: "Emerald Bay Resort & Spa",
    city: "Bali",
    location: "Beachfront / Private Lagoon",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    stars: 5,
    rating: 4.8,
    reviewsCount: 890,
    pricePerNight: 210,
    roomType: "Ocean View Villa",
    amenities: ["Private Beach", "Free Airport Transfer", "Tropical Spa", "Daily Breakfast"],
    freeCancellation: true,
  },
  {
    name: "The Royal Kensington Suites",
    city: "London",
    location: "South Kensington / Near Museums",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    stars: 4,
    rating: 4.7,
    reviewsCount: 640,
    pricePerNight: 245,
    roomType: "Executive Double Room",
    amenities: ["Historic Architecture", "Tea Lounge", "Free WiFi", "24/7 Concierge"],
    freeCancellation: false,
  },
  {
    name: "Manhattan Central Tower Hotel",
    city: "New York",
    location: "Midtown Manhattan / Near Central Park",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    stars: 4,
    rating: 4.6,
    reviewsCount: 1420,
    pricePerNight: 310,
    roomType: "Superior City View Suite",
    amenities: ["Rooftop Lounge", "Fitness Center", "Valet Parking", "Restaurant & Bar"],
    freeCancellation: true,
  },
  {
    name: "Marina Bay Premier Hotel",
    city: "Singapore",
    location: "Marina Bay Waterfront",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    stars: 5,
    rating: 4.9,
    reviewsCount: 2100,
    pricePerNight: 340,
    roomType: "Bayfront Luxury Room",
    amenities: ["Sky Pool", "Michelin-starred Dining", "Butler Service", "Free Shuttle"],
    freeCancellation: true,
  },
] as const;

export async function searchHotels(params: HotelSearchParams): Promise<HotelOffer[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  let nights = 1;
  if (params.checkIn && params.checkOut) {
    const start = new Date(params.checkIn).getTime();
    const end = new Date(params.checkOut).getTime();
    nights = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  }

  const queryCity = (params.city || "").toLowerCase();

  return SAMPLE_HOTELS.map((hotel, index) => {
    const isMatchingCity = queryCity ? hotel.city.toLowerCase().includes(queryCity) : true;
    const adjustedCity = queryCity && !isMatchingCity ? params.city : hotel.city;

    return {
      ...hotel,
      id: `ht-${index}-${Date.now()}`,
      city: adjustedCity,
      totalPrice: hotel.pricePerNight * nights * Math.max(1, params.rooms),
    };
  });
}
