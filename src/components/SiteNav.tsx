"use client";

import { useState } from "react";

// Placeholder nav: labels/links below are stand-ins for the real site
// structure. "Explore" is the first tab and holds a submenu for the
// parallax single-page site's sections; the rest are separate pages that
// don't exist yet (linked with "#" so they don't 404).
const EXPLORE_SECTIONS = [
  { label: "About Us", href: "#about" },
  { label: "The Challenge", href: "#challenge" },
  { label: "Meet the Team", href: "#team" },
  { label: "Join Us", href: "#join" },
  { label: "Sponsors", href: "#sponsors" },
];

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
          <li className="group relative">
            <button
              type="button"
              className="flex items-center gap-1.5 py-2 transition-colors hover:text-[#e02828]"
            >
              Explore
              <svg
                aria-hidden="true"
                viewBox="0 0 10 6"
                className="h-1.5 w-2.5 fill-current transition-transform group-hover:rotate-180"
              >
                <path d="M0 0l5 6 5-6z" />
              </svg>
            </button>

            <ul className="invisible absolute left-0 top-full flex min-w-[180px] translate-y-1 flex-col gap-0.5 rounded-sm border border-white/10 bg-black/90 p-1.5 opacity-0 backdrop-blur-sm transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {EXPLORE_SECTIONS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="block rounded-sm px-3 py-2 normal-case tracking-normal transition-colors hover:bg-white/5 hover:text-[#e02828]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>

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
          <span className="px-1 py-2 text-zinc-500">Explore</span>
          {EXPLORE_SECTIONS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-sm px-4 py-2 normal-case tracking-normal transition-colors hover:bg-white/5 hover:text-[#e02828]"
            >
              {item.label}
            </a>
          ))}
          <div className="my-2 border-t border-white/10" />
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
