"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll, useSpring } from "motion/react";
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
 * Runway mark + wordmark. One artwork everywhere: ink strips with the leaf-green
 * chevron (same as the favicon). On dark backgrounds (`light`) it sits on the
 * white logo tile so the colors stay identical. The mark is decorative, so the
 * wordmark beside it carries the name.
 */
export function Logo({ light = false, priority = false }: { light?: boolean; priority?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 ${light ? "text-white" : "text-ink"}`}>
      <Image
        src={light ? "/logo-tile.png" : "/logo-mark-ink.png"}
        alt=""
        width={512}
        height={512}
        priority={priority}
        className="h-9 w-9 shrink-0"
      />
      <span className="text-xl font-semibold leading-none tracking-[-0.01em]">RunwayX</span>
    </span>
  );
}

/**
 * Floating glass navbar: slides in on load, hides while scrolling down and
 * returns on scroll up, a pill follows the hovered link, and a thin bar shows
 * reading progress.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

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

        <nav aria-label="Main" className="flex h-[56px] items-center justify-between px-4 sm:px-5">
          <Link href="/#top" aria-label="RunwayX home">
            <Logo priority />
          </Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center text-[13px] text-ink/75 md:flex" onMouseLeave={() => setHover(null)}>
            {links.map((l) => (
              <li key={l.label} className="relative">
                <Link
                  href={l.href}
                  onMouseEnter={() => setHover(l.label)}
                  onFocus={() => setHover(l.label)}
                  className="relative z-10 block px-4 py-2 transition-colors hover:text-ink"
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
              className="group relative overflow-hidden rounded-[10px] bg-[#140d0b] px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-black/85"
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
              className="grid h-9 w-9 place-items-center rounded-lg text-ink/70 hover:bg-black/5 md:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
                  <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-sm text-ink/70">
                    {l.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Reading progress */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-sky via-leaf to-gold"
          style={{ scaleX: progress }}
        />
      </div>
    </motion.header>
  );
}
