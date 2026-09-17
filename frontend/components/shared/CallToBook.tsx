import { Phone } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { CONTACT, IS_TOLL_FREE_CONFIGURED, toTelHref } from "@/lib/constants";
import { cn } from "@/utils/cn";

/**
 * The toll-free call-to-action, used in the header, hero, forms, closing CTA,
 * mobile call bar and footer.
 *
 * The number comes from `NEXT_PUBLIC_TOLL_FREE_NUMBER` via `lib/constants` and
 * is never written into a component. When it is not configured, every variant
 * degrades to a link to the contact page rather than rendering a placeholder
 * number that a visitor might actually try to dial.
 */

type CallVariant = "inline" | "panel" | "compact" | "stacked";

export function CallToBook({
  variant = "inline",
  onDark = false,
  className,
}: {
  variant?: CallVariant;
  onDark?: boolean;
  className?: string;
}) {
  const href = IS_TOLL_FREE_CONFIGURED ? toTelHref(CONTACT.tollFree) : "/contact";

  /* --- Header / toolbar: one compact control --------------------------- */
  if (variant === "inline") {
    if (!IS_TOLL_FREE_CONFIGURED) {
      return (
        <ButtonLink
          href="/contact"
          variant="secondary"
          size="sm"
          onDark={onDark}
          className={className}
          iconLeft={<Phone strokeWidth={1.75} />}
        >
          Contact us
        </ButtonLink>
      );
    }

    return (
      <a
        href={href}
        className={cn(
          "group inline-flex items-center gap-3 rounded-[10px] px-3 py-2",
          "transition-colors duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          onDark ? "hover:bg-canvas-100/10 nx-focus-dark" : "hover:bg-sand-200/70",
          className
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-[10px] border",
            "transition-colors duration-[180ms]",
            onDark
              ? "border-clay-400/30 bg-clay-500/15 text-clay-400 group-hover:border-clay-400/60"
              : "border-clay-600/25 bg-clay-600/[0.07] text-clay-700 group-hover:border-clay-600/50"
          )}
        >
          <Phone className="size-4" strokeWidth={1.75} />
        </span>

        <span className="flex flex-col text-left leading-tight">
          <span
            className={cn(
              "text-[0.6875rem] font-semibold uppercase tracking-[0.14em]",
              onDark ? "text-sand-300" : "text-stone-600"
            )}
          >
            Call toll-free
          </span>
          <span
            className={cn(
              "nx-figures text-body-sm font-semibold",
              onDark ? "text-canvas-100" : "text-ink-900"
            )}
          >
            {CONTACT.tollFree}
          </span>
        </span>
      </a>
    );
  }

  /* --- Compact: a single line, for tight spaces ------------------------ */
  if (variant === "compact") {
    return (
      <a
        href={href}
        className={cn(
          "nx-figures group inline-flex items-center gap-2 text-body-sm font-semibold",
          "transition-colors duration-[180ms]",
          onDark
            ? "text-canvas-100 hover:text-clay-400 nx-focus-dark"
            : "text-ink-900 hover:text-clay-700",
          className
        )}
      >
        <Phone aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
        {IS_TOLL_FREE_CONFIGURED ? CONTACT.tollFree : "Contact us"}
      </a>
    );
  }

  /* --- Stacked: label above a large number, for the closing CTA -------- */
  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <p
          className={cn(
            "text-eyebrow uppercase",
            onDark ? "text-sand-300" : "text-stone-600"
          )}
        >
          Call us toll-free
        </p>

        {IS_TOLL_FREE_CONFIGURED ? (
          <a
            href={href}
            className={cn(
              "nx-figures font-display text-display-sm md:text-display-md",
              "transition-colors duration-[180ms]",
              onDark
                ? "text-canvas-100 hover:text-clay-400 nx-focus-dark"
                : "text-ink-900 hover:text-clay-700"
            )}
          >
            {CONTACT.tollFree}
          </a>
        ) : (
          <p
            className={cn(
              "text-body-md",
              onDark ? "text-sand-300" : "text-foreground-muted"
            )}
          >
            Our toll-free number will appear here once configured.{" "}
            <a
              href="/contact"
              className={cn(
                "font-semibold underline underline-offset-4",
                onDark ? "text-canvas-100" : "text-ink-900"
              )}
            >
              Contact us
            </a>{" "}
            in the meantime.
          </p>
        )}

        {CONTACT.hours ? (
          <p
            className={cn(
              "text-caption",
              onDark ? "text-stone-400" : "text-stone-500"
            )}
          >
            {CONTACT.hours}
          </p>
        ) : null}
      </div>
    );
  }

  /* --- Panel: the reassurance block beside forms ----------------------- */
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[12px] border p-5 sm:flex-row sm:items-center sm:justify-between",
        onDark
          ? "border-line-inverse bg-canvas-100/[0.04]"
          : "border-sand-300 bg-canvas-200/60",
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[10px] border",
            onDark
              ? "border-clay-400/30 bg-clay-500/15 text-clay-400"
              : "border-clay-600/25 bg-clay-600/[0.07] text-clay-700"
          )}
        >
          <Phone className="size-[1.125rem]" strokeWidth={1.75} />
        </span>

        <div>
          <p
            className={cn(
              "text-body-md font-semibold",
              onDark ? "text-canvas-100" : "text-ink-900"
            )}
          >
            Prefer to speak with someone?
          </p>
          <p
            className={cn(
              "mt-0.5 text-body-sm",
              onDark ? "text-sand-300" : "text-foreground-muted"
            )}
          >
            {IS_TOLL_FREE_CONFIGURED
              ? "Call us toll-free and a travel specialist will help."
              : "Send us a message and a travel specialist will help."}
          </p>
          {CONTACT.hours ? (
            <p
              className={cn(
                "mt-1 text-caption",
                onDark ? "text-stone-400" : "text-stone-500"
              )}
            >
              {CONTACT.hours}
            </p>
          ) : null}
        </div>
      </div>

      <ButtonLink
        href={href}
        variant="phone"
        size="md"
        onDark={onDark}
        className="shrink-0"
        fullWidthOnMobile
        iconLeft={<Phone strokeWidth={1.75} />}
      >
        {IS_TOLL_FREE_CONFIGURED ? CONTACT.tollFree : "Contact us"}
      </ButtonLink>
    </div>
  );
}
