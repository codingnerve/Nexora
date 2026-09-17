"use client";

import { useCallback, useRef, useState } from "react";

import { DateInput, todayISO } from "@/components/ui/DateInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { HOTEL_CATEGORIES } from "@/lib/constants";
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
import type { HotelCategory, HotelInquiryInput } from "@/types/inquiry";
import { ContactFields } from "./ContactFields";
import { FieldFull, FieldGrid, FormShell, SuccessPanel } from "./FormShell";
import { EMPTY_CONTACT, useInquiryFlow, type ContactValues } from "./useInquiryFlow";

interface HotelValues extends ContactValues {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: string;
  adults: string;
  children: string;
  hotelCategory: HotelCategory | "";
  preferredArea: string;
  breakfast: "ANY" | "INCLUDED" | "NOT_REQUIRED";
}

const INITIAL: HotelValues = {
  ...EMPTY_CONTACT,
  destination: "",
  checkIn: "",
  checkOut: "",
  rooms: "1",
  adults: "2",
  children: "0",
  hotelCategory: "ANY",
  preferredArea: "",
  breakfast: "ANY",
};

const countOptions = (max: number, from = 0) =>
  Array.from({ length: max - from + 1 }, (_, index) => ({
    value: String(from + index),
    label: String(from + index),
  }));

const BREAKFAST_OPTIONS = [
  { value: "ANY", label: "No preference" },
  { value: "INCLUDED", label: "Prefer breakfast included" },
  { value: "NOT_REQUIRED", label: "Not required" },
] as const;

/** Stay fields that can be pre-filled, e.g. from the homepage search bar. */
export type HotelDefaults = Partial<
  Pick<HotelValues, "destination" | "checkIn" | "checkOut" | "rooms" | "adults" | "children">
>;

export function HotelForm({
  /** The /hotels page collects two extra optional preferences that would make
      the compact homepage panel too long. */
  extended = false,
  defaults,
}: { extended?: boolean; defaults?: HotelDefaults } = {}) {
  // Held in state so the object keeps one identity across renders — the flow
  // hook resets to it after a submission.
  const [initialValues] = useState<HotelValues>(() => ({ ...INITIAL, ...defaults }));
  const panelRef = useRef<HTMLDivElement>(null);
  // Owned here, not by the hook, so no ref is read off a hook result in render.
  const scrollToPanel = useCallback(() => {
    panelRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  const flow = useInquiryFlow<HotelValues>({
    scrollToPanel,
    service: "hotels",
    initialValues,
    validateTrip: (v): FieldErrors => ({
      destination: requiredText(v.destination, "Destination"),
      checkIn: requiredDate(v.checkIn, "Check-in date"),
      checkOut:
        requiredDate(v.checkOut, "Check-out date") ??
        dateOrder(
          v.checkIn,
          v.checkOut,
          "Check-out can't be before check-in."
        ),
      hotelCategory: requiredChoice(v.hotelCategory, "a hotel preference"),
    }),
    validateContact: (v): FieldErrors => ({
      name: requiredText(v.name, "Full name"),
      email: validateEmail(v.email),
      phone: validatePhone(v.phone),
    }),
    buildPayload: (v): HotelInquiryInput => ({
      destination: v.destination.trim(),
      checkIn: v.checkIn,
      checkOut: v.checkOut,
      rooms: Number(v.rooms),
      adults: Number(v.adults),
      children: Number(v.children),
      hotelCategory: v.hotelCategory as HotelCategory,
      ...(v.preferredArea.trim() ? { preferredArea: v.preferredArea.trim() } : {}),
      ...(v.breakfast !== "ANY" ? { breakfast: v.breakfast } : {}),
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
        <SuccessPanel serviceLabel="Hotel request" />
      </div>
    );
  }

  return (
    <div ref={panelRef}>
      <FormShell
        step={flow.step}
        status={flow.status}
        message={flow.message}
        submitLabel="Request Hotel Options"
        isSubmitting={flow.isSubmitting}
        onContinue={flow.goToContact}
        onBack={flow.goBack}
        onSubmit={flow.submit}
      >
        {flow.step === 1 ? (
          <FieldGrid>
            <FieldFull>
              <Input
                label="Destination"
              maxLength={MAX_LENGTH.place}
                required
                placeholder="City, area or hotel name"
                autoComplete="off"
                value={values.destination}
                error={errors.destination}
                onChange={(event) => setField("destination", event.target.value)}
              />
            </FieldFull>

            <DateInput
              label="Check-in"
              required
              value={values.checkIn}
              error={errors.checkIn}
              onChange={(event) => setField("checkIn", event.target.value)}
            />

            <DateInput
              label="Check-out"
              required
              min={values.checkIn || todayISO()}
              value={values.checkOut}
              error={errors.checkOut}
              onChange={(event) => setField("checkOut", event.target.value)}
            />

            <Select
              label="Rooms"
              required
              value={values.rooms}
              options={countOptions(8, 1)}
              onChange={(event) => setField("rooms", event.target.value)}
            />

            <Select
              label="Adults"
              required
              value={values.adults}
              options={countOptions(12, 1)}
              onChange={(event) => setField("adults", event.target.value)}
            />

            <Select
              label="Children"
              value={values.children}
              options={countOptions(8)}
              onChange={(event) => setField("children", event.target.value)}
            />

            <Select
              label="Hotel preference"
              required
              value={values.hotelCategory}
              error={errors.hotelCategory}
              options={HOTEL_CATEGORIES.map((c) => ({
                value: c.value,
                label: c.label,
              }))}
              onChange={(event) =>
                setField("hotelCategory", event.target.value as HotelCategory)
              }
            />

            {extended ? (
              <>
                <Input
                  label="Preferred area"
                  maxLength={MAX_LENGTH.area}
                  placeholder="Neighbourhood, district or landmark"
                  autoComplete="off"
                  helper="Helpful if you want to be near something specific."
                  value={values.preferredArea}
                  onChange={(event) => setField("preferredArea", event.target.value)}
                />

                <Select
                  label="Breakfast"
                  value={values.breakfast}
                  options={BREAKFAST_OPTIONS.map((o) => ({
                    value: o.value,
                    label: o.label,
                  }))}
                  onChange={(event) =>
                    setField(
                      "breakfast",
                      event.target.value as HotelValues["breakfast"]
                    )
                  }
                />
              </>
            ) : null}
          </FieldGrid>
        ) : (
          <ContactFields
            values={values}
            errors={errors}
            setField={setField as (k: keyof ContactValues, v: string) => void}
            messageLabel="Special requirements"
            messagePlaceholder="Room preferences, accessibility needs, late arrival, breakfast — anything that helps."
          />
        )}
      </FormShell>
    </div>
  );
}
