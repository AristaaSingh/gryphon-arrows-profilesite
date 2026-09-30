"use client";

import { useEffect, useRef, useState } from "react";

type RevealDirection = "start" | "end" | "center";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  /** How many scrambled frames a character shows before it's "solved". */
  iterationsPerChar?: number;
  /** Order in which characters lock in. */
  revealDirection?: RevealDirection;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  /** Delay in ms before the effect starts. */
  startDelay?: number;
}

const DEFAULT_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=/\\<>[]{}";

function revealOrder(length: number, direction: RevealDirection): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  if (direction === "end") return indices.reverse();
  if (direction === "center") {
    const mid = (length - 1) / 2;
    return indices.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
  }
  return indices;
}

export default function DecryptedText({
  text,
  speed = 40,
  iterationsPerChar = 7,
  revealDirection = "start",
  characters = DEFAULT_CHARACTERS,
  className = "",
  encryptedClassName = "",
  parentClassName = "",
  startDelay = 0,
}: DecryptedTextProps) {
  const [display, setDisplay] = useState<string[]>(() => text.split(""));
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    text.split("").map(() => false)
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

        const order = revealOrder(text.length, revealDirection);
        const charTicks = order.map(() => 0);
        const solvedLocal = text.split("").map(() => false);
        let solvedCount = 0;

        const timeout = setTimeout(() => {
          const interval = setInterval(() => {
            setDisplay((prev) => {
              const next = [...prev];
              order.forEach((charIndex, orderPos) => {
                if (solvedLocal[charIndex]) return;
                const isActiveSlot = orderPos <= solvedCount;
                if (!isActiveSlot) return;

                if (text[charIndex] === " ") {
                  next[charIndex] = " ";
                  charTicks[orderPos] = iterationsPerChar;
                  solvedLocal[charIndex] = true;
                  return;
                }

                charTicks[orderPos] += 1;
                if (charTicks[orderPos] >= iterationsPerChar) {
                  next[charIndex] = text[charIndex];
                  solvedLocal[charIndex] = true;
                } else {
                  next[charIndex] =
                    characters[Math.floor(Math.random() * characters.length)];
                }
              });
              return next;
            });

            setRevealed((prev) => {
              const next = [...prev];
              let changed = false;
              order.forEach((charIndex, orderPos) => {
                if (
                  !next[charIndex] &&
                  orderPos <= solvedCount &&
                  charTicks[orderPos] >= iterationsPerChar
                ) {
                  next[charIndex] = true;
                  changed = true;
                }
              });
              return changed ? next : prev;
            });

            if (charTicks[solvedCount] >= iterationsPerChar) {
              solvedCount += 1;
            }

            if (solvedCount >= order.length) {
              clearInterval(interval);
            }
          }, speed);
        }, startDelay);

        return () => {
          clearTimeout(timeout);
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
          className={revealed[i] ? className : encryptedClassName || className}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
