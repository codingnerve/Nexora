"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ContactFields, type ContactCopy } from "@/components/forms/ContactFields";
import {
  FieldFull,
  FieldGrid,
  FormShell,
  SuccessPanel,
  type FormLabels,
} from "@/components/forms/FormShell";
import {
  EMPTY_CONTACT,
  useInquiryFlow,
  type ContactValues,
} from "@/components/forms/useInquiryFlow";
import { DateInput, addDaysISO, todayISO } from "@/components/ui/DateInput";
import { FormLocaleProvider } from "@/components/ui/FormLocale";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ES_DISCLOSURE } from "@/data/esFlights";
import { CONTACT } from "@/lib/constants";
import { MAX_LENGTH, dateOrder, type FieldErrors } from "@/lib/validation";
import {
  requiredChoiceEs,
  requiredDateEs,
  requiredTextEs,
  validateEmailEs,
  validatePhoneEs,
} from "@/lib/validation.es";
import type { CabinClass, FlightInquiryInput, TripType } from "@/types/inquiry";

/**
 * The flight request form, in Spanish.
 *
 * Same two steps, same fields and the same API call as the English
 * `<FlightForm>` — only the words differ. It also tags the message so the team
 * knows to answer in Spanish, and sends the visitor to /es/gracias afterwards.
 */

/** Event the route cards fire to pre-fill the origin and destination. */
export const ES_PREFILL_EVENT = "nexora:es-flight-prefill";

export interface EsPrefillDetail {
  from: string;
  to: string;
}

const TRIP_TYPES_ES = [
  { value: "ROUND_TRIP", label: "Ida y vuelta" },
  { value: "ONE_WAY", label: "Solo ida" },
  { value: "MULTI_CITY", label: "Varias ciudades" },
] as const;

const CABINS_ES = [
  { value: "ECONOMY", label: "Económica" },
  { value: "PREMIUM_ECONOMY", label: "Económica premium" },
  { value: "BUSINESS", label: "Ejecutiva" },
  { value: "FIRST", label: "Primera clase" },
] as const;

const FORM_LABELS_ES: FormLabels = {
  step: (step) => `Paso ${step} de 2`,
  tripDetails: "Datos del viaje",
  yourDetails: "Tus datos",
  continue: "Continuar",
  back: "Atrás",
  sending: "Enviando tu solicitud…",
  disclosure: ES_DISCLOSURE.short,
  callPrefix: "También puedes llamarnos al",
  received: "recibida.",
  redirecting: "Te llevamos a tu confirmación…",
};

const CONTACT_COPY_ES: ContactCopy = {
  name: "Nombre completo",
  namePlaceholder: "¿Con quién hablamos?",
  email: "Correo electrónico",
  phone: "Teléfono",
  phoneHelper: "Incluye el código de tu país para poder llamarte.",
  phonePlaceholder: "Tu número de contacto",
  phoneCodeLabel: "Código de marcación del país",
  phoneCodePlaceholder: "Código",
  locale: "es",
  honeypot: "Sitio web de la empresa",
};

const ERROR_MESSAGES_ES = {
  generic:
    "No pudimos enviar tu solicitud en este momento. Inténtalo de nuevo o llámanos.",
  field: "Revisa este dato e inténtalo de nuevo.",
} as const;

/** Lets the team see at a glance that this customer wants Spanish. */
const MESSAGE_TAG = "[Solicitud desde la página en español — responder en español]";

interface FlightValues extends ContactValues {
  tripType: TripType | "";
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  adults: string;
  children: string;
  infants: string;
  cabinClass: CabinClass | "";
}

const INITIAL: FlightValues = {
  ...EMPTY_CONTACT,
  tripType: "ROUND_TRIP",
  from: "",
  to: "",
  departureDate: "",
  returnDate: "",
  adults: "1",
  children: "0",
  infants: "0",
  cabinClass: "ECONOMY",
};

const countOptions = (max: number, from = 0) =>
  Array.from({ length: max - from + 1 }, (_, index) => ({
    value: String(from + index),
    label: String(from + index),
  }));

export function EsFlightForm() {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollToPanel = useCallback(() => {
    panelRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  const flow = useInquiryFlow<FlightValues>({
    scrollToPanel,
    service: "flights",
    initialValues: INITIAL,
    thankYouPath: "/es/gracias",
    errorMessages: ERROR_MESSAGES_ES,
    validateTrip: (v): FieldErrors => ({
      tripType: requiredChoiceEs(v.tripType, "un tipo de viaje"),
      from: requiredTextEs(v.from, "Origen"),
      to: requiredTextEs(v.to, "Destino"),
      departureDate: requiredDateEs(v.departureDate, "Fecha de salida"),
      returnDate:
        v.tripType === "ROUND_TRIP"
          ? (requiredDateEs(v.returnDate, "Fecha de regreso") ??
            dateOrder(
              v.departureDate,
              v.returnDate,
              "La fecha de regreso no puede ser anterior a la de salida."
            ))
          : undefined,
      cabinClass: requiredChoiceEs(v.cabinClass, "una cabina"),
    }),
    validateContact: (v): FieldErrors => ({
      name: requiredTextEs(v.name, "Nombre completo"),
      email: validateEmailEs(v.email),
      phone: validatePhoneEs(v.phone),
    }),
    buildPayload: (v): FlightInquiryInput => ({
      tripType: v.tripType as TripType,
      from: v.from.trim(),
      to: v.to.trim(),
      departureDate: v.departureDate,
      ...(v.tripType === "ROUND_TRIP" && v.returnDate
        ? { returnDate: v.returnDate }
        : {}),
      adults: Number(v.adults),
      children: Number(v.children),
      infants: Number(v.infants),
      cabinClass: v.cabinClass as CabinClass,
      customer: {
        name: v.name.trim(),
        email: v.email.trim(),
        phone: v.phone.trim(),
      },
      message: `${MESSAGE_TAG}${v.message.trim() ? `\n${v.message.trim()}` : ""}`.slice(
        0,
        MAX_LENGTH.message
      ),
      companyWebsite: v.companyWebsite,
    }),
  });

  const { values, errors, setField } = flow;

  // Route cards elsewhere on the page ask this form to fill in a route.
  const [highlight, setHighlight] = useState(false);
  useEffect(() => {
    const onPrefill = (event: Event) => {
      const detail = (event as CustomEvent<EsPrefillDetail>).detail;
      if (!detail) return;
      setField("from", detail.from);
      setField("to", detail.to);
      setHighlight(true);
      window.setTimeout(() => setHighlight(false), 1600);
    };
    window.addEventListener(ES_PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(ES_PREFILL_EVENT, onPrefill);
  }, [setField]);

  if (flow.status === "success") {
    return (
      <div ref={panelRef}>
        <SuccessPanel serviceLabel="Solicitud de vuelo" labels={FORM_LABELS_ES} />
      </div>
    );
  }

  return (
    <FormLocaleProvider value={{ optional: "Opcional", required: "(obligatorio)" }}>
      <div
        ref={panelRef}
        className={
          highlight
            ? "rounded-[12px] ring-4 ring-clay-500/25 transition-shadow duration-300"
            : "rounded-[12px] ring-0 ring-transparent transition-shadow duration-300"
        }
      >
        <FormShell
          step={flow.step}
          status={flow.status}
          message={flow.message}
          phone={CONTACT.spanish}
          labels={FORM_LABELS_ES}
          submitLabel="Solicitar opciones de vuelo"
          isSubmitting={flow.isSubmitting}
          onContinue={flow.goToContact}
          onBack={flow.goBack}
          onSubmit={flow.submit}
        >
          {flow.step === 1 ? (
            <FieldGrid>
              <FieldFull>
                <Select
                  label="Tipo de viaje"
                  required
                  value={values.tripType}
                  error={errors.tripType}
                  options={TRIP_TYPES_ES.map((t) => ({ value: t.value, label: t.label }))}
                  onChange={(event) =>
                    setField("tripType", event.target.value as TripType)
                  }
                />
              </FieldFull>

              <Input
                label="Origen"
                maxLength={MAX_LENGTH.place}
                required
                placeholder="Ciudad o aeropuerto"
                autoComplete="off"
                value={values.from}
                error={errors.from}
                onChange={(event) => setField("from", event.target.value)}
              />

              <Input
                label="Destino"
                maxLength={MAX_LENGTH.place}
                required
                placeholder="Ciudad o aeropuerto"
                autoComplete="off"
                value={values.to}
                error={errors.to}
                onChange={(event) => setField("to", event.target.value)}
              />

              <DateInput
                label="Salida"
                required
                value={values.departureDate}
                error={errors.departureDate}
                onChange={(event) => setField("departureDate", event.target.value)}
              />

              <DateInput
                label="Regreso"
                required={values.tripType === "ROUND_TRIP"}
                disabled={values.tripType !== "ROUND_TRIP"}
                helper={
                  values.tripType !== "ROUND_TRIP"
                    ? "No hace falta para este tipo de viaje."
                    : undefined
                }
                min={
                  values.departureDate
                    ? addDaysISO(values.departureDate, 0)
                    : todayISO()
                }
                value={values.returnDate}
                error={errors.returnDate}
                onChange={(event) => setField("returnDate", event.target.value)}
              />

              <Select
                label="Adultos"
                required
                value={values.adults}
                options={countOptions(9, 1)}
                onChange={(event) => setField("adults", event.target.value)}
              />

              <Select
                label="Niños"
                value={values.children}
                helper="De 2 a 11 años."
                options={countOptions(8)}
                onChange={(event) => setField("children", event.target.value)}
              />

              <Select
                label="Bebés"
                value={values.infants}
                helper="Menores de 2 años, en brazos."
                options={countOptions(4)}
                onChange={(event) => setField("infants", event.target.value)}
              />

              <Select
                label="Cabina"
                required
                value={values.cabinClass}
                error={errors.cabinClass}
                options={CABINS_ES.map((c) => ({ value: c.value, label: c.label }))}
                onChange={(event) =>
                  setField("cabinClass", event.target.value as CabinClass)
                }
              />
            </FieldGrid>
          ) : (
            <ContactFields
              values={values}
              errors={errors}
              setField={setField as (k: keyof ContactValues, v: string) => void}
              copy={CONTACT_COPY_ES}
              messageLabel="Comentarios adicionales"
              messagePlaceholder="Aerolínea preferida, equipaje, asientos, fechas flexibles… lo que nos ayude."
            />
          )}
        </FormShell>
      </div>
    </FormLocaleProvider>
  );
}
