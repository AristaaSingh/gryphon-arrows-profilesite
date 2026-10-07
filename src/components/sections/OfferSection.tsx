"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  BLUEPRINT_GRID,
  Corner,
  DimLine,
  MobileSheetRow,
  RED,
} from "@/components/ui/DrawingSheet";
import { SHEET_TOTAL } from "@/content/sections";

interface Item {
  tag: string;
  group: string;
  title: string;
  text?: string;
  points?: string[];
  side: "left" | "right";
}

// ── EDIT HERE ───────────────────────────────────────────────
// Zig-zag order: 4.01a left, 4.02a right, 4.01b left, 4.02b right.
// `text` is a sentence; `points` is a bullet list (use one or the other).
const ITEMS: Item[] = [
  {
    tag: "4.01a",
    group: "Stuff We Do",
    title: "Year-round build",
    text: "We work towards the IMechE UAS Challenge all year.",
    side: "left",
  },
  {
    tag: "4.02a",
    group: "Experience You Gain",
    title: "People skills",
    points: [
      "Teamwork",
      "Leadership & Responsibility",
      "Communication",
      "Project & Time Management",
    ],
    side: "right",
  },
  {
    tag: "4.01b",
    group: "Stuff We Do",
    title: "The fun side",
    text: "Collaborate with people across disciplines, and come along to our fun socials!",
    side: "left",
  },
  {
    tag: "4.02b",
    group: "Experience You Gain",
    title: "Engineering skills",
    points: [
      "Practical Design",
      "Testing & Problem Solving",
      "Multidisciplinary engineering",
      "Engineering Design Lifecycle",
    ],
    side: "right",
  },
]; // ────────────────────────────────────────────────────────────

/** A card whose slide-in is tied to scroll position: it travels in from its
 *  own side as it rises through the viewport, and reverses on the way back. */
function ZigCard({ item }: { item: Item }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 100%", "start 55%"],
  });
  const dir = item.side === "left" ? -1 : 1;
  const x = useTransform(scrollYProgress, [0, 1], [dir * 80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const right = item.side === "right";

  return (
    <li ref={ref} className="relative md:grid md:grid-cols-2">
      <motion.div
        style={{ x, opacity }}
        // Focusable so keyboard users can reach each card; focus looks
        // the same as hover (red border and glow: see .offer-card).
        tabIndex={0}
        role="group"
        aria-label={`${item.group}: ${item.title}`}
        className={`offer-card no-focus-ring transform-gpu will-change-transform group relative rounded-xl border border-white/15 bg-black/60 p-4 md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] sm:p-8 md:mx-0 ${
          right ? "md:col-start-2 md:ml-10" : "md:mr-10"
        }`}
      >
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          <span style={{ color: RED }}>{item.tag}</span>
          <span>{item.group}</span>
          <span className="h-px flex-1 bg-white/15" />
        </div>
        <h3 className="mt-3 font-display text-lg text-zinc-100 sm:mt-5 sm:text-3xl">
          {item.title}
        </h3>
        {item.text && (
          <p className="mt-2 font-body text-sm leading-relaxed sm:mt-4 sm:text-lg text-zinc-300">
            {item.text}
          </p>
        )}
        {item.points && (
          <ul className="mt-3 space-y-1.5 font-body text-sm text-zinc-300 sm:mt-5 sm:space-y-3 sm:text-lg">
            {item.points.map((pt) => (
              <li key={pt} className="flex items-start gap-3">
                <span
                  className="mt-2 h-px w-3 shrink-0 sm:mt-3 sm:w-4"
                  style={{ background: RED }}
                />
                {pt}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
      {/* Node on the centre spine. */}
      <span
        aria-hidden="true"
        className={`absolute top-9 hidden h-2.5 w-2.5 rounded-full border border-brand-red bg-black md:block ${
          right ? "left-1/2 ml-3" : "right-1/2 mr-3"
        }`}
      />
    </li>
  );
}

/** Section 04: "What We Offer" — a zig-zag of scroll-linked cards. */
export default function OfferSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.25 });
  const listRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 60%"],
  });
  const spine = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      id="stuff"
      className="relative scroll-mt-20 bg-black py-24 text-zinc-100 sm:py-32"
    >
      <div className="relative w-full overflow-hidden">
        <div ref={wrapRef}>
          <motion.div
            initial={{ clipPath: "inset(0 0 0 100%)", x: 60 }}
            animate={
              inView
                ? { clipPath: "inset(0 0% 0 0)", x: 0 }
                : { clipPath: "inset(0 0 0 100%)", x: 60 }
            }
            transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
            style={BLUEPRINT_GRID}
            className="relative overflow-hidden border-y border-white/10 bg-zinc-950 shadow-[0_0_80px_rgba(255,0,44,0.18)]"
          >
            <Corner className="left-3 top-3 border-l border-t" />
            <Corner className="right-3 top-3 border-r border-t" />
            <Corner className="bottom-3 left-3 border-b border-l" />
            <Corner className="bottom-3 right-3 border-b border-r" />

            <MobileSheetRow sec="04" sheet={4} />
            <div className="flex h-14 items-center gap-4 bg-black/40 px-6 sm:h-16 sm:px-10">
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:block">
                Sec. 04
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <DimLine side="left" inView={inView} />
                <motion.h2
                  className="whitespace-nowrap font-display text-lg uppercase tracking-[0.3em] text-white sm:text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: inView ? 1 : 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  What We Offer
                </motion.h2>
                <DimLine side="right" inView={inView} />
              </div>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:block">
                Sheet 4/{SHEET_TOTAL}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="relative px-6 pt-8 sm:px-10 sm:pt-14 xl:pl-56 xl:pr-40">
          <ul ref={listRef} className="relative space-y-6 md:space-y-8">
            {/* Spine that draws down as you scroll. */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/10 md:block"
            >
              <motion.div
                className="h-full w-full origin-top"
                style={{ scaleY: spine, background: RED }}
              />
            </div>
            {ITEMS.map((item) => (
              <ZigCard key={item.tag} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
