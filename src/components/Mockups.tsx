"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowUp, ArrowUpRight, ChevronLeft, Coffee, Ellipsis, Hourglass, House, Laptop, Megaphone,
  Plane, Plus, Receipt, Search, Server, Sparkles, X, Zap,
} from "lucide-react";

export type Screen = "home" | "expenses" | "runway" | "team" | "ai" | "scan";

/* ------------------------------------------------------------------ */
/* Fit: lay content out at a fixed design width, scale it to the box   */
/* ------------------------------------------------------------------ */

/**
 * Design width of every phone screen in points. Slightly narrower than a real
 * iPhone (393) so the UI reads "zoomed in" and stays legible at mockup sizes.
 */
export const SCREEN_W = 360;

/**
 * Renders children at a fixed design width and scales them to the real box,
 * so mockups look identical at any size (no clipped or re-wrapped text).
 * Uses CSS `zoom` rather than `transform: scale` so text is laid out and
 * rasterised at the final size and stays sharp.
 */
export function Fit({ base = SCREEN_W, children }: { base?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ s: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0) setBox({ s: width / base, h: (height * base) / width });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [base]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div
        style={{
          width: base,
          height: box ? box.h : "100%",
          zoom: box?.s ?? 1,
          visibility: box ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phone hardware                                                      */
/* ------------------------------------------------------------------ */

// Titanium edge: a dark band with light catching the corners
const FRAME_BG =
  "linear-gradient(145deg,#5b5b60 0%,#232326 14%,#0c0c0d 45%,#141416 70%,#3c3c40 100%)";
const FRAME_SHADOW = [
  "inset 0 0 0 1px rgba(255,255,255,0.16)", // polished outer chamfer
  "inset 0 0 0 2.5px #060606", // black bezel
  "0 2px 3px rgba(0,0,0,0.25)",
  "0 28px 50px -18px rgba(12,18,32,0.55)",
  "0 70px 100px -40px rgba(12,18,32,0.45)",
].join(",");

/**
 * Phone in a titanium frame with side buttons, Dynamic Island and a soft
 * glass reflection. Every proportion is relative to the width.
 * - `src`: show a real screenshot instead (put files in /public/screens)
 * - `children`: custom screen content (laid out at SCREEN_W wide)
 * - `bare`: drop the default width cap so a parent can size it
 */
export function PhoneMockup({
  label = "App screenshot",
  screen = "home",
  src,
  bare = false,
  className = "",
  children,
}: {
  label?: string;
  screen?: Screen;
  src?: string;
  bare?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const btn = "absolute w-[1.4%] bg-gradient-to-b from-[#3a3a3e] via-[#1a1a1c] to-[#3a3a3e]";
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative aspect-[9/19.5] w-full ${bare ? "" : "mx-auto max-w-[280px]"} ${className}`}
    >
      {/* Side buttons: action, volume up/down, power */}
      <span className={`${btn} -left-[1%] top-[16.5%] h-[3.6%] rounded-l-[2px]`} />
      <span className={`${btn} -left-[1%] top-[23%] h-[6.8%] rounded-l-[2px]`} />
      <span className={`${btn} -left-[1%] top-[31.5%] h-[6.8%] rounded-l-[2px]`} />
      <span className={`${btn} -right-[1%] top-[26%] h-[10.5%] rounded-r-[2px]`} />

      <div className="relative h-full w-full rounded-[16%/7.4%] p-[3%]" style={{ background: FRAME_BG, boxShadow: FRAME_SHADOW }}>
        <div className="relative h-full w-full overflow-hidden rounded-[13.4%/6.1%] bg-[#f4f4f2]">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className="h-full w-full object-cover" />
          ) : (
            <Fit>{children ?? <ScreenUI screen={screen} />}</Fit>
          )}
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-[1.55%] z-20 h-[3.35%] w-[31%] -translate-x-1/2 rounded-full bg-black">
            <span className="absolute right-[14%] top-1/2 h-[38%] aspect-square -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#2c3550,#07080c_70%)]" />
          </div>
          {/* Glass reflection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30"
            style={{ background: "linear-gradient(118deg,rgba(255,255,255,0.16) 0%,rgba(255,255,255,0.04) 26%,rgba(255,255,255,0) 40%)" }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * A phone that rises out of the bottom of its section, with a contact shadow.
 * Place it inside a parent with overflow-hidden so the lower part is cropped.
 */
export function RisingPhone({
  screen = "home",
  label,
  className = "",
  children,
}: {
  screen?: Screen;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <div aria-hidden="true" className="absolute inset-x-[8%] bottom-0 top-[30%] rounded-[40%] bg-black/35 blur-3xl" />
      <PhoneMockup bare screen={screen} label={label ?? "RunwayX app"}>
        {children}
      </PhoneMockup>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Annotations                                                         */
/* ------------------------------------------------------------------ */

/** Small floating glass card used around phones. First <p> is the label, second the value. */
export function FloatCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`absolute z-20 rounded-2xl bg-white px-4 py-3 text-[11.5px] leading-tight tabular-nums text-ink shadow-[0_1px_1px_rgba(0,0,0,0.04),0_16px_36px_-12px_rgba(12,18,32,0.45)] ring-1 ring-black/[0.06] [&>p+p]:mt-1 [&>p+p]:text-[14px] [&>p+p]:tracking-[-0.01em] ${className}`}
    >
      {children}
    </div>
  );
}

export type ArrowDir = "down" | "down-right" | "down-left" | "right" | "left" | "up-right" | "up-left";

const ARROW_BOX: Record<ArrowDir, string> = {
  down: "left-1/2 top-full mt-2 h-[52px] w-[24px] -translate-x-1/2",
  "down-right": "left-[55%] top-full mt-1.5 h-[48px] w-[56px]",
  "down-left": "right-[55%] top-full mt-1.5 h-[48px] w-[56px] -scale-x-100",
  "up-right": "left-[55%] bottom-full mb-1.5 h-[48px] w-[56px] -scale-y-100",
  "up-left": "right-[55%] bottom-full mb-1.5 h-[48px] w-[56px] -scale-100",
  right: "left-full top-[20%] ml-2 h-[30px] w-[58px]",
  left: "right-full top-[20%] mr-2 h-[30px] w-[58px] -scale-x-100",
};

/** Fine-line arrow. The text sits apart from it, so they never overlap. */
function NoteArrow({ dir }: { dir: ArrowDir }) {
  const kind = dir === "down" ? "down" : dir === "right" || dir === "left" ? "side" : "diag";
  return (
    <svg
      viewBox={kind === "side" ? "0 0 62 34" : kind === "down" ? "0 0 30 58" : "0 0 60 52"}
      className={`absolute ${ARROW_BOX[dir]}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "side" ? (
        <>
          <path d="M3 10 C20 2 42 4 55 20" />
          <path d="M55.5 12 L55 20 L47.5 18" />
        </>
      ) : kind === "down" ? (
        <>
          <path d="M15 3 C10 18 20 32 15 50" />
          <path d="M9.5 43.5 L15 51 L20.5 43.5" />
        </>
      ) : (
        <>
          <path d="M5 3 C8 24 24 40 51 45" />
          <path d="M45 39.5 L51 45 L43.5 48.5" />
        </>
      )}
    </svg>
  );
}

/** Editorial italic annotation with an arrow pointing in `arrow` direction. Position it with `className`. */
export function HandNote({
  children,
  className = "",
  arrow = "down-right",
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  arrow?: ArrowDir;
  light?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-30 font-serif text-[20px] font-light italic leading-[1.15] tracking-[-0.015em] ${
        light
          ? "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_14px_rgba(0,0,0,0.4)]"
          : "font-normal text-[#1c1a17] [text-shadow:0_0_10px_rgba(255,250,240,0.7)]"
      } ${className}`}
    >
      <div className="relative">
        <span className="block whitespace-nowrap">{children}</span>
        <NoteArrow dir={arrow} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screen chrome (laid out at SCREEN_W)                                */
/* ------------------------------------------------------------------ */

const INK = "#0d0e0f";
const card = "rounded-[22px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-black/[0.04]";

/** iOS status bar: time, signal, Wi-Fi and battery. */
export function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`relative z-10 flex h-[54px] shrink-0 items-center justify-between pl-[42px] pr-[30px] pt-[4px] text-[16px] font-semibold tracking-[-0.02em] ${
        dark ? "text-white" : "text-[#0d0e0f]"
      }`}
    >
      <span>9:41</span>
      <span className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
          <rect x="0" y="8" width="3.2" height="4" rx="1" />
          <rect x="4.8" y="5.5" width="3.2" height="6.5" rx="1" />
          <rect x="9.6" y="3" width="3.2" height="9" rx="1" />
          <rect x="14.4" y="0" width="3.2" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
          <path d="M1.3 4.4a9.8 9.8 0 0 1 13.4 0" />
          <path d="M4 7.2a6 6 0 0 1 8 0" />
          <circle cx="8" cy="10.2" r="1.4" fill="currentColor" stroke="none" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

function HomeIndicator({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`absolute bottom-[8px] left-1/2 z-10 h-[5px] w-[134px] -translate-x-1/2 rounded-full ${dark ? "bg-white" : "bg-black"}`} />
  );
}

const TABS = [
  [House, "Home"],
  [Receipt, "Expenses"],
  [Hourglass, "Runway"],
  [Sparkles, "AI CFO"],
] as const;

/** Bottom tab bar with a centred add button. `active` is a TABS index (or -1). */
function TabBar({ active }: { active: number }) {
  const item = (i: number) => {
    const [Icon, name] = TABS[i];
    return (
      <span key={name} className={`flex flex-col items-center gap-[3px] text-[10.5px] font-medium ${i === active ? "text-[#0d0e0f]" : "text-[#0d0e0f]/35"}`}>
        <Icon className="h-[22px] w-[22px]" strokeWidth={i === active ? 2.2 : 1.8} />
        {name}
      </span>
    );
  };
  return (
    <div className="mt-auto grid shrink-0 grid-cols-5 items-start border-t border-black/[0.06] bg-white px-3 pb-[34px] pt-[10px]">
      {item(0)}
      {item(1)}
      <span className="mx-auto -mt-[2px] grid h-[42px] w-[42px] place-items-center rounded-full bg-[#0d0e0f] text-white shadow-[0_6px_14px_-4px_rgba(0,0,0,0.5)]">
        <Plus className="h-5 w-5" strokeWidth={2.4} />
      </span>
      {item(2)}
      {item(3)}
    </div>
  );
}

function Title({ children, right, kicker }: { children: React.ReactNode; right?: React.ReactNode; kicker?: string }) {
  return (
    <div className="flex items-end justify-between px-5 pb-1 pt-[6px]">
      <div>
        {kicker && <p className="text-[13px] font-medium text-black/45">{kicker}</p>}
        <p className="text-[30px] font-bold leading-[1.15] tracking-[-0.035em]">{children}</p>
      </div>
      {right}
    </div>
  );
}

function Avatar({ initials, from, to, size = 36 }: { initials: string; from: string; to: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white ring-2 ring-white"
      style={{ width: size, height: size, fontSize: size * 0.36, background: `linear-gradient(140deg,${from},${to})` }}
    >
      {initials}
    </span>
  );
}

function Delta({ up, good, children }: { up: boolean; good: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-[2px] rounded-full px-[7px] py-[2px] text-[11.5px] font-semibold ${good ? "bg-[#e8f6ec] text-[#1c7a3d]" : "bg-[#fdecec] text-[#c2352f]"}`}>
      <ArrowUpRight className={`h-3 w-3 ${up ? "" : "rotate-90"}`} strokeWidth={2.6} />
      {children}
    </span>
  );
}

/** Screen shell: status bar, content column, home indicator. */
function Shell({ children, dark = false, bg = "#f4f4f2" }: { children: React.ReactNode; dark?: boolean; bg?: string }) {
  return (
    <div className="relative flex h-full flex-col tabular-nums antialiased" style={{ background: bg, color: dark ? "#fff" : INK }}>
      <StatusBar dark={dark} />
      {children}
      <HomeIndicator dark={dark} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screens                                                             */
/* ------------------------------------------------------------------ */

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const BURN = [3.4, 3.7, 3.5, 3.9, 4.0, 4.2];

/** Monthly burn bars with dashed gridlines. `last` overrides the final bar (₹L). */
function BurnBars({ last, height = 108 }: { last?: number; height?: number }) {
  const vals = [...BURN.slice(0, -1), last ?? BURN[BURN.length - 1]];
  const max = 5;
  return (
    <div>
      <div className="relative flex items-end gap-[14px] px-1" style={{ height }}>
        {[0, 1, 2].map((g) => (
          <span key={g} className="absolute inset-x-0 border-t border-dashed border-black/[0.08]" style={{ bottom: `${(g + 1) * 33}%` }} />
        ))}
        {vals.map((v, i) => {
          const isLast = i === vals.length - 1;
          return (
            <span
              key={MONTHS[i]}
              className={`relative flex-1 rounded-[7px] transition-[height] duration-700 ease-out ${isLast ? "bg-[#0d0e0f]" : "bg-[#0d0e0f]/[0.09]"}`}
              style={{ height: `${(v / max) * 100}%` }}
            >
              {isLast && (
                <span className="absolute -top-[26px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[7px] bg-[#0d0e0f] px-[6px] py-[2px] text-[11px] font-semibold text-white">
                  ₹{v.toFixed(1)}L
                </span>
              )}
            </span>
          );
        })}
      </div>
      <div className="mt-2 flex gap-[14px] px-1 text-[11px] font-medium text-black/35">
        {MONTHS.map((m) => (
          <span key={m} className="flex-1 text-center">{m}</span>
        ))}
      </div>
    </div>
  );
}

/** Home / overview screen. Values are props so the demo can animate them. */
export function HomeScreen({
  runway = "18.0",
  burn = "₹4.2L",
  cash = "₹75.6L",
  note = "+2.0 mo vs last month",
  warn = false,
  last,
  recent = { name: "Figma", meta: "Software · Yesterday", amount: "₹3,100" },
}: {
  runway?: string;
  burn?: string;
  cash?: string;
  note?: string;
  warn?: boolean;
  last?: number;
  recent?: { name: string; meta: string; amount: string };
}) {
  const gid = useId().replace(/:/g, "");
  return (
    <Shell>
      <Title kicker="Friday, 23 Oct" right={<Avatar initials="AK" from="#f6b38f" to="#e0795a" />}>
        Overview
      </Title>

      <div className="relative mx-4 mt-4 overflow-hidden rounded-[26px] bg-[#0d0e0f] p-5 text-white">
        <svg viewBox="0 0 360 90" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[82px] w-full" aria-hidden="true">
          <defs>
            <linearGradient id={`${gid}-g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9be15d" stopOpacity="0.28" />
              <stop offset="1" stopColor="#9be15d" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 70 C40 66 60 52 100 56 S160 40 200 42 S270 22 310 26 S350 14 360 12 L360 90 L0 90 Z" fill={`url(#${gid}-g)`} />
          <path d="M0 70 C40 66 60 52 100 56 S160 40 200 42 S270 22 310 26 S350 14 360 12" fill="none" stroke="#9be15d" strokeWidth="2" />
        </svg>
        <div className="relative flex items-center justify-between">
          <p className="text-[13px] font-medium text-white/55">Runway</p>
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9be15d]" /> Live
          </span>
        </div>
        <p className="relative mt-2 flex items-baseline gap-2">
          <span className="text-[58px] font-semibold leading-none tracking-[-0.05em]">{runway}</span>
          <span className="text-[17px] font-medium text-white/55">months</span>
        </p>
        <p className={`relative mt-2 pb-8 text-[13px] font-medium ${warn ? "text-[#ffb36b]" : "text-[#9be15d]"}`}>{note}</p>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <div className={`${card} p-4`}>
          <p className="text-[13px] font-medium text-black/45">Burn / mo</p>
          <p className="mt-1 text-[23px] font-semibold tracking-[-0.03em]">{burn}</p>
          <div className="mt-1.5"><Delta up good={false}>3.1%</Delta></div>
        </div>
        <div className={`${card} p-4`}>
          <p className="text-[13px] font-medium text-black/45">Cash</p>
          <p className="mt-1 text-[23px] font-semibold tracking-[-0.03em]">{cash}</p>
          <div className="mt-1.5"><Delta up={false} good>−0.5%</Delta></div>
        </div>
      </div>

      <div className={`${card} mx-4 mt-3 px-4 pb-3 pt-4`}>
        <div className="mb-8 flex items-center justify-between">
          <p className="text-[15px] font-semibold tracking-[-0.01em]">Monthly burn</p>
          <p className="text-[12px] font-medium text-black/40">Last 6 months</p>
        </div>
        <BurnBars last={last} />
      </div>

      <div className={`${card} mx-4 mt-3 flex items-center gap-3 px-4 py-3`}>
        <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#f1ecff] text-[#6b4de6]"><Laptop className="h-5 w-5" /></span>
        <span className="flex-1">
          <span className="block text-[15px] font-medium">{recent.name}</span>
          <span className="block text-[12.5px] text-black/45">{recent.meta}</span>
        </span>
        <span className="text-[15px] font-semibold">{recent.amount}</span>
      </div>

      <TabBar active={0} />
    </Shell>
  );
}

type Row = { icon: typeof Server; tint: string; fg: string; name: string; meta: string; amount: string };

function ListCard({ rows }: { rows: Row[] }) {
  return (
    <div className={`${card} mx-4 overflow-hidden`}>
      {rows.map((r, i) => (
        <div key={r.name} className="flex items-center gap-3 px-4 py-[11px]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px]" style={{ background: r.tint, color: r.fg }}>
            <r.icon className="h-[19px] w-[19px]" />
          </span>
          <span className={`flex flex-1 items-center gap-3 self-stretch ${i ? "-mt-[11px] border-t border-black/[0.06] pt-[11px]" : ""}`}>
            <span className="flex-1">
              <span className="block text-[15px] font-medium tracking-[-0.01em]">{r.name}</span>
              <span className="block text-[12.5px] text-black/45">{r.meta}</span>
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.01em]">{r.amount}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

const Section = ({ children }: { children: React.ReactNode }) => (
  <p className="px-6 pb-2 pt-5 text-[13px] font-semibold text-black/40">{children}</p>
);

function ExpensesScreen() {
  return (
    <Shell>
      <Title right={<span className="mb-1 grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-black/[0.06]"><Search className="h-[18px] w-[18px]" /></span>}>
        Expenses
      </Title>
      <div className="px-5 pt-3">
        <p className="text-[13px] font-medium text-black/45">Spent in October</p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="text-[34px] font-semibold leading-tight tracking-[-0.045em]">₹1,18,650</p>
          <Delta up={false} good>8%</Delta>
        </div>
      </div>
      <div className="flex gap-2 px-5 pt-4 text-[13px] font-medium">
        {["All", "Software", "Travel", "Team", "Payroll"].map((c, i) => (
          <span key={c} className={`rounded-full px-3.5 py-[7px] ${i === 0 ? "bg-[#0d0e0f] text-white" : "bg-white text-black/60 ring-1 ring-black/[0.06]"}`}>{c}</span>
        ))}
      </div>
      <Section>Today</Section>
      <ListCard
        rows={[
          { icon: Server, tint: "#fff1e5", fg: "#d9670f", name: "AWS", meta: "Software · Card •• 4242", amount: "₹38,400" },
          { icon: Plane, tint: "#e8f1ff", fg: "#2f6fe0", name: "IndiGo · BLR", meta: "Travel · Rohan", amount: "₹12,950" },
          { icon: Coffee, tint: "#f6efe7", fg: "#8a5a2b", name: "Blue Tokai", meta: "Food & drinks · Receipt", amount: "₹1,300" },
        ]}
      />
      <Section>Yesterday</Section>
      <ListCard
        rows={[
          { icon: Laptop, tint: "#f1ecff", fg: "#6b4de6", name: "Figma", meta: "Software · Annual", amount: "₹3,100" },
          { icon: Megaphone, tint: "#ffeaf1", fg: "#d23c75", name: "LinkedIn Ads", meta: "Marketing · Neha", amount: "₹8,000" },
        ]}
      />
      <TabBar active={1} />
    </Shell>
  );
}

function RunwayScreen() {
  const gid = useId().replace(/:/g, "");
  return (
    <Shell>
      <Title>Runway</Title>
      <div className="mx-5 mt-3 grid grid-cols-3 rounded-[12px] bg-black/[0.05] p-[3px] text-center text-[13px] font-medium">
        <span className="rounded-[9px] bg-white py-[6px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">Current</span>
        <span className="py-[6px] text-black/50">Hire 2</span>
        <span className="py-[6px] text-black/50">Cut 10%</span>
      </div>

      <div className={`${card} mx-4 mt-4 p-5`}>
        <p className="text-[13px] font-medium text-black/45">Cash runs out</p>
        <p className="mt-0.5 text-[34px] font-semibold leading-tight tracking-[-0.045em]">April 2028</p>
        <p className="text-[13px] text-black/45">18 months at current burn</p>
        <svg viewBox="0 0 320 150" className="mt-4 w-full" aria-hidden="true">
          <defs>
            <linearGradient id={`${gid}-a`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0d0e0f" stopOpacity="0.14" />
              <stop offset="1" stopColor="#0d0e0f" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 70, 110].map((y) => (
            <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#000" strokeOpacity="0.07" strokeDasharray="3 4" />
          ))}
          <path d="M0 18 C60 24 100 40 150 62 S250 112 320 140 L320 150 L0 150 Z" fill={`url(#${gid}-a)`} />
          <path d="M0 18 C60 24 100 40 150 62" fill="none" stroke="#0d0e0f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M150 62 C200 84 250 112 320 140" fill="none" stroke="#0d0e0f" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 6" />
          <line x1="150" x2="150" y1="0" y2="150" stroke="#0d0e0f" strokeOpacity="0.25" strokeDasharray="2 3" />
          <circle cx="150" cy="62" r="6" fill="#9be15d" stroke="#0d0e0f" strokeWidth="2.5" />
          <rect x="114" y="0" width="72" height="20" rx="6" fill="#0d0e0f" />
          <text x="150" y="14" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">Today</text>
        </svg>
        <div className="mt-2 flex justify-between text-[11px] font-medium text-black/35">
          <span>Apr 26</span><span>Oct 26</span><span>Apr 27</span><span>Oct 27</span><span>Apr 28</span>
        </div>
      </div>

      <div className="mx-4 mt-3 flex items-center gap-3 rounded-[20px] bg-[#fff6e0] px-4 py-3.5 ring-1 ring-[#f0d999]">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ffe7a8] text-[#8a5d00]"><ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2.4} /></span>
        <span>
          <span className="block text-[14px] font-semibold">Software spend up 12%</span>
          <span className="block text-[12.5px] text-black/50">Adds ₹14k to your monthly burn</span>
        </span>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <div className={`${card} p-4`}><p className="text-[13px] font-medium text-black/45">Seed round</p><p className="mt-1 text-[21px] font-semibold tracking-[-0.03em]">₹1.2Cr</p></div>
        <div className={`${card} p-4`}><p className="text-[13px] font-medium text-black/45">Spent so far</p><p className="mt-1 text-[21px] font-semibold tracking-[-0.03em]">₹44.4L</p></div>
      </div>
      <TabBar active={2} />
    </Shell>
  );
}

function Budget({ name, used, of, pct, warn }: { name: string; used: string; of: string; pct: number; warn?: boolean }) {
  return (
    <div className="py-2.5">
      <div className="flex justify-between text-[14px]">
        <span className="font-medium">{name}</span>
        <span className="text-black/45"><b className="font-semibold text-[#0d0e0f]">{used}</b> / {of}</span>
      </div>
      <div className="mt-2 h-[7px] overflow-hidden rounded-full bg-black/[0.06]">
        <div className={`h-full rounded-full ${warn ? "bg-[#e9a23b]" : "bg-[#0d0e0f]"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function TeamScreen() {
  const people = [
    ["AK", "Aisha Khan", "aisha@acme.in", "Admin", "#f6b38f", "#e0795a"],
    ["RM", "Rohan Mehta", "rohan@acme.in", "Co-founder", "#8ec5fc", "#4f7de0"],
    ["NS", "Neha Sharma", "neha@acme.in", "Member", "#a8e0b4", "#3f9d63"],
    ["DP", "Dev Patel", "dev@acme.in", "Member", "#d7b8f3", "#8d5bd6"],
  ];
  return (
    <Shell>
      <Title right={<span className="mb-1.5 rounded-full bg-[#0d0e0f] px-3.5 py-[7px] text-[13px] font-semibold text-white">Invite</span>}>
        Team
      </Title>
      <p className="px-5 text-[13px] text-black/45">4 members · 2 approvals waiting</p>
      <div className={`${card} mx-4 mt-4 overflow-hidden`}>
        {people.map(([ini, n, e, r, a, b], i) => (
          <div key={n} className="flex items-center gap-3 px-4 py-[11px]">
            <Avatar initials={ini} from={a} to={b} size={40} />
            <span className={`flex flex-1 items-center gap-2 self-stretch ${i ? "-mt-[11px] border-t border-black/[0.06] pt-[11px]" : ""}`}>
              <span className="flex-1">
                <span className="block text-[15px] font-medium tracking-[-0.01em]">{n}</span>
                <span className="block text-[12.5px] text-black/45">{e}</span>
              </span>
              <span className={`rounded-full px-2.5 py-[3px] text-[11.5px] font-semibold ${i === 0 ? "bg-[#0d0e0f] text-white" : "bg-black/[0.05] text-black/60"}`}>{r}</span>
            </span>
          </div>
        ))}
      </div>
      <Section>Budgets this month</Section>
      <div className={`${card} mx-4 px-4 py-1.5`}>
        <Budget name="Marketing" used="₹68k" of="₹1L" pct={68} />
        <Budget name="Software" used="₹82k" of="₹1L" pct={82} warn />
        <Budget name="Travel" used="₹17k" of="₹50k" pct={34} />
      </div>
      <TabBar active={-1} />
    </Shell>
  );
}

function AIScreen() {
  const you = "ml-auto max-w-[78%] rounded-[20px] rounded-br-[6px] bg-[#0d0e0f] px-4 py-[10px] text-[15px] leading-[1.35] text-white";
  const bot = "max-w-[86%] rounded-[20px] rounded-bl-[6px] bg-white px-4 py-[11px] text-[15px] leading-[1.4] shadow-[0_1px_2px_rgba(16,24,40,0.05)] ring-1 ring-black/[0.04]";
  return (
    <Shell>
      <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 pb-3 pt-1">
        <ChevronLeft className="h-6 w-6 text-black/60" />
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[conic-gradient(from_200deg,#9be15d,#3a9ddb,#7c5cff,#9be15d)] text-white">
          <Sparkles className="h-[18px] w-[18px]" />
        </span>
        <span className="flex-1">
          <span className="block text-[16px] font-semibold tracking-[-0.01em]">AI CFO</span>
          <span className="block text-[12px] text-black/45">Reads your live books</span>
        </span>
        <Ellipsis className="h-5 w-5 text-black/50" />
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 pt-4">
        <p className="text-center text-[12px] font-medium text-black/35">Today 9:41</p>
        <p className={you}>Can we afford 2 more engineers?</p>
        <div className={bot}>
          Yes, if you raise within 6 months. Two hires at ₹1.5L each bring you to:
          <div className="mt-3 grid grid-cols-2 gap-2">
            <span className="rounded-[12px] bg-[#f4f4f2] px-3 py-2"><span className="block text-[11.5px] text-black/45">Burn</span><b className="text-[16px] font-semibold">₹7.2L</b></span>
            <span className="rounded-[12px] bg-[#f4f4f2] px-3 py-2"><span className="block text-[11.5px] text-black/45">Runway</span><b className="text-[16px] font-semibold">10.5 mo</b></span>
          </div>
        </div>
        <p className={you}>Where are we overspending?</p>
        <div className={bot}>
          Cloud costs grew 31% in 3 months. Reserved instances would cut that.
          <span className="mt-2.5 flex w-fit items-center gap-1.5 rounded-full bg-[#e8f6ec] px-2.5 py-1 text-[12.5px] font-semibold text-[#1c7a3d]">
            <Zap className="h-3.5 w-3.5" /> Save ₹9k / month
          </span>
        </div>
      </div>

      <div className="mx-3 mb-[34px] mt-3 flex h-[50px] shrink-0 items-center gap-2 rounded-full bg-white pl-5 pr-[6px] text-[15px] text-black/35 ring-1 ring-black/[0.07]">
        <span className="flex-1">Ask about your numbers…</span>
        <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#0d0e0f] text-white"><ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.4} /></span>
      </div>
    </Shell>
  );
}

function ScanScreen() {
  const corner = "absolute h-7 w-7 border-white";
  return (
    <Shell dark bg="#0b0b0c">
      <div className="flex items-center justify-between px-5 pb-3 pt-1">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><X className="h-[18px] w-[18px]" /></span>
        <span className="text-[16px] font-semibold">Scan receipt</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Zap className="h-[17px] w-[17px]" /></span>
      </div>

      {/* Viewfinder: receipt on a wooden café table */}
      <div
        className="relative mx-3 flex-1 overflow-hidden rounded-[30px]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, #6b4b33 0%, #3c2a1d 55%, #1a120c 100%), repeating-linear-gradient(92deg, rgba(0,0,0,0.08) 0 2px, transparent 2px 22px)",
          backgroundBlendMode: "multiply",
        }}
      >
        <div className="absolute left-1/2 top-[10%] w-[64%] -translate-x-1/2 rotate-[-3deg] bg-[#fbfaf5] px-5 pb-6 pt-5 font-mono text-[11px] leading-[1.6] text-[#2a2a2a] shadow-[0_24px_40px_-10px_rgba(0,0,0,0.7)]">
          <p className="text-center text-[13px] font-bold tracking-[0.12em]">BLUE TOKAI</p>
          <p className="text-center text-[9.5px] text-black/50">COFFEE ROASTERS · INDIRANAGAR</p>
          <p className="my-2 border-t border-dashed border-black/30" />
          <p className="flex justify-between"><span>Latte ×3</span><span>840.00</span></p>
          <p className="flex justify-between"><span>Croissant ×2</span><span>460.00</span></p>
          <p className="flex justify-between text-black/55"><span>CGST/SGST</span><span>incl.</span></p>
          <p className="my-2 border-t border-dashed border-black/30" />
          <p className="relative flex justify-between text-[12.5px] font-bold">
            <span>TOTAL</span><span>₹1,300.00</span>
            <span className="absolute -inset-x-2 -inset-y-1 rounded-[5px] ring-2 ring-[#9be15d]" />
          </p>
          <p className="mt-2 text-[9px] text-black/45">23/10/26 09:38 · UPI</p>
          <div className="mt-3 h-8" style={{ background: "repeating-linear-gradient(90deg,#222 0 2px,transparent 2px 4px,#222 4px 5px,transparent 5px 8px)" }} />
        </div>
        <span className={`${corner} left-[12%] top-[7%] rounded-tl-[10px] border-l-[3px] border-t-[3px]`} />
        <span className={`${corner} right-[12%] top-[7%] rounded-tr-[10px] border-r-[3px] border-t-[3px]`} />
        <span className={`${corner} bottom-[7%] left-[12%] rounded-bl-[10px] border-b-[3px] border-l-[3px]`} />
        <span className={`${corner} bottom-[7%] right-[12%] rounded-br-[10px] border-b-[3px] border-r-[3px]`} />
        <div className="absolute inset-x-[14%] top-[54%] h-[2px] rounded-full bg-[#9be15d] shadow-[0_0_16px_3px_rgba(155,225,93,0.7)]" />
      </div>

      {/* Result sheet */}
      <div className="mt-3 shrink-0 rounded-t-[30px] bg-white px-5 pb-[38px] pt-2.5 text-[#0d0e0f]">
        <div className="mx-auto h-[5px] w-9 rounded-full bg-black/15" />
        <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-semibold text-[#1c7a3d]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2fb85a]" /> Details detected
        </p>
        <div className="mt-1.5 flex items-end justify-between">
          <span>
            <span className="block text-[18px] font-semibold tracking-[-0.02em]">Blue Tokai Coffee</span>
            <span className="block text-[13px] text-black/45">Food & drinks · Today, 9:38</span>
          </span>
          <span className="text-[22px] font-semibold tracking-[-0.03em]">₹1,300</span>
        </div>
        <div className="mt-4 grid h-12 place-items-center rounded-[14px] bg-[#0d0e0f] text-[15px] font-semibold text-white">Save expense</div>
      </div>
    </Shell>
  );
}

function ScreenUI({ screen }: { screen: Screen }) {
  switch (screen) {
    case "expenses": return <ExpensesScreen />;
    case "runway": return <RunwayScreen />;
    case "team": return <TeamScreen />;
    case "ai": return <AIScreen />;
    case "scan": return <ScanScreen />;
    default: return <HomeScreen />;
  }
}
