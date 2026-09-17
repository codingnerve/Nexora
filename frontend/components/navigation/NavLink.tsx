"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";

/**
 * A desktop navigation link. The current section gets a coral underline plus
 * `aria-current`, so location is conveyed by more than colour.
 */
export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  // `/destinations/bali` should still mark "Destinations" as current.
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center py-2 text-[0.9375rem] font-semibold",
        "transition-colors duration-200",
        isActive ? "text-ink-900" : "text-stone-700 hover:text-ink-900"
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-clay-500",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}
