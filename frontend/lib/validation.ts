/**
 * Client-side validation for the inquiry forms.
 *
 * This is a UX layer, not a security boundary — the backend's Zod schemas are
 * the authority and will reject anything invalid regardless of what happens
 * here. The goal is to catch mistakes before a visitor waits on a round trip.
 *
 * Messages state the cause and the fix, never just "invalid".
 */

import { digitsOnly } from "@/components/ui/PhoneInput";

export type FieldErrors<T extends string = string> = Partial<Record<T, string>>;

/** Trims and collapses internal whitespace. */
export const clean = (value: string): string => value.trim().replace(/\s+/g, " ");

export function requiredText(
  value: string,
  label: string,
  minLength = 2
): string | undefined {
  const trimmed = clean(value);
  if (!trimmed) return `${label} is required.`;
  if (trimmed.length < minLength) {
    return `${label} looks too short — please enter at least ${minLength} characters.`;
  }
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = clean(value);
  if (!trimmed) return "Email is required so we can send your options.";
  // Intentionally permissive: the backend does the authoritative check, and an
  // over-strict pattern here would reject valid addresses.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
    return "Enter a valid email address, for example name@example.com";
  }
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  const digits = digitsOnly(value);
  if (!digits) return "Phone number is required so a specialist can reach you.";
  if (digits.length < 6) return "That number looks too short. Check and try again.";
  if (digits.length > 15) return "That number looks too long. Check and try again.";
  return undefined;
}

/** Today at local midnight, for "not in the past" comparisons. */
function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * A required, real, not-in-the-past date. The date picker's `min` attribute
 * is only a hint — typed or pasted values bypass it, so check here too.
 */
export function requiredDate(value: string, label: string): string | undefined {
  if (!value) return `${label} is required.`;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return `${label} is not a valid date.`;
  if (date < startOfToday()) return `${label} can't be in the past.`;
  return undefined;
}

/** Maximum lengths, mirrored from the backend validators. */
export const MAX_LENGTH = {
  name: 120,
  email: 200,
  phone: 40,
  place: 120,
  address: 200,
  area: 160,
  subject: 160,
  message: 2000,
} as const;

/**
 * Maps API field paths onto form field names. The API reports customer
 * fields as `customer.email`; the forms call them `email`.
 */
export function mapApiFieldErrors(
  details: Record<string, string>
): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [path, message] of Object.entries(details)) {
    mapped[path.replace(/^customer\./, "")] = message;
  }
  return mapped;
}

/**
 * After a failed validation, move keyboard focus to the first invalid field
 * in the form the user was working in.
 *
 * The `aria-invalid` attributes only exist once React has committed the error
 * state, so this waits a tick and retries briefly until one appears.
 *
 * Timers, not `requestAnimationFrame`: animation frames are paused or throttled
 * whenever the browser is not painting (background tabs, some automated and
 * occluded windows), and QA found the focus silently never moving in exactly
 * that case.
 */
export function focusFirstInvalid(): void {
  if (typeof window === "undefined") return;
  const form = (document.activeElement as HTMLElement | null)?.closest("form");
  let attempts = 0;

  const tryFocus = () => {
    const target = (form ?? document).querySelector<HTMLElement>(
      '[aria-invalid="true"]'
    );
    if (target) {
      target.focus();
      return;
    }
    attempts += 1;
    if (attempts < 10) window.setTimeout(tryFocus, 16);
  };

  window.setTimeout(tryFocus, 0);
}

/** Ensures `end` is not before `start`, e.g. return date or check-out. */
export function dateOrder(
  start: string,
  end: string,
  message: string
): string | undefined {
  if (!start || !end) return undefined;
  if (new Date(`${end}T00:00:00`) < new Date(`${start}T00:00:00`)) return message;
  return undefined;
}

export function requiredChoice(value: string, label: string): string | undefined {
  return value ? undefined : `Choose ${label}.`;
}

/** True when every value in the map is undefined. */
export function isClean(errors: FieldErrors): boolean {
  return Object.values(errors).every((message) => !message);
}

/** Drops undefined entries so `aria-invalid` is only set on real failures. */
export function compact<T extends string>(errors: FieldErrors<T>): FieldErrors<T> {
  const result: FieldErrors<T> = {};
  for (const [key, message] of Object.entries(errors)) {
    if (message) result[key as T] = message as string;
  }
  return result;
}
