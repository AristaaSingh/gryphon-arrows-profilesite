"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import DecryptedText from "@/components/DecryptedText";
import TechText from "@/components/TechText";

const HEADING_TEXT = "GRYPHON ARROWS";
const LETTER_SPACING_EM = 0.2;
const MAX_FONT_SIZE = 150;
const MIN_FONT_SIZE = 32;

// Both the DecryptedText intro and TechText need to render "GRYPHON ARROWS"
// at the *same* pixel size, but they get there completely differently:
// the intro is DOM text sized by Tailwind breakpoint classes and can wrap
// onto two lines, while TechText is single-line canvas text that shrinks
// to fit its container instead of wrapping. Picking sizes for each
// separately (even per breakpoint) still drifts apart. Instead, measure
// the real ink width once — the same way TechText measures internally —
// and derive one font-size both phases render at, so there's nothing left
// to disagree about.
function useFittedFontSize(containerRef: RefObject<HTMLElement | null>) {
  const [fontSize, setFontSize] = useState(MAX_FONT_SIZE);

  useEffect(() => {
    const el = containerRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!el || !ctx) return;

    const measure = () => {
      const width = el.clientWidth;
      if (!width) return;
      const family = getComputedStyle(el).fontFamily;
      const probeSize = 300;
      ctx.font = `400 ${probeSize}px ${family}`;
      if ("letterSpacing" in ctx) {
        ctx.letterSpacing = `${LETTER_SPACING_EM * probeSize}px`;
      }
      const m = ctx.measureText(HEADING_TEXT);
      const inkWidth = (m.actualBoundingBoxLeft ?? 0) + (m.actualBoundingBoxRight ?? 0);
      const fit = Math.min(1, (width * 0.9) / Math.max(inkWidth, 1));
      const next = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, probeSize * fit));
      setFontSize(Math.round(next));
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    if (document.fonts) document.fonts.ready.then(measure, measure);

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return fontSize;
}

export default function Home() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [resolvedCount, setResolvedCount] = useState(0);
  const decrypted = resolvedCount >= 2;
  const fontSize = useFittedFontSize(wrapRef);

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
      <div ref={wrapRef} className="relative flex w-full flex-col items-center text-center">
        <span className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#e02828]">
          Gryphon Arrows &middot; IMechE UAS Challenge
        </span>

        {!decrypted && (
          <h1
            className="relative flex items-baseline justify-center whitespace-nowrap font-display text-zinc-100"
            style={{
              fontSize: `${fontSize}px`,
              letterSpacing: `${fontSize * LETTER_SPACING_EM}px`,
              gap: `${fontSize * 0.3}px`,
            }}
          >
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
            reveal, drag, specks, idle sweep) — see TechText.jsx. fontSize
            comes from the same measured value the intro just used above,
            so there's no jump. */}
        {decrypted && (
          <div
            className="relative h-40 w-full font-display sm:h-56 md:h-72"
            role="img"
            aria-label="Gryphon Arrows"
          >
            <TechText
              text={HEADING_TEXT}
              fontWeight={400}
              fontSize={fontSize}
              letterSpacing={LETTER_SPACING_EM}
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
