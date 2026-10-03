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

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex items-start justify-between gap-6 px-6 py-8 sm:items-center sm:px-10">
        <div className="flex items-center gap-3">
          <Image
            src="/team/griff-logo.png"
            alt=""
            width={1080}
            height={1025}
            className="h-10 w-auto"
          />
          <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400">
            <span className="text-xs tracking-[0.3em] text-zinc-300">
              Gryphon Arrows
            </span>
            <span>University of Leeds · IMechE UAS Challenge</span>
          </div>
        </div>

        {/* Right side: links stacked on phones (right-aligned), in a row from
            `sm` up; social icons sit under / after them. */}
        <div className="flex shrink-0 flex-col items-end gap-4 sm:flex-row sm:items-center sm:gap-8">
          <ul className="flex flex-col items-end gap-2 font-mono text-sm uppercase tracking-[0.2em] text-zinc-300 sm:flex-row sm:items-center sm:gap-6">
            {PAGES.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={FOOTER_LINK_HOVER}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={JOIN_HREF} {...JOIN_PROPS} className={FOOTER_LINK_HOVER}>
                Join Us
              </a>
            </li>
          </ul>

          <ul className="flex items-center gap-4 text-zinc-300">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href || "#"}
                  {...(social.href
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={social.label}
                  className="block transition-all duration-200 hover:-translate-y-0.5 hover:text-[#ffc100] active:text-[#ffc100]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    {social.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="border-t border-white/10 px-6 py-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:px-10 sm:text-left">
        © {new Date().getFullYear()} Gryphon Arrows
      </p>
    </footer>
  );
}
