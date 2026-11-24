"use client";

import { ArrowLeft, ArrowRight, CircleAlert, CircleCheck, Send } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { CONTACT, DISCLOSURE, IS_TOLL_FREE_CONFIGURED, toTelHref } from "@/lib/constants";
import { cn } from "@/utils/cn";

/**
 * Chrome shared by all three inquiry forms: the two-step progress line, the
 * step navigation, and the error and success screens.
 *
 * Keeping this in one place means the flight, hotel and cab forms only have to
 * describe their own fields.
 */

/* ---------------------------------------------------------------------------
 * Step indicator
 * ------------------------------------------------------------------------- */

/** Fixed text in the form chrome. Defaults to English; pass another set to translate. */
export interface FormLabels {
  step: (step: number) => string;
  tripDetails: string;
  yourDetails: string;
  continue: string;
  back: string;
  sending: string;
  disclosure: string;
  callPrefix: string;
  received: string;
  redirecting: string;
}

export const EN_FORM_LABELS: FormLabels = {
  step: (step) => `Step ${step} of 2`,
  tripDetails: "Trip details",
  yourDetails: "Your details",
  continue: "Continue",
  back: "Back",
  sending: "Sending your request…",
  disclosure: DISCLOSURE.short,
  callPrefix: "You can also call us on",
  received: "received.",
  redirecting: "Taking you to your confirmation…",
};

function StepLine({ step, labels }: { step: 1 | 2; labels: FormLabels }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-stone-600">
        {labels.step(step)}
        <span className="ml-2 font-medium normal-case tracking-normal text-stone-500">
          {step === 1 ? labels.tripDetails : labels.yourDetails}
        </span>
      </p>

      <span aria-hidden="true" className="flex flex-1 items-center gap-1.5">
        <span className="h-[3px] flex-1 rounded-full bg-clay-500" />
        <span
          className={cn(
            "h-[3px] flex-1 rounded-full transition-colors duration-[240ms]",
            step === 2 ? "bg-clay-500" : "bg-sand-300"
          )}
        />
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Success
 * ------------------------------------------------------------------------- */

/**
 * Brief hand-off state shown between a successful submit and the router
 * reaching /thank-you, so the form does not flash back into view. The real
 * confirmation, with the reference, lives on the thank-you page.
 */
export function SuccessPanel({
  serviceLabel,
  labels = EN_FORM_LABELS,
}: {
  serviceLabel: string;
  labels?: FormLabels;
}) {
  return (
    <div className="flex items-start gap-3 py-6" role="status" aria-live="polite">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[12px] border border-clay-600/25 bg-clay-600/[0.07] text-clay-700"
      >
        <CircleCheck className="size-[1.125rem]" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-body-md font-semibold text-ink-900">
          {serviceLabel} {labels.received}
        </p>
        <p className="mt-1 text-body-sm text-foreground-muted">
          {labels.redirecting}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Error banner
 * ------------------------------------------------------------------------- */

export function ErrorBanner({
  message,
  phone,
  labels = EN_FORM_LABELS,
}: {
  message: string;
  phone?: string;
  labels?: FormLabels;
}) {
  const dial = phone ?? CONTACT.tollFree;
  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-2.5 rounded-[10px] border border-danger-600/35 bg-danger-50 p-4"
    >
      <CircleAlert
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-danger-600"
      />
      <div className="text-body-sm text-ink-900">
        <p>{message}</p>
        {IS_TOLL_FREE_CONFIGURED ? (
          <p className="mt-1 text-caption text-stone-600">
            {labels.callPrefix}{" "}
            <a
              href={toTelHref(dial)}
              className="nx-figures font-semibold text-clay-700 underline underline-offset-4"
            >
              {dial}
            </a>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Shell
 * ------------------------------------------------------------------------- */

export function FormShell({
  step,
  status,
  message,
  submitLabel,
  isSubmitting,
  onContinue,
  onBack,
  onSubmit,
  children,
  phone,
  labels = EN_FORM_LABELS,
}: {
  /** Number offered in the error banner. Defaults to the site-wide line. */
  phone?: string;
  labels?: FormLabels;
  step: 1 | 2;
  status: string;
  message: string;
  submitLabel: string;
  isSubmitting: boolean;
  onContinue: () => void;
  onBack: () => void;
  onSubmit: () => void;
  children: ReactNode;
}) {
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (step === 1) onContinue();
        else onSubmit();
      }}
    >
      <StepLine step={step} labels={labels} />

      {status === "error" && message ? (
        <div className="mt-6">
          <ErrorBanner message={message} phone={phone} labels={labels} />
        </div>
      ) : null}

      <div className="mt-6">{children}</div>

      <div className="mt-7 flex flex-col gap-4 border-t border-sand-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="order-2 max-w-sm text-caption text-stone-500 sm:order-1">
          {labels.disclosure}
        </p>

        <div className="order-1 flex flex-col-reverse gap-3 sm:order-2 sm:flex-row sm:items-center">
          {step === 2 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              iconLeft={<ArrowLeft />}
              disabled={isSubmitting}
            >
              {labels.back}
            </Button>
          ) : null}

          {step === 1 ? (
            <Button type="submit" variant="primary" iconRight={<ArrowRight />} fullWidthOnMobile>
              {labels.continue}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="accent"
              loading={isSubmitting}
              loadingLabel={labels.sending}
              iconRight={isSubmitting ? undefined : <Send />}
              fullWidthOnMobile
            >
              {submitLabel}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

/** Two-column field grid used inside every step. */
export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">{children}</div>;
}

/** Spans the full grid width, for textareas and wide inputs. */
export function FieldFull({ children }: { children: ReactNode }) {
  return <div className="sm:col-span-2">{children}</div>;
}
