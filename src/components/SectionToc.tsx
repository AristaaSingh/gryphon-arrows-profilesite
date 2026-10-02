"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TocItem {
  id: string;
  label: string;
}

/**
 * Fixed side table of contents. The active section is whichever one
 * crosses the vertical middle of the viewport (a thin band down the
 * center, so only one can match at a time). Desktop-only: hidden below
 * xl, where there isn't spare horizontal room for it.
 */
export default function SectionToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="relative flex flex-col gap-6 border-l border-white/15 pl-5">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="toc-marker"
                  className="absolute -left-[22px] top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-[#ff002c] shadow-[0_0_12px_rgba(255,0,44,0.9)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`block font-mono text-xs uppercase tracking-[0.25em] transition-all duration-300 ${
                  isActive
                    ? "translate-x-1 text-white [text-shadow:0_0_14px_rgba(255,255,255,0.55)]"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
