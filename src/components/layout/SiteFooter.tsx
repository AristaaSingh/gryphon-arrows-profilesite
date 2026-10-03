import type { ReactNode } from "react";
import Image from "next/image";
import { SITE_LINKS } from "@/content/site-links";
import {
  JOIN_HREF,
  JOIN_PROPS,
  FOOTER_LINK_HOVER,
  PAGES,
} from "@/components/layout/navLinks";

/** Bottom bar, styled like the top menu (glass, logo) with calmer underline links. */
const SOCIALS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Instagram",
    href: SITE_LINKS.instagram,
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: SITE_LINKS.linkedin,
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

// Every link row is the same fixed height, so the two columns line up.
const ROW = "flex h-9 items-center";

const HEADING =
  "mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500";

/**
 * Bottom bar, styled like the top menu (glass, logo) with calmer underline
 * links. Brand on top (left on desktop); two labelled columns of links
 * beneath (right on desktop): site links, then social profiles.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex flex-col gap-8 px-6 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-10">
        <div className="flex items-center gap-3">
          <Image
            src="/team/griff-logo.png"
            alt=""
            width={1080}
            height={1025}
            className="h-12 w-auto"
          />
          <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400">
            <span className="text-xs tracking-[0.3em] text-zinc-300">
              Gryphon Arrows
            </span>
            <span>University of Leeds</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 border-t border-white/10 pt-8 sm:gap-16 sm:border-t-0 sm:pt-0">
          <nav aria-label="Footer">
            <h2 className={HEADING}>Navigate</h2>
            <ul className="-ml-1 flex flex-col items-start font-mono text-sm uppercase tracking-[0.2em] text-zinc-300">
              {PAGES.map((item) => (
                <li key={item.label} className={ROW}>
                  <a href={item.href} className={FOOTER_LINK_HOVER}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li className={ROW}>
                <a
                  href={JOIN_HREF}
                  {...JOIN_PROPS}
                  className={FOOTER_LINK_HOVER}
                >
                  Join Us
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={HEADING}>Follow us</h2>
            <ul className="-ml-1 flex flex-col items-start font-mono text-sm uppercase tracking-[0.2em] text-zinc-300">
              {SOCIALS.map((social) => (
                <li key={social.label} className={ROW}>
                  <a
                    href={social.href || "#"}
                    {...(social.href
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={`${FOOTER_LINK_HOVER} flex items-center gap-2`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    >
                      {social.icon}
                    </svg>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="border-t border-white/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:px-10">
        © {new Date().getFullYear()} Gryphon Arrows
      </p>
    </footer>
  );
}
