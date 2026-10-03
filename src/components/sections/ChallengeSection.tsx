import ChallengeLogo from "@/components/sections/ChallengeLogo";
import SectionDivider from "@/components/ui/SectionDivider";
import SectionText from "@/components/ui/SectionText";

// ── EDIT HERE ───────────────────────────────────────────────
const TITLE = "The Challenge";
const TEXT =
  "The IMechE UAS Challenge is an annual international student engineering competition organized by the Institution of Mechanical Engineers (IMechE). It tasks undergraduate and postgraduate university teams with designing, building, and operating an autonomous Unmanned Aerial System (UAS).";
// ────────────────────────────────────────────────────────────

/** Section 05: The Challenge — logo slides in first, text fades in beside it. */
export default function ChallengeSection() {
  return (
    <section
      id="challenge"
      className="relative grid min-h-screen scroll-mt-20 bg-black text-zinc-100 md:h-[46rem] md:min-h-0 md:grid-cols-2"
    >
      <SectionDivider label="Ref. 05.A" />

      {/* Logo first (left, and first in the DOM so it also leads on mobile);
          the text fades in after it. */}
      <ChallengeLogo />

      <div className="flex items-center px-6 pb-16 pt-4 sm:px-12 md:items-end md:justify-start md:pb-32 md:pl-6 md:pr-12 md:pt-28 xl:pr-32">
        <SectionText
          sec="05"
          sheet={5}
          title={TITLE}
          text={TEXT}
          delayMs={350}
        />
      </div>
    </section>
  );
}
