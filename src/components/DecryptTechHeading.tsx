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
  /** Outline drawn around each letter — helps readability over a busy or
   *  bright background. Set to "transparent" or width 0 to turn it off. */
  outlineColor?: string;
  /** Outline width as a fraction of the rendered font size. */
  outlineWidthEm?: number;
  /** Soft dark halo behind each letter (text-shadow) — reads more reliably
   *  than a thin stroke against a background whose brightness varies a lot
   *  (e.g. glowing threads crossing behind the text). Set 0 to turn off. */
  haloBlurEm?: number;
  letterSpacingEm?: number;
  minFontSize?: number;
  maxFontSize?: number;
  /** Decrypts right-to-left instead of the default left-to-right. */
  reverse?: boolean;
  /**
   * Swap to the interactive Tech Text component once decrypted. Default
   * false: the heading just stays as resolved DecryptedText (feedback was
   * Tech Text didn't fit here) — set true to bring it back, the rest of
   * this component is unchanged either way.
   */
  interactive?: boolean;
}

const DEFAULT_ACCENT = "#e02828";

/**
 * Plays the DecryptedText scramble-in effect once per word. With
 * `interactive` (off by default — see that prop), swaps afterward to the
 * real reactbits.dev Tech Text component (hover reveal, drag, idle sweep,
 * particles) for an interactive resting state instead of just leaving the
 * resolved text in place — see TechText.jsx/.css. Self-contained: it
 * measures its own box, so both phases render at the same size no matter
 * where this component is placed, and there's no flash of a wrong size
 * before the first real measurement (the box stays invisible until then).
 */
export default function DecryptTechHeading({
  text,
  className = "",
  style,
  color = "#f4f4f5",
  accentColor = DEFAULT_ACCENT,
  outlineColor = "#000000",
  outlineWidthEm = 0.04,
  haloBlurEm = 0.09,
  letterSpacingEm = 0.2,
  minFontSize = 24,
  maxFontSize = 160,
  reverse = false,
  interactive = false,
}: DecryptTechHeadingProps) {
  const words = text.split(" ").filter(Boolean);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const decrypted = resolvedCount >= words.length;
  // Layered rather than one soft shadow, which looks weak/washed out on
  // its own — a tight dark ring plus two wider, fainter ones reads as a
  // solid dark edge instead.
  const halo =
    fontSize && haloBlurEm > 0
      ? [
          `0 0 ${fontSize * haloBlurEm * 0.3}px rgba(0,0,0,0.95)`,
          `0 0 ${fontSize * haloBlurEm * 0.7}px rgba(0,0,0,0.85)`,
          `0 0 ${fontSize * haloBlurEm * 1.4}px rgba(0,0,0,0.6)`,
        ].join(", ")
      : undefined;

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
      {(!decrypted || !interactive) && fontSize !== null && (
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
              style={{
                color,
                WebkitTextStroke: `${fontSize * outlineWidthEm}px ${outlineColor}`,
                textShadow: halo,
              }}
              scramblingStyle={{
                color: accentColor,
                WebkitTextStroke: `${fontSize * outlineWidthEm}px ${outlineColor}`,
                textShadow: halo,
              }}
              speed={55}
              iterationsPerChar={14}
              staggerMs={95}
              startDelay={i * 550}
              reverse={reverse}
              onComplete={() => setResolvedCount((c) => c + 1)}
            />
          ))}
        </h1>
      )}

      {decrypted && interactive && fontSize !== null && (
        <TechText
          text={text}
          fontWeight={400}
          fontSize={fontSize}
          letterSpacing={letterSpacingEm}
          color={color}
          accentColor={accentColor}
          reach={220}
          softness={0.7}
          // Scaled to the rendered font size (capped at these same values,
          // which were tuned for a large desktop heading) — at mobile's
          // much smaller size, fixed pixel dashes/stroke read as dense and
          // congested relative to the letterforms.
          dashLength={Math.min(4, Math.max(2, fontSize * 0.042))}
          dashGap={Math.min(3, Math.max(1.5, fontSize * 0.031))}
          strokeWidth={Math.min(1.5, Math.max(1, fontSize * 0.0156))}
          lineStyle="dashed"
          reveal="letter"
          specks={15}
          selection
          labels
          draggable
          sweep
          sweepReverse={reverse}
          speed={1}
          style={undefined}
        />
      )}
    </div>
  );
}
