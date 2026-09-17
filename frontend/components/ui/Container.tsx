import type { ElementType, ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * The layout shell.
 *
 * Content tops out at 84rem (1344px) with generous gutters, so the site never
 * feels stretched across a 1920px display. Editorial sections that should break
 * this rule use `<Bleed>` rather than opting out ad hoc.
 */

type ContainerWidth = "content" | "shell" | "wide";

const WIDTHS: Record<ContainerWidth, string> = {
  /** ~48rem — long-form reading measure, 65-75 characters. */
  content: "max-w-[48rem]",
  /** ~92-96rem — generous, luxury full-width shell. */
  shell: "max-w-[92rem] 2xl:max-w-[96rem]",
  /** Ultra-wide editorial grids and panoramic sections. */
  wide: "max-w-[98rem] 2xl:max-w-[102rem]",
};

export function Container({
  as: Tag = "div",
  width = "shell",
  className,
  children,
}: {
  as?: ElementType;
  width?: ContainerWidth;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-8 lg:px-12 2xl:px-16",
        WIDTHS[width],
        className
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Breaks a section out to the full viewport width — for full-bleed photography
 * and dark editorial bands. Deliberately a separate component so escaping the
 * container is always an explicit decision.
 */
export function Bleed({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("nx-bleed", className)}>{children}</div>;
}
