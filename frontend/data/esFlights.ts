/**
 * Spanish copy for the flights landing page (/es/vuelos).
 *
 * Plain neutral Latin American Spanish, "tú" form. Nothing here states a fare,
 * schedule or availability — like the English page, the offer is personal help
 * from a travel specialist, not a booking engine.
 */

export const ES_NAV = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Rutas", href: "#rutas" },
  { label: "Preguntas", href: "#preguntas" },
] as const;

export const ES_HERO_POINTS = [
  "Atención en español, de principio a fin",
  "Un especialista revisa tu solicitud y te llama",
  "Sin pagos en línea ni compromiso",
] as const;

export const ES_BENEFITS = [
  {
    title: "Hablamos tu idioma",
    body: "Te atiende una persona en español, por teléfono o por correo.",
  },
  {
    title: "Opciones a tu medida",
    body: "Fechas flexibles, escalas cómodas, equipaje: lo tomamos en cuenta.",
  },
  {
    title: "Sin pago en línea",
    body: "No cobramos nada por enviar tu solicitud. Tú decides si seguimos.",
  },
  {
    title: "Vuelos nacionales e internacionales",
    body: "Ida y vuelta, solo ida o varias ciudades, en la cabina que prefieras.",
  },
] as const;

export const ES_STEPS = [
  {
    title: "Cuéntanos tu viaje",
    body: "Origen, destino, fechas y cuántas personas viajan. Son dos pasos cortos.",
  },
  {
    title: "Un especialista lo revisa",
    body: "Busca opciones que encajen con lo que necesitas y te las explica con calma.",
  },
  {
    title: "Tú decides",
    body: "Si te convence una opción, te ayudamos a reservarla. Si no, no pasa nada.",
  },
] as const;

export interface EsRoute {
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
}

/** Example routes that pre-fill the form. Deliberately no prices or times. */
export const ES_ROUTES: readonly EsRoute[] = [
  { fromCode: "JFK", fromCity: "Nueva York", toCode: "MEX", toCity: "Ciudad de México" },
  { fromCode: "LAX", fromCity: "Los Ángeles", toCode: "GDL", toCity: "Guadalajara" },
  { fromCode: "MIA", fromCity: "Miami", toCode: "BOG", toCity: "Bogotá" },
  { fromCode: "IAH", fromCity: "Houston", toCode: "SAL", toCity: "San Salvador" },
  { fromCode: "ORD", fromCity: "Chicago", toCode: "MDE", toCity: "Medellín" },
  { fromCode: "MIA", fromCity: "Miami", toCode: "MAD", toCity: "Madrid" },
] as const;

export const ES_ASSIST_POINTS = [
  "Te explicamos las opciones en español, sin tecnicismos.",
  "Tomamos en cuenta equipaje, escalas, niños y fechas flexibles.",
  "Reservamos solo cuando tú lo confirmas.",
] as const;

export const ES_FAQS = [
  {
    question: "¿Me atienden en español?",
    answer:
      "Sí. Tu solicitud la lee un especialista de nuestro equipo y te contacta en español, por teléfono o por correo, según prefieras.",
  },
  {
    question: "¿Cuánto cuesta enviar la solicitud?",
    answer:
      "Nada. Enviar la solicitud es gratis y no tienes que pagar para recibir opciones.",
  },
  {
    question: "¿Puedo pedir vuelos internacionales?",
    answer:
      "Sí, nacionales o internacionales. Escribe de dónde sales y a dónde vas, y un especialista buscará opciones adecuadas.",
  },
  {
    question: "¿Puedo pedir ida y vuelta o solo ida?",
    answer:
      "Sí. El formulario te deja elegir ida y vuelta, solo ida o varias ciudades. En ida y vuelta, agrega la fecha de regreso.",
  },
  {
    question: "¿Cuánto tardan en responderme?",
    answer:
      "Tu solicitud llega directo a nuestro equipo y un especialista te contacta con los datos que dejaste. Si tu viaje es muy pronto, llamar es la forma más rápida.",
  },
  {
    question: "¿Se reserva algo al enviar el formulario?",
    answer:
      "No. Enviar la solicitud no reserva ni cobra nada. La reserva solo se hace cuando tú aceptas una opción.",
  },
] as const;

export const ES_DISCLOSURE = {
  short: "No se requiere pago. Envía tus datos y nuestro equipo te contactará.",
  process:
    "Nexora Destinations no procesa pagos en línea ni emite boletos directamente a través de este sitio web.",
  assistance:
    "Nexora Destinations ayuda a sus clientes con las reservas a través de especialistas de viaje.",
} as const;

export const ES_FOOTER_LEGAL = [
  { label: "Términos y condiciones", href: "/terms-and-conditions" },
  { label: "Política de privacidad", href: "/privacy-policy" },
  { label: "Política de reservas", href: "/booking-policy" },
  { label: "Cancelaciones y reembolsos", href: "/cancellation-policy" },
] as const;
