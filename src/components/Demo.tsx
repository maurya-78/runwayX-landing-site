"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowUpRight, Bot, CalendarDays, ChevronDown, Hourglass, LayoutGrid, Lock, Pause, Play, Plus,
  Receipt, Server, Sparkles, Users,
} from "lucide-react";
import { HandNote, HomeScreen, PhoneMockup } from "./Mockups";

/**
 * Scripted product demo that plays like a screen recording: a desktop dashboard
 * and a phone stay in sync while an expense is logged, burn updates, runway is
 * recalculated and the AI CFO answers. Plays only while on screen, pausable,
 * and starts paused for users who prefer reduced motion.
 */
const CHAPTERS = ["Log an expense", "Burn updates", "Runway recalculates", "Ask the AI CFO"];
const CHAPTER_MS = 3200;
const TOTAL = CHAPTERS.length * CHAPTER_MS;
const ease = [0.22, 1, 0.36, 1] as const;

// Values per chapter: after an expense is logged, burn rises and runway shortens
const KPI = [
  { burn: "₹4.2L", runway: "18.0", cash: "₹75.6L", last: 4.2 },
  { burn: "₹4.6L", runway: "18.0", cash: "₹75.2L", last: 4.6 },
  { burn: "₹4.6L", runway: "16.4", cash: "₹75.2L", last: 4.6 },
  { burn: "₹4.6L", runway: "16.4", cash: "₹75.2L", last: 4.6 },
];

// Burn per month in ₹ lakh, Nov → Oct; the final value comes from KPI
const BURN_12 = [2.6, 2.9, 3.1, 2.8, 3.3, 3.4, 3.7, 3.5, 3.9, 4.0, 4.1];
const MONTHS_12 = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

const NAV = [
  [Receipt, "Expenses"],
  [LayoutGrid, "Overview"],
  [Hourglass, "Runway"],
  [Bot, "AI CFO"],
] as const;

function useClock(active: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      // rAF's timestamp can be slightly earlier than performance.now(), so never step backwards
      const dt = Math.max(0, now - last);
      setT((v) => (v + dt) % TOTAL);
      last = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return [t, setT] as const;
}

const noop = () => () => {};

const fmt = (ms: number) => `0:${String(Math.floor(ms / 1000)).padStart(2, "0")}`;

export default function DemoPlayer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  // Auto-play unless the user prefers reduced motion; their toggle wins after that
  const reduced = useReducedMotion();
  // The server can't know the motion preference, so start paused until hydrated (avoids a mismatch)
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? (hydrated && !reduced);
  const setPlaying = (f: (p: boolean) => boolean) => setChoice(f(playing));

  const [t, setT] = useClock(playing && inView);
  const ch = Math.max(0, Math.min(CHAPTERS.length - 1, Math.floor(t / CHAPTER_MS) || 0));
  const k = KPI[ch];

  return (
    <div ref={ref} className="relative md:pr-44">
      {/* Desktop "recording" */}
      <div className="overflow-hidden rounded-[18px] bg-white text-ink tabular-nums shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.06),0_40px_80px_-24px_rgba(10,16,28,0.55)]">
        {/* Window chrome */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-black/[0.06] bg-[#f7f7f5] px-4 py-2.5">
          <span className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-inset ring-black/10" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-inset ring-black/10" />
            <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-inset ring-black/10" />
          </span>
          <span className="flex w-[min(320px,40vw)] items-center justify-center gap-1.5 rounded-[8px] bg-white px-3 py-1 text-[13px] text-ink/55 ring-1 ring-black/[0.06]">
            <Lock className="h-3 w-3" aria-hidden="true" /> app.runwayx.com/overview
          </span>
          <span className="flex items-center justify-end gap-1.5 text-[12.5px] font-medium text-[#e5484d]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e5484d]" /> Demo
          </span>
        </div>

        <div className="relative grid aspect-[16/10] grid-cols-[1fr] sm:grid-cols-[176px_1fr]">
          {/* Sidebar */}
          <aside className="hidden flex-col border-r border-black/[0.06] bg-[#fafaf8] p-3 text-[13.5px] sm:flex">
            <div className="flex items-center gap-2 rounded-[10px] px-2 py-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark-ink.png" alt="" className="h-5 w-5" />
              <span className="font-semibold tracking-[-0.01em]">Acme Labs</span>
              <ChevronDown className="ml-auto h-3.5 w-3.5 text-ink/35" aria-hidden="true" />
            </div>
            <p className="mb-1 mt-5 px-2 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink/35">Workspace</p>
            {NAV.map(([Icon, x], i) => (
              <p
                key={x}
                className={`flex items-center gap-2.5 rounded-[9px] px-2 py-[7px] transition-colors duration-300 ${
                  i === ch ? "bg-white font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05]" : "text-ink/55"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                {x}
              </p>
            ))}
            <p className="flex items-center gap-2.5 rounded-[9px] px-2 py-[7px] text-ink/55">
              <Users className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" /> Team
            </p>
            <div className="mt-auto rounded-[12px] bg-white p-3 ring-1 ring-black/[0.05]">
              <p className="text-[12px] text-ink/45">Seed round</p>
              <p className="mt-0.5 text-[14px] font-semibold tracking-[-0.01em]">₹1.2Cr raised</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                <div className="h-full w-[37%] rounded-full bg-ink" />
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-3 p-4 sm:p-5">
            {/* Page header */}
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] text-ink/45">Acme Labs</p>
                <p className="text-[18px] font-semibold leading-tight tracking-[-0.025em]">Overview</p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-[9px] px-2.5 py-1.5 text-[13px] font-medium text-ink/60 ring-1 ring-black/[0.08] md:flex">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> Last 12 months
              </span>
              <span className="flex items-center gap-1.5 rounded-[9px] bg-ink px-2.5 py-1.5 text-[13px] font-semibold text-white">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add expense
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Kpi label="Runway" value={`${k.runway} mo`} hot={ch === 2} delta={ch >= 2 ? "−1.6 mo" : "+2.0 mo"} good={ch < 2} />
              <Kpi label="Monthly burn" value={k.burn} hot={ch === 1} delta={ch >= 1 ? "+9.5%" : "+3.1%"} good={false} />
              <Kpi label="Cash in bank" value={k.cash} hot={ch === 1} delta="−0.5%" good />
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[1.45fr_1fr]">
              <div className="flex min-h-0 flex-col rounded-[14px] p-4 ring-1 ring-black/[0.07]">
                <div className="flex items-baseline justify-between">
                  <p className="text-[13px] font-semibold tracking-[-0.01em]">Monthly burn</p>
                  <p className="text-[12px] text-ink/40">₹ lakh</p>
                </div>
                <BurnChart last={k.last} />
              </div>
              <div className="relative hidden min-h-0 overflow-hidden rounded-[14px] p-4 ring-1 ring-black/[0.07] lg:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={ch}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease }}
                    className="flex h-full flex-col gap-2 text-[13px]"
                  >
                    <Panel ch={ch} t={t % CHAPTER_MS} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Player controls */}
        {/* Right padding on md+ keeps the timecode clear of the overlapping phone */}
        <div className="flex items-center gap-3 border-t border-black/[0.06] bg-[#f7f7f5] px-4 py-2.5 md:pr-20">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause demo" : "Play demo"}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-ink/80"
          >
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 translate-x-px" />}
          </button>
          <div className="flex flex-1 gap-1.5">
            {CHAPTERS.map((c, i) => {
              const fill = Math.max(0, Math.min(1, (t - i * CHAPTER_MS) / CHAPTER_MS));
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setT(i * CHAPTER_MS)}
                  aria-label={`Jump to: ${c}`}
                  className="group flex flex-1 flex-col gap-1.5 text-left"
                >
                  <span className="h-1 overflow-hidden rounded-full bg-ink/10">
                    <span className="block h-full rounded-full bg-ink" style={{ width: `${fill * 100}%` }} />
                  </span>
                  <span className={`hidden truncate text-[12.5px] font-medium sm:block ${i === ch ? "text-ink" : "text-ink/40 group-hover:text-ink/70"}`}>{c}</span>
                </button>
              );
            })}
          </div>
          <span className="shrink-0 font-mono text-[12px] text-ink/45">
            {fmt(t)} / {fmt(TOTAL)}
          </span>
        </div>
      </div>

      {/* Phone in sync */}
      <motion.div
        className="absolute -bottom-10 right-0 hidden w-[232px] md:block"
        initial={{ rotate: 0, y: 40 }}
        whileInView={{ rotate: 6, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease }}
      >
        <PhoneMockup bare label="RunwayX mobile app, synced with the dashboard">
          <HomeScreen
            runway={k.runway}
            burn={k.burn}
            cash={k.cash}
            last={k.last}
            warn={ch >= 2}
            note={ch >= 2 ? "−1.6 mo after the AWS bill" : "+2.0 mo vs last month"}
            recent={ch === 0 ? undefined : { name: "AWS", meta: "Software · Just now", amount: "₹38,400" }}
          />
        </PhoneMockup>
      </motion.div>
      {/* Sits in the empty column above the phone and points straight down at it */}
      <HandNote light className="right-0 top-[56px] hidden w-[122px] text-right md:block" arrow="down">
        {"same numbers,"}
        <br />
        {"everywhere"}
      </HandNote>
    </div>
  );
}

function Kpi({ label, value, hot, delta, good }: { label: string; value: string; hot?: boolean; delta: string; good: boolean }) {
  return (
    <div className={`rounded-[14px] p-3 ring-1 transition-colors duration-500 sm:p-3.5 ${hot ? "bg-[#fffbea] ring-[#ecd58b]" : "ring-black/[0.07]"}`}>
      <p className="text-[12.5px] font-medium text-ink/50">{label}</p>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={value}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.35, ease }}
          className="mt-1 text-[19px] font-semibold tracking-[-0.03em] sm:text-[23px]"
        >
          {value}
        </motion.p>
      </AnimatePresence>
      <span className={`mt-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-[11.5px] font-semibold ${good ? "bg-[#e8f6ec] text-[#1c7a3d]" : "bg-[#fdecec] text-[#c2352f]"}`}>
        <ArrowUpRight className={`h-2.5 w-2.5 ${delta.startsWith("−") ? "rotate-90" : ""}`} strokeWidth={2.8} aria-hidden="true" />
        {delta}
      </span>
    </div>
  );
}

/** 12-month burn chart with y-axis gridlines, month labels and a tooltip on the current month. */
function BurnChart({ last }: { last: number }) {
  const vals = [...BURN_12, last];
  const max = 6;
  return (
    // Axis column + plot column; month labels share the plot column so they line up with the bars
    <div className="mt-6 grid min-h-0 flex-1 grid-cols-[16px_1fr] grid-rows-[1fr_auto] gap-x-2">
        <div className="flex flex-col justify-between text-right text-[11px] leading-none text-ink/35">
          {[6, 4, 2, 0].map((v) => (
            <span key={v} className="-my-[5px]">{v}</span>
          ))}
        </div>
        <div className="relative flex min-h-0 items-end gap-[5px]">
          {[0, 1, 2, 3].map((g) => (
            <span key={g} className="absolute inset-x-0 border-t border-dashed border-black/[0.07]" style={{ top: `${(g / 3) * 100}%` }} />
          ))}
          {vals.map((v, i) => {
            const isLast = i === vals.length - 1;
            return (
              <span
                key={MONTHS_12[i]}
                className={`relative flex-1 rounded-t-[5px] transition-[height] duration-700 ease-out ${isLast ? "bg-ink" : "bg-ink/[0.1]"}`}
                style={{ height: `${(v / max) * 100}%` }}
              >
                {isLast && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-ink px-1.5 py-0.5 text-[11.5px] font-semibold text-white">
                    ₹{v.toFixed(1)}L
                  </span>
                )}
              </span>
            );
          })}
        </div>
      <span />
      <div className="mt-1.5 flex gap-[5px] text-[11px] text-ink/35">
        {MONTHS_12.map((m) => (
          <span key={m} className="min-w-0 flex-1 overflow-hidden text-center">{m}</span>
        ))}
      </div>
    </div>
  );
}

/** Right-hand panel content for each chapter; `t` is ms into the chapter */
function Panel({ ch, t }: { ch: number; t: number }) {
  if (ch === 0) {
    const typed = "AWS".slice(0, Math.floor(t / 260));
    const amount = "38,400".slice(0, Math.max(0, Math.floor((t - 900) / 140)));
    const saved = t > 2200;
    return (
      <>
        <p className="flex items-center gap-1.5 text-[13px] font-semibold"><Plus className="h-3.5 w-3.5" /> New expense</p>
        <Field label="Vendor" value={typed} caret={!amount} />
        <Field label="Amount" value={amount ? `₹${amount}` : ""} caret={!!amount && !saved} />
        <Field label="Category" value={t > 1800 ? "Software" : ""} />
        <span className={`mt-auto rounded-[9px] py-2 text-center text-[13px] font-semibold transition-colors ${saved ? "bg-leaf text-white" : "bg-ink text-white"}`}>
          {saved ? "Saved ✓" : "Save expense"}
        </span>
      </>
    );
  }
  if (ch === 1)
    return (
      <>
        <p className="text-[13px] font-semibold">Recent</p>
        <div className="flex items-center gap-2.5 rounded-[10px] bg-[#fffbea] p-2.5 ring-1 ring-[#ecd58b]">
          <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-[#fff1e5] text-[#d9670f]"><Server className="h-3.5 w-3.5" /></span>
          <span className="flex-1 font-medium">AWS<span className="block text-[11.5px] font-normal text-ink/45">Software · now</span></span>
          <b className="font-semibold">₹38,400</b>
        </div>
        <div className="flex items-center gap-2.5 rounded-[10px] p-2.5 ring-1 ring-black/[0.06]">
          <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-[#f1ecff] text-[#6b4de6]"><Receipt className="h-3.5 w-3.5" /></span>
          <span className="flex-1 font-medium">Figma<span className="block text-[11.5px] font-normal text-ink/45">Software · yesterday</span></span>
          <b className="font-semibold">₹3,100</b>
        </div>
        <p className="mt-auto text-ink/55">Burn this month rose to <b className="font-semibold text-ink">₹4.6L</b>.</p>
      </>
    );
  if (ch === 2)
    return (
      <>
        <p className="text-[13px] font-semibold">Runway</p>
        <p className="text-[28px] font-semibold leading-none tracking-[-0.04em]">16.4 <span className="text-[14px] font-medium text-ink/45">months</span></p>
        <svg viewBox="0 0 200 70" className="w-full" aria-hidden="true">
          <path d="M0 8 C60 14 110 30 150 50 S190 66 200 68" fill="none" stroke="#111" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.3" />
          <motion.path
            d="M0 8 C50 18 90 36 130 54 S180 68 190 70"
            fill="none"
            stroke="#111"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease }}
          />
        </svg>
        <p className="mt-auto text-[12.5px] text-ink/50">Cash out moves to <b className="font-semibold text-ink">Feb 2028</b></p>
      </>
    );
  const answer = "Burn rose 9% from the AWS bill. Reserved instances could save ₹9k/mo and win back 0.4 months.";
  return (
    <>
      <p className="flex items-center gap-1.5 text-[13px] font-semibold"><Sparkles className="h-3.5 w-3.5" /> AI CFO</p>
      <p className="ml-auto max-w-[85%] rounded-[14px] rounded-br-[4px] bg-ink px-3 py-1.5 text-[12.5px] text-white">Why did runway drop?</p>
      {t > 600 && (
        <p className="max-w-[92%] rounded-[14px] rounded-bl-[4px] bg-[#f4f4f2] px-3 py-1.5 text-[12.5px] leading-snug">
          {answer.slice(0, Math.floor((t - 600) / 22))}
        </p>
      )}
      <p className="mt-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-ink/40 ring-1 ring-black/[0.08]">
        <Sparkles className="h-3 w-3" /> Ask about your numbers…
      </p>
    </>
  );
}

function Field({ label, value, caret }: { label: string; value: string; caret?: boolean }) {
  return (
    <div className="rounded-[9px] px-2.5 py-1.5 ring-1 ring-black/[0.08]">
      <p className="text-[11.5px] text-ink/45">{label}</p>
      <p className="h-4 text-[13.5px] font-medium">
        {value}
        {caret && <span className="ml-px inline-block h-3 w-px animate-pulse bg-ink align-middle" />}
      </p>
    </div>
  );
}
