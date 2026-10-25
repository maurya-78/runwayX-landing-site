import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Raised black button, after Kobra's Button
 * (https://kobra.systems/components/button, "default" variant, rounded).
 *
 * The link itself only carries the label; the fill, gloss and layered shadow
 * live on a ::before layer (`.btn-raise` in globals.css) so press and hover
 * can scale / brighten the surface without moving the text.
 */
export function RaiseButton({ className = "", ...linkProps }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...linkProps}
      data-slot="button"
      className={`btn-raise inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-ink ${className}`}
    />
  );
}
