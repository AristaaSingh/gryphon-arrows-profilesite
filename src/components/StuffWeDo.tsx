"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

interface Item {
  num: string;
  title: string;
  text?: string;
  points?: string[];
}

const STUFF: Item[] = [
  {
    num: "01",
    title: "Year-round build",
    text: "We work towards the IMechE UAS Challenge all year.",
  },
  {
    num: "02",
    title: "The fun side",
    text: "Collaborate with people across disciplines, and come along to our fun socials!",
  },
];

const EXPERIENCE: Item[] = [
  {
    num: "01",
    title: "People skills",
    points: ["Teamwork", "Leadership & Responsibility", "Communication", "Project & Time Management"],
  },
  {
    num: "02",
    title: "Engineering skills",
    points: [
      "Practical Design",
      "Testing & Problem Solving",
      "Multidisciplinary engineering",
      "Engineering Design Lifecycle",
    ],
  },
];

const RED = "#ff002c";

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

/** One drawing-sheet strip split down the middle: 4.01 left, 4.02 right. */
function Half({
  sub,
  title,
  items,
  className = "",
}: {
  sub: string;
  title: string;
  items: Item[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-5 flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: RED }}>
          {sub}
        </span>
        <h3 className="font-display text-xl uppercase tracking-[0.15em] text-white sm:text-2xl">
          {title}
        </h3>
      </div>
      <motion.ul variants={container} className="space-y-5">
        {items.map((item) => (
          <motion.li
            key={item.num}
            variants={card}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="group relative overflow-hidden rounded-xl border border-white/15 bg-black/60 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] transition-colors hover:border-[#ff002c]/60"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
            />
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              <span style={{ color: RED }}>{item.num}</span>
              <span className="h-px flex-1 bg-white/15" />
            </div>
            <h4 className="mt-4 font-display text-lg text-zinc-100 sm:text-xl">{item.title}</h4>
            {item.text && (
              <p className="mt-3 font-body text-base leading-relaxed text-zinc-300">{item.text}</p>
            )}
            {item.points && (
              <ul className="mt-4 space-y-2 font-body text-base text-zinc-300">
                {item.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3">
                    <span className="mt-2.5 h-px w-4 shrink-0" style={{ background: RED }} />
                    {pt}
                  </li>
                ))}
              </ul>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export default function StuffWeDo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.25 });

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden">
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

        <div className="flex h-14 items-center gap-4 border-b border-white/10 bg-black/40 px-6 sm:h-16 sm:px-10">
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

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 px-6 py-8 sm:py-10 md:grid-cols-2 xl:pl-56 xl:pr-40"
        >
          <Half sub="4.01" title="Stuff We Do" items={STUFF} className="md:pr-8 xl:pr-12" />
          <Half
            sub="4.02"
            title="Experience You Gain"
            items={EXPERIENCE}
            className="mt-10 border-white/15 md:mt-0 md:border-l md:border-dashed md:pl-8 xl:pl-12"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
