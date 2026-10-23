"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowDownRight, Bot, Coffee, Plane, Receipt, Server, Sparkles, Users } from "lucide-react";

export type Screen = "home" | "expenses" | "runway" | "team" | "ai" | "scan";

/* ------------------------------------------------------------------ */
/* Fit: lay content out at a fixed design width, scale it to the box   */
/* ------------------------------------------------------------------ */

/** Design width of every phone screen (px). */
export const SCREEN_W = 254;

/**
 * Renders children at a fixed design width and scales them to the real box,
 * so mockups look identical at any size (no clipped or re-wrapped text).
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
        className="origin-top-left"
        style={{
          width: base,
          height: box ? box.h : "100%",
          transform: `scale(${box?.s ?? 1})`,
          visibility: box ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phone frame                                                         */
/* ------------------------------------------------------------------ */

/**
 * Phone frame with a built-in illustrative screen. Every proportion is relative
 * to the phone width, so it can be any size.
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
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative aspect-[9/19] w-full rounded-[16%/7.58%] bg-[#141414] p-[3%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/40 ${
        bare ? "" : "mx-auto max-w-[270px]"
      } ${className}`}
    >
      <div className="absolute left-1/2 top-[2.6%] z-10 h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      <div className="relative h-full w-full overflow-hidden rounded-[13.6%/6.3%] bg-[#f7f6f2]">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <Fit>{children ?? <ScreenUI screen={screen} />}</Fit>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hand holding a phone                                                */
/* ------------------------------------------------------------------ */

// Fingers wrap the phone's right edge from behind: [centerY, height, reach past edge, tilt]
const FINGERS: [number, number, number, number][] = [
  [360, 44, 30, 8],
  [406, 46, 34, 10],
  [452, 44, 31, 12],
  [496, 36, 25, 16],
];
const EDGE = 340; // phone's right edge in the hand's 420×760 drawing

/**
 * Phone held in an illustrated left hand: palm behind, fingers curling round the
 * right edge, thumb resting on the left edge. The wrist runs off the bottom, so
 * place it where a parent with overflow-hidden can crop it.
 */
export function HandPhone({
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
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative aspect-[420/760] w-full ${className}`}>
      {/* Behind the phone: palm, wrist and the wrapped fingers */}
      <svg viewBox="0 0 420 760" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-palm`} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#f0c0a2" />
            <stop offset="1" stopColor="#dc9f7f" />
          </linearGradient>
          <linearGradient id={`${id}-finger`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3c6a8" />
            <stop offset="1" stopColor="#dd9f7e" />
          </linearGradient>
        </defs>
        <path
          d="M150 760 C148 715 128 680 108 650 C92 628 86 600 92 572 L336 496 C356 520 364 580 354 636 C344 680 330 712 326 760 Z"
          fill={`url(#${id}-palm)`}
        />
        {FINGERS.map(([cy, h, reach, tilt]) => (
          <rect
            key={cy}
            x={300}
            y={cy - h / 2}
            width={EDGE - 300 + reach}
            height={h}
            rx={h / 2}
            transform={`rotate(${tilt} ${EDGE} ${cy})`}
            fill={`url(#${id}-finger)`}
            stroke="#cf8f6f"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      <div className="absolute" style={{ left: "16.667%", top: "2.632%", width: "64.286%" }}>
        <PhoneMockup bare screen={screen} label={label ?? "RunwayX app in hand"}>
          {children}
        </PhoneMockup>
      </div>

      {/* In front of the phone: fingertips over the bezel and the thumb */}
      <svg viewBox="0 0 420 760" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-thumb`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f5cbb0" />
            <stop offset="1" stopColor="#e2a585" />
          </linearGradient>
        </defs>
        {FINGERS.map(([cy, h, , tilt]) => (
          <g key={cy} transform={`rotate(${tilt} ${EDGE} ${cy})`}>
            <ellipse cx={EDGE - 1} cy={cy} rx={9} ry={h / 2 - 5} fill="#efbd9e" stroke="#cf8f6f" strokeWidth="1.2" />
            <ellipse cx={EDGE - 3} cy={cy} rx={4.5} ry={h / 2 - 12} fill="#f9dfcf" />
          </g>
        ))}
        <path
          d="M150 760 C112 735 72 712 58 664 C46 624 52 584 70 552 C82 530 90 512 98 498 C104 486 118 480 126 488 C134 496 130 510 122 520 C112 538 106 558 106 584 C106 610 114 636 130 660 L182 760 Z"
          fill={`url(#${id}-thumb)`}
        />
        {/* Thumbnail and knuckle crease */}
        <ellipse cx="117" cy="496" rx="7.5" ry="11" transform="rotate(38 117 496)" fill="#f9e0d1" stroke="#dba487" strokeWidth="1" />
        <path d="M106 584 C106 610 114 636 130 660" fill="none" stroke="#c9856a" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
        <path d="M74 566 C80 572 88 574 96 572" fill="none" stroke="#c9856a" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Annotations                                                         */
/* ------------------------------------------------------------------ */

/** Small floating UI card used around phones. */
export function FloatCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`absolute z-20 rounded-2xl bg-white/95 px-3.5 py-2.5 text-[12px] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.25)] ring-1 ring-black/5 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

export type ArrowDir = "down-right" | "down-left" | "right" | "left" | "up-right" | "up-left";

const ARROW_BOX: Record<ArrowDir, string> = {
  "down-right": "left-[55%] top-full mt-1 h-[52px] w-[60px]",
  "down-left": "right-[55%] top-full mt-1 h-[52px] w-[60px] -scale-x-100",
  "up-right": "left-[55%] bottom-full mb-1 h-[52px] w-[60px] -scale-y-100",
  "up-left": "right-[55%] bottom-full mb-1 h-[52px] w-[60px] -scale-100",
  right: "left-full top-[20%] ml-1.5 h-[34px] w-[62px]",
  left: "right-full top-[20%] mr-1.5 h-[34px] w-[62px] -scale-x-100",
};

/** Hand-drawn arrow. The text sits apart from it, so they never overlap. */
function NoteArrow({ dir }: { dir: ArrowDir }) {
  const side = dir === "right" || dir === "left";
  return (
    <svg
      viewBox={side ? "0 0 62 34" : "0 0 60 52"}
      className={`absolute ${ARROW_BOX[dir]}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {side ? (
        <>
          <path d="M3 10 C20 2 42 4 55 20" />
          <path d="M54.3 10 L55 20 L45.4 17.3" />
        </>
      ) : (
        <>
          <path d="M5 3 C8 24 24 40 51 45" />
          <path d="M44 37.9 L51 45 L41.9 49.2" />
        </>
      )}
    </svg>
  );
}

/** Handwritten note with an arrow pointing in `arrow` direction. Position it with `className`. */
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
      className={`pointer-events-none absolute z-30 font-hand text-[23px] leading-[1.05] ${light ? "text-white" : "text-ink/80"} ${className}`}
    >
      <div className="relative">
        <span className="block -rotate-3 whitespace-nowrap">{children}</span>
        <NoteArrow dir={arrow} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screens (laid out at SCREEN_W)                                      */
/* ------------------------------------------------------------------ */

export const BAR_H = [42, 55, 48, 62, 58, 70, 52, 66, 60, 74, 64, 56];

export function Bars({ count = 7, className = "", last }: { count?: number; className?: string; last?: number }) {
  return (
    <div className={`flex items-end gap-[6%] ${className}`}>
      {BAR_H.slice(0, count).map((h, i) => {
        const isLast = i === count - 1;
        return (
          <span
            key={i}
            className={`flex-1 rounded-t-[4px] transition-[height] duration-700 ease-out ${isLast ? "bg-ink" : "bg-ink/15"}`}
            style={{ height: `${isLast && last !== undefined ? last : h}%` }}
          />
        );
      })}
    </div>
  );
}

export function Status() {
  return (
    <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[9px] font-semibold text-ink">
      <span>9:41</span>
      <span className="flex gap-1">
        <span className="h-1.5 w-3 rounded-sm bg-ink" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink" />
      </span>
    </div>
  );
}

function ScreenUI({ screen }: { screen: Screen }) {
  return (
    <div className="flex h-full flex-col text-ink">
      <Status />
      <div className="flex flex-1 flex-col gap-2.5 overflow-hidden px-3.5 pt-3">{SCREENS[screen]}</div>
    </div>
  );
}

const rowIcon = "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-paper";

const SCREENS: Record<Screen, React.ReactNode> = {
  home: (
    <>
      <p className="text-[10px] text-ink/50">Good morning, Aisha</p>
      <div className="rounded-2xl bg-ink p-3.5 text-white">
        <p className="text-[9px] uppercase tracking-wider text-white/50">Runway</p>
        <p className="font-serif text-[34px] italic leading-none">18 months</p>
        <p className="mt-1 text-[9px] text-[#9be15d]">+2 mo vs last month</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white p-2.5 shadow-sm">
          <p className="text-[8px] text-ink/50">Burn / mo</p>
          <p className="text-[14px] font-semibold">₹4.2L</p>
        </div>
        <div className="rounded-xl bg-white p-2.5 shadow-sm">
          <p className="text-[8px] text-ink/50">Funds</p>
          <p className="text-[14px] font-semibold">₹75.6L</p>
        </div>
      </div>
      <div className="flex h-24 flex-col rounded-xl bg-white p-2.5 shadow-sm">
        <p className="text-[8px] text-ink/50">Monthly burn</p>
        <Bars className="mt-2 flex-1" />
      </div>
    </>
  ),
  expenses: (
    <>
      <p className="text-[15px] font-semibold">Expenses</p>
      <div className="flex gap-1.5 text-[8px]">
        {["All", "Software", "Travel", "Team"].map((c, i) => (
          <span key={c} className={`rounded-full px-2 py-1 ${i === 0 ? "bg-ink text-white" : "bg-white text-ink/60"}`}>{c}</span>
        ))}
      </div>
      {[
        [Server, "AWS", "Software", "₹38,400"],
        [Plane, "Flight to BLR", "Travel", "₹12,950"],
        [Coffee, "Team lunch", "Team", "₹4,200"],
        [Receipt, "Figma", "Software", "₹3,100"],
        [Users, "Contractor", "Payroll", "₹60,000"],
      ].map(([Icon, n, c, a]) => {
        const I = Icon as typeof Server;
        return (
          <div key={n as string} className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
            <span className={rowIcon}><I className="h-3.5 w-3.5" /></span>
            <span className="flex-1">
              <span className="block text-[10px] font-medium">{n as string}</span>
              <span className="block text-[8px] text-ink/45">{c as string}</span>
            </span>
            <span className="text-[10px] font-semibold">{a as string}</span>
          </div>
        );
      })}
    </>
  ),
  runway: (
    <>
      <p className="text-[15px] font-semibold">Runway</p>
      <div className="rounded-2xl bg-white p-3 shadow-sm">
        <p className="text-[8px] text-ink/50">Cash runs out</p>
        <p className="font-serif text-[28px] italic leading-tight">April 2028</p>
        <svg viewBox="0 0 200 80" className="mt-2 w-full" aria-hidden="true">
          <path d="M0 10 C50 18 90 30 130 48 S180 72 200 78" fill="none" stroke="#111" strokeWidth="2.5" />
          <path d="M0 10 C50 18 90 30 130 48 S180 72 200 78 L200 80 L0 80 Z" fill="#111" opacity="0.06" />
          <circle cx="130" cy="48" r="4" fill="#9be15d" stroke="#111" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-[#fff4d6] p-2.5 text-[9px]">
        <ArrowDownRight className="h-3.5 w-3.5" /> Software spend up 12% this month
      </div>
      <div className="grid grid-cols-2 gap-2 text-[9px]">
        <div className="rounded-xl bg-white p-2.5 shadow-sm"><p className="text-ink/50">Seed round</p><p className="text-[13px] font-semibold">₹1.2Cr</p></div>
        <div className="rounded-xl bg-white p-2.5 shadow-sm"><p className="text-ink/50">Spent</p><p className="text-[13px] font-semibold">₹44.4L</p></div>
      </div>
    </>
  ),
  team: (
    <>
      <p className="text-[15px] font-semibold">Team</p>
      {[
        ["Aisha K.", "Admin", "#f7c59f"],
        ["Rohan M.", "Co-founder", "#a8d5e2"],
        ["Neha S.", "Member", "#c5e1a5"],
        ["Dev P.", "Member", "#e1bee7"],
      ].map(([n, r, c]) => (
        <div key={n} className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
          <span className="grid h-7 w-7 place-items-center rounded-full text-[9px] font-semibold" style={{ background: c }}>{n[0]}</span>
          <span className="flex-1 text-[10px] font-medium">{n}</span>
          <span className="rounded-full bg-paper px-2 py-0.5 text-[8px] text-ink/60">{r}</span>
        </div>
      ))}
      <div className="rounded-xl bg-white p-2.5 shadow-sm">
        <p className="text-[8px] text-ink/50">Marketing budget</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-paper"><div className="h-full w-[68%] rounded-full bg-ink" /></div>
        <p className="mt-1 text-[8px] text-ink/50">₹68k of ₹1L</p>
      </div>
    </>
  ),
  ai: (
    <>
      <p className="flex items-center gap-1.5 text-[15px] font-semibold"><Bot className="h-4 w-4" /> AI CFO</p>
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-ink px-3 py-2 text-[10px] text-white">Can we afford 2 more engineers?</div>
      <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-[10px] leading-snug shadow-sm">
        Yes. Hiring 2 at ₹1.5L each brings burn to ₹7.2L and runway to <b>10.5 months</b>. I&apos;d raise within 6 months.
      </div>
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-ink px-3 py-2 text-[10px] text-white">Where are we overspending?</div>
      <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-[10px] leading-snug shadow-sm">
        Cloud costs grew 31% in 3 months. Reserved instances could save ₹9k/mo.
      </div>
      <div className="mb-4 mt-auto flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[9px] text-ink/40 shadow-sm">
        <Sparkles className="h-3 w-3" /> Ask about your numbers…
      </div>
    </>
  ),
  scan: (
    <>
      <p className="text-[15px] font-semibold">Scan receipt</p>
      <div className="relative flex-1 rounded-2xl bg-[#2b2b2b] p-5">
        <div className="mx-auto h-full max-w-[75%] rotate-[-3deg] rounded bg-white p-2 text-[7px] text-ink/60">
          <p className="text-center font-semibold text-ink">BLUE TOKAI</p>
          <p className="mt-2">Latte x3 ........ ₹840</p>
          <p>Croissant x2 .... ₹460</p>
          <p className="mt-2 font-semibold text-ink">Total ₹1,300</p>
        </div>
        <div className="absolute inset-x-6 top-1/2 h-0.5 bg-[#9be15d] shadow-[0_0_12px_#9be15d]" />
      </div>
      <div className="mb-4 rounded-xl bg-white p-2.5 text-[9px] shadow-sm">
        <p className="font-semibold">Blue Tokai · ₹1,300</p>
        <p className="text-ink/50">Food & drinks · Today</p>
      </div>
    </>
  ),
};
