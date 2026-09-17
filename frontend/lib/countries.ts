/**
 * Country dialling codes for the customer phone field.
 *
 * Reference data, not business information — these are published ITU-T E.164
 * country calling codes. The list covers common origin and destination markets
 * rather than every territory, so the picker stays usable on a phone.
 *
 * `NEXT_PUBLIC_DEFAULT_DIAL_CODE` selects which entry (if any) is preselected.
 * It is intentionally unset by default: assuming a customer's country would be
 * guessing, and a wrong default is worse than no default.
 */

export interface DialCode {
  /** ISO 3166-1 alpha-2 — used as the option key, since codes are not unique. */
  readonly iso: string;
  readonly name: string;
  readonly dial: string;
}

export const DIAL_CODES: readonly DialCode[] = [
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "BH", name: "Bahrain", dial: "+973" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "CH", name: "Switzerland", dial: "+41" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "EG", name: "Egypt", dial: "+20" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "HK", name: "Hong Kong", dial: "+852" },
  { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "KW", name: "Kuwait", dial: "+965" },
  { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "MV", name: "Maldives", dial: "+960" },
  { iso: "MY", name: "Malaysia", dial: "+60" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "NP", name: "Nepal", dial: "+977" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "OM", name: "Oman", dial: "+968" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "TR", name: "Türkiye", dial: "+90" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "VN", name: "Vietnam", dial: "+84" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
] as const;

/**
 * Preselected dial code, or `""` when unconfigured.
 * Matched against the ISO code so `+1` resolves unambiguously.
 */
export const DEFAULT_DIAL_ISO: string = (() => {
  const configured = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY?.trim().toUpperCase();
  if (!configured) return "";
  return DIAL_CODES.some((c) => c.iso === configured) ? configured : "";
})();

export function findDialCode(iso: string): DialCode | undefined {
  return DIAL_CODES.find((country) => country.iso === iso);
}
