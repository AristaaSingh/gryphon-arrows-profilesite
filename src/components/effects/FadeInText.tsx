"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

interface FadeInTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  /** Ms between each character starting to fade in, left to right. */
  staggerMs?: number;
  /** Ms each character's own fade takes. */
  durationMs?: number;
  onComplete?: () => void;
}

/**
 * Plain left-to-right fade-in, one character at a time — no scramble, just
 * opacity. Triggers once, when scrolled into view.
 */
export default function FadeInText({
  text,
  className = "",
  style,
  staggerMs = 45,
  durationMs = 500,
  onComplete,
}: FadeInTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);
  const [started, setStarted] = useState(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;
        observer.disconnect();
        setStarted(true);
        const total = text.length * staggerMs + durationMs;
        timeoutId = setTimeout(() => onCompleteRef.current?.(), total);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, staggerMs, durationMs]);

  return (
    <span ref={ref} className={className} style={style} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            opacity: started ? 1 : 0,
            transition: `opacity ${durationMs}ms ease`,
            transitionDelay: `${i * staggerMs}ms`,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
