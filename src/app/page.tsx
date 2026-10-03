"use client";

import Image from "next/image";
import DecryptTechHeading from "@/components/DecryptTechHeading";
import ScrollFade from "@/components/ScrollFade";
import SectionDivider from "@/components/SectionDivider";
import SectionToc from "@/components/SectionToc";
import SiteNav from "@/components/SiteNav";
import SpecularButton from "@/components/SpecularButton";
import SponsorsRibbon from "@/components/SponsorsRibbon";
import StuffWeDo from "@/components/StuffWeDo";
import WebThreads from "@/components/WebThreads";

const ABOUT_TEXT =
  "Gryphon Arrows is a student-led UAV engineering team focused on innovation, hands-on design, and real-world aerospace development. We bring together multidisciplinary engineering talent to design, build, and test advanced unmanned aircraft, competing in the IMechE UAS Challenge while developing practical engineering skills and the next generation of aerospace engineers.";

const CHALLENGE_TEXT =
  "The IMechE UAS Challenge is an annual international student engineering competition organized by the Institution of Mechanical Engineers (IMechE). It tasks undergraduate and postgraduate university teams with designing, building, and operating an autonomous Unmanned Aerial System (UAS).";

const TOC_ITEMS = [
  { id: "home", label: "Home" },
  { id: "sponsors", label: "Our Sponsors" },
  { id: "about", label: "About Us" },
  { id: "stuff", label: "Stuff We Do" },
  { id: "challenge", label: "The Challenge" },
];

export default function Home() {
  const scrollToNext = () => {
    document.getElementById("sponsors")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SiteNav />
      <SectionToc items={TOC_ITEMS} />

      <main id="home" className="relative min-h-screen overflow-hidden bg-black text-zinc-100">
        <div className="animate-fade-in-up absolute inset-0">
          <WebThreads
            color1="#ff002c"
            color2="#ffc100"
            color3="#ffffff"
            speed={0.2}
            threadCount={6}
            frequency={5}
            spread={0.18}
            taper={1}
            position={0.5}
            fanMode="center"
            glow={0.02}
            falloff={0.6}
            thickness={1.1}
            brightness={0.6}
            opacity={1}
            mirror
            shimmer={false}
            grain
            grainIntensity={0.05}
            mouseInteraction
            mouseStrength={0.3}
          />
        </div>

        {/* fanMode="center" + position={0.5} on WebThreads converges the
            threads' brightest point at the exact horizontal/vertical center
            of this section — the gap between the two words below is sized
            to leave that glow visible, not covered by either line. */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <ScrollFade threshold={0.4}>
            <span className="mb-4 block font-body text-sm tracking-wide text-zinc-100 sm:text-base">
              University of Leeds IMechE UAS Challenge
            </span>
          </ScrollFade>

          <ScrollFade threshold={0.3} className="flex flex-col items-center">
            <DecryptTechHeading
              text="Gryphon"
              outlineWidthEm={0}
              haloBlurEm={0}
              className="h-16 w-72 sm:h-24 sm:w-96 md:h-32 md:w-[34rem]"
            />

            <div aria-hidden="true" className="h-4 sm:h-8 md:h-12" />

            <DecryptTechHeading
              text="Arrows"
              reverse
              outlineWidthEm={0}
              haloBlurEm={0}
              className="h-16 w-72 sm:h-24 sm:w-96 md:h-32 md:w-[34rem]"
            />
          </ScrollFade>

          <ScrollFade threshold={0.4} className="mt-8">
            <SpecularButton
              size="md"
              radius={14}
              textColor="#f5f5f5"
              lineColor="#ffc100"
              baseColor="#3a1414"
              intensity={1}
              shineSize={12}
              shineFade={45}
              speed={0.3}
              followMouse
              proximity={260}
              onClick={scrollToNext}
            >
              Explore us
            </SpecularButton>
          </ScrollFade>
        </div>

        {/* Drawing-sheet annotations, matching the sponsors strip. */}
        <div
          aria-hidden="true"
          className="animate-fade-in-up pointer-events-none absolute inset-x-0 top-[4.75rem] z-10 flex justify-between px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400 sm:px-10"
          style={{ animationDelay: "1300ms" }}
        >
          <span>Sec. 01</span>
          <span>Sheet 1/5</span>
        </div>
      </main>

      {/* Sponsors ribbon, sitting between the landing and About Us. */}
      <div id="sponsors" className="relative bg-black py-24 text-zinc-100 sm:py-32">
        <SponsorsRibbon />
      </div>

      <section
        id="about"
        className="relative grid min-h-screen scroll-mt-20 bg-black text-zinc-100 md:grid-cols-2"
      >
        <SectionDivider />
        <SectionDivider edge="bottom" label="Ref. 03.B" heightClass="h-16 md:h-48" />

        {/* About text (left). */}
        <div className="flex items-center px-6 py-28 sm:px-12 md:pl-20 md:pr-12 xl:pl-60">
          <ScrollFade threshold={0.25} className="w-full max-w-xl">
            <div
              aria-hidden="true"
              className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500"
            >
              <span>Sec. 03</span>
              <span className="h-px w-16 bg-[#ff002c]" />
              <span>Sheet 3/5</span>
            </div>
            <h2 className="font-display text-3xl text-zinc-100 sm:text-4xl">About Us</h2>
            <p className="mt-6 font-body text-base leading-relaxed text-zinc-300 sm:text-lg">
              {ABOUT_TEXT}
            </p>
          </ScrollFade>
        </div>

        {/* Team photo: the whole right half of the screen, flush to the
            edge, full section height. Cropped to the people (bottom-weighted)
            rather than the ceiling. */}
        <ScrollFade threshold={0.15} className="relative min-h-[22rem] md:min-h-full">
          <div className="absolute inset-0 overflow-hidden border-l border-dashed border-white/25 bg-zinc-950">
            <Image
              src="/team/team-photo.jpg"
              alt="The Gryphon Arrows team in their red kit"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="-translate-y-[6%] scale-[1.04] object-cover object-[55%_80%]"
            />
          </div>
          {/* Single-column (mobile) layout: the photo starts mid-section, so it
              needs its own soft top edge. */}
          <SectionDivider className="md:hidden" label="Ref. 03.C" heightClass="h-28" />
        </ScrollFade>
      </section>

      <div id="stuff" className="relative scroll-mt-20 bg-black py-24 text-zinc-100 sm:py-32">
        <StuffWeDo />
      </div>

      <section
        id="challenge"
        className="relative grid min-h-screen scroll-mt-20 bg-black text-zinc-100 md:grid-cols-2"
      >
        <SectionDivider label="Ref. 05.A" />

        <div className="flex items-center px-6 py-28 sm:px-12 md:pl-20 md:pr-12 xl:pl-60">
          <ScrollFade threshold={0.25} className="w-full max-w-xl">
            <div
              aria-hidden="true"
              className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500"
            >
              <span>Sec. 05</span>
              <span className="h-px w-16 bg-[#ff002c]" />
              <span>Sheet 5/5</span>
            </div>
            <h2 className="font-display text-3xl text-zinc-100 sm:text-4xl">The Challenge</h2>
            <p className="mt-6 font-body text-base leading-relaxed text-zinc-300 sm:text-lg">
              {CHALLENGE_TEXT}
            </p>
          </ScrollFade>
        </div>

        <ScrollFade threshold={0.15} className="relative min-h-[22rem] md:min-h-full">
          <div
            role="img"
            aria-label="Challenge image placeholder"
            className="absolute inset-0 flex items-center justify-center border-l border-dashed border-white/25 bg-zinc-950"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
              Challenge image
            </span>
          </div>
        </ScrollFade>
      </section>
    </>
  );
}
