"use client";

import { useCallback, useRef, useState } from "react";

import { DateInput, TimeInput } from "@/components/ui/DateInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { VEHICLE_TYPES } from "@/lib/constants";
import {
  MAX_LENGTH,
  requiredChoice,
  requiredDate,
  requiredText,
  validateEmail,
  validatePhone,
  type FieldErrors,
} from "@/lib/validation";
import type { CabInquiryInput, VehicleType } from "@/types/inquiry";
import { ContactFields } from "./ContactFields";
import { FieldGrid, FormShell, SuccessPanel } from "./FormShell";
import { EMPTY_CONTACT, useInquiryFlow, type ContactValues } from "./useInquiryFlow";

interface CabValues extends ContactValues {
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  vehicleType: VehicleType | "";
  passengers: string;
  luggage: string;
}

const INITIAL: CabValues = {
  ...EMPTY_CONTACT,
  pickupLocation: "",
  dropoffLocation: "",
  date: "",
  time: "",
  vehicleType: "",
  passengers: "2",
  luggage: "2",
};

const countOptions = (max: number, from = 0) =>
  Array.from({ length: max - from + 1 }, (_, index) => ({
    value: String(from + index),
    label: String(from + index),
  }));

/** Ride fields that can be pre-filled, e.g. from the homepage search bar. */
export type CabDefaults = Partial<
  Pick<CabValues, "pickupLocation" | "dropoffLocation" | "date" | "time" | "vehicleType" | "passengers">
>;

export function CabForm({ defaults }: { defaults?: CabDefaults } = {}) {
  // Held in state so the object keeps one identity across renders — the flow
  // hook resets to it after a submission.
  const [initialValues] = useState<CabValues>(() => ({ ...INITIAL, ...defaults }));
  const panelRef = useRef<HTMLDivElement>(null);
  // Owned here, not by the hook, so no ref is read off a hook result in render.
  const scrollToPanel = useCallback(() => {
    panelRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  const flow = useInquiryFlow<CabValues>({
    scrollToPanel,
    service: "cabs",
    initialValues,
    validateTrip: (v): FieldErrors => ({
      pickupLocation: requiredText(v.pickupLocation, "Pickup location"),
      dropoffLocation: requiredText(v.dropoffLocation, "Drop-off location"),
      date: requiredDate(v.date, "Pickup date"),
      time: v.time ? undefined : "Pickup time is required.",
      vehicleType: requiredChoice(v.vehicleType, "a vehicle type"),
    }),
    validateContact: (v): FieldErrors => ({
      name: requiredText(v.name, "Full name"),
      email: validateEmail(v.email),
      phone: validatePhone(v.phone),
    }),
    buildPayload: (v): CabInquiryInput => ({
      pickupLocation: v.pickupLocation.trim(),
      dropoffLocation: v.dropoffLocation.trim(),
      date: v.date,
      time: v.time,
      vehicleType: v.vehicleType as VehicleType,
      passengers: Number(v.passengers),
      luggage: Number(v.luggage),
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
        <SuccessPanel serviceLabel="Cab request" />
      </div>
    );
  }

  return (
    <div ref={panelRef}>
      <FormShell
        step={flow.step}
        status={flow.status}
        message={flow.message}
        submitLabel="Request a Cab"
        isSubmitting={flow.isSubmitting}
        onContinue={flow.goToContact}
        onBack={flow.goBack}
        onSubmit={flow.submit}
      >
        {flow.step === 1 ? (
          <FieldGrid>
            <Input
              label="Pickup"
              maxLength={MAX_LENGTH.address}
              required
              placeholder="Airport terminal, hotel or address"
              autoComplete="off"
              value={values.pickupLocation}
              error={errors.pickupLocation}
              onChange={(event) => setField("pickupLocation", event.target.value)}
            />

            <Input
              label="Drop-off"
              maxLength={MAX_LENGTH.address}
              required
              placeholder="Where you need to get to"
              autoComplete="off"
              value={values.dropoffLocation}
              error={errors.dropoffLocation}
              onChange={(event) => setField("dropoffLocation", event.target.value)}
            />

            <DateInput
              label="Date"
              required
              value={values.date}
              error={errors.date}
              onChange={(event) => setField("date", event.target.value)}
            />

            <TimeInput
              label="Pickup time"
              required
              helper="Local time at the pickup point."
              value={values.time}
              error={errors.time}
              onChange={(event) => setField("time", event.target.value)}
            />

            <Select
              label="Vehicle type"
              required
              placeholder="Choose a vehicle"
              value={values.vehicleType}
              error={errors.vehicleType}
              options={VEHICLE_TYPES.map((v) => ({ value: v.value, label: v.label }))}
              onChange={(event) =>
                setField("vehicleType", event.target.value as VehicleType)
              }
            />

            <Select
              label="Passengers"
              required
              value={values.passengers}
              options={countOptions(12, 1)}
              onChange={(event) => setField("passengers", event.target.value)}
            />

            <Select
              label="Luggage"
              value={values.luggage}
              helper="Number of bags, roughly."
              options={countOptions(12)}
              onChange={(event) => setField("luggage", event.target.value)}
            />
          </FieldGrid>
        ) : (
          <ContactFields
            values={values}
            errors={errors}
            setField={setField as (k: keyof ContactValues, v: string) => void}
            messageLabel="Additional instructions"
            messagePlaceholder="Flight number, child seat, extra stop, meeting point — anything that helps."
          />
        )}
      </FormShell>
    </div>
  );
}
