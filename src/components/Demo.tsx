"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Bot, Pause, Play, Plus, Server, Sparkles } from "lucide-react";
import { Bars, FloatCard, HandNote, PhoneMockup, Status } from "./Mockups";

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
  { burn: "₹4.2L", runway: "18.0", bar: 56 },
  { burn: "₹4.6L", runway: "18.0", bar: 72 },
  { burn: "₹4.6L", runway: "16.4", bar: 72 },
  { burn: "₹4.6L", runway: "16.4", bar: 72 },
];

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

const fmt = (ms: number) => `0:${String(Math.floor(ms / 1000)).padStart(2, "0")}`;

export default function DemoPlayer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  // Auto-play unless the user prefers reduced motion; their toggle wins after that
  const reduced = useReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reduced;
  const setPlaying = (f: (p: boolean) => boolean) => setChoice(f(playing));

  const [t, setT] = useClock(playing && inView);
  const ch = Math.max(0, Math.min(CHAPTERS.length - 1, Math.floor(t / CHAPTER_MS) || 0));
  const k = KPI[ch];

  return (
    <div ref={ref} className="relative md:pr-32">
      {/* Desktop "recording" */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)] md:-rotate-1">
        <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6159]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c941]" />
          <span className="ml-4 rounded-md bg-paper px-3 py-0.5 text-[11px] text-ink/45">app.runwayx.com</span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-[#e5484d]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e5484d]" /> Demo
          </span>
        </div>

        <div className="relative grid aspect-[16/10] grid-cols-[1fr] text-ink sm:grid-cols-[150px_1fr]">
          <aside className="hidden space-y-1 border-r border-line bg-[#fafaf8] p-4 text-[12px] text-ink/55 sm:block">
            <p className="mb-4 font-semibold text-ink">RunwayX</p>
            {["Expenses", "Overview", "Runway", "AI CFO"].map((x, i) => (
              <p
                key={x}
                className={`rounded-md px-2 py-1.5 transition-colors duration-300 ${
                  i === ch ? "bg-white font-medium text-ink shadow-sm" : ""
                }`}
              >
                {x}
              </p>
            ))}
          </aside>

          <div className="flex min-w-0 flex-col gap-3 p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-3">
              <Kpi label="Runway" value={`${k.runway} mo`} hot={ch === 2} accent />
              <Kpi label="Monthly burn" value={k.burn} hot={ch === 1} />
              <Kpi label="Funds left" value={ch === 0 ? "₹75.6L" : "₹75.2L"} hot={ch === 1} />
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr]">
              <div className="flex min-h-0 flex-col rounded-xl border border-line p-3">
                <p className="text-[11px] text-ink/50">Burn, last 12 months</p>
                <Bars className="mt-3 flex-1" count={12} last={k.bar} />
              </div>
              <div className="relative hidden min-h-0 overflow-hidden rounded-xl border border-line p-3 lg:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={ch}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease }}
                    className="flex h-full flex-col gap-2 text-[12px]"
                  >
                    <Panel ch={ch} t={t % CHAPTER_MS} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Player controls */}
        <div className="flex items-center gap-3 border-t border-line bg-[#fafaf8] px-4 py-2.5">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause demo" : "Play demo"}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-ink/80"
          >
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 translate-x-px" />}
          </button>
          <div className="flex flex-1 gap-1">
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
                  <span className={`hidden truncate text-[11px] sm:block ${i === ch ? "text-ink" : "text-ink/40 group-hover:text-ink/70"}`}>{c}</span>
                </button>
              );
            })}
          </div>
          <span className="shrink-0 font-mono text-[11px] text-ink/45">
            {fmt(t)} / {fmt(TOTAL)}
          </span>
        </div>
      </div>

      {/* Phone in sync */}
      <motion.div
        className="absolute -bottom-12 right-0 hidden w-[210px] md:block"
        initial={{ rotate: 0, y: 40 }}
        whileInView={{ rotate: 7, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease }}
      >
        <PhoneMockup bare label="RunwayX mobile app, synced with the dashboard">
          <div className="flex h-full flex-col gap-2.5 px-3.5 text-ink">
            <Status />
            <p className="pt-1 text-[10px] text-ink/50">Good morning, Aisha</p>
            <div className="rounded-2xl bg-ink p-3.5 text-white">
              <p className="text-[9px] uppercase tracking-wider text-white/50">Runway</p>
              <p className="font-serif text-[34px] italic leading-none">{k.runway} mo</p>
              <p className={`mt-1 text-[9px] ${ch >= 2 ? "text-[#ffb36b]" : "text-[#9be15d]"}`}>
                {ch >= 2 ? "−1.6 mo after AWS bill" : "+2 mo vs last month"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <p className="text-[8px] text-ink/50">Burn / mo</p>
                <p className="text-[14px] font-semibold">{k.burn}</p>
              </div>
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <p className="text-[8px] text-ink/50">Last expense</p>
                <p className="text-[14px] font-semibold">{ch === 0 ? "—" : "₹38.4k"}</p>
              </div>
            </div>
            <div className="flex h-24 flex-col rounded-xl bg-white p-2.5 shadow-sm">
              <p className="text-[8px] text-ink/50">Monthly burn</p>
              <Bars className="mt-2 flex-1" last={k.bar} />
            </div>
          </div>
        </PhoneMockup>
        <FloatCard className="-left-24 top-28 -rotate-6">
          <p className="text-ink/50">Synced</p>
          <p className="text-[14px] font-semibold text-leaf">just now</p>
        </FloatCard>
      </motion.div>
      {/* Sits in the empty column above the phone and points straight down at it */}
      <HandNote className="right-0 top-[64px] hidden w-[122px] text-right md:block" arrow="down">
        {"same numbers,"}
        <br />
        {"everywhere"}
      </HandNote>
    </div>
  );
}

function Kpi({ label, value, hot, accent }: { label: string; value: string; hot?: boolean; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 transition-colors duration-500 ${hot ? "border-ink/30 bg-[#fffbea]" : "border-line"}`}>
      <p className="text-[11px] text-ink/50">{label}</p>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={value}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.35, ease }}
          className={`mt-1 text-lg font-semibold tracking-tight sm:text-xl ${accent ? "text-leaf" : ""}`}
        >
          {value}
        </motion.p>
      </AnimatePresence>
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
        <p className="flex items-center gap-1.5 font-semibold"><Plus className="h-3.5 w-3.5" /> New expense</p>
        <Field label="Vendor" value={typed} caret={!amount} />
        <Field label="Amount" value={amount ? `₹${amount}` : ""} caret={!!amount && !saved} />
        <Field label="Category" value={t > 1800 ? "Software" : ""} />
        <span className={`mt-auto rounded-lg py-1.5 text-center text-[11px] font-semibold transition-colors ${saved ? "bg-leaf text-white" : "bg-ink text-white"}`}>
          {saved ? "Saved ✓" : "Save expense"}
        </span>
      </>
    );
  }
  if (ch === 1)
    return (
      <>
        <p className="font-semibold">Recent</p>
        <div className="flex items-center gap-2 rounded-lg bg-[#fffbea] p-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white"><Server className="h-3 w-3" /></span>
          <span className="flex-1">AWS<span className="block text-[10px] text-ink/45">Software · now</span></span>
          <b>₹38,400</b>
        </div>
        <p className="text-ink/55">Burn this month rose to <b className="text-ink">₹4.6L</b>.</p>
      </>
    );
  if (ch === 2)
    return (
      <>
        <p className="font-semibold">Runway</p>
        <p className="font-serif text-[30px] italic leading-none">16.4 months</p>
        <svg viewBox="0 0 200 70" className="w-full" aria-hidden="true">
          <path d="M0 8 C60 14 110 30 150 50 S190 66 200 68" fill="none" stroke="#111" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
          <motion.path
            d="M0 8 C50 18 90 36 130 54 S180 68 190 70"
            fill="none"
            stroke="#111"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease }}
          />
        </svg>
        <p className="text-[11px] text-ink/50">Cash out: Feb 2028</p>
      </>
    );
  const answer = "Burn rose 9% from the AWS bill. Reserved instances could save ₹9k/mo and win back 0.4 months.";
  return (
    <>
      <p className="flex items-center gap-1.5 font-semibold"><Bot className="h-3.5 w-3.5" /> AI CFO</p>
      <p className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-ink px-2.5 py-1.5 text-[11px] text-white">Why did runway drop?</p>
      {t > 600 && (
        <p className="max-w-[92%] rounded-xl rounded-bl-sm bg-paper px-2.5 py-1.5 text-[11px] leading-snug">
          {answer.slice(0, Math.floor((t - 600) / 22))}
        </p>
      )}
      <p className="mt-auto flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-[10px] text-ink/40">
        <Sparkles className="h-3 w-3" /> Ask about your numbers…
      </p>
    </>
  );
}

function Field({ label, value, caret }: { label: string; value: string; caret?: boolean }) {
  return (
    <div className="rounded-lg border border-line px-2.5 py-1.5">
      <p className="text-[10px] text-ink/45">{label}</p>
      <p className="h-4 text-[12px] font-medium">
        {value}
        {caret && <span className="ml-px inline-block h-3 w-px animate-pulse bg-ink align-middle" />}
      </p>
    </div>
  );
}
