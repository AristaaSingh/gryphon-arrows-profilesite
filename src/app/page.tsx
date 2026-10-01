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

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]">
          IMechE UAS Challenge
        </span>

        <DecryptTechHeading
          text="Gryphon Arrows"
          className="h-20 w-full max-w-3xl sm:h-28 md:h-36"
        />

        <p className="mt-2 max-w-sm font-body text-sm text-zinc-300">
          Taking off soon, hang on!!
        </p>
      </div>
    </main>
  );
}
