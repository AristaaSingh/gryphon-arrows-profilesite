"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

/**
 * Left half of The Challenge: the UAS Challenge logo on a blueprint panel.
 * The logo's text is dark maroon, so it sits on a white card (same idea as
 * the sponsor cards) instead of directly on the black page. The card slides
 * in from the left; the caption follows. Watched on the outer wrapper (not
 * the card) so the observer still fires while the card is offscreen.
 */
export default function ChallengeLogo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative flex min-h-[22rem] items-center justify-center overflow-hidden border-r border-dashed border-white/25 bg-zinc-950 px-6 py-16 md:min-h-full xl:pl-56 xl:pr-12"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <div className="flex w-full max-w-sm flex-col items-center">
        <motion.div
          initial={{ x: -140, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: -140, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-xl bg-white p-8 shadow-[0_0_80px_rgba(255,0,44,0.2)] ring-1 ring-white/20 sm:p-10"
        >
          <Image
            src="/challenge/uas-challenge-logo.png"
            alt="IMechE UAS Challenge logo"
            width={465}
            height={281}
            className="h-auto w-full"
          />
        </motion.div>
        <motion.p
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: inView ? 0.6 : 0 }}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500"
        >
          Fig. 05 — IMechE UAS Challenge
        </motion.p>
      </div>
    </div>
  );
}
