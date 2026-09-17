import { HOTEL_PHOTOS } from "@/lib/images";
import type { PhotoCard } from "@/components/sections/PhotoCardGrid";

/**
 * Content for the three service pages.
 *
 * Everything here describes what we can *ask* a customer about, or general
 * planning considerations. Nothing asserts inventory, availability, pricing,
 * fleet size, response times or entry requirements — those are claims the
 * business cannot make from a website.
 *
 * Option lists (cabins, vehicle types, room and passenger counts) mirror what
 * the inquiry forms actually accept, so the pages never promise a choice the
 * form cannot record.
 */

type Note = { readonly title: string; readonly body: string };
type Faq = { readonly question: string; readonly answer: string };

/* ---------------------------------------------------------------------------
 * Flights
 * ------------------------------------------------------------------------- */

export const FLIGHT_AREAS: readonly Note[] = [
  {
    title: "Domestic flights",
    body: "Journeys within the country, whether it's a quick hop or a connection across a longer route.",
  },
  {
    title: "International flights",
    body: "Long-haul and regional routes, including journeys that need a connection on the way.",
  },
  {
    title: "Round trips",
    body: "Outbound and return together, so the two dates and timings are planned as one journey.",
  },
  {
    title: "One-way journeys",
    body: "A single leg — useful for open-ended travel or when the return is still undecided.",
  },
];

/** What a specialist plans around. Mirrors the flight form's fields. */
export const FLIGHT_JOURNEY: readonly Note[] = [
  { title: "Route planning", body: "Where you're flying from and to, and whether a direct flight or a connection suits you better." },
  { title: "Dates", body: "Departure and return dates — and whether either of them can move." },
  { title: "Traveller requirements", body: "Adults, children and infants travelling, and anything that affects how you travel." },
  { title: "Cabin preferences", body: "Economy, premium economy, business or first." },
  { title: "Airline preferences", body: "An airline you prefer or would rather avoid, if you have one." },
];

export const FLIGHT_TIPS: readonly Note[] = [
  {
    title: "Flexible dates",
    body: "If your dates allow flexibility, tell our team. A day either side can widen the options a specialist looks at.",
  },
  {
    title: "Traveller details",
    body: "Provide accurate passenger counts — adults, children and infants — so the options match who is actually travelling.",
  },
  {
    title: "Cabin preference",
    body: "Tell us if you prefer economy, premium economy, business or first, and whether you'd consider another cabin.",
  },
  {
    title: "Special requirements",
    body: "Mention any specific needs in the request — baggage, assistance at the airport, or timings that matter.",
  },
];

export const FLIGHT_FAQS: readonly Faq[] = [
  {
    question: "Can I request international flights?",
    answer:
      "Yes. You can request domestic or international flights — enter where you're flying from and to, and a specialist will look into suitable options.",
  },
  {
    question: "Can I request a round trip?",
    answer:
      "Yes. The form lets you choose a round trip, a one-way journey or a multi-city trip. For a round trip, add your return date.",
  },
  {
    question: "Can I specify an airline?",
    answer:
      "Yes. There is an optional preferred airline field on the form. A specialist will take it into account, though a particular airline may not fly your route or dates.",
  },
  {
    question: "Can I request a preferred cabin?",
    answer: "Yes. Choose economy, premium economy, business or first when you send the request.",
  },
  {
    question: "How will I receive flight options?",
    answer:
      "A travel specialist contacts you by phone or email, using the details you provide, to talk through the options. Nothing is booked until you have agreed to it.",
  },
  {
    question: "How long does it take to hear back?",
    answer:
      "Your request goes straight to our team, and a specialist reviews it and gets in touch using your contact details. If your travel date is very close, calling us is the quickest way to get help.",
  },
  {
    question: "Do you charge for submitting an inquiry?",
    answer:
      "No. Sending a request is free and does not commit you to anything. No payment details are collected on this website.",
  },
];

/* ---------------------------------------------------------------------------
 * Hotels
 * ------------------------------------------------------------------------- */

/** Illustrative categories for describing a preference — not live inventory. */
export const HOTEL_TYPES: readonly PhotoCard[] = [
  {
    title: "City Hotels",
    body: "Close to the centre, a venue or the sights you came for.",
    image: HOTEL_PHOTOS.cityRoom.src,
    imageAlt: HOTEL_PHOTOS.cityRoom.alt,
  },
  {
    title: "Beach Resorts",
    body: "Pools, sea views and space to slow down.",
    image: HOTEL_PHOTOS.palmsPool.src,
    imageAlt: HOTEL_PHOTOS.palmsPool.alt,
  },
  {
    title: "Business Hotels",
    body: "A desk, reliable connectivity and a sensible route to meetings.",
    image: HOTEL_PHOTOS.businessRoom.src,
    imageAlt: HOTEL_PHOTOS.businessRoom.alt,
  },
  {
    title: "Family Stays",
    body: "Room for everyone, and facilities that keep children busy.",
    image: HOTEL_PHOTOS.poolTerrace.src,
    imageAlt: HOTEL_PHOTOS.poolTerrace.alt,
  },
  {
    title: "Luxury Stays",
    body: "Five-star hotels and resorts where the stay is part of the trip.",
    image: HOTEL_PHOTOS.classicSuite.src,
    imageAlt: HOTEL_PHOTOS.classicSuite.alt,
  },
  {
    title: "Budget-Friendly Stays",
    body: "Clean, comfortable and practical, without paying for extras you won't use.",
    image: HOTEL_PHOTOS.brightRoom.src,
    imageAlt: HOTEL_PHOTOS.brightRoom.alt,
  },
];

/** The details we can take with a hotel request. Mirrors the hotel form. */
export const HOTEL_DETAILS = [
  "Destination",
  "Check-in and check-out dates",
  "Number of rooms",
  "Number of guests",
  "Hotel category",
  "Preferred location",
  "Breakfast preference",
  "Special requirements",
] as const;

export const HOTEL_TIPS: readonly Note[] = [
  {
    title: "Location",
    body: "Name the area, landmark or venue you want to be near. It narrows the options more than anything else.",
  },
  {
    title: "Room requirements",
    body: "Say how the group is split across rooms, and whether you need twin beds, connecting rooms or extra space.",
  },
  {
    title: "Check-in and check-out",
    body: "Early arrivals and late departures are worth mentioning, especially around overnight flights.",
  },
  {
    title: "Breakfast",
    body: "Tell us whether breakfast should be included or isn't needed, so the options are compared like for like.",
  },
  {
    title: "Family requirements",
    body: "Children's ages, cots, pools and whether a quieter location matters.",
  },
  {
    title: "Business requirements",
    body: "Distance to your office or venue, a workspace in the room, and invoicing needs.",
  },
];

export const HOTEL_FAQS: readonly Faq[] = [
  {
    question: "Can you help me find a hotel in a specific area?",
    answer:
      "Yes. Add your preferred area on the form, or name a landmark, office or venue you want to be near, and a specialist will look for options around it.",
  },
  {
    question: "Can I request more than one room?",
    answer:
      "Yes. The form accepts up to eight rooms along with the number of adults and children. For a larger group, mention it under special requirements or contact us directly.",
  },
  {
    question: "Can I ask for breakfast to be included?",
    answer: "Yes. The hotel request form has a breakfast preference you can set.",
  },
  {
    question: "I already have a hotel in mind. Can you look into it?",
    answer:
      "Yes. Mention the hotel by name under special requirements, and a specialist will include it when they look into your options.",
  },
  {
    question: "Are the hotel types on this page available hotels?",
    answer:
      "No. They are categories to help you describe what you're looking for. A specialist checks what is actually available for your dates and contacts you with options.",
  },
  {
    question: "Is my hotel booked when I send the form?",
    answer:
      "No. A request is not a reservation. Nothing is booked until you have discussed the options with a specialist and agreed to go ahead.",
  },
  {
    question: "Is there a charge for sending a hotel request?",
    answer:
      "No. Sending a request is free, and no payment details are collected on this website.",
  },
];

/* ---------------------------------------------------------------------------
 * Cabs
 * ------------------------------------------------------------------------- */

export const CAB_SERVICE_TYPES: readonly Note[] = [
  { title: "Airport Transfers", body: "Pickups and drop-offs planned around your flight times." },
  { title: "City Transfers", body: "Between hotels, stations, offices and venues across a city." },
  { title: "Point-to-Point Travel", body: "A single planned journey between two addresses." },
  { title: "Family Travel", body: "Enough seats and luggage space for everyone travelling together." },
  { title: "Business Travel", body: "Punctual rides to meetings, events and the airport." },
  { title: "Group Travel", body: "Larger vehicles when a group needs to travel as one." },
];

/**
 * The vehicle preferences the cab form records, described as categories. No
 * models, prices or availability — a specialist confirms the actual vehicle.
 */
export const CAB_VEHICLE_TYPES: readonly Note[] = [
  { title: "Hatchback", body: "A compact option for one or two passengers with light luggage." },
  { title: "Sedan", body: "Usually suits up to three passengers with modest luggage." },
  { title: "SUV", body: "More room for luggage, or a more comfortable longer drive." },
  { title: "Van / Minibus", body: "For families and groups travelling together." },
  { title: "Luxury", body: "A higher-specification vehicle where that matters." },
];

export const CAB_PLAN_AHEAD: readonly Note[] = [
  { title: "Easier arrivals", body: "No searching for a ride after a long flight — the transport is already arranged." },
  { title: "Clearer pickups", body: "The pickup point, date and time are agreed before the day." },
  { title: "Better planning", body: "Transfers fit around flights and hotel check-in rather than the other way round." },
  { title: "The right vehicle", body: "Passenger numbers and luggage are known up front, so the vehicle suits the group." },
];

export const CAB_FAQS: readonly Faq[] = [
  {
    question: "Can you arrange an airport pickup?",
    answer:
      "Yes. Enter the airport as your pickup, add the date and time, and include your flight number under additional instructions so the pickup can be planned around your arrival.",
  },
  {
    question: "Can I choose the type of vehicle?",
    answer:
      "You can request a hatchback, sedan, SUV, van or minibus, or a luxury vehicle. A specialist confirms what can be arranged for your journey.",
  },
  {
    question: "How many passengers and bags can I request for?",
    answer:
      "The form accepts up to 12 passengers and 12 pieces of luggage. For a larger group, mention it under additional instructions or contact us directly.",
  },
  {
    question: "Can I arrange a return journey too?",
    answer:
      "Yes. Send the request for the first journey and describe the return — date, time and pickup point — under additional instructions.",
  },
  {
    question: "Is my ride confirmed when I submit the form?",
    answer:
      "No. Submitting sends your request to our team. A specialist contacts you to confirm the details, and nothing is arranged until you agree.",
  },
  {
    question: "Is there a charge for sending a cab request?",
    answer: "No. Sending a request is free, and no payment details are collected on this website.",
  },
];
