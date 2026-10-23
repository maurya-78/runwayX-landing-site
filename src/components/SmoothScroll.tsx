"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Inertia-based smooth scrolling for the whole page.
 * Anchor links (#features, #pricing…) glide too, and respect each section's
 * scroll-margin-top so headings clear the fixed navbar.
 * Skipped entirely for users who prefer reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
