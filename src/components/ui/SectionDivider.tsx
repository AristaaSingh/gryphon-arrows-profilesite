"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

const FADE_MASK_TOP =
  "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)";
const FADE_MASK_BOTTOM =
  "linear-gradient(to top, black 0%, black 35%, transparent 100%)";
const EDGE_MASK =
  "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)";

/**
 * Soft top edge for a section whose content (e.g. a full-bleed photo) would
 * otherwise start with a hard cut: a blurred fade up out of black, plus
 * drafting-style detail — a ruler row of tick marks, a red hairline that
 * draws out from the centre, and a registration crosshair at the midline.
 * Absolutely positioned; put it first inside a `relative` section.
 */
export default function SectionDivider({
  label = "Ref. 03.A",
  edge = "top",
  className = "",
  heightClass = "h-40 sm:h-48",
}: {
  label?: string;
  edge?: "top" | "bottom";
  className?: string;
  heightClass?: string;
}) {
  const bottom = edge === "bottom";
  const FADE_MASK = bottom ? FADE_MASK_BOTTOM : FADE_MASK_TOP;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 z-20 ${heightClass} ${bottom ? "bottom-0" : "top-0"} ${className}`}
    >
      {/* Blur that eases off toward the bottom, so the photo sharpens as it
          gets further from the edge instead of starting with a hard cut. */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
      />
      {/* Fade up out of the page's black. */}
      <div
        className={`absolute inset-0 ${bottom ? "bg-gradient-to-t" : "bg-gradient-to-b"} from-black via-black/70 to-transparent`}
      />

      {/* Ruler: small ticks every 12px, tall red ticks every 60px. */}
      <motion.div
        className={`absolute inset-x-0 ${bottom ? "bottom-0" : "top-0"}`}
        style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div
          className="h-1.5 w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0 1px, transparent 1px 12px)",
          }}
        />
        <div
          className="-mt-1.5 h-3 w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,0,44,0.85) 0 1px, transparent 1px 60px)",
          }}
        />
      </motion.div>

      {/* Red hairline drawing out from the centre. */}
      <motion.div
        className={`absolute inset-x-0 h-px ${bottom ? "bottom-0" : "top-0"}`}
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-brand-red) 20%, var(--color-brand-red) 80%, transparent)",
          transformOrigin: "center",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1.1, ease: EASE_OUT }}
      />

      {/* Registration crosshair on the midline, where the two columns meet. */}
      <motion.div
        className={`absolute left-1/2 hidden -translate-x-1/2 md:block ${bottom ? "bottom-0 -scale-y-100" : "top-0"}`}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -6 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <span className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-brand-red" />
        <span className="absolute left-1/2 top-3 h-px w-5 -translate-x-1/2 bg-brand-red" />
        <span className="absolute left-1/2 top-3 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-red" />
      </motion.div>

      <motion.span
        className={`absolute right-6 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:right-10 ${bottom ? "bottom-4" : "top-4"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        {label}
      </motion.span>
    </div>
  );
}
