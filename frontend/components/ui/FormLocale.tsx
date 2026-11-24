"use client";

import { createContext, useContext } from "react";

/**
 * The few words every form field renders on its own ("Optional", and the
 * screen-reader "(required)"). English by default; a translated form wraps its
 * fields in `<FormLocaleProvider value={...}>` to change them.
 */
export interface FormLocaleStrings {
  optional: string;
  required: string;
}

const EN: FormLocaleStrings = { optional: "Optional", required: "(required)" };

const FormLocaleContext = createContext<FormLocaleStrings>(EN);

export const FormLocaleProvider = FormLocaleContext.Provider;

export function useFormLocale(): FormLocaleStrings {
  return useContext(FormLocaleContext);
}
