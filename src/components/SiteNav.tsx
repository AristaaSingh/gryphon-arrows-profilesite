// Placeholder nav: labels/links below are stand-ins for the real site
// structure. "Overview" is the first tab and holds a submenu for the
// parallax single-page site's sections; the rest are separate pages that
// don't exist yet (linked with "#" so they don't 404).
const OVERVIEW_SECTIONS = [
  { label: "About Us", href: "#about" },
  { label: "The Challenge", href: "#challenge" },
  { label: "Meet the Team", href: "#team" },
  { label: "Join Us", href: "#join" },
];

const PAGES = [
  { label: "Sponsors", href: "#" },
  { label: "Gallery", href: "#" },
  { label: "Contact", href: "#" },
];

export default function SiteNav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/30 px-6 py-4 backdrop-blur-sm sm:px-10">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-300">
        Gryphon Arrows
      </span>

      <ul className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-300">
        <li className="group relative">
          <button
            type="button"
            className="flex items-center gap-1.5 py-2 transition-colors hover:text-[#e02828]"
          >
            Overview
            <svg
              aria-hidden="true"
              viewBox="0 0 10 6"
              className="h-1.5 w-2.5 fill-current transition-transform group-hover:rotate-180"
            >
              <path d="M0 0l5 6 5-6z" />
            </svg>
          </button>

          <ul
            className="invisible absolute left-0 top-full flex min-w-[180px] translate-y-1 flex-col gap-0.5 rounded-sm border border-white/10 bg-black/90 p-1.5 opacity-0 backdrop-blur-sm transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
          >
            {OVERVIEW_SECTIONS.map((item) => (
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
    </nav>
  );
}
