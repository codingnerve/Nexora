import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/** Small uppercase label above a heading: coral on light, golden sand on dark. */
export function Eyebrow({
  children,
  onDark = false,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag
      className={cn(
        "text-[0.8125rem] font-bold uppercase tracking-[0.12em]",
        onDark ? "text-amber-400" : "text-clay-700",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Section heading block: eyebrow, title, and optional lede.
 *
 * Headings are Manrope at a heavy weight with tight tracking — clear and
 * confident rather than decorative.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  onDark = false,
  level = 2,
  size = "lg",
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  /** Heading level, so pages keep a correct h1→h6 outline. */
  level?: 1 | 2 | 3;
  size?: "md" | "lg" | "xl";
  className?: string;
  /** Actions or links rendered under the lede. */
  children?: ReactNode;
}) {
  const Heading = `h${level}` as const;

  const titleSize =
    size === "xl"
      ? "text-display-lg md:text-display-xl"
      : size === "lg"
        ? "text-display-md md:text-display-lg"
        : "text-display-sm md:text-display-md";

  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      {eyebrow ? (
        <Eyebrow
          onDark={onDark}
          className={cn("mb-3", align === "center" && "text-center")}
        >
          {eyebrow}
        </Eyebrow>
      ) : null}

      <Heading
        className={cn(
          "font-display",
          titleSize,
          onDark ? "text-canvas-100" : "text-ink-900"
        )}
      >
        {title}
      </Heading>

      {lede ? (
        <p
          className={cn(
            "mt-4 max-w-xl text-body-lg",
            align === "center" && "mx-auto",
            onDark ? "text-white/75" : "text-foreground-muted"
          )}
        >
          {lede}
        </p>
      ) : null}

      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
