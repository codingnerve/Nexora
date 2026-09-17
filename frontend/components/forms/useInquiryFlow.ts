"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { ApiError } from "@/lib/api";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import { submitInquiry, type InquiryService } from "@/lib/inquiryClient";
import {
  compact,
  focusFirstInvalid,
  isClean,
  mapApiFieldErrors,
  type FieldErrors,
} from "@/lib/validation";

/** Fields that live on step 2 of every service form. */
const CONTACT_FIELDS = new Set(["name", "email", "phone", "message"]);
import type { InquiryCreated } from "@/types/inquiry";

export type FlowStatus = "idle" | "submitting" | "error" | "success";

/** Shared contact fields, identical across all three services. */
export interface ContactValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Hidden honeypot — must stay empty. Real users never see this field. */
  companyWebsite: string;
}

export const EMPTY_CONTACT: ContactValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  companyWebsite: "",
};

interface FlowOptions<V extends ContactValues> {
  service: InquiryService;
  initialValues: V;
  /** Validates step 1 (trip details). */
  validateTrip: (values: V) => FieldErrors;
  /** Validates step 2 (contact details). */
  validateContact: (values: V) => FieldErrors;
  /** Maps form values to the API payload shape. */
  buildPayload: (values: V) => unknown;
  /**
   * Brings the panel back into view after a step change or an error.
   *
   * The caller owns the ref rather than this hook returning one: a ref read off
   * a hook's return value counts as accessing a ref during render, which React
   * (and the `react-hooks/refs` lint rule) correctly rejects.
   */
  scrollToPanel?: () => void;
}

/**
 * Drives the two-step inquiry forms: values, per-field errors, step movement
 * and submission.
 *
 * Validation runs on step advance and on submit rather than on every keystroke,
 * which is the pattern that annoys people least. Once a field has an error it
 * clears as soon as the visitor edits it, so the message never lingers after
 * it has been addressed.
 */
export function useInquiryFlow<V extends ContactValues>({
  service,
  initialValues,
  validateTrip,
  validateContact,
  buildPayload,
  scrollToPanel,
}: FlowOptions<V>) {
  const [values, setValues] = useState<V>(initialValues);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FlowStatus>("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<InquiryCreated | null>(null);
  const router = useRouter();

  /**
   * Hard guard against double submission. The loading button blocks mouse
   * clicks with CSS, but pressing Enter in a field submits the form directly —
   * a ref catches that synchronously, before React has re-rendered.
   */
  const inFlight = useRef(false);

  const focusPanel = useCallback(() => {
    scrollToPanel?.();
  }, [scrollToPanel]);

  const setField = useCallback(
    <K extends keyof V>(key: K, value: V[K]) => {
      setValues((previous) => ({ ...previous, [key]: value }));
      // Clear this field's error the moment the visitor starts fixing it.
      setErrors((previous) =>
        previous[key as string] ? { ...previous, [key as string]: undefined } : previous
      );
    },
    []
  );

  const goToContact = useCallback(() => {
    const found = compact(validateTrip(values));
    setErrors(found);
    if (!isClean(found)) {
      focusPanel();
      focusFirstInvalid();
      return;
    }
    setStep(2);
    focusPanel();
  }, [values, validateTrip, focusPanel]);

  const goBack = useCallback(() => {
    setStep(1);
    setErrors({});
    focusPanel();
  }, [focusPanel]);

  const submit = useCallback(async () => {
    if (inFlight.current) return;

    const found = compact(validateContact(values));
    setErrors(found);
    if (!isClean(found)) {
      focusPanel();
      focusFirstInvalid();
      return;
    }

    // Silently succeed for bots so they get no signal about the honeypot.
    // The backend rejects it too; this just avoids the round trip.
    if (values.companyWebsite.trim() !== "") {
      setStatus("success");
      setResult(null);
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    setMessage("");

    try {
      const created = await submitInquiry(
        service as "flights",
        buildPayload(values) as never
      );
      setResult(created);
      setStatus("success");

      // The reference is the only thing that travels in the URL — never the
      // customer name, email, phone or travel details.
      router.push(
        `/thank-you?inquiry=${encodeURIComponent(created.inquiryId)}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.message);
        // Surface any per-field problems the backend reported, on the step
        // where those fields actually live.
        if (error.isValidationError) {
          const fieldErrors = mapApiFieldErrors(error.fieldErrors);
          setErrors(fieldErrors);
          const onlyContactFields = Object.keys(fieldErrors).every((key) =>
            CONTACT_FIELDS.has(key)
          );
          setStep(onlyContactFields ? 2 : 1);
          focusFirstInvalid();
        }
      } else {
        setMessage(GENERIC_ERROR_MESSAGE);
      }
      setStatus("error");
      focusPanel();
    } finally {
      inFlight.current = false;
    }
  }, [values, validateContact, buildPayload, service, focusPanel, router]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setStep(1);
    setStatus("idle");
    setMessage("");
    setResult(null);
  }, [initialValues]);

  return {
    values,
    setField,
    errors,
    step,
    status,
    message,
    result,
    goToContact,
    goBack,
    submit,
    reset,
    isSubmitting: status === "submitting",
  };
}
