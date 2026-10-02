"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";

const SPONSORS = [
  { name: "Menapia", src: "/sponsors/menapia.webp", width: 2500, height: 1109 },
  { name: "SimScale", src: "/sponsors/SimScale-logo.png", width: 600, height: 155 },
];

const RED = "#ff002c";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 1.1 } },
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

/** One half of an engineering dimension line: a rule that draws outward
 *  from the title, with an arrowhead and an extension tick at its end. */
function DimLine({ side, inView }: { side: "left" | "right"; inView: boolean }) {
  const left = side === "left";
  return (
    <div className="relative h-4 flex-1">
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px"
        style={{ background: RED, transformOrigin: left ? "right center" : "left center" }}
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

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-3.5 w-3.5 ${className}`}
      style={{ borderColor: `${RED}b3` }}
    />
  );
}

export default function SponsorsRibbon() {
  // Watched on the flat wrapper, not the card: while the card is folded
  // edge-on (rotateY ~95deg) it has almost no visible area, so observing
  // the card itself would never fire and it would stay folded forever.
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.25 });

  return (
    <div ref={wrapRef} className="relative w-full" style={{ perspective: 1800 }}>
      {/* Full-width card that unfolds like a door hinged on its left edge. */}
      <motion.div
        initial={{ opacity: 0, rotateY: -95 }}
        animate={inView ? { opacity: 1, rotateY: 0 } : { opacity: 0, rotateY: -95 }}
        transition={{ type: "spring", stiffness: 55, damping: 15, mass: 1.1 }}
        style={{
          transformOrigin: "left center",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
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
            Sheet 2/3
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
  );
}
