import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * The Nexora button.
 *
 * A 10px corner — firm and modern, never a pill. Primary actions are solid navy;
 * the coral `accent` variant is for the single strongest call to action in a
 * view. Coral carries navy text because white on coral fails contrast (3.1:1).
 * Hover lifts by 1px with a soft shadow; nothing bounces or glows.
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "text"
  | "phone"
  | "accent";

export type ButtonSize = "sm" | "md" | "lg";

const BASE = [
  "relative inline-flex items-center justify-center gap-2",
  "font-sans font-semibold tracking-[-0.01em] text-center",
  "rounded-[10px] border border-transparent",
  "transition-[background-color,border-color,color,transform,box-shadow]",
  "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "select-none whitespace-nowrap",
  // A 44px minimum target on touch devices, per WCAG / Apple HIG.
  "min-h-11",
  "disabled:pointer-events-none disabled:opacity-50",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50",
].join(" ");

const SIZES: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[0.875rem]",
  md: "h-12 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-6 text-base",
};

/** `text` sits inline in copy, so it must not carry button height or padding. */
const TEXT_SIZES: Record<ButtonSize, string> = {
  sm: "text-[0.875rem]",
  md: "text-[0.9375rem]",
  lg: "text-base",
};

const LIFT = "hover:-translate-y-px active:translate-y-0 motion-reduce:hover:translate-y-0";

const VARIANTS: Record<ButtonVariant, string> = {
  /* Solid navy. The default action. */
  primary: cn(
    "bg-ink-900 text-white",
    "hover:bg-ink-800 hover:shadow-raised active:bg-ink-950",
    LIFT
  ),

  /* White with a border. Sits beside primary without competing. */
  secondary: cn(
    "bg-white text-ink-900 border-sand-400",
    "hover:border-ink-900/40 hover:shadow-subtle",
    LIFT
  ),

  /* Coral with navy text. The strongest call to action on a view. */
  accent: cn(
    "bg-clay-500 text-ink-900",
    "hover:bg-clay-400 hover:shadow-raised",
    LIFT
  ),

  /* Quiet. For tertiary and toolbar actions. */
  ghost: cn("bg-transparent text-ink-900", "hover:bg-canvas-200 active:bg-sand-300"),

  /** Inline link with an underline that grows from the left on hover. */
  text: cn("group/text bg-transparent p-0 text-ink-900 min-h-0", "hover:text-clay-700"),

  /** Phone. White and outlined with a coral handset, so "call" never reads as "submit". */
  phone: cn(
    "nx-figures bg-white text-ink-900 border-sand-400 [&_svg]:text-clay-600",
    "hover:border-ink-900/40 hover:shadow-subtle",
    LIFT
  ),
};

/** Variants restyled for placement on the dark navy surface. */
const ON_DARK: Partial<Record<ButtonVariant, string>> = {
  primary: cn("bg-white text-ink-900", "hover:bg-canvas-200 hover:shadow-raised", LIFT),
  secondary: cn(
    "bg-transparent text-white border-white/35",
    "hover:border-white hover:bg-white/[0.06]",
    LIFT
  ),
  ghost: "bg-transparent text-white hover:bg-white/10",
  text: "group/text bg-transparent p-0 text-white min-h-0 hover:text-amber-400",
  phone: cn(
    "nx-figures bg-white/[0.06] text-white border-white/35 [&_svg]:text-clay-400",
    "hover:border-white hover:bg-white/[0.1]",
    LIFT
  ),
  accent: cn("bg-clay-500 text-ink-900 hover:bg-clay-400", LIFT),
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Restyles the button for the dark ink surface. */
  onDark?: boolean;
  /** Shows a spinner and blocks interaction. Announced to screen readers. */
  loading?: boolean;
  /** Text shown to assistive tech while `loading`. */
  loadingLabel?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** Full width below `sm`, intrinsic above — the usual mobile form pattern. */
  fullWidthOnMobile?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

function buildClassName({
  variant = "primary",
  size = "md",
  onDark = false,
  fullWidth = false,
  fullWidthOnMobile = false,
  className,
}: Omit<CommonProps, "children">): string {
  const isText = variant === "text";

  return cn(
    BASE,
    isText ? TEXT_SIZES[size] : SIZES[size],
    (onDark && ON_DARK[variant]) || VARIANTS[variant],
    onDark && "nx-focus-dark",
    fullWidth && "w-full",
    fullWidthOnMobile && "w-full sm:w-auto",
    className
  );
}

/** Shared inner content so the button and link forms stay identical. */
function Content({
  loading,
  loadingLabel,
  iconLeft,
  iconRight,
  variant,
  children,
}: Pick<
  CommonProps,
  "loading" | "loadingLabel" | "iconLeft" | "iconRight" | "variant" | "children"
>) {
  return (
    <>
      {loading ? (
        <>
          <LoaderCircle
            aria-hidden="true"
            className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
          />
          <span>{loadingLabel ?? "Sending…"}</span>
        </>
      ) : (
        <>
          {iconLeft ? (
            <span aria-hidden="true" className="shrink-0 [&>svg]:size-[1.125rem]">
              {iconLeft}
            </span>
          ) : null}

          {variant === "text" ? (
            // The growing underline lives on its own element so it can animate
            // scaleX without affecting the text baseline.
            <span className="relative">
              {children}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current",
                  "transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "group-hover/text:scale-x-100 group-focus-visible/text:scale-x-100"
                )}
              />
            </span>
          ) : (
            children
          )}

          {iconRight ? (
            <span
              aria-hidden="true"
              className={cn(
                "shrink-0 [&>svg]:size-[1.125rem]",
                "transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover/text:translate-x-0.5 motion-reduce:transform-none"
              )}
            >
              {iconRight}
            </span>
          ) : null}
        </>
      )}
    </>
  );
}

/* ---------------------------------------------------------------------------
 * <Button> — renders a real <button>
 * ------------------------------------------------------------------------- */

export interface ButtonProps
  extends CommonProps,
    Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> {}

export function Button({
  variant = "primary",
  size = "md",
  onDark,
  loading = false,
  loadingLabel,
  iconLeft,
  iconRight,
  fullWidth,
  fullWidthOnMobile,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      // Kept focusable while loading so focus is not lost mid-submit.
      disabled={disabled}
      aria-disabled={loading || disabled ? true : undefined}
      aria-busy={loading || undefined}
      className={buildClassName({
        variant,
        size,
        onDark,
        fullWidth,
        fullWidthOnMobile,
        className,
      })}
      {...rest}
    >
      <Content
        loading={loading}
        loadingLabel={loadingLabel}
        iconLeft={iconLeft}
        iconRight={iconRight}
        variant={variant}
      >
        {children}
      </Content>
    </button>
  );
}

/* ---------------------------------------------------------------------------
 * <ButtonLink> — same visual language, but a real anchor
 * ------------------------------------------------------------------------- */

export interface ButtonLinkProps
  extends CommonProps,
    Omit<ComponentPropsWithoutRef<"a">, "children" | "className"> {
  href: string;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  onDark,
  iconLeft,
  iconRight,
  fullWidth,
  fullWidthOnMobile,
  className,
  children,
  href,
  ...rest
}: ButtonLinkProps) {
  const classes = buildClassName({
    variant,
    size,
    onDark,
    fullWidth,
    fullWidthOnMobile,
    className,
  });

  const content = (
    <Content iconLeft={iconLeft} iconRight={iconRight} variant={variant}>
      {children}
    </Content>
  );

  // `tel:` and external URLs must not go through the client-side router.
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
