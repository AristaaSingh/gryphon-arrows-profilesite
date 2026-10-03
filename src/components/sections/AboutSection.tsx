import Image from "next/image";
import ScrollFade from "@/components/ui/ScrollFade";
import SectionDivider from "@/components/ui/SectionDivider";
import SectionText from "@/components/ui/SectionText";

// ── EDIT HERE ───────────────────────────────────────────────
const TITLE = "About Us";
const TEXT =
  "Gryphon Arrows is a student-led UAV engineering team focused on innovation, hands-on design, and real-world aerospace development. We bring together multidisciplinary engineering talent to design, build, and test advanced unmanned aircraft, competing in the IMechE UAS Challenge while developing practical engineering skills and the next generation of aerospace engineers.";
// Team photo: replace the file in public/team/ (or change the path here).
const PHOTO = {
  src: "/team/team-photo.jpg",
  alt: "The Gryphon Arrows team in their red kit",
};
// ────────────────────────────────────────────────────────────

/** Section 03: About Us — text on the left, team photo on the right. */
export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative grid min-h-screen scroll-mt-20 bg-black text-zinc-100 md:grid-cols-2"
    >
      <SectionDivider />
      <SectionDivider
        edge="bottom"
        label="Ref. 03.B"
        heightClass="h-16 md:h-48"
      />

      {/* Text (left). */}
      <div className="flex items-center px-6 py-28 sm:px-12 md:pl-20 md:pr-12 xl:pl-60">
        <SectionText sec="03" sheet={3} title={TITLE} text={TEXT} />
      </div>

      {/* Team photo: the whole right half of the screen, flush to the
          edge, full section height. Cropped to the people (bottom-weighted)
          rather than the ceiling. */}
      <ScrollFade
        threshold={0.15}
        className="relative min-h-[22rem] md:min-h-full"
      >
        <div className="absolute inset-0 overflow-hidden border-l border-dashed border-white/25 bg-zinc-950">
          <Image
            src={PHOTO.src}
            alt={PHOTO.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="-translate-y-[6%] scale-[1.04] object-cover object-[55%_80%]"
          />
        </div>
        {/* Single-column (mobile) layout: the photo starts mid-section, so it
            needs its own soft top edge. */}
        <SectionDivider
          className="md:hidden"
          label="Ref. 03.C"
          heightClass="h-28"
        />
      </ScrollFade>
    </section>
  );
}
