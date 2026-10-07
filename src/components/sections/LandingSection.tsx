"use client";

import { useState } from "react";
import DecryptTechHeading from "@/components/effects/DecryptTechHeading";
import SpecularButton from "@/components/effects/SpecularButton";
import WebThreads from "@/components/effects/WebThreads";
import ScrollFade from "@/components/ui/ScrollFade";
import { SHEET_TOTAL } from "@/content/sections";
import { TOUCH_QUERY, useMediaQuery } from "@/lib/useMediaQuery";

// ── EDIT HERE ───────────────────────────────────────────────
const EYEBROW = "University of Leeds IMechE UAS Challenge";
const BUTTON_LABEL = "Explore us";
// ────────────────────────────────────────────────────────────

/** Section 01: the landing hero (animated threads, heading, Explore button). */
export default function LandingSection() {
  // No hover on touch screens, so the button keeps its shine on by default.
  const isTouch = useMediaQuery(TOUCH_QUERY);
  // Keyboard focus shows the same shine as hovering the button.
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const scrollToNext = () => {
    document.getElementById("sponsors")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      id="home"
      className="relative min-h-screen overflow-hidden bg-black text-zinc-100"
    >
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
          <span className="mb-4 block font-body text-sm tracking-wide text-zinc-100 sm:text-base">
            {EYEBROW}
          </span>
        </ScrollFade>

        {/* The animated words below are decorative; this is the real page
            heading for search engines and screen readers. */}
        <h1 className="sr-only">Gryphon Arrows</h1>

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
          <span
            className="contents"
            onFocus={(e) =>
              setKeyboardFocus(e.target.matches(":focus-visible"))
            }
            onBlur={() => setKeyboardFocus(false)}
          >
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
              autoAnimate={isTouch || keyboardFocus}
              proximity={260}
              onClick={scrollToNext}
              className="no-focus-ring"
            >
              {BUTTON_LABEL}
            </SpecularButton>
          </span>
        </ScrollFade>
      </div>

      {/* Drawing-sheet annotations, matching the sponsors strip. */}
      <div
        aria-hidden="true"
        className="animate-fade-in-up pointer-events-none absolute inset-x-0 top-[5.5rem] z-10 flex justify-between px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400 sm:top-[6rem] sm:px-10"
        style={{ animationDelay: "1300ms" }}
      >
        <span>Sec. 01</span>
        <span>Sheet 1/{SHEET_TOTAL}</span>
      </div>
    </main>
  );
}
