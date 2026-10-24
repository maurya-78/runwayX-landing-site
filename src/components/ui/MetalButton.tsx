"use client";

/**
 * Metal Button (cult-ui, https://www.cult-ui.com/docs/components/metal-button)
 * adapted for this project: the cult-ui version wraps a shadcn `Button`; this
 * one wraps a Next.js `Link` directly, since the site doesn't use shadcn.
 * The liquid metal ring comes from `metal-fx` (MIT, Jakub Antalík).
 *
 * The fill lives on the MetalFx wrapper and the link stays transparent, so the
 * animated ring stays visible around it. The ring freezes for users who ask
 * for reduced motion.
 *
 * MetalFx decides between its WebGL tree and a plain fallback during render
 * (WebGL2 is never "supported" on the server), so it must only mount on the
 * client. Until then a static pill with the same size and look is rendered,
 * which keeps server and client HTML identical and avoids a layout shift.
 */
import { useSyncExternalStore, type ComponentProps, type CSSProperties } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { MetalFx, type MetalFxPreset, type MetalFxTheme } from "metal-fx";

/*
 * Workaround for a metal-fx 2.0.11 bug that freezes the ring.
 * When the last instance unmounts, metal-fx tears down its shared WebGL
 * renderer and calls WEBGL_lose_context.loseContext(). The resulting
 * "webglcontextlost" event fires asynchronously, and its handler flags
 * whichever renderer is current, which by then is the *new* one created by
 * the immediate remount (React Strict Mode in dev, or navigating away and
 * back). A renderer flagged as lost stops its animation loop after one frame.
 * Hiding WEBGL_lose_context from metal-fx's teardown means the old context is
 * simply released by GC instead, so the new renderer is never flagged.
 * Only that one extension name is affected; this site has no other WebGL code.
 */
if (typeof window !== "undefined" && typeof WebGL2RenderingContext !== "undefined") {
  const proto = WebGL2RenderingContext.prototype as WebGL2RenderingContext & { __noLoseContext?: true };
  if (!proto.__noLoseContext) {
    const getExtension = proto.getExtension;
    proto.getExtension = function (this: WebGL2RenderingContext, name: string) {
      return name === "WEBGL_lose_context" ? null : getExtension.call(this, name);
    } as typeof proto.getExtension;
    proto.__noLoseContext = true;
  }
}

type MetalButtonProps = ComponentProps<typeof Link> & {
  preset?: MetalFxPreset;
  theme?: MetalFxTheme;
  /** 0..1, scales shader opacity and glow */
  strength?: number;
  /** Ring thickness in CSS px */
  ringCssPx?: number;
  /** Classes for the MetalFx wrapper (surface fill, shadow) */
  metalFxClassName?: string;
  metalFxStyle?: CSSProperties;
};

const noopSubscribe = () => () => {};
/** false during SSR and hydration, true once running in the browser */
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

// Shared by the static placeholder and the live wrapper so both look the same.
// The inset hairline keeps a stable edge above the shader, like cult-ui's version.
const SHELL =
  "relative isolate inline-flex w-fit min-w-0 flex-col items-stretch rounded-full leading-none transition-colors before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-1 before:ring-inset before:ring-white/15";

export function MetalButton({
  preset = "chromatic",
  theme = "dark",
  strength = 1,
  ringCssPx = 2,
  metalFxClassName = "",
  metalFxStyle,
  className = "",
  ...linkProps
}: MetalButtonProps) {
  const isClient = useIsClient();
  const reduceMotion = useReducedMotion();

  const link = (
    <Link
      {...linkProps}
      className={`relative z-20 inline-flex items-center justify-center gap-2 rounded-full border-0 bg-transparent whitespace-nowrap shadow-none outline-offset-4 focus-visible:outline-2 ${className}`}
    />
  );

  if (!isClient) {
    return (
      <div className={`${SHELL} ${metalFxClassName}`} style={metalFxStyle}>
        {link}
      </div>
    );
  }

  return (
    <MetalFx
      preset={preset}
      theme={theme}
      strength={strength}
      ringCssPx={ringCssPx}
      innerShadow
      paused={!!reduceMotion}
      variant="button"
      className={`${SHELL} overflow-visible! ${metalFxClassName}`}
      style={metalFxStyle}
    >
      {link}
    </MetalFx>
  );
}
