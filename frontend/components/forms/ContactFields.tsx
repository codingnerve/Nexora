"use client";

import { Input, Textarea } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { HONEYPOT_FIELD } from "@/lib/constants";
import { MAX_LENGTH, type FieldErrors } from "@/lib/validation";
import type { ContactValues } from "./useInquiryFlow";
import { FieldFull, FieldGrid } from "./FormShell";

/** Visible text for the shared contact fields. Defaults to English. */
export interface ContactCopy {
  name: string;
  namePlaceholder: string;
  email: string;
  phone: string;
  phoneHelper: string;
  phonePlaceholder?: string;
  phoneCodeLabel?: string;
  phoneCodePlaceholder?: string;
  /** Language tag for country names in the dialling-code picker. */
  locale?: string;
  honeypot: string;
}

const EN_CONTACT_COPY: ContactCopy = {
  name: "Full name",
  namePlaceholder: "Who should we ask for?",
  email: "Email",
  phone: "Phone",
  phoneHelper: "Include your country code so we can reach you.",
  honeypot: "Company website",
};

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
  copy = EN_CONTACT_COPY,
}: {
  copy?: ContactCopy;
  values: ContactValues;
  errors: FieldErrors;
  setField: (key: keyof ContactValues, value: string) => void;
  messageLabel: string;
  messagePlaceholder: string;
}) {
  return (
    <FieldGrid>
      <Input
        label={copy.name}
        required
        autoComplete="name"
        maxLength={MAX_LENGTH.name}
        placeholder={copy.namePlaceholder}
        value={values.name}
        error={errors.name}
        onChange={(event) => setField("name", event.target.value)}
      />

      <Input
        label={copy.email}
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
        label={copy.phone}
        required
        helper={copy.phoneHelper}
        placeholder={copy.phonePlaceholder}
        codeLabel={copy.phoneCodeLabel}
        codePlaceholder={copy.phoneCodePlaceholder}
        locale={copy.locale}
        error={errors.phone}
        onChange={(combined) => setField("phone", combined)}
      />

      {/* Honeypot: hidden from people, tempting to bots. Never announced to
          assistive tech, and excluded from the tab order. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={HONEYPOT_FIELD}>{copy.honeypot}</label>
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
