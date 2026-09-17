import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/utils/cn";

/**
 * Photographic card grid.
 *
 * Shared by the homepage (trip styles), hotels (stay types), cabs (ride types)
 * and flights (journey moments), so each page gets a visual, scannable section
 * without four near-identical implementations.
 *
 *   bento — the first card spans two rows on desktop, the rest fill beside it.
 *   grid  — equal cards, three or four across.
 *
 * Copy sits over a bottom scrim; on hover the photo eases in and the arrow
 * appears. Motion is CSS only and collapses under `prefers-reduced-motion`.
 */

export interface PhotoCard {
  readonly title: string;
  readonly body: string;
  readonly image: string;
  readonly imageAlt: string;
  /** Small label above the title, e.g. "Couples". */
  readonly tag?: string;
  readonly href?: string;
}

export function PhotoCardGrid({
  id,
  eyebrow,
  title,
  lede,
  items,
  layout = "grid",
  columns = 3,
  tone = "canvas",
  action,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  items: readonly PhotoCard[];
  layout?: "bento" | "grid";
  columns?: 3 | 4;
  tone?: "canvas" | "muted" | "sand";
  /** Optional link or button beside the heading. */
  action?: ReactNode;
}) {
  const isBento = layout === "bento";

  return (
    <Section id={id} tone={tone} space="lg">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={eyebrow} title={title} lede={lede} size="lg" />
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </Reveal>

      <Reveal className="mt-10 lg:mt-14">
        <ul
          className={cn(
            "grid gap-4 sm:grid-cols-2 lg:gap-5",
            isBento
              ? "lg:auto-rows-[17rem] lg:grid-cols-3"
              : columns === 4
                ? "lg:grid-cols-4"
                : "lg:grid-cols-3"
          )}
        >
          {items.map((item, index) => {
            const isLead = isBento && index === 0;
            return (
              <li
                key={item.title}
                className={cn(
                  isLead && "sm:col-span-2 lg:col-span-1 lg:row-span-2",
                  // With an even count the last card is left alone on its row,
                  // so it widens to keep the grid flush.
                  isBento && index === items.length - 1 && items.length % 2 === 0 && "sm:col-span-2"
                )}
              >
                <Card
                  item={item}
                  lead={isLead}
                  className={cn(
                    isBento ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[4/3] lg:aspect-[5/4]"
                  )}
                  sizes={
                    isLead
                      ? "(min-width: 1024px) 33vw, 100vw"
                      : columns === 4 && !isBento
                        ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  }
                />
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}

function Card({
  item,
  lead,
  className,
  sizes,
}: {
  item: PhotoCard;
  lead: boolean;
  className?: string;
  sizes: string;
}) {
  const body = (
    <>
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        sizes={sizes}
        className={cn(
          "-z-10 object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:scale-[1.05] motion-reduce:transform-none motion-reduce:transition-none"
        )}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-ink-950/0"
      />

      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
        <span className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 motion-reduce:transform-none">
          {item.tag ? (
            <span className="mb-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-amber-400 backdrop-blur-sm">
              {item.tag}
            </span>
          ) : null}
          <span
            className={cn(
              "block font-extrabold leading-tight tracking-[-0.025em] text-white",
              lead ? "text-[1.625rem] sm:text-[2rem]" : "text-[1.25rem] sm:text-[1.375rem]"
            )}
          >
            {item.title}
          </span>
          <span
            className={cn(
              "mt-1.5 block max-w-md text-[0.9375rem] leading-relaxed text-white/80",
              !lead && "line-clamp-3"
            )}
          >
            {item.body}
          </span>
        </span>

        {item.href ? (
          <span
            aria-hidden="true"
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white text-ink-900",
              "translate-y-1 opacity-0 transition-[opacity,transform] duration-300",
              "group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
              "motion-reduce:transform-none"
            )}
          >
            <ArrowUpRight className="size-5" strokeWidth={2} />
          </span>
        ) : null}
      </span>
    </>
  );

  const shell = cn(
    "group relative isolate block h-full overflow-hidden rounded-[20px] bg-ink-900",
    className
  );

  return item.href ? (
    <Link href={item.href} className={shell}>
      {body}
    </Link>
  ) : (
    <div className={shell}>{body}</div>
  );
}
