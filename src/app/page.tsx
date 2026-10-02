"use client";

import DecryptTechHeading from "@/components/DecryptTechHeading";
import ScrollFade from "@/components/ScrollFade";
import SectionToc from "@/components/SectionToc";
import SiteNav from "@/components/SiteNav";
import SpecularButton from "@/components/SpecularButton";
import SponsorsRibbon from "@/components/SponsorsRibbon";
import WebThreads from "@/components/WebThreads";

const TOC_ITEMS = [
  { id: "home", label: "Home" },
  { id: "sponsors", label: "Our Sponsors" },
  { id: "about", label: "About Us" },
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
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]">
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
      </main>

      {/* Sponsors ribbon, sitting between the landing and About Us. */}
      <div id="sponsors" className="relative bg-black py-24 text-zinc-100 sm:py-32">
        <SponsorsRibbon />
      </div>

      <section
        id="about"
        className="relative flex min-h-screen scroll-mt-20 items-center bg-black px-6 py-28 text-zinc-100 sm:px-12 md:px-20"
      >
        <ScrollFade className="mx-auto w-full max-w-3xl">
          <h2 className="font-display text-3xl text-zinc-100 sm:text-4xl">About Us</h2>
          <p className="mt-5 font-body text-base leading-relaxed text-zinc-300">
            About us content
          </p>
        </ScrollFade>
      </section>
    </>
  );
}
