"use client";

import { useEffect, useRef, useState } from "react";
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

// Touch-screen timing (ms). The cards start fading in about 900ms after the
// strip appears; each is roughly halfway into place ~100ms later, which is
// when its lock fires.
const INTRO_START_MS = 1000;
const INTRO_STEP_MS = 180; // matches the cards' fade-in stagger, so each locks as it arrives
const INTRO_HOLD_MS = 700; // how long all three stay locked before the loop starts
const IDLE_MS = 1600; // gap between locks once the intro is done

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
  // Which cards are "target locked": the mouse target cursor locks one at a
  // time; the touch intro below keeps several locked together.
  const listRef = useRef<HTMLUListElement>(null);
  const [locked, setLocked] = useState<number[]>([]);
  const lockOnly = (i: number | null) => setLocked(i === null ? [] : [i]);

  // Touch screens have no cursor, so they get a timed sequence instead:
  //  1. intro: each card locks as it is about halfway into place, and the
  //     locks pile up so you can see all of them as the cards appear,
  //  2. then they release and the cards take turns locking on a loop (idle).
  // Tapping a card locks it and carries on from the next one.
  const nextRef = useRef(0);
  const tappedRef = useRef(false);
  const [cycleKey, setCycleKey] = useState(0);
  useEffect(() => {
    if (!inView || !window.matchMedia("(hover: none)").matches) return;
    const fromTap = tappedRef.current;
    tappedRef.current = false;
    const timers: number[] = [];

    const step = () => {
      const i = nextRef.current % SPONSORS.length;
      setLocked([i]);
      nextRef.current = i + 1;
    };

    let idleStart = IDLE_MS; // after a tap: let the tapped card sit a beat
    if (!fromTap) {
      nextRef.current = 0;
      // Start clean: drop whatever was locked the last time the strip was on screen.
      timers.push(window.setTimeout(() => setLocked([]), 0));
      SPONSORS.forEach((_, i) => {
        timers.push(
          window.setTimeout(
            () => setLocked((prev) => [...prev, i]),
            INTRO_START_MS + i * INTRO_STEP_MS,
          ),
        );
      });
      const lastLock = INTRO_START_MS + (SPONSORS.length - 1) * INTRO_STEP_MS;
      // Let the full set of locks show for a moment, then release them all.
      timers.push(
        window.setTimeout(() => setLocked([]), lastLock + INTRO_HOLD_MS),
      );
      idleStart = lastLock + INTRO_HOLD_MS + 500;
    }
    timers.push(
      window.setTimeout(() => {
        step();
        timers.push(window.setInterval(step, IDLE_MS));
      }, idleStart),
    );
    return () => {
      timers.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    };
  }, [inView, cycleKey]);

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
                data-locked={inView && locked.includes(i)}
                variants={card}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                onClick={() => {
                  // Touch: lock the tapped card, then carry on from the next.
                  if (window.matchMedia("(hover: none)").matches) {
                    nextRef.current = i + 1;
                    tappedRef.current = true;
                    setLocked([i]);
                    setCycleKey((k) => k + 1);
                  }
                }}
                className="target-card group relative w-full max-w-sm overflow-hidden rounded-xl border border-white/15 bg-white/[0.03] p-6 transition-[border-color,box-shadow] duration-500 data-[locked=true]:border-[#ff002c]/70 data-[locked=true]:shadow-[0_0_50px_rgba(255,0,44,0.3)] sm:w-[calc(50%-1.25rem)] sm:max-w-none lg:w-[calc(33.333%-1.667rem)]"
              >
                {/* "Target lock": on hover (or, on touch screens, all the
                    time) red corner brackets snap in around the logo, the
                    grid lights up. Styles live in
                    globals.css under .target-*. Logos keep their real colours;
                    a thin white outline keeps dark logos readable on black. */}
                <span aria-hidden="true" className="target-grid" />
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
                    className="h-full w-full object-contain transition-transform duration-500 [filter:drop-shadow(1.5px_0_0_#fff)_drop-shadow(-1.5px_0_0_#fff)_drop-shadow(0_1.5px_0_#fff)_drop-shadow(0_-1.5px_0_#fff)_drop-shadow(0_0_12px_rgba(255,255,255,0.3))] group-data-[locked=true]:scale-[1.04]"
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
