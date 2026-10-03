"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  JOIN_HREF,
  JOIN_PROPS,
  LINK_HOVER,
  PAGES,
} from "@/components/layout/navLinks";

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="animate-fade-in-up fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex items-center justify-between px-6 py-4 sm:px-10">
        <a href="#home" className="flex items-center gap-3">
          <Image
            src="/team/griff-logo.png"
            alt="Gryphon Arrows logo"
            width={1080}
            height={1025}
            priority
            className="h-10 w-auto sm:h-12"
          />
          <span className="hidden font-mono text-xs uppercase tracking-[0.3em] text-zinc-300 min-[430px]:inline">
            Gryphon Arrows
          </span>
        </a>

        {/* Desktop nav — hidden below sm, where it has no room and would
            squish against the wordmark. */}
        <ul className="hidden items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-zinc-300 sm:flex">
          {PAGES.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={LINK_HOVER}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href={JOIN_HREF} {...JOIN_PROPS} className={LINK_HOVER}>
              Join Us
            </a>
          </li>
        </ul>

        {/* Mobile: "Join Us" stays in the bar itself so it's visible the
            moment the page opens, next to the hamburger. */}
        <div className="flex items-center gap-3 sm:hidden">
          <a
            href={JOIN_HREF}
            {...JOIN_PROPS}
            className={`${LINK_HOVER} border border-white/30 font-mono text-xs uppercase tracking-[0.2em] text-zinc-100`}
          >
            Join Us
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 sm:hidden"
          >
            <span
              className={`h-px w-5 bg-zinc-300 transition-transform ${mobileOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-5 bg-zinc-300 transition-transform ${mobileOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile panel: height + fade open/close, links stagger in. */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/10 sm:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4 font-mono text-sm uppercase tracking-[0.2em] text-zinc-300">
              {PAGES.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
                  className={`${LINK_HOVER} py-2`}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
