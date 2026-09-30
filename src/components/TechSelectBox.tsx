"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface TechSelectBoxProps {
  /** The positioned ancestor to search for `[data-glyph="true"]` letter spans. */
  containerRef: RefObject<HTMLElement | null>;
  /** Only tracks the cursor once true (e.g. after a decrypt effect finishes). */
  active: boolean;
  className?: string;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * A CAD/blueprint-style selection box that snaps to whichever letter the
 * cursor is nearest to, with a dimension readout — a lightweight take on
 * reactbits.dev's "Tech Text" hover effect, scoped to a static heading
 * instead of its canvas/physics/particle engine.
 */
export default function TechSelectBox({
  containerRef,
  active,
  className = "",
}: TechSelectBoxProps) {
  const [box, setBox] = useState<Box | null>(null);
  const glyphsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !active) return;

    glyphsRef.current = Array.from(
      container.querySelectorAll<HTMLElement>('[data-glyph="true"]')
    );

    const handleMove = (e: MouseEvent) => {
      const glyphs = glyphsRef.current;
      if (glyphs.length === 0) return;
      const containerRect = container.getBoundingClientRect();

      let nearest: HTMLElement | null = null;
      let nearestDistance = Infinity;
      for (const glyph of glyphs) {
        const rect = glyph.getBoundingClientRect();
        const dx =
          e.clientX < rect.left
            ? rect.left - e.clientX
            : e.clientX > rect.right
              ? e.clientX - rect.right
              : 0;
        const dy =
          e.clientY < rect.top
            ? rect.top - e.clientY
            : e.clientY > rect.bottom
              ? e.clientY - rect.bottom
              : 0;
        const distance = Math.hypot(dx, dy);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = glyph;
        }
      }

      if (!nearest || nearestDistance > 120) {
        setBox(null);
        return;
      }

      const rect = nearest.getBoundingClientRect();
      setBox({
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
      });
    };

    const handleLeave = () => setBox(null);

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);
    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [containerRef, active]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className={`tech-select-box ${box ? "tech-select-box--visible" : ""} ${className}`.trim()}
      style={
        box
          ? {
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
            }
          : undefined
      }
    >
      {box && (
        <span className="tech-select-box__label">
          {Math.round(box.width)}&times;{Math.round(box.height)}
        </span>
      )}
      <span className="tech-select-box__corner tech-select-box__corner--tl" />
      <span className="tech-select-box__corner tech-select-box__corner--tr" />
      <span className="tech-select-box__corner tech-select-box__corner--bl" />
      <span className="tech-select-box__corner tech-select-box__corner--br" />
    </div>
  );
}
