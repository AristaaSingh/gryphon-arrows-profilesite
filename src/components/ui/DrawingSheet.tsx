"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";

/** Shared bits of the "engineering drawing sheet" look used by the sponsors
 *  and offer strips (and the logo panel on mobile). */

export const RED = "#ff002c";

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
        transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
export function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-3.5 w-3.5 ${className}`}
      style={{ borderColor: `${RED}b3` }}
    />
  );
}
