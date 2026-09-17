/**
 * Cab / Car Rental search dummy engine & types.
 */

export interface CabSearchParams {
  pickupLocation: string;
  dropoffLocation?: string;
  pickupDate: string;
  pickupTime: string;
  vehicleType: string;
}

export interface CabOffer {
  id: string;
  model: string;
  category: "Sedan" | "SUV" | "Luxury" | "Van";
  seats: number;
  luggage: number;
  transmission: string;
  features: readonly string[];
  pricePerDay: number;
  totalPrice: number;
  supplier: string;
  driverOption: "Driver Included" | "Self-Drive Available";
}

const SAMPLE_CABS: readonly Omit<CabOffer, "id" | "totalPrice">[] = [
  {
    model: "Toyota Camry / Honda Accord",
    category: "Sedan",
    seats: 4,
    luggage: 2,
    transmission: "Automatic",
    features: ["Air Conditioned", "Free Cancellation", "Flight Monitoring", "Meet & Greet"],
    pricePerDay: 48,
    supplier: "Nexora City Fleet",
    driverOption: "Driver Included",
  },
  {
    model: "Toyota RAV4 / Chevrolet Suburban",
    category: "SUV",
    seats: 6,
    luggage: 4,
    transmission: "Automatic",
    features: ["All-Wheel Drive", "Extra Legroom", "Child Seat Available", "Free Cancellation"],
    pricePerDay: 75,
    supplier: "Nexora Premier SUV",
    driverOption: "Driver Included",
  },
  {
    model: "Mercedes-Benz E-Class / BMW 5 Series",
    category: "Luxury",
    seats: 4,
    luggage: 3,
    transmission: "Automatic",
    features: ["Leather Seating", "Complimentary Water", "Uniformed Chauffeur", "VIP Terminal Access"],
    pricePerDay: 135,
    supplier: "Nexora VIP Chauffeur",
    driverOption: "Driver Included",
  },
  {
    model: "Toyota HiAce / Mercedes-Benz V-Class",
    category: "Van",
    seats: 8,
    luggage: 6,
    transmission: "Automatic",
    features: ["Spacious Group Seating", "High Roof", "USB Chargers", "Long Distance Ready"],
    pricePerDay: 110,
    supplier: "Nexora Group Travel",
    driverOption: "Driver Included",
  },
] as const;

export async function searchCabs(params: CabSearchParams): Promise<CabOffer[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return SAMPLE_CABS.filter((cab) => {
    if (!params.vehicleType || params.vehicleType === "ANY") return true;
    return cab.category.toUpperCase() === params.vehicleType.toUpperCase();
  }).map((cab, index) => ({
    ...cab,
    id: `cab-${index}-${Date.now()}`,
    totalPrice: cab.pricePerDay,
  }));
}
