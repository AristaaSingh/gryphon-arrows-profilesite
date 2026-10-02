"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const SPONSORS = [
  { name: "Menapia", src: "/sponsors/menapia.webp", width: 2500, height: 1109 },
  { name: "SimScale", src: "/sponsors/SimScale-logo.png", width: 600, height: 155 },
];

const MARQUEE_WORD = "Our Sponsors";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 48, rotate: -3, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 16 },
  },
};

function MarqueeRow({ reduceMotion }: { reduceMotion: boolean | null }) {
  // Two identical halves, translated by exactly one half's width, so the
  // loop restarts invisibly.
  const half = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 font-display text-2xl uppercase tracking-[0.25em] text-black sm:text-3xl">
            {MARQUEE_WORD}
          </span>
          <span className="text-xl text-black/70">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden whitespace-nowrap py-3 sm:py-4">
      <motion.div
        className="flex w-max"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {half("a")}
        {half("b")}
      </motion.div>
    </div>
  );
}

export default function SponsorsRibbon() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      {/* The ribbon: a slightly tilted red-to-amber band carrying the
          scrolling "Our Sponsors" marquee, with the cards sitting inside it. */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.92, rotate: -4 }}
        whileInView={{ opacity: 1, scaleX: 1, rotate: -1.5 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
        className="overflow-hidden rounded-sm border border-white/10 bg-zinc-950 shadow-[0_0_80px_rgba(255,0,44,0.18)]"
      >
        <div className="bg-gradient-to-r from-[#ff002c] via-[#ff6a1a] to-[#ffc100]">
          <MarqueeRow reduceMotion={reduceMotion} />
        </div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          className="flex flex-col items-center justify-center gap-8 px-6 py-12 sm:flex-row sm:gap-12 sm:py-16"
        >
          {SPONSORS.map((s) => (
            <motion.li
              key={s.name}
              variants={card}
              whileHover={{ y: -10, rotate: 1.5, scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="group relative w-full max-w-xs overflow-hidden rounded-xl bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/20 sm:w-72"
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
                  className="h-auto max-h-24 w-full object-contain"
                />
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}
