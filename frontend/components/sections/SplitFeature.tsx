import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import type { EditorialPhoto } from "@/lib/images";
import { cn } from "@/utils/cn";

/**
 * Image beside content — the workhorse editorial layout.
 *
 *   image       the main photograph
 *   inset       an optional second, smaller photograph that overlaps a corner
 *               of the main one on desktop (hidden on phones, where it would
 *               only crowd the column)
 *   imageSide   which side the photograph sits on from `lg` up; on phones the
 *               photograph always comes first, at a sensible 4:3 crop
 *   ratio       the desktop crop of the main photograph
 *
 * Content is passed as children so each page writes its own copy and lists.
 */

const TONES = {
  canvas: "bg-background",
  muted: "bg-surface-muted",
  ink: "bg-ink-900 text-canvas-100",
} as const;

const RATIOS = {
  portrait: "lg:aspect-[4/5]",
  tall: "lg:aspect-[5/6]",
  square: "lg:aspect-square",
  landscape: "lg:aspect-[4/3]",
} as const;

export function SplitFeature({
  id,
  image,
  inset,
  imageSide = "left",
  ratio = "portrait",
  tone = "canvas",
  priority = false,
  children,
  className,
}: {
  id?: string;
  image: EditorialPhoto;
  inset?: EditorialPhoto;
  imageSide?: "left" | "right";
  ratio?: keyof typeof RATIOS;
  tone?: keyof typeof TONES;
  priority?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const imageRight = imageSide === "right";

  return (
    <section id={id} className={cn(TONES[tone], "py-16 md:py-24 lg:py-28", className)}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          <Reveal
            className={cn(
              "relative lg:col-span-6",
              imageRight && "lg:order-2 lg:col-start-7",
              inset && (imageRight ? "lg:pl-10" : "lg:pr-10"),
              inset && "lg:pb-12"
            )}
          >
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-[20px] bg-sand-200",
                RATIOS[ratio]
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading={priority ? "eager" : undefined}
                fetchPriority={priority ? "high" : undefined}
                sizes="(min-width: 1280px) 640px, (min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>

            {inset ? (
              <div
                className={cn(
                  "absolute bottom-0 hidden aspect-[4/5] w-[42%] overflow-hidden rounded-[16px] border-[6px] shadow-panel lg:block",
                  tone === "ink" ? "border-ink-900" : tone === "muted" ? "border-sand-200" : "border-canvas-100",
                  imageRight ? "left-0" : "right-0"
                )}
              >
                <Image
                  src={inset.src}
                  alt={inset.alt}
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </Reveal>

          <Reveal
            delay={0.06}
            className={cn("lg:col-span-6", imageRight ? "lg:order-1" : "lg:col-start-7")}
          >
            {children}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
