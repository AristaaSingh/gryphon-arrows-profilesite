"use client";

import { useState } from "react";

// Placeholder nav: these are separate pages that don't exist yet (linked
// with "#" so they don't 404). The Explore dropdown was removed for now.
const PAGES = [
  { label: "Gallery", href: "#" },
  { label: "Contact", href: "#" },
];

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="animate-fade-in-up fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4 sm:px-10">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-300">
          Gryphon Arrows
        </span>

        {/* Desktop nav — hidden below sm, where it has no room and would
            squish against the wordmark. */}
        <ul className="hidden items-center gap-8 font-mono text-sm uppercase tracking-[0.2em] text-zinc-300 sm:flex">
          {PAGES.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="transition-colors hover:text-[#e02828]">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger — only this + the wordmark occupy the row below
            sm, so nothing squishes. */}
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

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="flex flex-col gap-1 border-t border-white/10 px-6 py-4 font-mono text-sm uppercase tracking-[0.2em] text-zinc-300 sm:hidden">
          {PAGES.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-sm px-1 py-2 transition-colors hover:text-[#e02828]"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
