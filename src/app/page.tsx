"use client";

import { useState } from "react";
import DecryptedText from "@/components/DecryptedText";
import TechText from "@/components/TechText";

export default function Home() {
  const [resolvedCount, setResolvedCount] = useState(0);
  const decrypted = resolvedCount >= 2;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative flex w-full flex-col items-center text-center">
        <span className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]">
          Gryphon Arrows &middot; IMechE UAS Challenge
        </span>

        {!decrypted && (
          <h1 className="relative flex flex-wrap items-baseline justify-center gap-x-8 sm:gap-x-12 font-display text-5xl tracking-[0.2em] sm:text-7xl md:text-8xl">
            <DecryptedText
              text="GRYPHON"
              className="text-zinc-100"
              scramblingClassName="text-[#e02828]/70"
              speed={40}
              iterationsPerChar={10}
              staggerMs={70}
              onComplete={() => setResolvedCount((c) => c + 1)}
            />
            <DecryptedText
              text="ARROWS"
              className="text-zinc-100"
              scramblingClassName="text-[#e02828]/70"
              speed={40}
              iterationsPerChar={10}
              staggerMs={70}
              startDelay={550}
              onComplete={() => setResolvedCount((c) => c + 1)}
            />
          </h1>
        )}

        {/* DecryptedText renders the intro; once it resolves, this takes
            over as the real reactbits.dev Tech Text component (hover
            reveal, drag, specks, idle sweep) — see TechText.jsx. */}
        {decrypted && (
          <div
            className="relative h-40 w-full max-w-5xl font-display sm:h-56 md:h-72"
            role="img"
            aria-label="Gryphon Arrows"
          >
            <TechText
              text="GRYPHON ARROWS"
              fontWeight={400}
              fontSize={180}
              letterSpacing={0.12}
              color="#f4f4f5"
              accentColor="#e02828"
              reach={220}
              softness={0.7}
              dashLength={4}
              dashGap={3}
              strokeWidth={1.5}
              lineStyle="dashed"
              reveal="letter"
              specks={15}
              selection
              labels
              draggable
              sweep
              speed={1}
              style={undefined}
            />
          </div>
        )}

        <p className="mt-4 max-w-md font-body text-sm text-zinc-400">
          Taking off soon, hang on!!
        </p>
      </div>
    </main>
  );
}
