"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import DecryptedText from "@/components/DecryptedText";
import TechText from "@/components/TechText";

interface DecryptTechHeadingProps {
  /** Space-separated words. Each word decrypts independently, in order. */
  text: string;
  /**
   * Classes/styles for the OUTER wrapping box — this is what actually
   * controls where the heading sits and how big its box is (position
   * absolute/relative, width, height, etc). The heading measures and
   * sizes itself against this box alone, never the rest of the page, so
   * it can be dropped anywhere (centered, absolutely positioned over a
   * background image, inside a grid cell...) and stays put there.
   */
  className?: string;
  style?: CSSProperties;
  color?: string;
  accentColor?: string;
  letterSpacingEm?: number;
  minFontSize?: number;
  maxFontSize?: number;
}

const DEFAULT_ACCENT = "#e02828";

/**
 * Plays the DecryptedText scramble-in effect once per word, then swaps to
 * the real reactbits.dev Tech Text component (hover reveal, drag, idle
 * sweep, particles) for the interactive resting state — see
 * TechText.jsx/.css. Self-contained: it measures its own box, so both
 * phases render at the same size no matter where this component is
 * placed, and there's no flash of a wrong size before the first real
 * measurement (the box stays invisible until then).
 */
export default function DecryptTechHeading({
  text,
  className = "",
  style,
  color = "#f4f4f5",
  accentColor = DEFAULT_ACCENT,
  letterSpacingEm = 0.2,
  minFontSize = 24,
  maxFontSize = 160,
}: DecryptTechHeadingProps) {
  const words = text.split(" ").filter(Boolean);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const decrypted = resolvedCount >= words.length;

  // useLayoutEffect (not useEffect) so the size is measured and applied
  // before the browser paints, wherever possible — combined with the
  // `fontSize === null` gate below, this means the heading is simply
  // invisible for one frame rather than briefly showing at a wrong size.
  useLayoutEffect(() => {
    const el = wrapRef.current;
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
        ctx.letterSpacing = `${letterSpacingEm * probeSize}px`;
      }
      const m = ctx.measureText(text);
      const inkWidth = (m.actualBoundingBoxLeft ?? 0) + (m.actualBoundingBoxRight ?? 0);
      const fit = Math.min(1, (width * 0.9) / Math.max(inkWidth, 1));
      const next = Math.min(maxFontSize, Math.max(minFontSize, probeSize * fit));
      setFontSize(Math.round(next));
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    if (document.fonts) document.fonts.ready.then(measure, measure);

    return () => resizeObserver.disconnect();
  }, [text, letterSpacingEm, minFontSize, maxFontSize]);

  return (
    <div
      ref={wrapRef}
      className={`relative font-display ${className}`.trim()}
      style={{ ...style, visibility: fontSize === null ? "hidden" : "visible" }}
    >
      {!decrypted && fontSize !== null && (
        <h1
          className="relative flex h-full items-center justify-center whitespace-nowrap"
          style={{
            fontSize: `${fontSize}px`,
            letterSpacing: `${fontSize * letterSpacingEm}px`,
            gap: `${fontSize * 0.3}px`,
            color,
          }}
        >
          {words.map((word, i) => (
            <DecryptedText
              key={word + i}
              text={word}
              className=""
              scramblingClassName="opacity-70"
              style={{ color }}
              scramblingStyle={{ color: accentColor }}
              speed={40}
              iterationsPerChar={10}
              staggerMs={70}
              startDelay={i * 550}
              onComplete={() => setResolvedCount((c) => c + 1)}
            />
          ))}
        </h1>
      )}

      {decrypted && fontSize !== null && (
        <TechText
          text={text}
          fontWeight={400}
          fontSize={fontSize}
          letterSpacing={letterSpacingEm}
          color={color}
          accentColor={accentColor}
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
      )}
    </div>
  );
}
