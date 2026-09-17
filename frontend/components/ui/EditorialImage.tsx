import Image from "next/image";

import { cn } from "@/utils/cn";

/**
 * Image treatment.
 *
 * Photography uses a 20px corner by default, 12px for small images. The ratio
 * is still chosen per placement rather than applied globally.
 */

export type ImageRatio =
  | "portrait"
  | "tall"
  | "square"
  | "landscape"
  | "wide"
  | "panorama";

const RATIOS: Record<ImageRatio, string> = {
  tall: "aspect-[3/4.4]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[3/2]",
  wide: "aspect-[16/10]",
  panorama: "aspect-[21/9]",
};

export type ImageCorner = "plate" | "soft" | "none";

const CORNERS: Record<ImageCorner, string> = {
  /** The photography default: a generous, friendly corner. */
  plate: "rounded-[20px]",
  /** Smaller images and thumbnails. */
  soft: "rounded-[12px]",
  none: "rounded-none",
};

export function EditorialImage({
  src,
  alt,
  ratio = "landscape",
  corner = "plate",
  sizes = "(min-width: 1024px) 45vw, 100vw",
  priority = false,
  zoomOnHover = false,
  /** Darkens the lower half so text can sit over the image accessibly. */
  scrim = false,
  quality,
  className,
  imageClassName,
  children,
}: {
  src: string;
  /** Required. Describe the scene — never "image" or the file name. */
  alt: string;
  ratio?: ImageRatio;
  corner?: ImageCorner;
  sizes?: string;
  priority?: boolean;
  zoomOnHover?: boolean;
  scrim?: boolean;
  quality?: number;
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-sand-200",
        RATIOS[ratio],
        CORNERS[corner],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        quality={quality}
        className={cn(
          "object-cover",
          zoomOnHover && [
            "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-hover:scale-[1.03] motion-reduce:transform-none",
            "motion-reduce:transition-none",
          ],
          imageClassName
        )}
      />

      {scrim ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/15 to-transparent"
        />
      ) : null}

      {children}
    </div>
  );
}
