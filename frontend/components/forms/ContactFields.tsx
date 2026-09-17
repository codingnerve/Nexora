"use client";

import { Input, Textarea } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { HONEYPOT_FIELD } from "@/lib/constants";
import { MAX_LENGTH, type FieldErrors } from "@/lib/validation";
import type { ContactValues } from "./useInquiryFlow";
import { FieldFull, FieldGrid } from "./FormShell";

/**
 * Step 2 of every inquiry form: who you are and how to reach you.
 *
 * Split out of step 1 deliberately — asking for a name and phone number before
 * a visitor has described their trip is the fastest way to lose them. These
 * fields are identical across all three services, so they live here once.
 */
export function ContactFields({
  values,
  errors,
  setField,
  messageLabel,
  messagePlaceholder,
}: {
  values: ContactValues;
  errors: FieldErrors;
  setField: (key: keyof ContactValues, value: string) => void;
  messageLabel: string;
  messagePlaceholder: string;
}) {
  return (
    <FieldGrid>
      <Input
        label="Full name"
        required
        autoComplete="name"
        maxLength={MAX_LENGTH.name}
        placeholder="Who should we ask for?"
        value={values.name}
        error={errors.name}
        onChange={(event) => setField("name", event.target.value)}
      />

      <Input
        label="Email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        maxLength={MAX_LENGTH.email}
        placeholder="name@example.com"
        value={values.email}
        error={errors.email}
        onChange={(event) => setField("email", event.target.value)}
      />

      <PhoneInput
        label="Phone"
        required
        helper="Include your country code so we can reach you."
        error={errors.phone}
        onChange={(combined) => setField("phone", combined)}
      />

      {/* Honeypot: hidden from people, tempting to bots. Never announced to
          assistive tech, and excluded from the tab order. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={HONEYPOT_FIELD}>Company website</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.companyWebsite}
          onChange={(event) => setField("companyWebsite", event.target.value)}
        />
      </div>

      <FieldFull>
        <Textarea
          label={messageLabel}
          rows={4}
          maxLength={MAX_LENGTH.message}
          placeholder={messagePlaceholder}
          value={values.message}
          error={errors.message}
          onChange={(event) => setField("message", event.target.value)}
        />
      </FieldFull>
    </FieldGrid>
  );
}
