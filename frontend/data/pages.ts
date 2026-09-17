import type { ContentBlock } from "@/components/sections/ContentPage";

/**
 * Copy for About, FAQ and the policy pages.
 *
 * Every statement here describes how this website and its inquiry system
 * actually behave. Nothing asserts a founding date, team size, legal entity,
 * registration number, jurisdiction, award or partnership — none of that has
 * been supplied.
 *
 * ── Before launch ──────────────────────────────────────────────────────────
 *  The three policy texts are an accurate description of the system, not
 *  legal advice. The business must have them reviewed, and add its legal
 *  entity name and governing jurisdiction, before going live.
 * ───────────────────────────────────────────────────────────────────────────
 */

/* ---------------------------------------------------------------------------
 * About
 * ------------------------------------------------------------------------- */

export const ABOUT_BLOCKS: readonly ContentBlock[] = [
  {
    heading: "What we do",
    paragraphs: [
      "Nexora Destination is a travel assistance service. We help people arrange flights, hotel stays, cabs and airport transfers — and we do it by having a person look at each request, rather than sending you through a booking engine.",
    ],
  },
  {
    heading: "How it works",
    paragraphs: [
      "You tell us what you need through one of our request forms, or by calling us. A travel specialist reviews it, works out what is practical for your dates, and contacts you with options. When you decide what suits you, the specialist handles the booking.",
    ],
  },
  {
    heading: "What this website does not do",
    paragraphs: [
      "The website collects travel requests. It does not take payments, issue tickets, confirm hotel reservations or dispatch cabs, and it never shows live prices or availability. Anything you book is arranged with you directly by a specialist, who will explain the price and terms before you commit.",
    ],
  },
  {
    heading: "Why work this way",
    paragraphs: [
      "Plenty of trips are simple enough for a search box. Many are not: a multi-city route, a family that needs connecting rooms, a late arrival that needs a car waiting. Talking to a person tends to be faster for those, and it means one team keeps track of the flights, the stay and the transfer together.",
    ],
  },
];

/* ---------------------------------------------------------------------------
 * FAQ
 * ------------------------------------------------------------------------- */

export const FAQ_ENTRIES: readonly { question: string; answer: string }[] = [
  {
    question: "Can I book and pay on this website?",
    answer:
      "No. The website only collects your travel request. A travel specialist contacts you with options, and any booking is arranged directly with you. No payment details are ever collected through this site.",
  },
  {
    question: "What happens after I send a request?",
    answer:
      "You receive a request reference straight away. A travel specialist reviews your details and contacts you by phone or email with suitable options. Nothing is booked until you have agreed to it.",
  },
  {
    question: "Does sending a request mean my trip is confirmed?",
    answer:
      "No. A request is not a booking or a reservation. It simply tells our team what you need so they can look into options for you.",
  },
  {
    question: "Why don't you show prices on the website?",
    answer:
      "Fares, room rates and transfer costs change constantly and depend on your exact dates and requirements. Rather than show figures that may not be available, a specialist gives you current options when they contact you.",
  },
  {
    question: "Which services can you help with?",
    answer:
      "Flights, hotel stays, cabs and airport transfers. You can request one of these, or tell us about the whole trip through the contact form and we will coordinate it.",
  },
  {
    question: "Do you handle visas or entry requirements?",
    answer:
      "No. Entry and transit requirements depend on your nationality and destination, and they change. Please check the official government guidance for your route. We help with the travel arrangements themselves.",
  },
  {
    question: "What is my request reference for?",
    answer:
      "It identifies your request. Quote it if you contact us about that trip, so a specialist can find your details quickly.",
  },
  {
    question: "Can I change or withdraw a request?",
    answer:
      "Yes. Contact us and quote your request reference. Because nothing is booked until you agree to it, withdrawing a request costs nothing.",
  },
];

/* ---------------------------------------------------------------------------
 * Booking Policy
 * ------------------------------------------------------------------------- */

export const BOOKING_POLICY_BLOCKS: readonly ContentBlock[] = [
  {
    heading: "1. Booking Request",
    paragraphs: [
      "Customers can make booking requests through our website or authorized customer support channels.",
      "Customers must provide accurate information, including their name, contact details, travel dates, destination, and any other information required to complete the booking.",
    ],
  },
  {
    heading: "2. Availability",
    paragraphs: [
      "Submitting a booking request does not guarantee availability.",
      "Availability and pricing may change until the reservation is confirmed by the applicable travel provider.",
    ],
  },
  {
    heading: "3. Booking Confirmation",
    paragraphs: [
      "A booking will be considered confirmed after:",
    ],
    list: [
      "Availability has been confirmed;",
      "Required payment has been successfully received; and",
      "The applicable airline, hotel, car rental company, or travel supplier has confirmed the reservation.",
    ],
  },
  {
    heading: "4. Customer Information",
    paragraphs: [
      "Customers are responsible for ensuring that all information provided during booking is correct.",
      "For flight bookings, passenger names should match the applicable identification or travel documents.",
      "Incorrect information may result in additional charges or restrictions.",
    ],
  },
  {
    heading: "5. Flight Bookings",
    paragraphs: [
      "Flight reservations are subject to the airline’s fare rules, baggage policies, ticket conditions, schedule changes, and cancellation rules.",
    ],
  },
  {
    heading: "6. Hotel Bookings",
    paragraphs: [
      "Hotel reservations are subject to the property’s check-in, check-out, cancellation, payment, identification, and other applicable policies.",
    ],
  },
  {
    heading: "7. Car Rental Bookings",
    paragraphs: [
      "Car rental reservations may be subject to requirements relating to driver’s license, age, identification, payment method, security deposit, insurance, and other rental conditions.",
      "Requirements may vary by rental provider and location.",
    ],
  },
  {
    heading: "8. Travel Packages",
    paragraphs: [
      "Travel packages may contain multiple travel services. Each service may have separate terms, cancellation conditions, and supplier policies.",
      "Customers should review the applicable package details before completing payment.",
    ],
  },
  {
    heading: "9. Booking Changes",
    paragraphs: [
      "Changes to confirmed bookings are subject to availability and the applicable supplier’s rules.",
      "Additional fees, fare differences, or service charges may apply.",
    ],
  },
  {
    heading: "10. Customer Responsibility",
    paragraphs: [
      "Before travelling, customers should verify their:",
    ],
    list: [
      "Booking details",
      "Travel dates",
      "Passenger names",
      "Passport and visa requirements",
      "Baggage allowance",
      "Hotel requirements",
      "Car rental requirements",
      "Cancellation conditions",
    ],
  },
  {
    heading: "Customer Support & Contact",
    paragraphs: [
      "For assistance with your booking or any questions regarding our policies, please contact our customer support team:",
      "Email: support@nexoradestinations.com",
      "Phone: Available via our Contact page",
    ],
  },
];

/* ---------------------------------------------------------------------------
 * Cancellation & Refund Policy
 * ------------------------------------------------------------------------- */

export const CANCELLATION_BLOCKS: readonly ContentBlock[] = [
  {
    heading: "1. Cancellation Requests",
    paragraphs: [
      "Cancellation requests must be submitted through our official customer support channels.",
      "A cancellation request is considered received once it has been submitted to Nexora Destinations.",
    ],
  },
  {
    heading: "2. Flight Cancellation",
    paragraphs: [
      "Flight cancellations and refunds are subject to the applicable airline’s fare rules and ticket conditions.",
      "Some fares may be non-refundable or may include cancellation charges.",
      "If a refund is approved, the refundable amount will be calculated after applicable airline, supplier, and service charges.",
    ],
  },
  {
    heading: "3. Hotel Cancellation",
    paragraphs: [
      "Hotel cancellation policies vary depending on the property and rate selected.",
      "Some reservations may be refundable until a specified cancellation deadline, while others may be non-refundable.",
      "The cancellation conditions applicable to your reservation will be provided during the booking process where available.",
    ],
  },
  {
    heading: "4. Car Rental Cancellation",
    paragraphs: [
      "Car rental cancellations are subject to the applicable rental provider’s terms.",
      "Cancellation fees, no-show charges, deposits, or other supplier charges may apply.",
    ],
  },
  {
    heading: "5. Travel Package Cancellation",
    paragraphs: [
      "Travel packages may contain multiple services with different cancellation policies.",
      "The refund amount will depend on the individual terms applicable to the services included in the package.",
    ],
  },
  {
    heading: "6. Non-Refundable Bookings",
    paragraphs: [
      "Certain tickets, hotel rates, car rentals, promotional offers, and travel services may be non-refundable.",
      "Customers should review the applicable cancellation conditions before completing payment.",
    ],
  },
  {
    heading: "7. No-Show",
    paragraphs: [
      "If a customer does not use a booked service and does not cancel within the applicable cancellation period, the booking may be subject to a no-show charge or may become non-refundable according to the supplier’s rules.",
    ],
  },
  {
    heading: "8. Refund Processing",
    paragraphs: [
      "Once an eligible refund has been approved, Nexora Destinations will initiate the refund through the applicable payment method or payment provider.",
      "The time required for the refund to appear in the customer’s account may depend on the payment provider, bank, card issuer, airline, hotel, or other supplier.",
    ],
  },
  {
    heading: "9. Supplier Cancellation",
    paragraphs: [
      "If an airline, hotel, car rental company, or other supplier cancels a service, available options will depend on the applicable supplier’s policy and the circumstances of the booking.",
    ],
  },
  {
    heading: "10. Request a Cancellation or Refund",
    paragraphs: [
      "To request a cancellation or refund, please contact our customer support team:",
      "Email: support@nexoradestinations.com (or via our Contact page)",
      "Please provide your booking/reference number, customer name, and reason for the request where applicable.",
    ],
  },
];

/* ---------------------------------------------------------------------------
 * Privacy Policy
 * ------------------------------------------------------------------------- */

export const PRIVACY_BLOCKS: readonly ContentBlock[] = [
  {
    heading: "1. Information We Collect",
    paragraphs: [
      "Depending on the service you use, we may collect:",
    ],
    list: [
      "Name",
      "Email address",
      "Phone number",
      "Travel dates and destinations",
      "Passenger or traveler information",
      "Booking information",
      "Billing information",
      "Information required to complete a travel reservation",
      "Information submitted through our contact forms",
    ],
  },
  {
    heading: "2. How We Use Information",
    paragraphs: [
      "We may use customer information to:",
    ],
    list: [
      "Process travel bookings",
      "Provide booking confirmations",
      "Communicate booking updates",
      "Provide customer support",
      "Process payments and eligible refunds",
      "Coordinate with travel suppliers",
      "Respond to inquiries",
      "Improve our website and services",
      "Prevent fraud and unauthorized activity",
      "Comply with applicable legal requirements",
    ],
  },
  {
    heading: "3. Payment Information",
    paragraphs: [
      "Payments may be processed through third-party payment processors.",
      "Where payment processing is handled by an authorized payment provider, Nexora Destinations does not intend to store complete payment card information on its own systems.",
    ],
  },
  {
    heading: "4. Sharing Information",
    paragraphs: [
      "We may share relevant information with service providers when necessary to complete or support your booking, including airlines, hotels, car rental companies, travel suppliers, payment processors, technology providers, or authorities where legally required.",
    ],
  },
  {
    heading: "5. Cookies",
    paragraphs: [
      "Our website may use cookies and similar technologies to provide website functionality, security, analytics, and an improved user experience.",
    ],
  },
  {
    heading: "6. Data Security",
    paragraphs: [
      "We use reasonable measures to protect customer information from unauthorized access, misuse, alteration, or disclosure.",
      "However, no online system can guarantee complete security.",
    ],
  },
  {
    heading: "7. Third-Party Services",
    paragraphs: [
      "Our website may contain links or integrations to third-party websites and services.",
      "Their privacy practices are governed by their own privacy policies.",
    ],
  },
  {
    heading: "8. Privacy Requests",
    paragraphs: [
      "Depending on applicable law, customers may have rights regarding their personal information.",
      "For privacy-related questions or requests, please contact us:",
      "Email: support@nexoradestinations.com",
    ],
  },
  {
    heading: "9. Policy Updates",
    paragraphs: [
      "We may update this Privacy Policy periodically. Any updated version will be published on this page.",
    ],
  },
  {
    heading: "10. Contact",
    paragraphs: [
      "Nexora Destinations",
      "Email: support@nexoradestinations.com",
      "For telephone inquiries and company correspondence, please visit our Contact page.",
    ],
  },
];

/* ---------------------------------------------------------------------------
 * Terms & Conditions
 * ------------------------------------------------------------------------- */

export const TERMS_BLOCKS: readonly ContentBlock[] = [
  {
    heading: "1. Acceptance of Terms",
    paragraphs: [
      "By accessing or using the Nexora Destinations website and services, you agree to comply with and be bound by these Terms & Conditions, along with our Booking Policy, Cancellation & Refund Policy, and Privacy Policy.",
    ],
  },
  {
    heading: "2. Travel Services & Booking Model",
    paragraphs: [
      "Nexora Destinations assists customers in organizing travel services including flights, hotels, car rentals, and custom packages. Submitting a request or inquiry does not guarantee availability or price until confirmed by the applicable travel suppliers under our Booking Policy.",
    ],
  },
  {
    heading: "3. Supplier Terms & Rules",
    paragraphs: [
      "All travel bookings arranged through Nexora Destinations are subject to the specific terms, conditions, fare rules, baggage policies, and conditions of carriage of the applicable airlines, hotels, car rental companies, or tour operators.",
    ],
  },
  {
    heading: "4. Cancellations, Changes & Refunds",
    paragraphs: [
      "Changes and cancellations are subject to supplier availability, penalty fees, and the terms outlined in our Cancellation & Refund Policy. Certain promotional or discounted rates may be strictly non-refundable.",
    ],
  },
  {
    heading: "5. Customer Responsibilities",
    paragraphs: [
      "Customers are responsible for providing accurate and verifiable traveler information matching government-issued identification, as well as obtaining all necessary passports, visas, and health documentation for travel.",
    ],
  },
  {
    heading: "6. Limitation of Liability",
    paragraphs: [
      "Nexora Destinations works with reputable third-party travel providers but is not liable for provider delays, cancellations, schedule adjustments, or unforeseen events beyond our reasonable control.",
    ],
  },
  {
    heading: "7. Modifications to Terms",
    paragraphs: [
      "We reserve the right to modify these Terms & Conditions periodically. Any updates will be published on this website.",
    ],
  },
  {
    heading: "8. Contact & Support",
    paragraphs: [
      "For any inquiries regarding these Terms & Conditions, please reach out to our team at support@nexoradestinations.com or through our Contact page.",
    ],
  },
];

