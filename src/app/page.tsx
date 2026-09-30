"use client";

import { useRef, useState } from "react";
import DecryptedText from "@/components/DecryptedText";
import TechSelectBox from "@/components/TechSelectBox";

export default function Home() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [decrypted, setDecrypted] = useState(false);

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
      <div className="relative flex flex-col items-center text-center">
        <span className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
          Gryphon Arrows &middot; IMechE UAS Challenge
        </span>
        <h1
          ref={headingRef}
          className="relative font-display text-4xl tracking-tight sm:text-6xl"
        >
          <DecryptedText
            text="Site under construction"
            className="text-zinc-100"
            scramblingClassName="text-cyan-400/70"
            speed={40}
            iterationsPerChar={10}
            staggerMs={70}
            onComplete={() => setDecrypted(true)}
          />
          <TechSelectBox containerRef={headingRef} active={decrypted} />
        </h1>
        <p className="mt-4 max-w-md font-body text-sm text-zinc-400">
          Taking off soon, hang on!!
        </p>
      </div>
    </main>
  );
}
