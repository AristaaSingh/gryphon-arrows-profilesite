"use client";

import { useState } from "react";
import { SITE_LINKS } from "@/content/site-links";

// Placeholder nav: these are separate pages that don't exist yet (linked
// with "#" so they don't 404). The Explore dropdown was removed for now.
// Hover / focus / press: a soft yellow glow, readable on the dark background.
const LINK_HOVER =
  "transition-all duration-300 hover:text-[#ffc100] hover:[text-shadow:0_0_12px_rgba(255,193,0,0.75)] focus-visible:text-[#ffc100] focus-visible:[text-shadow:0_0_12px_rgba(255,193,0,0.75)] active:text-[#ffc100]";

const PAGES = [{ label: "Contact", href: "#" }];

// The "Join Us" link lives in src/content/site-links.ts so it can be edited
// without touching this component.
const JOIN_HREF = SITE_LINKS.joinForm || "#";
const JOIN_PROPS = SITE_LINKS.joinForm
  ? { target: "_blank", rel: "noopener noreferrer" }
  : {};

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
              <a href={item.href} className={LINK_HOVER}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={JOIN_HREF}
              {...JOIN_PROPS}
              className={LINK_HOVER}
            >
              Join Us
            </a>
          </li>
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
              className={`${LINK_HOVER} rounded-sm px-1 py-2`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={JOIN_HREF}
            {...JOIN_PROPS}
            className={`${LINK_HOVER} rounded-sm px-1 py-2`}
          >
            Join Us
          </a>
        </div>
      )}
    </nav>
  );
}
