import DecryptTechHeading from "@/components/DecryptTechHeading";
import SiteNav from "@/components/SiteNav";
import WebThreads from "@/components/WebThreads";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-zinc-100">
      <div className="absolute inset-0">
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

      <SiteNav />

      {/* fanMode="center" + position={0.5} on WebThreads converges the
          threads' brightest point at the exact horizontal/vertical center
          of this section — the gap between the two words below is sized
          to leave that glow visible, not covered by either line. */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]">
          IMechE UAS Challenge
        </span>

        <DecryptTechHeading
          text="Gryphon"
          outlineWidthEm={0}
          haloBlurEm={0}
          className="h-16 w-72 sm:h-24 sm:w-96 md:h-32 md:w-[34rem]"
        />

        <div aria-hidden="true" className="h-6 sm:h-10 md:h-16" />

        <DecryptTechHeading
          text="Arrows"
          reverse
          outlineWidthEm={0}
          haloBlurEm={0}
          className="h-16 w-72 sm:h-24 sm:w-96 md:h-32 md:w-[34rem]"
        />

        <p className="mt-6 max-w-sm font-body text-sm text-zinc-300">
          Taking off soon, hang on!!
        </p>
      </div>
    </main>
  );
}
