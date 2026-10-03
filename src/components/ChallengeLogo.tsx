"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

/**
 * Left half of The Challenge: the UAS Challenge logo on a blueprint panel,
 * kept clear of the blurred divider along the section's top edge.
 * The logo is transparent and sits straight on the panel (no card). It
 * slides in from the bottom left. Watched on the outer
 * wrapper (not the logo) so the observer still fires while the logo is
 * offscreen.
 */
export default function ChallengeLogo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative flex min-h-[22rem] items-center justify-center overflow-hidden border-r border-dashed border-white/25 bg-zinc-950 md:border-r-0 md:bg-transparent px-6 pb-4 pt-48 sm:pt-56 md:min-h-full md:pt-52 md:items-start md:justify-end md:pb-16 md:pl-16 md:pr-6 xl:pl-56 xl:pr-6"
    >
      {/* Blueprint grid behind the logo on mobile only; on desktop the logo
          floats on the page with no panel or seam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative flex w-full max-w-md flex-col items-center">
        <motion.div
          initial={{ x: -140, y: 120, opacity: 0 }}
          animate={
            inView ? { x: 0, y: 0, opacity: 1 } : { x: -140, y: 120, opacity: 0 }
          }
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <Image
            src="/challenge/uas-challenge-logo.png"
            alt="IMechE UAS Challenge logo"
            width={465}
            height={281}
            className="h-auto w-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
