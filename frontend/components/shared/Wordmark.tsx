import Image from "next/image";
import Link from "next/link";

import { SITE } from "@/lib/constants";
import { cn } from "@/utils/cn";

/**
 * The Nexora Destination brand logo.
 *
 * Renders the official company logo (/images/weblogo.png) with responsive sizing,
 * crisp rendering, and accessible markup.
 */
export function Wordmark({
  onDark = false,
  href = "/",
  size = "md",
  className,
}: {
  onDark?: boolean;
  /** Set to `null` to render as plain text, e.g. inside the footer. */
  href?: string | null;
  size?: "md" | "lg";
  className?: string;
}) {
  const content = onDark ? (
    <span
      className={cn(
        "inline-flex items-center rounded-xl bg-white px-3 py-1.5 shadow-sm transition-transform duration-200 hover:scale-[1.02]",
        className
      )}
    >
      <Image
        src="/images/weblogo.png"
        alt={SITE.name}
        width={size === "lg" ? 190 : 160}
        height={size === "lg" ? 64 : 54}
        className={cn(
          "h-auto object-contain",
          size === "lg" ? "w-[155px] sm:w-[175px]" : "w-[135px] sm:w-[150px]"
        )}
        priority
      />
    </span>
  ) : (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/images/weblogo.png"
        alt={SITE.name}
        width={size === "lg" ? 190 : 165}
        height={size === "lg" ? 64 : 55}
        className={cn(
          "h-9 sm:h-11 w-auto max-w-[170px] sm:max-w-[210px] object-contain",
          className
        )}
        priority
      />
    </span>
  );

  if (href === null) {
    return content;
  }

  return (
    <Link
      href={href}
      aria-label={`${SITE.name} — home`}
      className={cn(
        "inline-flex items-center rounded-[8px] py-1 transition-opacity duration-200 hover:opacity-90",
        onDark && "nx-focus-dark"
      )}
    >
      {content}
    </Link>
  );
}

