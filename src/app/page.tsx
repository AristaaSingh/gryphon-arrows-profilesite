import Image from "next/image";
import DecryptTechHeading from "@/components/DecryptTechHeading";
import SiteNav from "@/components/SiteNav";
import WebThreads from "@/components/WebThreads";

export default function Home() {
  return (
    <>
      <SiteNav />

      <main className="relative min-h-screen overflow-hidden bg-black text-zinc-100">
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
          <span
            className="animate-fade-in-up mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]"
            style={{ animationDelay: "120ms" }}
          >
            University of Leeds IMechE UAS Challenge
          </span>

          <div className="animate-fade-in-up flex flex-col items-center" style={{ animationDelay: "200ms" }}>
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
          </div>

          <p
            className="animate-fade-in-up mt-6 max-w-sm font-body text-sm text-zinc-300"
            style={{ animationDelay: "900ms" }}
          >
            Taking off soon, hang on!!
          </p>
        </div>

        <a
          href="#about-section"
          className="animate-fade-in-up group absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-zinc-300 transition-colors hover:text-[#e02828]"
          style={{ animationDelay: "1100ms" }}
        >
          Explore us
          <svg
            aria-hidden="true"
            viewBox="0 0 16 10"
            className="h-2.5 w-4 animate-bounce fill-current"
          >
            <path d="M0 0l8 10 8-10z" />
          </svg>
        </a>
      </main>

      <section
        id="about-section"
        className="relative scroll-mt-20 bg-black px-6 py-24 text-center text-zinc-100 sm:py-32"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-20">
          <div id="sponsors" className="flex flex-col items-center gap-4 scroll-mt-24">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]">
              Sponsored by
            </span>
            <Image
              src="/sponsors/menapia.webp"
              alt="Menapia"
              width={240}
              height={106}
              className="h-auto w-40 sm:w-48"
            />
          </div>

          <div id="about" className="flex flex-col items-center gap-4 scroll-mt-24">
            <h2 className="font-display text-2xl text-zinc-100 sm:text-3xl">About Us</h2>
            <p className="max-w-xl font-body text-sm text-zinc-300 sm:text-base">
              About us content
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
