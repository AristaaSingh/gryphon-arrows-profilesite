import ScrollFade from "@/components/ui/ScrollFade";
import { SHEET_TOTAL } from "@/content/sections";

/** The standard text block: "Sec. 03 ── Sheet 3/5" label, heading, paragraph. */
export default function SectionText({
  sec,
  sheet,
  title,
  text,
  delayMs = 0,
}: {
  /** Section number shown in the label, e.g. "03". */
  sec: string;
  /** Sheet number shown in the label, e.g. 3 (the total comes from content/sections.ts). */
  sheet: number;
  title: string;
  text: string;
  /** Wait this long after scrolling into view before fading in. */
  delayMs?: number;
}) {
  return (
    <ScrollFade threshold={0.25} delayMs={delayMs} className="w-full max-w-xl">
      <div
        aria-hidden="true"
        className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500"
      >
        <span>Sec. {sec}</span>
        <span className="h-px w-16 bg-brand-red" />
        <span>
          Sheet {sheet}/{SHEET_TOTAL}
        </span>
      </div>
      <h2 className="font-display text-3xl text-zinc-100 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-6 font-body text-base leading-relaxed text-zinc-300 sm:text-lg">
        {text}
      </p>
    </ScrollFade>
  );
}
