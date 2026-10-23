"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/#features", label: "Product" },
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "Resources" },
];

/**
 * Runway mark + wordmark on a transparent background. Light backgrounds use the
 * ink mark; dark backgrounds (`light`) use the light mark with the bright-green
 * chevron. The mark is decorative, so the wordmark beside it carries the name.
 */
export function Logo({ light = false, priority = false }: { light?: boolean; priority?: boolean }) {
  return (
    <span className={`flex items-center gap-2 ${light ? "text-white" : "text-ink"}`}>
      {/* Mark height ~1.6x the wordmark cap so the two read as one unit */}
      <Image
        src={light ? "/logo-mark.png" : "/logo-nav.png"}
        alt=""
        width={512}
        height={512}
        priority={priority}
        className={light ? "h-10 w-10 shrink-0" : "h-8 w-8 shrink-0 sm:h-9 sm:w-9"}
      />
      <span className="text-[20px] font-semibold leading-none tracking-[-0.03em] sm:text-[22px]">RunwayX</span>
    </span>
  );
}

/**
 * Floating glass navbar: slides in on load, hides while scrolling down and
 * returns on scroll up, and a pill follows the hovered link.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: hidden ? -90 : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`relative mx-auto max-w-[1100px] overflow-hidden rounded-2xl border backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow,border-color] duration-500 ${
          scrolled || open
            ? "border-white/70 bg-white/65 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)]"
            : "border-white/40 bg-white/25 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.15)]"
        }`}
      >
        {/* Glass sheen */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        <nav aria-label="Main" className="flex h-[56px] items-center justify-between gap-2 px-3 sm:h-[60px] sm:px-5">
          <Link href="/#top" aria-label="RunwayX home">
            <Logo priority />
          </Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center text-[14.5px] font-medium tracking-[-0.01em] text-ink/70 md:flex" onMouseLeave={() => setHover(null)}>
            {links.map((l) => (
              <li key={l.label} className="relative">
                <Link
                  href={l.href}
                  onMouseEnter={() => setHover(l.label)}
                  onFocus={() => setHover(l.label)}
                  className="relative z-10 block whitespace-nowrap px-3 py-2 transition-colors hover:text-ink lg:px-4"
                >
                  {l.label}
                </Link>
                {hover === l.label && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-white/80 shadow-sm ring-1 ring-black/5"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/#download"
              className="group relative overflow-hidden whitespace-nowrap rounded-[11px] bg-[#140d0b] px-3 py-2 text-[13.5px] font-semibold tracking-[-0.01em] text-white transition hover:bg-black/85 sm:px-4 sm:py-2.5 sm:text-[14.5px]"
            >
              <span className="relative z-10">Get the app</span>
              {/* Shine sweep */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover:translate-x-[400%]"
              />
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-ink/70 hover:bg-black/5 md:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-black/[0.06] px-5 md:hidden"
            >
              {links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-[15px] font-medium text-ink/70 transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
