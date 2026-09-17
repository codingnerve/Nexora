import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scales. The custom `text-display-*`,
 * `text-body-*`, `text-caption` and `text-eyebrow` steps from `globals.css` are
 * registered here so that a later class correctly overrides an earlier one in
 * the same group. Unregistered, they are mistaken for text colours and a size
 * paired with a colour (e.g. `text-body-md text-white/80`) loses one of the two.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-sm",
            "display-md",
            "display-lg",
            "display-xl",
            "display-2xl",
            "body-lg",
            "body-md",
            "body-sm",
            "caption",
            "eyebrow",
          ],
        },
      ],
      "font-family": ["font-display", "font-sans"],
      shadow: [{ shadow: ["subtle", "raised", "panel"] }],
    },
  },
});

/** Conditionally join class names, with Tailwind conflicts resolved. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
