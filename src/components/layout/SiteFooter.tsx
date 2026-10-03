import Image from "next/image";
import {
  JOIN_HREF,
  JOIN_PROPS,
  LINK_HOVER,
  PAGES,
} from "@/components/layout/navLinks";

/** Bottom bar, styled like the top menu (glass, logo, same link buttons). */
export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:justify-between sm:px-10">
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

        <ul className="flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-zinc-300">
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
      </div>

      <p className="border-t border-white/10 px-6 py-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:px-10 sm:text-left">
        © {new Date().getFullYear()} Gryphon Arrows
      </p>
    </footer>
  );
}
