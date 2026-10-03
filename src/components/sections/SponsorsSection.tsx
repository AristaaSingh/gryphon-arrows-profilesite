"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
import {
  BLUEPRINT_GRID,
  Corner,
  DimLine,
} from "@/components/ui/DrawingSheet";
import { SHEET_TOTAL } from "@/content/sections";

// ── EDIT HERE ───────────────────────────────────────────────
// To add a sponsor: drop the logo into public/sponsors/ and add a line.
const SPONSORS = [
  { name: "Menapia", src: "/sponsors/menapia.webp", width: 2500, height: 1109 },
  {
    name: "SimScale",
    src: "/sponsors/SimScale-logo.png",
    width: 600,
    height: 155,
  },
];
// ────────────────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.9 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 16 },
  },
};

/** Section 02: the sponsors strip. */
export default function SponsorsSection() {
  // Watched on the wrapper, not the card: while the card is fully clipped
  // away it has no visible area, so observing it would never fire.
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.25 });

  return (
    <div
      id="sponsors"
      className="relative bg-black py-24 text-zinc-100 sm:py-32"
    >
      <div ref={wrapRef} className="relative w-full overflow-hidden">
        {/* Full-width card that wipes in from the left: a clip-path reveal
          sweeping left to right while the card slides into place. */}
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)", x: -60 }}
          animate={
            inView
              ? { clipPath: "inset(0 0% 0 0)", x: 0 }
              : { clipPath: "inset(0 100% 0 0)", x: -60 }
          }
          transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
          style={BLUEPRINT_GRID}
          className="relative overflow-hidden border-y border-white/10 bg-zinc-950 shadow-[0_0_80px_rgba(255,0,44,0.18)]"
        >
          <Corner className="left-3 top-3 border-l border-t" />
          <Corner className="right-3 top-3 border-r border-t" />
          <Corner className="bottom-3 left-3 border-b border-l" />
          <Corner className="bottom-3 right-3 border-b border-r" />

          {/* Title strip, styled as an engineering-drawing dimension line. */}
          <div className="flex h-14 items-center gap-4 border-b border-white/10 bg-black/40 px-6 sm:h-16 sm:px-10">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:block">
              Sec. 02
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <DimLine side="left" inView={inView} />
              <motion.span
                className="whitespace-nowrap font-display text-lg uppercase tracking-[0.3em] text-white sm:text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Our Sponsors
              </motion.span>
              <DimLine side="right" inView={inView} />
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:block">
              Sheet 2/{SHEET_TOTAL}
            </span>
          </div>

          <motion.ul
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="flex flex-col items-center justify-center gap-6 px-6 py-8 sm:flex-row sm:gap-10 sm:py-10 xl:px-56"
          >
            {SPONSORS.map((s) => (
              <motion.li
                key={s.name}
                variants={card}
                whileHover={{ y: -8, rotate: 1, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="group relative w-full max-w-sm overflow-hidden rounded-xl bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/20 sm:max-w-none sm:flex-1 sm:basis-0 lg:max-w-xl"
              >
                {/* Diagonal shine that sweeps across on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
                />
                <div className="flex h-24 items-center justify-center">
                  <Image
                    src={s.src}
                    alt={s.name}
                    width={s.width}
                    height={s.height}
                    className="h-full w-full object-contain"
                  />
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
}
