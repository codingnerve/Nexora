"use client";

import { useCallback, useRef, useState } from "react";

import { DateInput, addDaysISO, todayISO } from "@/components/ui/DateInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CABIN_CLASSES, TRIP_TYPES } from "@/lib/constants";
import {
  MAX_LENGTH,
  dateOrder,
  requiredChoice,
  requiredDate,
  requiredText,
  validateEmail,
  validatePhone,
  type FieldErrors,
} from "@/lib/validation";
import type { CabinClass, FlightInquiryInput, TripType } from "@/types/inquiry";
import { ContactFields } from "./ContactFields";
import { FieldFull, FieldGrid, FormShell, SuccessPanel } from "./FormShell";
import { EMPTY_CONTACT, useInquiryFlow, type ContactValues } from "./useInquiryFlow";

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
  preferredAirline: string;
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
  preferredAirline: "",
};

const countOptions = (max: number, from = 0) =>
  Array.from({ length: max - from + 1 }, (_, index) => ({
    value: String(from + index),
    label: String(from + index),
  }));

/** Trip fields that can be pre-filled, e.g. from the homepage search bar. */
export type FlightDefaults = Partial<
  Pick<
    FlightValues,
    "tripType" | "from" | "to" | "departureDate" | "returnDate" | "adults" | "children" | "infants" | "cabinClass"
  >
>;

export function FlightForm({
  /** The /flights page collects an extra optional preference that would make
      the compact homepage panel too long. */
  extended = false,
  defaults,
}: { extended?: boolean; defaults?: FlightDefaults } = {}) {
  // Held in state so the object keeps one identity across renders — the flow
  // hook resets to it after a submission.
  const [initialValues] = useState<FlightValues>(() => ({ ...INITIAL, ...defaults }));
  const panelRef = useRef<HTMLDivElement>(null);
  // Owned here, not by the hook, so no ref is read off a hook result in render.
  const scrollToPanel = useCallback(() => {
    panelRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  const flow = useInquiryFlow<FlightValues>({
    scrollToPanel,
    service: "flights",
    initialValues,
    validateTrip: (v): FieldErrors => ({
      tripType: requiredChoice(v.tripType, "a trip type"),
      from: requiredText(v.from, "Departure city"),
      to: requiredText(v.to, "Destination"),
      departureDate: requiredDate(v.departureDate, "Departure date"),
      // Only a round trip needs a return date.
      returnDate:
        v.tripType === "ROUND_TRIP"
          ? (requiredDate(v.returnDate, "Return date") ??
            dateOrder(
              v.departureDate,
              v.returnDate,
              "Return date can't be before the departure date."
            ))
          : undefined,
      cabinClass: requiredChoice(v.cabinClass, "a cabin class"),
    }),
    validateContact: (v): FieldErrors => ({
      name: requiredText(v.name, "Full name"),
      email: validateEmail(v.email),
      phone: validatePhone(v.phone),
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
      ...(v.preferredAirline.trim()
        ? { preferredAirline: v.preferredAirline.trim() }
        : {}),
      customer: {
        name: v.name.trim(),
        email: v.email.trim(),
        phone: v.phone.trim(),
      },
      message: v.message.trim() || undefined,
      companyWebsite: v.companyWebsite,
    }),
  });

  const { values, errors, setField } = flow;

  if (flow.status === "success") {
    return (
      <div ref={panelRef}>
        <SuccessPanel serviceLabel="Flight request" />
      </div>
    );
  }

  return (
    <div ref={panelRef}>
      <FormShell
        step={flow.step}
        status={flow.status}
        message={flow.message}
        submitLabel="Request Flight Options"
        isSubmitting={flow.isSubmitting}
        onContinue={flow.goToContact}
        onBack={flow.goBack}
        onSubmit={flow.submit}
      >
        {flow.step === 1 ? (
          <FieldGrid>
            <FieldFull>
              <Select
                label="Trip type"
                required
                value={values.tripType}
                error={errors.tripType}
                options={TRIP_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                onChange={(event) =>
                  setField("tripType", event.target.value as TripType)
                }
              />
            </FieldFull>

            <Input
              label="From"
              maxLength={MAX_LENGTH.place}
              required
              placeholder="City or airport"
              autoComplete="off"
              value={values.from}
              error={errors.from}
              onChange={(event) => setField("from", event.target.value)}
            />

            <Input
              label="To"
              maxLength={MAX_LENGTH.place}
              required
              placeholder="City or airport"
              autoComplete="off"
              value={values.to}
              error={errors.to}
              onChange={(event) => setField("to", event.target.value)}
            />

            <DateInput
              label="Departure"
              required
              value={values.departureDate}
              error={errors.departureDate}
              onChange={(event) => setField("departureDate", event.target.value)}
            />

            <DateInput
              label="Return"
              required={values.tripType === "ROUND_TRIP"}
              // A one-way or multi-city request has no return leg to collect.
              disabled={values.tripType !== "ROUND_TRIP"}
              helper={
                values.tripType !== "ROUND_TRIP"
                  ? "Not needed for this trip type."
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
              label="Adults"
              required
              value={values.adults}
              options={countOptions(9, 1)}
              onChange={(event) => setField("adults", event.target.value)}
            />

            <Select
              label="Children"
              value={values.children}
              helper="Aged 2 to 11."
              options={countOptions(8)}
              onChange={(event) => setField("children", event.target.value)}
            />

            <Select
              label="Infants"
              value={values.infants}
              helper="Under 2, on a lap."
              options={countOptions(4)}
              onChange={(event) => setField("infants", event.target.value)}
            />

            <Select
              label="Cabin"
              required
              value={values.cabinClass}
              error={errors.cabinClass}
              options={CABIN_CLASSES.map((c) => ({ value: c.value, label: c.label }))}
              onChange={(event) =>
                setField("cabinClass", event.target.value as CabinClass)
              }
            />

            {extended ? (
              <FieldFull>
                <Input
                  label="Preferred airline"
                  maxLength={MAX_LENGTH.place}
                  placeholder="If you have one in mind"
                  autoComplete="off"
                  helper="We will try to match it, but cannot guarantee availability."
                  value={values.preferredAirline}
                  onChange={(event) =>
                    setField("preferredAirline", event.target.value)
                  }
                />
              </FieldFull>
            ) : null}
          </FieldGrid>
        ) : (
          <ContactFields
            values={values}
            errors={errors}
            setField={setField as (k: keyof ContactValues, v: string) => void}
            messageLabel="Additional requirements"
            messagePlaceholder="Preferred airlines, baggage, seating, flexible dates — anything that helps."
          />
        )}
      </FormShell>
    </div>
  );
}
