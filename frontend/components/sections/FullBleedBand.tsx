import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import type { EditorialPhoto } from "@/lib/images";
import { cn } from "@/utils/cn";

/**
 * Edge-to-edge photography with the copy set over it.
 *
 * On desktop the photograph fills the band and a left-to-right scrim keeps the
 * copy readable. On phones the photograph is shown on its own at a 4:3 crop and
 * the copy sits beneath it on navy — text over a narrow, busy crop is hard to
 * read, and a full-height phone photo would dominate the page.
 */
export function FullBleedBand({
  id,
  image,
  eyebrow,
  title,
  lede,
  align = "left",
  children,
  objectPosition = "object-center",
}: {
  id?: string;
  image: EditorialPhoto;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "right";
  children?: ReactNode;
  /** Tailwind object-position class, for photographs with an off-centre subject. */
  objectPosition?: string;
}) {
  const right = align === "right";

  return (
    <section id={id} className="relative isolate overflow-hidden bg-ink-900">
      <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          quality={85}
          sizes="100vw"
          className={cn("object-cover", objectPosition)}
        />
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 hidden lg:block",
            right
              ? "bg-gradient-to-l from-ink-950/90 via-ink-950/55 to-ink-950/0"
              : "bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/0"
          )}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-900 to-ink-900/0 lg:hidden"
        />
      </div>

      <Container className="relative">
        <div
          className={cn(
            "flex py-12 sm:py-14 lg:min-h-[38rem] lg:items-center lg:py-24",
            right && "lg:justify-end"
          )}
        >
          <Reveal className="max-w-xl">
            {eyebrow ? <Eyebrow onDark>{eyebrow}</Eyebrow> : null}
            <h2 className="mt-4 font-display text-display-md text-white md:text-display-lg">
              {title}
            </h2>
            {lede ? <p className="mt-5 text-body-lg text-white/80">{lede}</p> : null}
            {children}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
