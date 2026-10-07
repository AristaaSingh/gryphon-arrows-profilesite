"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { EASE_OUT_CSS } from "@/lib/motion";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "@/lib/useMediaQuery";

interface ScrollFadeProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** How much of the element must be visible to trigger — 0 to 1. */
  threshold?: number;
  /** Px the content eases up/down by while fading. */
  translateY?: number;
  durationMs?: number;
  /** Wait this long after becoming visible before fading in. */
  delayMs?: number;
}

/**
 * Fades (and slightly eases) its content in when scrolled into view, and
 * back out when scrolled away — unlike a one-shot load animation, this
 * reverses both ways via IntersectionObserver, so it replays every time
 * the element crosses the viewport edge, not just once on mount.
 */
export default function ScrollFade({
  children,
  className = "",
  id,
  threshold = 0.2,
  translateY = 24,
  durationMs = 1400,
  delayMs = 0,
}: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduceMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      {
        threshold,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style: CSSProperties = reduceMotion
    ? { opacity: 1, transform: "none" }
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${translateY}px)`,
        transition: `opacity ${durationMs}ms ${EASE_OUT_CSS} ${visible ? delayMs : 0}ms, transform ${durationMs}ms ${EASE_OUT_CSS} ${visible ? delayMs : 0}ms`,
      };

  return (
    <div ref={ref} id={id} className={className} style={style}>
      {children}
    </div>
  );
}
