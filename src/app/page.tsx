import DecryptedText from "@/components/DecryptedText";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative flex flex-col items-center text-center">
        <span className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
          Gryphon Arrows &middot; IMechE UAS Challenge
        </span>
        <h1 className="font-display text-4xl tracking-tight sm:text-6xl">
          <DecryptedText
            text="Site under construction"
            className="text-zinc-100"
            scramblingClassName="text-cyan-400/70"
            speed={30}
            iterationsPerChar={10}
            staggerMs={70}
          />
        </h1>
        <p className="mt-4 max-w-md font-body text-sm text-zinc-400">
          Building something worth flying. Check back soon.
        </p>
      </div>
    </main>
  );
}
