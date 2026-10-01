"use client";

import Image from "next/image";
import DecryptTechHeading from "@/components/DecryptTechHeading";
import ScrollFade from "@/components/ScrollFade";
import SiteNav from "@/components/SiteNav";
import SpecularButton from "@/components/SpecularButton";
import WebThreads from "@/components/WebThreads";

const ABOUT_PLACEHOLDER =
  "I am not crazy! I know he swapped those numbers. I knew it was 1216. One after Magna Carta. As if I could ever make such a mistake. Never. Never! I just – I just couldn’t prove it. He covered his tracks, he got that idiot at the copy shop to lie for him. You think this is something? You think this is bad? This? This chicanery? He’s done worse. That billboard! Are you telling me that a man just happens to fall like that? No! He orchestrated it! Jimmy! He defecated through a sunroof! And I saved him! And I shouldn’t have. I took him into my own firm!";

export default function Home() {
  const scrollToAbout = () => {
    document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SiteNav />

      <main className="relative min-h-screen snap-start overflow-hidden bg-black text-zinc-100">
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
              onClick={scrollToAbout}
            >
              Explore us
            </SpecularButton>
          </ScrollFade>
        </div>
      </main>

      <section
        id="about-section"
        className="relative min-h-screen snap-start scroll-mt-20 bg-black px-6 pt-28 pb-16 text-zinc-100 sm:px-12 sm:pt-32 md:px-20"
      >
        <div className="mx-auto max-w-5xl">
          <ScrollFade id="sponsors" className="flex scroll-mt-24 justify-end">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]">
                Sponsored by
              </span>
              <Image
                src="/sponsors/menapia.webp"
                alt="Menapia"
                width={240}
                height={106}
                className="h-auto w-32 sm:w-40"
              />
            </div>
          </ScrollFade>

          <ScrollFade id="about" className="mt-20 max-w-xl scroll-mt-24 text-left sm:mt-28">
            <h2 className="font-display text-2xl text-zinc-100 sm:text-3xl">About Us</h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-zinc-300 sm:text-base">
              {ABOUT_PLACEHOLDER}
            </p>
          </ScrollFade>
        </div>
      </section>
    </>
  );
}
