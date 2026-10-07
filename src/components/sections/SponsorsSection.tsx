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
import TargetLockLayer from "@/components/ui/TargetLockLayer";
import { SHEET_TOTAL } from "@/content/sections";
import { useSponsorLocks } from "@/components/sections/useSponsorLocks";

// ── EDIT HERE ───────────────────────────────────────────────
// To add a sponsor: drop the logo into public/sponsors/ and add a line.
// Logos sit on a white card, so a PNG/WebP with a transparent (or white)
// background works.
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
  // Which cards are target-locked (mouse cursor, intro, touch loop).
  const listRef = useRef<HTMLUListElement>(null);
  const { locked, lockOnly, tap, focusCard } = useSponsorLocks(
    inView,
    SPONSORS.length,
  );

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
            ref={listRef}
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="flex flex-wrap items-center justify-center gap-6 px-6 py-8 sm:gap-10 sm:py-10 xl:px-48 [@media(hover:hover)_and_(pointer:fine)]:cursor-none"
          >
            {SPONSORS.map((s, i) => (
              <motion.li
                key={s.name}
                data-target-name={s.name}
                data-locked={locked.includes(i)}
                variants={card}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                onClick={() => tap(i)}
                // Keyboard users can tab to each card; focus shows the same
                // target-lock look as hovering it.
                tabIndex={0}
                onFocus={(e) =>
                  focusCard(
                    e.currentTarget.matches(":focus-visible") ? i : null,
                  )
                }
                onBlur={() => focusCard(null)}
                className="target-card no-focus-ring group relative w-full max-w-sm overflow-hidden rounded-xl border border-white/20 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-500 data-[locked=true]:border-brand-red data-[locked=true]:shadow-[0_0_50px_rgba(255,0,44,0.45)] sm:w-[calc(50%-1.25rem)] sm:max-w-none lg:w-[calc(33.333%-1.667rem)]"
              >
                {/* White card behind each logo. "Target lock": when a card is
                    locked, red corner brackets snap in around the logo and the
                    card glows red. Styles live in globals.css under .target-*. */}
                <span
                  aria-hidden="true"
                  className="target-bracket target-bracket--tl"
                />
                <span
                  aria-hidden="true"
                  className="target-bracket target-bracket--tr"
                />
                <span
                  aria-hidden="true"
                  className="target-bracket target-bracket--bl"
                />
                <span
                  aria-hidden="true"
                  className="target-bracket target-bracket--br"
                />
                <div className="relative flex h-24 items-center justify-center">
                  <Image
                    src={s.src}
                    alt={s.name}
                    width={s.width}
                    height={s.height}
                    className="h-full w-full object-contain transition-transform duration-500 group-data-[locked=true]:scale-[1.04]"
                  />
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <TargetLockLayer
            containerRef={listRef}
            itemSelector="li"
            onLock={lockOnly}
          />
        </motion.div>
      </div>
    </div>
  );
}
