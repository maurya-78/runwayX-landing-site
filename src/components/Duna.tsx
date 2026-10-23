"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import CloudSky from "./CloudSky";
import { Logo } from "./Navbar";
import { FloatCard, HandNote, HandPhone } from "./Mockups";
import { Accent } from "./Sections";
import Link from "next/link";
import AskAI from "./AskAI";

const ease = [0.22, 1, 0.36, 1] as const;

function Badge({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-[12px] font-medium backdrop-blur ${
        dark ? "bg-black/[0.05] text-ink" : "bg-white/20 text-white ring-1 ring-white/25"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-[2px] bg-[#9be15d]" aria-hidden="true" />
      {children}
    </span>
  );
}

function PillButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink shadow-sm transition hover:shadow-md"
    >
      {children}
      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}

/** Centered copy block used by the cloud sections */
function CenterCopy({
  badge, title, body, cta, href, as = "h2",
}: { badge: string; title: React.ReactNode; body: string; cta: string; href: string; as?: "h1" | "h2" }) {
  const T = as;
  return (
    <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 text-center text-white">
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
        <Badge>{badge}</Badge>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1, ease }}>
        <T className="mt-4 text-4xl font-medium tracking-[-0.035em] sm:text-[44px] sm:leading-[1.1]">{title}</T>
        <p className="mx-auto mt-4 max-w-[440px] text-[15px] leading-relaxed text-white/85">{body}</p>
      </motion.div>
      <motion.div className="mt-8" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2, ease }}>
        <PillButton href={href}>{cta}</PillButton>
      </motion.div>
    </div>
  );
}

/* ---------------- Hero ---------------- */
export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-white pb-16 pt-[60px] sm:pb-20">
      {/* Painting: "The Rocky Mountains, Lander's Peak" by Albert Bierstadt (public domain) */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1.04 }}
        transition={{ duration: 2.4, ease }}
      >
        <Image
          src="/images/hero-rockies.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
      </motion.div>
      {/* Soft fade into the page */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-b from-white/0 via-white/80 to-white" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.a
          href="/#features"
          className="group inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md transition hover:bg-black/60"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
        >
          New: AI CFO for your startup
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </motion.a>
        <motion.h1
          className="mt-6 text-[40px] font-medium leading-[1.05] tracking-[-0.04em] text-ink sm:text-[60px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
        >
          Know your runway,
          <br />
          not just your <Accent>spend</Accent>
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-[520px] text-[16px] leading-relaxed text-ink/65 sm:text-[17px]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
        >
          RunwayX tracks every expense, calculates burn and runway in real time, and gives your team an AI CFO, all in one app.
        </motion.p>
        <motion.a
          href="/#download"
          className="mt-8 inline-flex items-center rounded-full bg-[#140d0b] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-black/80"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease }}
        >
          Get the app
        </motion.a>
      </div>
    </section>
  );
}

/* ---------------- Centered AI section (blue sky, middle of page) ---------------- */
export function CenterAI() {
  return (
    <section className="relative overflow-hidden pt-40">
      <CloudSky id="ai" className="absolute inset-0 h-full w-full" />
      <CenterCopy
        badge="Artificial Intelligence"
        title={<>AI built for <Accent>founders.</Accent></>}
        body="RunwayX's AI CFO reads your real numbers. Ask about burn, overspend or runway and get clear answers, backed by your data."
        cta="Discover RunwayX AI"
        href="/#features"
      />
      {/* Hand rises from the section's bottom edge; the wrist is cropped by overflow-hidden */}
      <motion.div
        className="relative z-10 mx-auto -mb-44 mt-16 w-[320px]"
        initial={{ opacity: 0, y: 80, rotate: 0 }}
        whileInView={{ opacity: 1, y: 0, rotate: -4 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease }}
      >
        <HandPhone screen="ai" label="RunwayX AI CFO chat" />
        <FloatCard className="-left-32 top-40 -rotate-6">
          <p className="text-ink/50">Suggested saving</p>
          <p className="font-semibold">₹9k / month</p>
        </FloatCard>
        <HandNote light arrow="down-left" className="-right-36 top-6 hidden sm:block">
          your CFO, in your pocket
        </HandNote>
      </motion.div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
const footerBottomLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/security", label: "Security" },
];

export function Footer() {
  return (
    <footer id="download" className="relative isolate flex flex-col overflow-hidden text-white">
      {/* Painting: "Mount Corcoran" by Albert Bierstadt (public domain) */}
      <Image
        src="/images/footer-corcoran.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[center_35%]"
      />
      {/* Scrims keep the copy and links legible */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1d3a45]/80 via-[#1d3a45]/30 to-black/70" />

      {/* Download CTA */}
      <div className="pt-28">
        <CenterCopy
          badge="Available on Android &amp; iOS"
          title={<>Grow with <Accent>clarity.</Accent></>}
          body="Download RunwayX and see your runway in under a minute."
          cta="Download RunwayX"
          href="https://play.google.com/store"
        />
      </div>

      {/* Bottom bar */}
      <div className="mx-auto w-full max-w-[1100px] px-6 pb-8 pt-20">
        <div className="flex flex-col items-center gap-5 border-t border-white/15 pt-8 text-[13px] md:flex-row md:justify-between">
          {/* Left: logo */}
          <Link href="/#top" aria-label="Back to top">
            <Logo light />
          </Link>

          {/* Center: links + AI buttons */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <nav aria-label="Footer">
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-medium text-white/80">
                {footerBottomLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <AskAI variant="dark" label="Ask AI about RunwayX" />
          </div>

          {/* Right: copyright */}
          <p className="text-white/60">© 2026 RunwayX</p>
        </div>
      </div>
    </footer>
  );
}
