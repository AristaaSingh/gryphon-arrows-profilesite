"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface Item {
  tag: string;
  group: string;
  title: string;
  text?: string;
  points?: string[];
  side: "left" | "right";
}

// Zig-zag order: 4.01a left, 4.02a right, 4.01b left, 4.02b right.
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
    points: ["Teamwork", "Leadership & Responsibility", "Communication", "Project & Time Management"],
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
];

const RED = "#ff002c";

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
        className={`transform-gpu will-change-transform group relative overflow-hidden rounded-xl border border-white/15 bg-black/60 p-4 transition-colors md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] hover:border-[#ff002c]/60 sm:p-8 md:mx-0 ${
          right ? "md:col-start-2 md:ml-10" : "md:mr-10"
        }`}
      >
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          <span style={{ color: RED }}>{item.tag}</span>
          <span>{item.group}</span>
          <span className="h-px flex-1 bg-white/15" />
        </div>
        <h4 className="mt-3 font-display text-lg text-zinc-100 sm:mt-5 sm:text-3xl">{item.title}</h4>
        {item.text && (
          <p className="mt-2 font-body text-sm leading-relaxed sm:mt-4 sm:text-lg text-zinc-300">{item.text}</p>
        )}
        {item.points && (
          <ul className="mt-3 space-y-1.5 font-body text-sm text-zinc-300 sm:mt-5 sm:space-y-3 sm:text-lg">
            {item.points.map((pt) => (
              <li key={pt} className="flex items-start gap-3">
                <span className="mt-2 h-px w-3 shrink-0 sm:mt-3 sm:w-4" style={{ background: RED }} />
                {pt}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
      {/* Node on the centre spine. */}
      <span
        aria-hidden="true"
        className={`absolute top-9 hidden h-2.5 w-2.5 rounded-full border border-[#ff002c] bg-black md:block ${
          right ? "left-1/2 ml-3" : "right-1/2 mr-3"
        }`}
      />
    </li>
  );
}

export default function StuffWeDo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.25 });
  const listRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 60%"],
  });
  const spine = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
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
          style={{
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

          <div className="flex h-14 items-center gap-4 bg-black/40 px-6 sm:h-16 sm:px-10">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:block">
              Sec. 04
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <DimLine side="left" inView={inView} />
              <motion.span
                className="whitespace-nowrap font-display text-lg uppercase tracking-[0.3em] text-white sm:text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                What We Offer
              </motion.span>
              <DimLine side="right" inView={inView} />
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:block">
              Sheet 4/5
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
  );
}
