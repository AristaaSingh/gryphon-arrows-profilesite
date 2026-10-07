"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
import {
  BLUEPRINT_GRID,
  Corner,
  DimLine,
  MobileSheetRow,
} from "@/components/ui/DrawingSheet";
import { SHEET_TOTAL } from "@/content/sections";

// ── EDIT HERE ───────────────────────────────────────────────
// To add a sponsor: drop the logo into public/sponsors/ and add a line.
// Use a PNG/WebP with a TRANSPARENT background (a white box around the logo
// would show up as a white block).
const SPONSORS = [
  { name: "Menapia", src: "/sponsors/menapia.webp", width: 2500, height: 1109 },
  {
    name: "SimScale",
    src: "/sponsors/simscale-logo.png",
    width: 600,
    height: 155,
  },
  {
    name: "3DEXPERIENCE SOLIDWORKS",
    src: "/sponsors/solidworks-logo.png",
    width: 1000,
    height: 326,
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
          <MobileSheetRow sec="02" sheet={2} />
          <div className="flex h-14 items-center gap-4 border-b border-white/10 bg-black/40 px-6 sm:h-16 sm:px-10">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:block">
              Sec. 02
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <DimLine side="left" inView={inView} />
              <motion.h2
                className="whitespace-nowrap font-display text-lg uppercase tracking-[0.3em] text-white sm:text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Our Sponsors
              </motion.h2>
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
            className="flex flex-wrap items-center justify-center gap-6 px-6 py-8 sm:gap-10 sm:py-10 xl:px-48"
          >
            {SPONSORS.map((s) => (
              <motion.li
                key={s.name}
                variants={card}
                whileHover={{ y: -8, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="group relative w-full max-w-sm overflow-hidden rounded-xl border border-white/15 bg-white/[0.03] p-6 transition-[border-color,box-shadow] duration-500 hover:border-white/60 hover:shadow-[0_0_50px_rgba(255,0,44,0.35)] sm:w-[calc(50%-1.25rem)] sm:max-w-none lg:w-[calc(33.333%-1.667rem)]"
              >
                {/* Logos keep their real colours. A thin white outline (a
                    "die-cut sticker" edge) keeps dark logos readable on the
                    black page; on hover a white fill wipes in diagonally
                    (bottom left to top right, like the menu buttons) and the
                    outline fades out. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top_right,#ffffff_50%,transparent_50%)] bg-[length:200%_200%] bg-[position:100%_0%] transition-[background-position] duration-500 ease-out group-hover:bg-[position:0%_100%] group-active:bg-[position:0%_100%]"
                />
                <div className="relative flex h-24 items-center justify-center">
                  <Image
                    src={s.src}
                    alt={s.name}
                    width={s.width}
                    height={s.height}
                    className="h-full w-full object-contain transition-[filter] duration-500 [filter:drop-shadow(1.5px_0_0_#fff)_drop-shadow(-1.5px_0_0_#fff)_drop-shadow(0_1.5px_0_#fff)_drop-shadow(0_-1.5px_0_#fff)_drop-shadow(0_0_12px_rgba(255,255,255,0.3))] group-hover:[filter:none] group-active:[filter:none]"
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
