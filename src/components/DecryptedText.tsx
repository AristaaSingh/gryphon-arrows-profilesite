"use client";

import { useEffect, useRef, useState } from "react";

interface DecryptedTextProps {
  text: string;
  /** Ms between scramble ticks. */
  speed?: number;
  /** Average number of ticks before a character locks in. */
  iterationsPerChar?: number;
  /** Ms between each character starting to scramble — the gap between lock-ins. */
  staggerMs?: number;
  characters?: string;
  /** Applied to every character, resolved or not — keeps one font throughout. */
  className?: string;
  /** Extra class applied only while a character is still scrambling (e.g. a color tint). */
  scramblingClassName?: string;
  parentClassName?: string;
  startDelay?: number;
}

const DEFAULT_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=/\\<>[]{}";

export default function DecryptedText({
  text,
  speed = 40,
  iterationsPerChar = 8,
  staggerMs = 30,
  characters = DEFAULT_CHARACTERS,
  className = "",
  scramblingClassName = "",
  parentClassName = "",
  startDelay = 0,
}: DecryptedTextProps) {
  const [display, setDisplay] = useState<string[]>(() => text.split(""));
  const [solved, setSolved] = useState<boolean[]>(() =>
    text.split("").map((c) => c === " ")
  );
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || hasRun.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;
        observer.disconnect();

        const length = text.length;
        const chars = text.split("");

        // Each character starts `staggerMs` after the previous one, independent
        // of the scramble tick speed, so the gap between lock-ins is tunable
        // without changing how fast individual characters flicker.
        const startAtMs = chars.map((_, i) => i * staggerMs);
        // Per-character threshold with jitter so resolves don't land in lockstep.
        const threshold = chars.map(() =>
          Math.max(2, iterationsPerChar + Math.floor(Math.random() * 4) - 2)
        );
        const ticks = chars.map(() => 0);
        const isSolved = chars.map((c) => c === " ");

        let elapsedMs = 0;
        let intervalId: ReturnType<typeof setInterval> | undefined;

        const timeoutId = setTimeout(() => {
          intervalId = setInterval(() => {
            const nextDisplay = new Array<string>(length);
            let allSolved = true;

            for (let i = 0; i < length; i++) {
              if (isSolved[i]) {
                nextDisplay[i] = chars[i];
                continue;
              }
              if (startAtMs[i] > elapsedMs) {
                nextDisplay[i] =
                  chars[i] === " "
                    ? " "
                    : characters[Math.floor(Math.random() * characters.length)];
                allSolved = false;
                continue;
              }

              ticks[i] += 1;
              if (ticks[i] >= threshold[i]) {
                nextDisplay[i] = chars[i];
                isSolved[i] = true;
              } else {
                nextDisplay[i] =
                  characters[Math.floor(Math.random() * characters.length)];
                allSolved = false;
              }
            }

            setDisplay(nextDisplay);
            setSolved(isSolved.slice());
            elapsedMs += speed;

            if (allSolved && intervalId !== undefined) {
              clearInterval(intervalId);
            }
          }, speed);
        }, startDelay);

        return () => {
          clearTimeout(timeoutId);
          if (intervalId !== undefined) clearInterval(intervalId);
        };
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={containerRef} className={parentClassName} aria-label={text}>
      {display.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`${className} ${solved[i] ? "" : scramblingClassName}`.trim()}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
