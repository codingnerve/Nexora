/**
 * Spanish versions of the client-side form checks in `lib/validation.ts`.
 *
 * Same rules, same limits — only the wording differs. The backend remains the
 * authority; these exist so a Spanish-speaking visitor never reads an English
 * error message.
 */

import { digitsOnly } from "@/components/ui/PhoneInput";
import { clean } from "@/lib/validation";

export function requiredTextEs(
  value: string,
  label: string,
  minLength = 2
): string | undefined {
  const trimmed = clean(value);
  if (!trimmed) return `${label}: este campo es obligatorio.`;
  if (trimmed.length < minLength) {
    return `${label} es muy corto: escribe al menos ${minLength} caracteres.`;
  }
  return undefined;
}

export function validateEmailEs(value: string): string | undefined {
  const trimmed = clean(value);
  if (!trimmed) return "Escribe tu correo para que podamos enviarte las opciones.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
    return "Escribe un correo válido, por ejemplo nombre@ejemplo.com";
  }
  return undefined;
}

export function validatePhoneEs(value: string): string | undefined {
  const digits = digitsOnly(value);
  if (!digits) return "Escribe tu teléfono para que un especialista pueda llamarte.";
  if (digits.length < 6) return "Ese número es muy corto. Revísalo e inténtalo de nuevo.";
  if (digits.length > 15) return "Ese número es muy largo. Revísalo e inténtalo de nuevo.";
  return undefined;
}

export function requiredDateEs(value: string, label: string): string | undefined {
  if (!value) return `${label}: este campo es obligatorio.`;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return `${label} no es una fecha válida.`;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (date < today) return `${label} no puede ser una fecha pasada.`;
  return undefined;
}

export function requiredChoiceEs(value: string, label: string): string | undefined {
  return value ? undefined : `Elige ${label}.`;
}
