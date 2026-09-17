"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Select } from "@/components/ui/Select";
import { ApiError } from "@/lib/api";
import { DISCLOSURE, GENERIC_ERROR_MESSAGE, HONEYPOT_FIELD } from "@/lib/constants";
import { submitInquiry } from "@/lib/inquiryClient";
import {
  compact,
  focusFirstInvalid,
  isClean,
  mapApiFieldErrors,
  MAX_LENGTH,
  requiredText,
  validateEmail,
  validatePhone,
  type FieldErrors,
} from "@/lib/validation";
import type { GeneralInquiryInput } from "@/types/inquiry";
import { ErrorBanner, FieldFull, FieldGrid, SuccessPanel } from "./FormShell";

/**
 * General enquiry form.
 *
 * Single step, unlike the service forms — there is no trip to describe, so
 * splitting it would add friction for no benefit. It posts to the same
 * `/api/inquiries/general` endpoint through the shared client.
 */

const SERVICE_OPTIONS = [
  { value: "OTHER", label: "Something else" },
  { value: "FLIGHT", label: "Flights" },
  { value: "HOTEL", label: "Hotels" },
  { value: "CAB", label: "Cabs & transfers" },
] as const;

type ServiceValue = (typeof SERVICE_OPTIONS)[number]["value"];

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  service: ServiceValue;
  subject: string;
  message: string;
  companyWebsite: string;
}

const INITIAL: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  service: "OTHER",
  subject: "",
  message: "",
  companyWebsite: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  // Blocks a second submit (e.g. Enter pressed twice) while one is in flight.
  const inFlight = useRef(false);

  const setField = useCallback(
    <K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) => {
      setValues((previous) => ({ ...previous, [key]: value }));
      setErrors((previous) =>
        previous[key as string]
          ? { ...previous, [key as string]: undefined }
          : previous
      );
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (inFlight.current) return;

      const found = compact<string>({
        name: requiredText(values.name, "Full name"),
        email: validateEmail(values.email),
        phone: validatePhone(values.phone),
        message:
          values.message.trim().length >= 10
            ? undefined
            : "Please give us a little more detail — at least 10 characters.",
      });

      setErrors(found);
      if (!isClean(found)) {
        focusFirstInvalid();
        return;
      }

      // Bots get a silent success; the backend rejects it independently.
      if (values.companyWebsite.trim() !== "") {
        setStatus("success");
        return;
      }

      inFlight.current = true;
      setStatus("submitting");
      setMessage("");

      try {
        const payload: GeneralInquiryInput = {
          customer: {
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
          },
          subject: values.subject.trim() || undefined,
          service: values.service,
          message: values.message.trim(),
          companyWebsite: values.companyWebsite,
        };

        const created = await submitInquiry("general", payload);
        setStatus("success");
        router.push(`/thank-you?inquiry=${encodeURIComponent(created.inquiryId)}`);
      } catch (error) {
        if (error instanceof ApiError) {
          setMessage(error.message);
          if (error.isValidationError) {
            setErrors(mapApiFieldErrors(error.fieldErrors));
            focusFirstInvalid();
          }
        } else {
          setMessage(GENERIC_ERROR_MESSAGE);
        }
        setStatus("error");
      } finally {
        inFlight.current = false;
      }
    },
    [values, router]
  );

  if (status === "success") {
    return <SuccessPanel serviceLabel="Message" />;
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      {status === "error" && message ? <ErrorBanner message={message} /> : null}

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

        <Select
          label="What's it about?"
          value={values.service}
          options={SERVICE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(event) =>
            setField("service", event.target.value as ServiceValue)
          }
        />

        <FieldFull>
          <Input
            label="Subject"
            placeholder="A short summary"
            maxLength={MAX_LENGTH.subject}
            autoComplete="off"
            value={values.subject}
            error={errors.subject}
            onChange={(event) => setField("subject", event.target.value)}
          />
        </FieldFull>

        {/* Honeypot: hidden from people, out of the tab order. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor={`contact-${HONEYPOT_FIELD}`}>Company website</label>
          <input
            id={`contact-${HONEYPOT_FIELD}`}
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
            label="How can we help?"
            required
            rows={5}
            maxLength={MAX_LENGTH.message}
            placeholder="Tell us about the trip, the dates, or the question you have."
            value={values.message}
            error={errors.message}
            onChange={(event) => setField("message", event.target.value)}
          />
        </FieldFull>
      </FieldGrid>

      <div className="mt-7 flex flex-col gap-4 border-t border-sand-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="order-2 max-w-sm text-caption text-stone-500 sm:order-1">
          {DISCLOSURE.short}
        </p>

        <Button
          type="submit"
          variant="accent"
          className="order-1 sm:order-2"
          loading={status === "submitting"}
          loadingLabel="Sending your message…"
          iconRight={status === "submitting" ? undefined : <Send />}
          fullWidthOnMobile
        >
          Send Message
        </Button>
      </div>
    </form>
  );
}
