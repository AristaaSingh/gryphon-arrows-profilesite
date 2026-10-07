"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { SHEET_TOTAL } from "@/content/sections";
import { EASE_OUT } from "@/lib/motion";

/** Shared bits of the "engineering drawing sheet" look used by the sponsors
 *  and offer strips (and the logo panel on mobile). */

export const RED = "var(--color-brand-red)";

/** Faint blueprint grid, applied as an inline style on a panel. */
export const BLUEPRINT_GRID: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

/** One half of an engineering dimension line: a rule that draws outward
 *  from the title, with an arrowhead and an extension tick at its end. */
export function DimLine({
  side,
  inView,
}: {
  side: "left" | "right";
  inView: boolean;
}) {
  const left = side === "left";
  return (
    <div className="relative h-4 flex-1">
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px"
        style={{
          background: RED,
          transformOrigin: left ? "right center" : "left center",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: EASE_OUT }}
      />
      <motion.div
        className={`absolute top-0 h-4 w-px ${left ? "left-0" : "right-0"}`}
        style={{ background: RED }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ delay: 1.3, duration: 0.3 }}
      />
      <motion.span
        className={`absolute top-1/2 -translate-y-1/2 border-y-4 border-y-transparent ${
          left ? "left-0 border-r-8" : "right-0 border-l-8"
        }`}
        style={left ? { borderRightColor: RED } : { borderLeftColor: RED }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ delay: 1.3, duration: 0.3 }}
      />
    </div>
  );
}

/** Red corner bracket; position it with className, e.g. "left-3 top-3 border-l border-t". */
export function Corner({
  className,
  color = `color-mix(in srgb, ${RED} 70%, transparent)`,
}: {
  className: string;
  /** Border colour; defaults to translucent red. */
  color?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-3.5 w-3.5 ${className}`}
      style={{ borderColor: color }}
    />
  );
}

/** "Sec. 02 ── Sheet 2/5" row for phones, where the strip's title bar has no
 *  room for those labels. Hidden from `sm` up (the title bar shows them). */
export function MobileSheetRow({ sec, sheet }: { sec: string; sheet: number }) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-3 px-8 pb-1 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:hidden"
    >
      <span>Sec. {sec}</span>
      <span
        className="h-px flex-1"
        style={{ background: `color-mix(in srgb, ${RED} 60%, transparent)` }}
      />
      <span>
        Sheet {sheet}/{SHEET_TOTAL}
      </span>
    </div>
  );
}
