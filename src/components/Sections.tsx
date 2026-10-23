"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bot, Check, Flame, Hourglass, Plus, Receipt, ScanLine, Users,
} from "lucide-react";
import Reveal from "./Reveal";
import { FloatCard, HandNote, HandPhone, PhoneMockup, type Screen } from "./Mockups";
import DemoPlayer from "./Demo";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

/** Italic serif accent word inside headlines */
export function Accent({ children }: { children: React.ReactNode }) {
  return <em className="font-serif text-[1.12em] font-normal italic tracking-[-0.01em]">{children}</em>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-ink/50">{children}</p>;
}
function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`mt-3 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl ${className}`}>{children}</h2>;
}


/* ---------------- Intro + big mockup ---------------- */
export function Intro() {
  return (
    <section className="px-6 py-24 sm:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>One app for your startup&apos;s money</Eyebrow>
        <H2>Stop guessing. Start seeing where every <Accent>rupee</Accent> goes.</H2>
        <p className="mx-auto mt-5 max-w-lg text-ink/60">
          Spreadsheets break, accounting tools are built for accountants. RunwayX is built for founders who need answers in seconds.
        </p>
      </Reveal>
      <Reveal delay={0.15} className="mt-20">
        <DemoPlayer />
      </Reveal>
    </section>
  );
}

/* ---------------- Feature grid ---------------- */
const grid = [
  { icon: Receipt, title: "Expense tracking", body: "Log every spend in seconds with categories, notes and receipts." },
  { icon: Flame, title: "Burn rate", body: "Monthly burn updates automatically as expenses come in." },
  { icon: Hourglass, title: "Runway estimation", body: "Know exactly how many months of cash you have left." },
  { icon: Users, title: "Team management", body: "Invite co-founders and staff with role-based access." },
  { icon: ScanLine, title: "Receipt scanning", body: "Snap a bill and RunwayX extracts amount, vendor and date." },
  { icon: Bot, title: "AI CFO", body: "Ask questions about your finances and get clear answers." },
];
export function Features() {
  return (
    <section id="features" className="scroll-mt-24 px-6 py-24 sm:px-8">
      <Reveal>
        <Eyebrow>Features</Eyebrow>
        <H2 className="max-w-xl">Everything your startup&apos;s <Accent>finances</Accent> need.</H2>
      </Reveal>
      <div className="mt-12 grid overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 [&>*]:bg-paper" style={{ gap: 1 }}>
        {grid.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <div className="group h-full p-7 transition hover:bg-white">
              <f.icon className="h-6 w-6 text-ink/70 transition group-hover:text-leaf" aria-hidden="true" />
              <h3 className="mt-8 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-ink/60">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Alternating rows ---------------- */
const rows = [
  {
    eyebrow: "Expenses",
    title: "Every rupee, accounted for.",
    body: "Add expenses manually or scan a receipt. RunwayX categorises spend, attaches files and keeps a searchable history so month-end is never a scramble.",
    points: ["Smart categories", "Receipt & file attachments", "Search and filter in a tap"],
    label: "Expenses screen",
    note: "snap, done!",
  },
  {
    eyebrow: "Burn & runway",
    title: "See the cliff before you reach it.",
    body: "Live burn rate and runway projections based on your real funds and spending, with signals that tell you when to act.",
    points: ["Monthly burn trends", "Runway in months", "Funds & funding rounds"],
    label: "Runway screen",
    note: "know before it's late",
  },
  {
    eyebrow: "Team",
    title: "Your whole team, one ledger.",
    body: "Bring co-founders and employees in. Everyone reports expenses, admins approve, and budgets stay under control per category.",
    points: ["Role-based access", "Category budgets", "Expense reports"],
    label: "Team screen",
    note: "everyone in sync",
  },
];

/**
 * A different composition per row: in hand, fanned pair, tilted with cards.
 * Notes sit in empty space with arrows pointing at the phone, never on top of it.
 */
function RowVisual({ i, label, note }: { i: number; label: string; note: string }) {
  if (i === 0)
    return (
      // Wrist runs off the bottom of the card (cropped by overflow-hidden)
      <div className="relative mx-auto -mb-36 w-[270px] pt-20">
        <HandPhone screen="scan" label={label} className="rotate-[-4deg]" />
        <FloatCard className="-right-14 top-48 rotate-3">
          <p className="text-ink/50">Auto-filled</p>
          <p className="font-semibold">₹1,300 · Food</p>
        </FloatCard>
        <HandNote className="-left-12 top-0" arrow="down-right">{note}</HandNote>
      </div>
    );
  if (i === 1)
    return (
      <div className="relative mx-auto h-[540px] w-[340px]">
        <div className="absolute left-0 top-[96px] w-[180px] -rotate-[9deg]">
          <PhoneMockup bare screen="home" label="Home screen" />
        </div>
        <div className="absolute right-0 top-[70px] w-[205px] rotate-[6deg]">
          <PhoneMockup bare screen="runway" label={label} />
        </div>
        <HandNote className="left-6 top-0" arrow="down-right">{note}</HandNote>
      </div>
    );
  return (
    <div className="relative mx-auto w-[220px] pt-20">
      <div className="rotate-[5deg]">
        <PhoneMockup bare screen="team" label={label} />
      </div>
      <FloatCard className="-left-24 top-56 -rotate-6">
        <p className="font-semibold">Neha added an expense</p>
        <p className="text-ink/50">₹4,200 · Team lunch</p>
      </FloatCard>
      <FloatCard className="-right-16 bottom-16 rotate-3">
        <p className="text-ink/50">Approved by</p>
        <p className="font-semibold">Aisha (Admin)</p>
      </FloatCard>
      <HandNote className="-left-16 top-0" arrow="down-right">{note}</HandNote>
    </div>
  );
}
export function Showcase() {
  return (
    <section className="divide-y divide-line border-y border-line">
      {rows.map((r, i) => (
        <div key={r.title} className="grid items-center gap-12 px-6 py-20 sm:px-8 md:grid-cols-2">
          <Reveal className={i % 2 ? "md:order-2" : ""}>
            <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-[#bfe6f3] to-[#f6f2df] px-6 py-12">
              <RowVisual i={i} label={r.label} note={r.note} />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>{r.eyebrow}</Eyebrow>
            <H2>{r.title}</H2>
            <p className="mt-5 max-w-md text-ink/60">{r.body}</p>
            <ul className="mt-6 space-y-3">
              {r.points.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-white">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      ))}
    </section>
  );
}

/* ---------------- How it works ---------------- */
const steps: { n: string; title: string; body: string; label: string; screen: Screen; tilt: string }[] = [
  { n: "01", title: "Create your startup", body: "Sign up, add your company and opening funds in under a minute.", label: "Home screen", screen: "home", tilt: "-rotate-6" },
  { n: "02", title: "Log what you spend", body: "Add expenses or scan receipts. Your team can too.", label: "Expenses screen", screen: "expenses", tilt: "rotate-3" },
  { n: "03", title: "Watch your runway", body: "Burn, runway and AI insights update automatically.", label: "AI CFO screen", screen: "ai", tilt: "-rotate-2" },
];
export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 px-6 py-24 sm:px-8">
      <Reveal className="text-center">
        <Eyebrow>How it works</Eyebrow>
        <H2>Up and running in <Accent>three</Accent> steps.</H2>
      </Reveal>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1} className={["md:mt-16", "md:mt-8", "md:mt-0"][i]}>
            <div className="h-full rounded-2xl border border-line bg-white p-6 transition-shadow hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)]">
              <span className="font-serif text-2xl italic text-ink/40">{s.n}</span>
              <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-ink/60">{s.body}</p>
              <div className="mt-6 h-[300px] overflow-hidden rounded-xl bg-gradient-to-b from-[#e6f1f5] to-paper px-6 pt-8">
                <div className={`mx-auto w-[190px] transition-transform duration-500 hover:rotate-0 ${s.tilt}`}>
                  <PhoneMockup bare screen={s.screen} label={s.label} />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */
export function Stats() {
  const s = [
    { v: "10s", l: "to log an expense" },
    { v: "0", l: "spreadsheets needed" },
    { v: "24/7", l: "AI CFO on call" },
    { v: "100%", l: "of spend visible" },
  ];
  return (
    <section className="grid grid-cols-2 divide-x divide-y divide-line border-b border-line md:grid-cols-4 md:divide-y-0">
      {s.map((x, i) => (
        <Reveal key={x.l} delay={i * 0.06} className="px-6 py-12 sm:px-8">
          <p className="text-5xl font-medium tracking-[-0.04em]">{x.v}</p>
          <p className="mt-2 text-sm text-ink/55">{x.l}</p>
        </Reveal>
      ))}
    </section>
  );
}

/* ---------------- Pricing ---------------- */
const plans = [
  { name: "Starter", price: "Free", note: "For solo founders", feats: ["1 startup", "Unlimited expenses", "Burn & runway"], cta: "Start free" },
  { name: "Team", price: "₹999", note: "per month", feats: ["Up to 10 members", "Receipt scanning", "Category budgets", "AI CFO"], cta: "Start trial", hot: true },
  { name: "Scale", price: "Custom", note: "For growing teams", feats: ["Unlimited members", "Priority support", "Custom reports"], cta: "Contact us" },
];
export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-line px-6 py-24 sm:px-8">
      <Reveal className="text-center">
        <Eyebrow>Pricing</Eyebrow>
        <H2>Simple pricing that <Accent>grows</Accent> with you.</H2>
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <div className={`flex h-full flex-col rounded-2xl border p-7 ${p.hot ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="mt-4 text-4xl font-medium tracking-tight">{p.price}</p>
              <p className={`text-sm ${p.hot ? "text-white/55" : "text-ink/50"}`}>{p.note}</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {p.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4" aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/#download" className={`mt-8 rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${p.hot ? "bg-white text-ink hover:bg-white/85" : "bg-ink text-white hover:bg-ink/85"}`}>
                {p.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-ink/40">Placeholder pricing — update to your real plans.</p>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const faqs = [
  { q: "Who is RunwayX for?", a: "Founders and small startup teams who want clarity on spend, burn and runway without hiring a finance team." },
  { q: "How is runway calculated?", a: "RunwayX divides your available funds by your average monthly burn, using your real logged expenses." },
  { q: "Is my financial data secure?", a: "Data is stored on Firebase with per-startup access rules. Only members you invite can see your numbers." },
  { q: "Can my team add expenses?", a: "Yes. Invite members with roles; they can log expenses and admins can review them." },
  { q: "Which platforms are supported?", a: "RunwayX is built with Flutter and runs on Android and iOS." },
];
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-24 grid gap-10 border-t border-line px-6 py-24 sm:px-8 md:grid-cols-[1fr_1.4fr]">
      <Reveal>
        <Eyebrow>FAQ</Eyebrow>
        <H2>Questions, <Accent>answered.</Accent></H2>
      </Reveal>
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium"
              >
                {f.q}
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }}>
                  <Plus className="h-5 w-5 text-ink/50" aria-hidden="true" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="overflow-hidden pb-5 text-ink/60"
                  >
                    {f.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

